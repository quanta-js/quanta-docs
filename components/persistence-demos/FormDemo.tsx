'use client';
import { useState } from 'react';
import { useQuantaStore } from '@quantajs/react';
import { formStore, userPreferencesStore } from './stores';

export function FormDemo() {
  const store = useQuantaStore(formStore);
  const themeStore = useQuantaStore(userPreferencesStore);
  const [showCode, setShowCode] = useState(false);
  const isDark = themeStore.theme === 'dark';
  const updateField = (field: string, value: string | number) => store.updateField(field, value);

  const isValidStep = store.step === 1 ? !!store.name.trim() : store.step === 2 ? store.email.includes('@') : !!store.message.trim();

  return (
    <div className={`p-6 rounded-2xl shadow-lg space-y-6 transition-all duration-300 ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
      }`}>
      <div className="flex justify-between items-start">
        <div className={`text-2xl font-semibold ${isDark ? 'text-white': 'text-black'}`}>Multi-Step Form</div>
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
            title="Resets form to step 1 & wipes localStorage"
            className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
            aria-label="Reset form store"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Use Case Blurb */}
      <div className={`p-3 rounded-lg text-sm border-l-4 ${isDark ? 'bg-purple-900/20 border-purple-500 text-purple-300' : 'bg-purple-50 border-purple-500 text-purple-700'
        }`}>
        <span className={`font-semibold ${isDark ? 'text-white': 'text-black'}`}>Real Use Case:</span>  Onboarding wizards—users resume half-filled forms after tab closes. Transforms clean data for backend.
      </div>

      {/* Progress */}
      <div className="flex gap-4 mb-4">
        {['Name', 'Email', 'Message'].map((label, idx) => (
          <span
            key={label}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${store.step > idx + 1
                ? 'bg-green-600 text-white'
                : store.step === idx + 1
                  ? 'bg-indigo-600 text-white'
                  : `${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
              }`}
          >
            {idx + 1}. {label}
          </span>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {store.step === 1 && (
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={store.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-ring ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
            />
            <button
              onClick={store.nextStep}
              disabled={!isValidStep}
              className={`mt-2 px-4 py-2 rounded-lg transition-all duration-200 ${isValidStep
                  ? `${isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`
                  : `${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-400 text-gray-500'} cursor-not-allowed`
                }`}
            >
              Next
            </button>
          </div>
        )}
        {store.step === 2 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={store.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-ring ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
            />
            {!store.email.includes('@') && store.email && (
              <p className={`${isDark ? 'text-red-400' : 'text-red-500'} text-sm`}>Invalid email</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={store.prevStep}
                className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
              >
                Previous
              </button>
              <button
                onClick={store.nextStep}
                disabled={!isValidStep}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${isValidStep
                    ? `${isDark ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`
                    : `${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-400 text-gray-500'} cursor-not-allowed`
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {store.step === 3 && (
          <div>
            <textarea
              placeholder="Enter your message"
              value={store.message}
              onChange={(e) => updateField('message', e.target.value)}
              rows={4}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-ring ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
            />
            {!store.message.trim() && <p className={`${isDark ? 'text-red-400' : 'text-red-500'} text-sm`}>Message required</p>}
            <div className="flex gap-2 mt-2">
              <button
                onClick={store.prevStep}
                className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
              >
                Previous
              </button>
              <button
                onClick={store.resetForm}
                className={`px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                Submit & Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div>
        <h4 className="font-medium mb-2">Preview:</h4>
        <pre className={`p-4 rounded-lg text-sm overflow-x-auto transition-colors ${isDark ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-800'
          }`}>
          {JSON.stringify(
            { name: store.name, email: store.email, message: store.message },
            null,
            2
          )}
        </pre>
      </div>

      {/* Debounce Viz */}
      <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
        <div className={`h-2 rounded-full transition-all duration-100 ${isDark ? 'bg-purple-500' : 'bg-purple-600'
          }`} style={{ width: '60%' }} />
      </div>
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
        Fast debounce (100ms) for form typing • Transforms skip empties.
      </p>

      {/* Code Snippet */}
      {showCode && (
        <pre className={`${isDark ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-800'} p-3 rounded-lg text-xs overflow-x-auto mt-4 border border-gray-600`}>
          <code>{`persist: {
  transform: {
    out: (data) => ({ ...data, empty: undefined }), // Clean for storage
  },
  debounceMs: 100,
}`}</code>
        </pre>
      )}
    </div>
  );
}