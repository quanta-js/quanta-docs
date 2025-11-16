'use client';
import dynamic from 'next/dynamic';

// Dynamic imports for SSR safety
const ThemeDemo = dynamic(() => import('./ThemeDemo').then(m => m.ThemeDemo), { ssr: false });
const ShoppingCartDemo = dynamic(() => import('./ShoppingCartDemo').then(m => m.ShoppingCartDemo), { ssr: false });
const FormDemo = dynamic(() => import('./FormDemo').then(m => m.FormDemo), { ssr: false });
const AppStateDemo = dynamic(() => import('./AppStateDemo').then(m => m.AppStateDemo), { ssr: false });
const CrossTabDemo = dynamic(() => import('./CrossTabDemo').then(m => m.CrossTabDemo), { ssr: false });

export function PersistenceDemosWrapper() {
  return (
    <div className="space-y-8 transition-colors duration-300">
      {/* Hero Intro */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">QuantaJS Persistence: Live Playground</h2>
        <p className="text-lg mb-6">
          Test real-world state persistence—no setup, just mutate and reload. QuantaJS auto-saves to localStorage (or adapters like IndexedDB) with zero boilerplate.
        </p>
        {/* Quick Use Cases Table */}
        <div className="w-full">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Use Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Why QuantaJS?</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">User Preferences (e.g., themes, locales)</td>
                <td className="px-6 py-4">Persists across sessions; survives browser updates. Scalable for 100s of settings.</td>
                <td className="px-6 py-4">Theme Switcher</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">E-commerce Cart</td>
                <td className="px-6 py-4">Deep mutations (e.g., qty updates) auto-save with debounce; include only essentials to avoid bloat.</td>
                <td className="px-6 py-4">Shopping Cart</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">Multi-Step Forms (e.g., onboarding)</td>
                <td className="px-6 py-4">Transform data (e.g., clean empties); resume interrupted flows seamlessly.</td>
                <td className="px-6 py-4">Contact Form</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">App UI State (e.g., dashboards)</td>
                <td className="px-6 py-4">Exclude transients like pagination; nested filters persist without full rehydrate.</td>
                <td className="px-6 py-4">App State</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">Multi-Tab Sync (e.g., collaborative tools)</td>
                <td className="px-6 py-4">Storage events trigger live updates; framework-agnostic for PWAs.</td>
                <td className="px-6 py-4">Cross-Tab Sync</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Demos (Columnar) */}
      <ThemeDemo />
      <ShoppingCartDemo />
      <FormDemo />
      <AppStateDemo />
      <CrossTabDemo />

      {/* Footer Tip */}
      <div className="text-center p-6 bg-green-900/20 text-green-300">
        <p className="text-sm font-medium mb-2">Pro Tip: Inspect localStorage in DevTools to see auto-saves in action.</p>
        <p className="text-xs text-gray-500">
          QuantaJS handles hydration on init + debounced saves. Scale to IndexedDB for larger state.
        </p>
      </div>
    </div>
  );
}