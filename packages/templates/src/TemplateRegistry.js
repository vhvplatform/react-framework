import fs from 'fs-extra';
import path from 'path';
import { Template } from './Template.js';
/**
 * Registry for managing templates in the templates directory
 */
export class TemplateRegistry {
    constructor(templatesDir) {
        Object.defineProperty(this, "templatesDir", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "templates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.templatesDir = templatesDir;
        this.templates = new Map();
    }
    /**
     * Initialize the registry and load all templates
     */
    async initialize() {
        await fs.ensureDir(this.templatesDir);
        await this.loadTemplates();
    }
    /**
     * Load all templates from the templates directory
     */
    async loadTemplates() {
        this.templates.clear();
        const entries = await fs.readdir(this.templatesDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const templatePath = path.join(this.templatesDir, entry.name);
                const configPath = path.join(templatePath, 'template.config.json');
                if (await fs.pathExists(configPath)) {
                    try {
                        const template = await Template.load(templatePath);
                        this.templates.set(template.getName(), template);
                    }
                    catch (error) {
                        console.warn(`Failed to load template from ${templatePath}:`, error);
                    }
                }
            }
        }
    }
    /**
     * Get a template by name
     */
    async getTemplate(name) {
        return this.templates.get(name) || null;
    }
    /**
     * Check if a template exists
     */
    hasTemplate(name) {
        return this.templates.has(name);
    }
    /**
     * List all templates
     */
    listTemplates() {
        return Array.from(this.templates.values());
    }
    /**
     * Get template metadata for all templates
     */
    async listTemplateMetadata() {
        const metadata = [];
        for (const template of this.templates.values()) {
            const config = template.getConfig();
            const templatePath = template.getPath();
            const stats = await fs.stat(templatePath);
            metadata.push({
                name: config.name,
                description: config.description,
                version: config.version,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime,
                componentCount: config.components.required.length + config.components.optional.length,
                routeCount: config.routes.length,
            });
        }
        return metadata;
    }
    /**
     * Search templates by criteria
     */
    searchTemplates(options) {
        const templates = this.listTemplates();
        return templates.filter((template) => {
            const config = template.getConfig();
            if (options.name && !config.name.toLowerCase().includes(options.name.toLowerCase())) {
                return false;
            }
            if (options.description && !config.description.toLowerCase().includes(options.description.toLowerCase())) {
                return false;
            }
            return true;
        });
    }
    /**
     * Register a new template
     */
    async registerTemplate(name, config) {
        if (this.templates.has(name)) {
            throw new Error(`Template ${name} already exists`);
        }
        const templatePath = path.join(this.templatesDir, name);
        const template = await Template.create(templatePath, config);
        this.templates.set(name, template);
        return template;
    }
    /**
     * Remove a template
     */
    async removeTemplate(name) {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template ${name} not found`);
        }
        // Remove from registry
        this.templates.delete(name);
        // Remove directory
        await fs.remove(template.getPath());
    }
    /**
     * Get the templates directory path
     */
    getTemplatesDir() {
        return this.templatesDir;
    }
    /**
     * Get default templates directory
     */
    static getDefaultTemplatesDir() {
        // Use environment variable if set, otherwise use default location
        return process.env.SAAS_TEMPLATES_DIR || path.join(process.cwd(), 'templates');
    }
}
//# sourceMappingURL=TemplateRegistry.js.map