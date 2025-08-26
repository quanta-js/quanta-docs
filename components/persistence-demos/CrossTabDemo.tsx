'use client';

import { useQuantaStore } from '@quantajs/react';
import { crossTabStore } from './stores';

export function CrossTabDemo() {
  const store = useQuantaStore(crossTabStore);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Cross-Tab Synchronization Demo</h3>
      <p>
        Last updated: <strong>{store.lastUpdated}</strong>
      </p>
      <p>
        Update count: <strong>{store.tabCount}</strong>
      </p>
      <button
        onClick={store.updateTimestamp}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Update Timestamp
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Open this page in multiple tabs and watch them sync automatically!
      </p>
    </div>
  );
}
