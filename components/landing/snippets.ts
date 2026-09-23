/** Code shown on the landing page. Keep in step with the current API. */

/** The store behind the hero instrument, as it runs. */
export const INSTRUMENT_CODE = `import { defineStore } from '@quantajs/core';
import { useQuantaValue, useQuantaActions } from '@quantajs/react';

const useDemo = defineStore('demo', {
  state: () => ({ count: 7, step: 1 }),
  getters: {
    doubled: (s) => s.count * 2,
  },
  actions: {
    increment() {
      this.count = (this.count + this.step) % 1000;
    },
    cycleStep() {
      this.step = this.step === 1 ? 2 : this.step === 2 ? 5 : 1;
    },
    incrementThrice() {
      // three writes, one action: subscribers wake once
      this.increment();
      this.increment();
      this.increment();
    },
  },
});

function Count() {
  // re-renders only when count changes
  const count = useQuantaValue(useDemo, (s) => s.count);
  return <DotMatrix text={String(count)} />;
}
`;

export const ASYNC_CODE = `const useUser = defineStore('user', {
  state: () => ({ name: '' }),
  actions: {
    async load(id: string) {
      const res = await fetch(\`/api/users/\${id}\`, { signal: this.$signal });
      this.name = (await res.json()).name;
    },
  },
});

user.load.pending; // true while the request is in flight
user.load.error;   // the rejection, or null
user.load.abort(); // cancels it through $signal`;

export const CONTAINER_CODE = `// app/page.tsx — one container per request
export default async function Page() {
  const container = createContainer();
  await useCart(container).load();

  const snapshot = container.dehydrate();
  container.dispose();

  return <Providers snapshot={snapshot}><Cart /></Providers>;
}`;

export const PERSIST_CODE = `const usePrefs = defineStore('prefs', {
  state: () => ({ theme: 'light', token: '' }),
  persist: {
    adapter: new LocalStorageAdapter('prefs'),
    include: ['theme'],
    version: 2,
    migrations: {
      2: (data) => ({ ...data, theme: data.dark ? 'dark' : 'light' }),
    },
  },
});`;

export const DEVTOOLS_CODE = `import { QuantaDevTools } from '@quantajs/react/devtools';

export function DevPanel() {
  // live state and an action log, with secrets masked
  return <QuantaDevTools redact={['token', 'user.email']} />;
}`;
