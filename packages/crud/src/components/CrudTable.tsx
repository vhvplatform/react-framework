import { memo, useMemo, useCallback } from 'react';
import { CrudTableConfig } from '../types';
import { Button } from '@vhvplatform/ui-components';

interface CrudTableProps<T> {
  data: T[];
  config: CrudTableConfig<T>;
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  selected?: Set<any>;
  onToggleSelect?: (item: T) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
}

function CrudTableComponent<T extends { id?: any }>({
  data,
  config,
  loading = false,
  onEdit,
  onDelete,
  onView,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected = false,
}: CrudTableProps<T>) {
  const { columns, selectable, actions, emptyMessage = 'No data available', loadingRows = 5 } = config;

  const hasActions = useMemo(
    () => actions && (actions.edit || actions.delete || actions.view || actions.custom),
    [actions]
  );

  // Memoize loading skeleton to prevent re-render
  const loadingSkeleton = useMemo(() => {
    if (!loading) return null;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && <th className="w-12"></th>}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {hasActions && <th className="w-32"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: loadingRows }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                {selectable && (
                  <td className="px-6 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>
                )}
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [loading, selectable, columns, hasActions, loadingRows]);

  if (loading) {
    return loadingSkeleton;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIdx) => (
            <TableRow
              key={item.id ?? rowIdx}
              item={item}
              columns={columns}
              selectable={selectable}
              selected={selected}
              onToggleSelect={onToggleSelect}
              hasActions={hasActions}
              actions={actions}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Memoized table row component to prevent unnecessary re-renders
interface TableRowProps<T> {
  item: T;
  columns: any[];
  selectable?: boolean;
  selected?: Set<any>;
  onToggleSelect?: (item: T) => void;
  hasActions: boolean;
  actions: any;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

const TableRow = memo(function TableRow<T extends { id?: any }>({
  item,
  columns,
  selectable,
  selected,
  onToggleSelect,
  hasActions,
  actions,
  onView,
  onEdit,
  onDelete,
}: TableRowProps<T>) {
  return (
    <tr className="hover:bg-gray-50">
      {selectable && (
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selected?.has(item.id)}
            onChange={() => onToggleSelect?.(item)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
      )}
      {columns.map((col, colIdx) => {
        const value = typeof col.key === 'string' ? (item as any)[col.key] : item[col.key];
        return (
          <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {col.render ? col.render(value, item) : String(value || '-')}
          </td>
        );
      })}
      {hasActions && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex gap-2 justify-end">
            {actions.view && (
              <Button size="sm" variant="secondary" onClick={() => onView?.(item)}>
                View
              </Button>
            )}
            {actions.edit && (
              <Button size="sm" variant="primary" onClick={() => onEdit?.(item)}>
                Edit
              </Button>
            )}
            {actions.delete && (
              <Button size="sm" variant="danger" onClick={() => onDelete?.(item)}>
                Delete
              </Button>
            )}
            {actions.custom?.map((action: any, idx: number) => (
              <Button
                key={idx}
                size="sm"
                variant="secondary"
                onClick={() => action.onClick(item)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
}) as <T extends { id?: any }>(props: TableRowProps<T>) => JSX.Element;

// Export memoized component with proper generic typing
export const CrudTable = memo(CrudTableComponent) as typeof CrudTableComponent;
