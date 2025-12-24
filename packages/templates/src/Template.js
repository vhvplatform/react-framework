import fs from 'fs-extra';
import path from 'path';
/**
 * Represents a single template with operations for reading and updating configuration
 */
export class Template {
    constructor(templatePath, config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "templatePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.templatePath = templatePath;
        this.config = config;
    }
    /**
     * Get template configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Get template name
     */
    getName() {
        return this.config.name;
    }
    /**
     * Get template description
     */
    getDescription() {
        return this.config.description;
    }
    /**
     * Get template version
     */
    getVersion() {
        return this.config.version;
    }
    /**
     * Get template path
     */
    getPath() {
        return this.templatePath;
    }
    /**
     * Get template source code path
     */
    getSourcePath() {
        return path.join(this.templatePath, 'src');
    }
    /**
     * Get template routes
     */
    getRoutes() {
        return [...this.config.routes];
    }
    /**
     * Get template dependencies
     */
    getDependencies() {
        return { ...this.config.dependencies };
    }
    /**
     * Get template components
     */
    getComponents() {
        return {
            required: [...this.config.components.required],
            optional: [...this.config.components.optional],
        };
    }
    /**
     * Update template configuration
     */
    async updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        const configPath = path.join(this.templatePath, 'template.config.json');
        await fs.writeJson(configPath, this.config, { spaces: 2 });
    }
    /**
     * Load template from directory
     */
    static async load(templatePath) {
        const configPath = path.join(templatePath, 'template.config.json');
        if (!(await fs.pathExists(configPath))) {
            throw new Error(`Template configuration not found at ${configPath}`);
        }
        const config = await fs.readJson(configPath);
        return new Template(templatePath, config);
    }
    /**
     * Create a new template directory structure
     */
    static async create(templatePath, config) {
        // Create template directory
        await fs.ensureDir(templatePath);
        // Create src directory
        await fs.ensureDir(path.join(templatePath, 'src'));
        // Write configuration
        const configPath = path.join(templatePath, 'template.config.json');
        await fs.writeJson(configPath, config, { spaces: 2 });
        return new Template(templatePath, config);
    }
    /**
     * Copy template files to a destination
     */
    async copyTo(destinationPath) {
        await fs.copy(this.templatePath, destinationPath, {
            filter: (src) => {
                // Don't copy node_modules or dist directories
                return !src.includes('node_modules') && !src.includes('dist');
            },
        });
    }
}
//# sourceMappingURL=Template.js.map