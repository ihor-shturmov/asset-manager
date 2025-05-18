import { useState, useEffect } from 'react';
import AssetManager from './components/AssetManager';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading for a smoother transition
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 min-h-screen min-w-full bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-2xl text-blue-700 dark:text-blue-200 font-bold animate-pulse">Loading Asset Manager...</div>
      </div>
    );
  }

  return <AssetManager />;
}

export default App;
