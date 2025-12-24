import React from 'react';

export function Documentation() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-4 text-gray-700">
          Welcome to the API documentation. Here you&apos;ll find everything you need to integrate
          with our platform.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">Authentication</h3>
        <p className="mb-4 text-gray-700">
          All API requests require authentication using an API key. Include your key in the
          Authorization header:
        </p>
        <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </pre>

        <h3 className="text-xl font-semibold mb-3 mt-6">Rate Limits</h3>
        <p className="text-gray-700">
          API calls are limited to 1000 requests per hour per API key.
        </p>
      </div>
    </div>
  );
}

export default Documentation;
