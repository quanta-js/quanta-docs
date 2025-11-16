'use client';
import { useState } from 'react';
import { useQuantaStore } from '@quantajs/react';
import { userPreferencesStore } from './stores';

export function ThemeDemo() {
  const store = useQuantaStore(userPreferencesStore);
  const [showCode, setShowCode] = useState(false);
  const updateTheme = (theme: string) => {
    store.updateTheme(theme);
  };

  const isDark = store.theme === 'dark'; // Local theme flag

  return (
    <div className={`p-6 rounded-2xl shadow-lg space-y-4 transition-all duration-300 ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
      }`}>
      <div className="flex justify-between items-start">
        <div className={`text-2xl font-semibold ${isDark ? 'text-white': 'text-black'}`}>Theme Switcher</div>
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
              if (store.$persist) store.$persist.clear(); // Clear persistence
              store.$reset(); // Reset state to initials
            }}
            title="Resets to defaults & wipes localStorage for this store"
            className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
            aria-label="Reset theme store"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Use Case Blurb */}
      <div className={`p-3 rounded-lg text-sm border-l-4 ${isDark ? 'bg-indigo-900/20 border-indigo-500 text-indigo-300' : 'bg-indigo-50 border-indigo-500 text-indigo-700'
        }`}>
        <span className={`font-semibold ${isDark ? 'text-white': 'text-black'}`}>Real Use Case:</span> User prefs in SaaS apps—theme/language persist across logins, reducing churn by 20% (per UX studies). QuantaJS hydrates on app load.
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => updateTheme('light')}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${store.theme === 'light'
              ? `font-bold shadow-md ${isDark ? 'bg-yellow-800 border-yellow-600 text-white' : 'bg-yellow-200 border-yellow-400'}`
              : `${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`
            }`}
          aria-label="Switch to light theme"
        >
          ☀️ Light
        </button>
        <button
          onClick={() => updateTheme('dark')}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${store.theme === 'dark'
              ? `font-bold shadow-md ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-900 text-white border-gray-700'}` // Adjusted for contrast
              : `${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`
            }`}
          aria-label="Switch to dark theme"
        >
          🌙 Dark
        </button>
      </div>
      <p className="text-sm">
        Current: <span className={`${isDark ? 'text-indigo-300' : 'text-indigo-700'} font-semibold`}>{store.theme}</span>
      </p>
      {/* Debounce Viz */}
      <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
        <div className={`h-2 rounded-full transition-all duration-300 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`} style={{ width: '100%' }} /> {/* Simulates debounce flush */}
      </div>
      <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
        Auto-saves every 300ms. Refresh to test persistence!
      </p>

      {/* Code Snippet */}
      {showCode && (
        <pre className={`${isDark ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-800'} p-3 rounded-lg text-xs overflow-x-auto mt-4 border border-gray-600`}>
          <code>{`persist: {
  adapter: new LocalStorageAdapter("user-preferences"),
  debounceMs: 300, // Batches rapid theme toggles
}`}</code>
        </pre>
      )}
    </div>
  );
}