'use client';

import { useQuantaStore } from '@quantajs/react';
import { userPreferencesStore } from './stores';

export function ThemeDemo() {
  const store = useQuantaStore(userPreferencesStore);

    const updateTheme = (theme: string) => {
      debugger
    store.updateTheme(theme);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Theme Switcher Demo</h3>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => updateTheme('light')}
          className={`px-4 py-2 rounded-lg border transition ${
            store.theme === 'light'
              ? 'bg-yellow-200 border-yellow-400 font-bold'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          ☀️ Light
        </button>
        <button
          onClick={() => updateTheme('dark')}
          className={`px-4 py-2 rounded-lg border transition ${
            store.theme === 'dark'
              ? 'bg-gray-900 text-white border-gray-700 font-bold'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          🌙 Dark
        </button>
      </div>
      <p>
        Current theme: <strong>{store.theme}</strong>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Try changing the theme and refreshing the page!
      </p>
    </div>
  );
}
