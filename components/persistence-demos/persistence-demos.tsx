'use client';

import dynamic from 'next/dynamic';

const ThemeDemo = dynamic(() => import('./ThemeDemo').then(m => m.ThemeDemo), { ssr: false });
const ShoppingCartDemo = dynamic(() => import('./ShoppingCartDemo').then(m => m.ShoppingCartDemo), { ssr: false });
const FormDemo = dynamic(() => import('./FormDemo').then(m => m.FormDemo), { ssr: false });
const AppStateDemo = dynamic(() => import('./AppStateDemo').then(m => m.AppStateDemo), { ssr: false });
const CrossTabDemo = dynamic(() => import('./CrossTabDemo').then(m => m.CrossTabDemo), { ssr: false });

export function PersistenceDemosWrapper() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Interactive QuantaJS Persistence Demos</h2>
      <p className="text-gray-600 dark:text-gray-400 italic">
        These demos showcase real QuantaJS persistence features. Try them out!
      </p>

      <ThemeDemo />
      <ShoppingCartDemo />
      <FormDemo />
      <AppStateDemo />
      <CrossTabDemo />
    </div>
  );
}
