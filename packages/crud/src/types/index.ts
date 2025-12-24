/**
 * CRUD operation types
 */
export type CrudOperation = 'create' | 'read' | 'update' | 'delete' | 'list';

/**
 * CRUD state for a resource
 */
export interface CrudState<T> {
  /** Current item being edited */
  item: T | null;
  
  /** List of items */
  items: T[];
  
  /** Loading state */
  loading: boolean;
  
  /** Error message */
  error: string | null;
  
  /** Current operation */
  operation: CrudOperation | null;
  
  /** Total count for pagination */
  total: number;
  
  /** Current page */
  page: number;
  
  /** Items per page */
  limit: number;
}

/**
 * CRUD actions
 */
export interface CrudActions<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  /** Fetch all items */
  fetchAll: (params?: QueryParams) => Promise<void>;
  
  /** Fetch single item by ID */
  fetchOne: (id: string | number) => Promise<void>;
  
  /** Create new item */
  create: (data: CreateDto) => Promise<T>;
  
  /** Update existing item */
  update: (id: string | number, data: UpdateDto) => Promise<T>;
  
  /** Delete item */
  remove: (id: string | number) => Promise<void>;
  
  /** Reset state */
  reset: () => void;
  
  /** Set current item */
  setItem: (item: T | null) => void;
  
  /** Clear error */
  clearError: () => void;
}

/**
 * Query parameters for list operations
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
  [key: string]: any;
}

/**
 * CRUD configuration
 */
export interface CrudConfig<T> {
  /** Resource name (e.g., 'users', 'posts') */
  resource: string;
  
  /** Base API endpoint */
  endpoint?: string;
  
  /** ID field name (default: 'id') */
  idField?: keyof T;
  
  /** Initial items per page */
  initialLimit?: number;
  
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  
  /** Success callbacks */
  onSuccess?: {
    create?: (item: T) => void;
    update?: (item: T) => void;
    delete?: (id: string | number) => void;
  };
  
  /** Error callbacks */
  onError?: {
    create?: (error: Error) => void;
    update?: (error: Error) => void;
    delete?: (error: Error) => void;
    fetch?: (error: Error) => void;
  };
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/**
 * Form mode
 */
export type FormMode = 'create' | 'edit' | 'view';

/**
 * Table column configuration
 */
export interface TableColumn<T> {
  /** Column key */
  key: keyof T | string;
  
  /** Column label */
  label: string;
  
  /** Sortable column */
  sortable?: boolean;
  
  /** Custom render function */
  render?: (value: any, item: T) => React.ReactNode;
  
  /** Column width */
  width?: string | number;
  
  /** Hide on mobile */
  hideOnMobile?: boolean;
}

/**
 * CRUD table configuration
 */
export interface CrudTableConfig<T> {
  /** Table columns */
  columns: TableColumn<T>[];
  
  /** Enable row selection */
  selectable?: boolean;
  
  /** Enable sorting */
  sortable?: boolean;
  
  /** Enable pagination */
  paginated?: boolean;
  
  /** Enable search */
  searchable?: boolean;
  
  /** Row actions */
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    custom?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (item: T) => void;
    }>;
  };
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Loading rows count */
  loadingRows?: number;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  /** Field name */
  field: string;
  
  /** Filter label */
  label: string;
  
  /** Filter type */
  type: 'text' | 'select' | 'date' | 'daterange' | 'number' | 'boolean';
  
  /** Options for select type */
  options?: Array<{ label: string; value: any }>;
  
  /** Placeholder */
  placeholder?: string;
}

/**
 * Bulk action configuration
 */
export interface BulkAction<T> {
  /** Action label */
  label: string;
  
  /** Action icon */
  icon?: React.ReactNode;
  
  /** Action handler */
  handler: (items: T[]) => Promise<void>;
  
  /** Confirm before action */
  confirm?: {
    title: string;
    message: string;
  };
  
  /** Action variant */
  variant?: 'primary' | 'secondary' | 'danger';
}
