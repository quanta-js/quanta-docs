'use client';

import { useQuantaStore } from '@quantajs/react';
import { appStateStore } from './stores';

export function AppStateDemo() {
  const store = useQuantaStore(appStateStore);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow space-y-6">
      <h3 className="text-lg font-semibold">App State Demo</h3>

      {/* Views */}
      <div>
        <h4 className="font-medium mb-2">Current View: {store.currentView}</h4>
        <div className="flex gap-2">
          {['dashboard', 'analytics', 'settings'].map((v) => (
            <button
              key={v}
              onClick={() => store.setView(v)}
              className={`px-3 py-1 rounded-lg ${
                store.currentView === v
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <h4 className="font-medium">Filters</h4>
        <div className="flex gap-3">
          <label className="flex flex-col text-sm">
            Category
            <select
              value={store.filters.category}
              onChange={(e) => store.updateFilters({ category: e.target.value })}
              className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="tech">Tech</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </label>
          <label className="flex flex-col text-sm">
            Status
            <select
              value={store.filters.status}
              onChange={(e) => store.updateFilters({ status: e.target.value })}
              className="border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </label>
        </div>
      </div>

      {/* Pagination */}
      <div>
        <h4 className="font-medium mb-2">Pagination</h4>
        <div className="flex items-center gap-3">
          <button
            onClick={() => store.setPage(Math.max(1, store.pagination.page - 1))}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Previous
          </button>
          <span>Page {store.pagination.page}</span>
          <button
            onClick={() => store.setPage(store.pagination.page + 1)}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <button
          onClick={store.toggleSidebar}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {store.sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
        </button>
        <span className="ml-3">
          Sidebar: {store.sidebarCollapsed ? 'Collapsed' : 'Expanded'}
        </span>
      </div>
    </div>
  );
}
