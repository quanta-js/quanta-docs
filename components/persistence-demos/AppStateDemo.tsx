/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useQuantaStore } from '@quantajs/react';
import { appStateStore, userPreferencesStore } from './stores';
import { useState } from 'react';

export function AppStateDemo() {
  const store = useQuantaStore(appStateStore);
  const themeStore = useQuantaStore(userPreferencesStore);
  const [showCode, setShowCode] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const isDark = themeStore.theme === 'dark';

  const filteredTasks = Array.isArray(store.filteredTasks) ? store.filteredTasks : []
  const paginatedTasks = filteredTasks.slice(
    (store.pagination.page - 1) * (store.pagination.limit || 5),
    store.pagination.page * (store.pagination.limit || 5)
  );

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    store.addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg space-y-6 transition-all duration-300 ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Task Dashboard</div>
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
            title="Resets dashboard to defaults & wipes localStorage (tasks persist across resets? Test it!)"
            className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
            aria-label="Reset dashboard store"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Use Case Blurb */}
      <div className={`p-3 rounded-lg text-sm border-l-4 ${isDark ? 'bg-blue-900/20 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700'}`}>
        <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Real Use Case:</span>  Project tools like Trello—filters/views/tasks persist sessions, so devs resume filtered boards after lunch. Excludes pagination for fresh starts on filter changes.
      </div>

      {/* Quick Add Task */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Add a task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-ring ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
        />
        <button
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${newTaskTitle.trim()
            ? `${isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`
            : `${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-400 text-gray-500'} cursor-not-allowed`
            }`}
        >
          Add
        </button>
      </div>

      {/* Controls: View, Filters, Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Views */}
        <div>
          <h4 className="font-medium mb-2"><span className={`${isDark ? 'text-white' : 'text-black'}`}>View: </span><span className={`${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>{store.currentView}</span></h4>
          <div className="flex gap-2">
            {['list', 'board', 'calendar'].map((v) => (
              <button
                key={v}
                onClick={() => store.setView(v as "list" | "board" | "calendar")}
                className={`px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 text-xs ${store.currentView === v
                  ? `${isDark ? 'bg-indigo-700 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md'}`
                  : `${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`
                  }`}
                aria-label={`Switch to ${v} view`}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Simulated View: Simple list (board/calendar could expand) */}
          {store.currentView === 'list' && <p className="text-xs mt-1 italic">List view: Tasks below.</p>}
          {store.currentView === 'board' && <p className="text-xs mt-1 italic">Board: Drag-drop sim (persists positions).</p>}
          {store.currentView === 'calendar' && <p className="text-xs mt-1 italic">Calendar: Due dates persist.</p>}
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Filters ({filteredTasks.length} tasks)</h4>
          <label className="block text-xs">
            Status
            <select
              value={store.filters.status}
              onChange={(e) => {
                store.updateFilters({ status: e.target.value as "all" | "pending" | "in-progress" | "done" });
                store.filters = { ...store.filters };
                store.setPage(1); // Reset page on filter
              }}
              className={`w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label className="block text-xs">
            Priority
            <select
              value={store.filters.priority}
              onChange={(e) => {
                store.updateFilters({ priority: e.target.value as "medium" | "all" | "low" | "high" });
                store.filters = { ...store.filters };
                store.setPage(1);
              }}
              className={`w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        {/* Sidebar Toggle */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={store.toggleSidebar}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              aria-label="Toggle sidebar"
            >
              {store.sidebar.collapsed ? 'Expand' : 'Collapse'} Sidebar
            </button>
            <span className="text-sm">Status: <span className='font-semibold'>{store.sidebar.collapsed ? 'Hidden' : 'Visible'}</span></span>
          </div>
          {!store.sidebar.collapsed && (
            <div className={`mt-2 p-2 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              User: {store.sidebar.user || 'Guest'}
            </div>
          )}
        </div>
      </div>

      {/* Tasks List (Paginated) */}
      <div>
        <h4 className="font-medium mb-2 flex justify-between items-center">
          Tasks ({paginatedTasks.length} of {filteredTasks.length})
          <div className="text-xs">
            Page {store.pagination.page} •
            <button
              onClick={() => store.setPage(Math.max(1, store.pagination.page - 1))}
              disabled={store.pagination.page === 1}
              className={`ml-2 px-2 py-1 rounded ${isDark ? 'bg-gray-700 disabled:bg-gray-600' : 'bg-gray-200 disabled:bg-gray-300'}`}
            >
              ← Prev
            </button>
            <button
              onClick={() => store.setPage(store.pagination.page + 1)}
              disabled={paginatedTasks.length < (store.pagination.limit || 5)}
              className={`ml-1 px-2 py-1 rounded ${isDark ? 'bg-gray-700 disabled:bg-gray-600' : 'bg-gray-200 disabled:bg-gray-300'}`}
            >
              Next →
            </button>
          </div>
        </h4>
        {paginatedTasks.length === 0 ? (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>No tasks match filters—add some!</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {paginatedTasks.map((task: any) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${task.completed
                  ? `${isDark ? 'bg-gray-700 line-through text-gray-400' : 'bg-gray-100 line-through text-gray-500'}`
                  : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => store.toggleTask(task.id)}
                    className="rounded"
                  />
                  <span className={`text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high' ? 'bg-red-500 text-white' : task.priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                    {task.priority}
                  </span>
                </div>
                <span className="text-xs opacity-75">{task.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debounce Viz */}
      <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div className={`h-2 rounded-full transition-all duration-200 ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} style={{ width: '70%' }} />
      </div>
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Persists tasks/filters/views (excludes pagination). Add 10+ tasks, filter, reload—state resumes!
      </p>

      {/* Code Snippet */}
      {showCode && (
        <pre className={`${isDark ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-800'} p-3 rounded-lg text-xs overflow-x-auto mt-4 border border-gray-600`}>
          <code>{`state: () => ({
  tasks: [/* sample */],
  filters: { status: 'all', priority: 'medium' },
  // ...
}),
getters: {
  filteredTasks: (state) => state.tasks.filter(/* logic */),
},
persist: {
  include: ['tasks', 'filters', 'currentView', 'sidebar'],
  exclude: ['pagination'], // Transient
  debounceMs: 200,
}`}</code>
        </pre>
      )}
    </div>
  );
}