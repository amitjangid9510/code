import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';

// Complex dummy data
const generateDummyData = () => {
  const categories = ['Electronics', 'Books', 'Clothing', 'Food', 'Furniture'];
  const statuses = ['Active', 'Pending', 'Completed', 'Cancelled'];
  const locations = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'];
  
  return Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    description: `This is a detailed description for product ${index + 1} with some unique features.`,
    price: Math.floor(Math.random() * 1000) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    rating: (Math.random() * 5).toFixed(1),
    stock: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString().split('T')[0],
    tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
  }));
};

const App = () => {
  const [data] = useState(() => generateDummyData());
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => `$${info.getValue()}`,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: info => info.getValue().join(', '),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Product Catalog (Card View)</h1>
      
      {/* Global Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search across all fields..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button
          onClick={() => setGlobalFilter('')}
          style={{ padding: '8px 12px', backgroundColor: '#ff4444', color: 'white', border: 'none' }}
        >
          Clear
        </button>
      </div>

      {/* Column Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <label>Category: </label>
          <select
            value={columnFilters.find(f => f.id === 'category')?.value || ''}
            onChange={e => {
              const filter = e.target.value ? { id: 'category', value: e.target.value } : undefined;
              setColumnFilters(prev => 
                prev.filter(f => f.id !== 'category').concat(filter ? [filter] : [])
              );
            }}
            style={{ padding: '5px' }}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>

        <div>
          <label>Status: </label>
          <select
            value={columnFilters.find(f => f.id === 'status')?.value || ''}
            onChange={e => {
              const filter = e.target.value ? { id: 'status', value: e.target.value } : undefined;
              setColumnFilters(prev => 
                prev.filter(f => f.id !== 'status').concat(filter ? [filter] : [])
              );
            }}
            style={{ padding: '5px' }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label>Min Price: </label>
          <input
            type="number"
            placeholder="Min price"
            value={columnFilters.find(f => f.id === 'price')?.value?.[0] || ''}
            onChange={e => {
              const minPrice = e.target.value ? Number(e.target.value) : undefined;
              setColumnFilters(prev => 
                prev.filter(f => f.id !== 'price').concat(
                  minPrice !== undefined ? [{ id: 'price', value: [minPrice, undefined] }] : []
                )
              );
            }}
            style={{ padding: '5px', width: '100px' }}
          />
        </div>

        <div>
          <label>Max Price: </label>
          <input
            type="number"
            placeholder="Max price"
            value={columnFilters.find(f => f.id === 'price')?.value?.[1] || ''}
            onChange={e => {
              const maxPrice = e.target.value ? Number(e.target.value) : undefined;
              setColumnFilters(prev => {
                const existingFilter = prev.find(f => f.id === 'price');
                const minValue = existingFilter?.value?.[0];
                return prev.filter(f => f.id !== 'price').concat(
                  maxPrice !== undefined || minValue !== undefined 
                    ? [{ id: 'price', value: [minValue || 0, maxPrice] }] 
                    : []
                );
              });
            }}
            style={{ padding: '5px', width: '100px' }}
          />
        </div>
      </div>

      {/* Sorting Controls */}
      <div style={{ marginBottom: '20px' }}>
        <label>Sort by: </label>
        <select
          value={sorting[0]?.id || ''}
          onChange={e => {
            const sortId = e.target.value;
            if (sortId) {
              setSorting([{ id: sortId, desc: sorting[0]?.id === sortId ? !sorting[0]?.desc : false }]);
            } else {
              setSorting([]);
            }
          }}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="">No sorting</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="createdAt">Created Date</option>
        </select>
        
        {sorting[0] && (
          <button
            onClick={() => setSorting([{ id: sorting[0].id, desc: !sorting[0].desc }])}
            style={{ padding: '5px 10px' }}
          >
            {sorting[0].desc ? '↑ Ascending' : '↓ Descending'}
          </button>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '20px' }}>
        Showing {table.getFilteredRowModel().rows.length} of {data.length} items
      </div>

      {/* Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {table.getRowModel().rows.map(row => (
          <div key={row.id} style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{row.getValue('name')}</h3>
            <p style={{ margin: '5px 0', color: '#666' }}>{row.getValue('description')}</p>
            <div style={{ margin: '5px 0' }}>
              <strong>Price:</strong> {row.getValue('price')}
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Category:</strong> {row.getValue('category')}
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Status:</strong> {row.getValue('status')}
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Location:</strong> {row.getValue('location')}
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Rating:</strong> {row.getValue('rating')}/5
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Stock:</strong> {row.getValue('stock')} units
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Created:</strong> {row.getValue('createdAt')}
            </div>
            <div style={{ margin: '5px 0' }}>
              <strong>Tags:</strong> {row.getValue('tags')}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          style={{ padding: '8px 12px', border: '1px solid #ccc' }}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{ padding: '8px 12px', border: '1px solid #ccc' }}
        >
          {'<'}
        </button>
        
        <span style={{ display: 'flex', gap: '5px' }}>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{ padding: '8px 12px', border: '1px solid #ccc' }}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          style={{ padding: '8px 12px', border: '1px solid #ccc' }}
        >
          {'>>'}
        </button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          style={{ padding: '8px' }}
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default App;
