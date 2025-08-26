'use client';

import { useQuantaStore } from '@quantajs/react';
import { formStore } from './stores';

export function FormDemo() {
  const store = useQuantaStore(formStore);

  const updateField = (field: string, value: string | number) => store.updateField(field, value);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow space-y-6">
      <h3 className="text-lg font-semibold">Multi-Step Form Demo</h3>

      {/* Progress */}
      <div className="flex gap-4 mb-4">
        {['Name', 'Email', 'Message'].map((label, idx) => (
          <span
            key={label}
            className={`px-3 py-1 rounded-full text-sm ${
              store.step >= idx + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}
          >
            {idx + 1}. {label}
          </span>
        ))}
      </div>

      {/* Steps */}
      {store.step === 1 && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter your name"
            value={store.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={store.nextStep}
            disabled={!store.name.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {store.step === 2 && (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={store.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="flex gap-2">
            <button
              onClick={store.prevStep}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Previous
            </button>
            <button
              onClick={store.nextStep}
              disabled={!store.email.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {store.step === 3 && (
        <div className="space-y-3">
          <textarea
            placeholder="Enter your message"
            value={store.message}
            onChange={(e) => updateField('message', e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="flex gap-2">
            <button
              onClick={store.prevStep}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Previous
            </button>
            <button
              onClick={store.resetForm}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Submit & Reset
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      <div>
        <h4 className="font-medium mb-2">Form Data Preview:</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(
            { name: store.name, email: store.email, message: store.message },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
