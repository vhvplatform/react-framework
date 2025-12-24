import React from 'react';

export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Developer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">API Calls</h3>
          <p className="text-3xl font-bold text-blue-600">12,456</p>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Apps</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-500">Currently running</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600">99.8%</p>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
