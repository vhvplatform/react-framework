import React from 'react';
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Integration Portal
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/api-explorer" className="text-gray-700 hover:text-blue-600">
              API Explorer
            </Link>
            <Link to="/docs" className="text-gray-700 hover:text-blue-600">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
