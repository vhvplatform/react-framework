import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            👋 Hello World!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Welcome to SaaS Framework React
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h2 className="font-semibold text-gray-700 mb-2">Features:</h2>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ React 18 with TypeScript</li>
              <li>✅ Vite for fast development</li>
              <li>✅ Tailwind CSS for styling</li>
              <li>✅ Module system ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
