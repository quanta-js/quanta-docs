'use client';
import { useQuantaStore } from '@quantajs/react';
import { crossTabStore, userPreferencesStore } from './stores';
import { useState } from 'react';

export function CrossTabDemo() {
  const store = useQuantaStore(crossTabStore);
  const themeStore = useQuantaStore(userPreferencesStore);
  const [showCode, setShowCode] = useState(false);
  const isDark = themeStore.theme === 'dark';

  return (
    <div className={`p-6 rounded-2xl shadow-lg space-y-4 transition-all duration-300 ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
      }`}>
      <div className="flex justify-between items-start">
        <div className={`text-2xl font-semibold ${isDark ? 'text-white': 'text-black'}`}>Cross-Tab Sync</div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`text-xs ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} underline-offset-2`}
            aria-label="Toggle store code"
          >
            {showCode ? 'Hide' : 'View'} Code
          </button>
          <button
            onClick={() => {
              if (store.$persist) store.$persist.clear();
              store.$reset();
            }}
            title="Resets timestamp & count to defaults, wipes localStorage"
            className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
            aria-label="Reset cross-tab store"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Use Case Blurb */}
      <div className={`p-3 rounded-lg text-sm border-l-4 ${isDark ? 'bg-orange-900/20 border-orange-500 text-orange-300' : 'bg-orange-50 border-orange-500 text-orange-700'
        }`}>
        <span className={`font-semibold ${isDark ? 'text-white': 'text-black'}`}>Real Use Case:</span> Collaborative editors (e.g., Figma-lite)—real-time tab sync via storage events, no WebSockets needed for basics.
      </div>

      <p className="text-lg">
        Last updated: <span className='font-semibold'>{store.lastUpdated}</span>
      </p>
      <p className="text-lg">
        Update count: <span className='font-semibold'>{store.tabCount}</span>
      </p>
      <button
        onClick={store.updateTimestamp}
        className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        aria-label="Update timestamp and count"
      >
        Update (Syncs Tabs!)
      </button>
      {/* Sync Badge */}
      <div className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-green-900/20' : 'bg-green-50'
        }`}>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'
          }`}>
          Live Sync Active
        </span>
      </div>
      <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
        Open in multiple tabs—watch updates propagate instantly!
      </p>

      {/* Debounce Viz */}
      <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
        <div className={`h-2 rounded-full transition-all duration-100 ${isDark ? 'bg-orange-500' : 'bg-orange-600'
          }`} style={{ width: '90%' }} />
      </div>

      {/* Code Snippet */}
      {showCode && (
        <pre className={`${isDark ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-800'} p-3 rounded-lg text-xs overflow-x-auto mt-4 border border-gray-600`}>
          <code>{`persist: {
  adapter: new LocalStorageAdapter("cross-tab-demo"),
  // Built-in storage event listener for sync
  debounceMs: 100,
}`}</code>
        </pre>
      )}
    </div>
  );
}