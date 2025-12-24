import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { Reducer } from '@reduxjs/toolkit';

/**
 * Module interface for the framework
 */
export interface Module {
  /**
   * Unique identifier for the module
   */
  id: string;

  /**
   * Display name of the module
   */
  name: string;

  /**
   * Module version
   */
  version: string;

  /**
   * Module dependencies (other module IDs)
   */
  dependencies?: string[];

  /**
   * Module initialization function
   */
  initialize?: () => Promise<void> | void;

  /**
   * Redux reducer for the module
   */
  reducer?: Reducer;

  /**
   * Routes provided by the module
   */
  routes?: RouteObject[];

  /**
   * Module configuration
   */
  config?: Record<string, unknown>;
}

/**
 * Module registry interface
 */
export interface IModuleRegistry {
  /**
   * Register a new module
   */
  register(module: Module): void;

  /**
   * Get a registered module by ID
   */
  getModule(id: string): Module | undefined;

  /**
   * Get all registered modules
   */
  getAllModules(): Module[];

  /**
   * Initialize all registered modules
   */
  initializeAll(): Promise<void>;

  /**
   * Get all reducers from registered modules
   */
  getReducers(): Record<string, Reducer>;

  /**
   * Get all routes from registered modules
   */
  getRoutes(): RouteObject[];
}

/**
 * Application configuration
 */
export interface ApplicationConfig {
  /**
   * Application name
   */
  name: string;

  /**
   * API base URL
   */
  apiUrl?: string;

  /**
   * Enable Redux DevTools
   */
  enableDevTools?: boolean;

  /**
   * Custom middleware
   */
  middleware?: unknown[];

  /**
   * Initial Redux state
   */
  initialState?: Record<string, unknown>;
}

/**
 * Application props
 */
export interface ApplicationProps {
  /**
   * Application configuration
   */
  config: ApplicationConfig;

  /**
   * Modules to register
   */
  modules?: Module[];

  /**
   * Children components
   */
  children?: ReactNode;
}

/**
 * Module factory options
 */
export interface CreateModuleOptions {
  /**
   * Module ID
   */
  id: string;

  /**
   * Module name
   */
  name: string;

  /**
   * Module version
   */
  version?: string;

  /**
   * Dependencies
   */
  dependencies?: string[];

  /**
   * Reducer
   */
  reducer?: Reducer;

  /**
   * Routes
   */
  routes?: RouteObject[];

  /**
   * Initialization function
   */
  initialize?: () => Promise<void> | void;

  /**
   * Configuration
   */
  config?: Record<string, unknown>;
}

/**
 * Redux store state interface
 */
export interface RootState {
  [key: string]: unknown;
}

/**
 * Module context value
 */
export interface ModuleContextValue {
  /**
   * Get module by ID
   */
  getModule: (id: string) => Module | undefined;

  /**
   * Get all modules
   */
  getAllModules: () => Module[];

  /**
   * Check if module is registered
   */
  hasModule: (id: string) => boolean;
}
