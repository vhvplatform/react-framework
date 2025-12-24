import React from 'react';

export function APIExplorer() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">API Explorer</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Endpoint</label>
          <select className="w-full px-3 py-2 border rounded-md">
            <option>GET /api/users</option>
            <option>POST /api/users</option>
            <option>GET /api/products</option>
            <option>POST /api/orders</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Request Body</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md font-mono text-sm"
            rows={8}
            placeholder='{&#10;  "key": "value"&#10;}'
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Send Request
        </button>
      </div>
    </div>
  );
}

export default APIExplorer;
