import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CrudTable } from '@vhvplatform/crud';
import { CrudTableConfig } from '@vhvplatform/crud';

describe('CrudTable Performance Tests', () => {
  interface TestItem {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  }

  const createLargeDataset = (size: number): TestItem[] => {
    return Array(size)
      .fill(0)
      .map((_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: i % 3 === 0 ? 'admin' : 'user',
        status: i % 2 === 0 ? 'active' : 'inactive',
      }));
  };

  const config: CrudTableConfig<TestItem> = {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
    ],
    selectable: false,
    actions: {
      edit: true,
      delete: true,
    },
  };

  describe('rendering performance', () => {
    it('should render small dataset quickly', () => {
      const data = createLargeDataset(10);

      const start = performance.now();
      render(<CrudTable data={data} config={config} />);
      const end = performance.now();

      // Should render quickly (< 50ms)
      expect(end - start).toBeLessThan(50);
      expect(screen.getByText('User 0')).toBeInTheDocument();
    });

    it('should render medium dataset efficiently', () => {
      const data = createLargeDataset(100);

      const start = performance.now();
      render(<CrudTable data={data} config={config} />);
      const end = performance.now();

      // Should render in reasonable time (< 200ms)
      expect(end - start).toBeLessThan(200);
      expect(screen.getByText('User 0')).toBeInTheDocument();
    });

    it('should render large dataset without blocking', () => {
      const data = createLargeDataset(1000);

      const start = performance.now();
      render(<CrudTable data={data} config={config} />);
      const end = performance.now();

      // Should still render without excessive blocking (< 1000ms)
      // Note: 1000 rows is a large dataset, consider pagination for production
      expect(end - start).toBeLessThan(1000);
      expect(screen.getByText('User 0')).toBeInTheDocument();
    });
  });

  describe('loading state performance', () => {
    it('should render loading state quickly', () => {
      const start = performance.now();
      render(<CrudTable data={[]} config={config} loading={true} />);
      const end = performance.now();

      // Loading skeleton should be very fast (< 30ms)
      expect(end - start).toBeLessThan(30);
    });
  });

  describe('empty state performance', () => {
    it('should render empty state quickly', () => {
      const start = performance.now();
      render(<CrudTable data={[]} config={config} />);
      const end = performance.now();

      // Empty state should be very fast (< 20ms)
      expect(end - start).toBeLessThan(20);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('with custom renderers', () => {
    it('should handle custom renderers efficiently', () => {
      const data = createLargeDataset(100);
      const configWithRender: CrudTableConfig<TestItem> = {
        ...config,
        columns: [
          {
            key: 'name',
            label: 'Name',
            render: (value) => <strong>{value}</strong>,
          },
          {
            key: 'email',
            label: 'Email',
            render: (value) => <a href={`mailto:${value}`}>{value}</a>,
          },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ],
      };

      const start = performance.now();
      render(<CrudTable data={data} config={configWithRender} />);
      const end = performance.now();

      // Should render with custom renderers efficiently (< 300ms)
      expect(end - start).toBeLessThan(300);
      expect(screen.getByText('User 0')).toBeInTheDocument();
    });
  });

  describe('with selection', () => {
    it('should handle selection efficiently', () => {
      const data = createLargeDataset(100);
      const selected = new Set<number>();
      const onToggleSelect = (item: TestItem) => {
        if (selected.has(item.id)) {
          selected.delete(item.id);
        } else {
          selected.add(item.id);
        }
      };

      const configWithSelection: CrudTableConfig<TestItem> = {
        ...config,
        selectable: true,
      };

      const start = performance.now();
      render(
        <CrudTable
          data={data}
          config={configWithSelection}
          selected={selected}
          onToggleSelect={onToggleSelect}
        />
      );
      const end = performance.now();

      // Should render with selection efficiently (< 250ms)
      expect(end - start).toBeLessThan(250);
    });
  });
});
