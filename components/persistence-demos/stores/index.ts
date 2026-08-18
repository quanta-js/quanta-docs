/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LocalStorageAdapter } from "@quantajs/core";
import { createStore } from "@quantajs/react";

export const userPreferencesStore = createStore("userPreferencesStore", {
    state: () => ({
        theme: "light",
        language: "en",
        notifications: true,
        fontSize: "medium",
    }),
    actions: {
        updateTheme(theme: string) {
            this.theme = theme;
        },
        updateLanguage(lang: string) {
            this.language = lang;
        },
        toggleNotifications() {
            this.notifications = !this.notifications;
        },
    },
    persist: {
        adapter: new LocalStorageAdapter("user-preferences"),
        debounceMs: 300,
    },
});

export const shoppingCartStore = createStore("shoppingCartStore", {
    state: () => ({
        items: [] as Array<{
            id: number;
            name: string;
            price: number;
            quantity: number;
        }>,
    }),
    getters: {
        itemCount: (state) => state.items.length,
        isEmpty: (state) => state.items.length === 0,
        // Derived, never stored. Keeping a `total` in state means every
        // action that touches `items` has to remember to recompute it — and
        // the one that forgets ships a cart whose total silently disagrees
        // with its contents. A getter cannot drift.
        total: (state) =>
            state.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
    },
    actions: {
        addItem(product: { id: number; name: string; price: number }) {
            const existing = this.items.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
        },
        removeItem(productId: number) {
            this.items = this.items.filter((item) => item.id !== productId);
        },
        updateQuantity(productId: number, quantity: number) {
            const item = this.items.find((it) => it.id === productId);
            if (!item) return;

            if (quantity <= 0) {
                this.removeItem(productId);
                return;
            }
            // A plain in-place write. Reassigning the array to force an update
            // used to be necessary and no longer is.
            item.quantity = quantity;
        },
        clearCart() {
            this.items = [];
        },
    },
    persist: {
        adapter: new LocalStorageAdapter("shopping-cart"),
        debounceMs: 500,
        // Only `items` is persisted — `total` derives from it, so storing it
        // would just be a second copy that can go stale.
        include: ["items"],
    },
});

export const formStore = createStore("formStore", {
    state: () => ({
        name: "",
        email: "",
        message: "",
        step: 1,
    }),
    actions: {
        // Same circularity trap as `appStateStore.updateFilters` below:
        // `keyof typeof this` in a parameter position makes TypeScript give
        // up on the whole actions object, so none of these actions would
        // appear on the store's type.
        updateField(field: string, value: string | number) {
            (this as any)[field] = value;
        },
        nextStep() {
            if (this.step < 3) this.step++;
        },
        prevStep() {
            if (this.step > 1) this.step--;
        },
        resetForm() {
            this.name = "";
            this.email = "";
            this.message = "";
            this.step = 1;
        },
    },
    persist: {
        adapter: new LocalStorageAdapter("contact-form"),
        debounceMs: 100,
        transform: {
            out: (data) => {
                // Don't save empty fields
                const cleanData: Record<string, unknown> = {};
                Object.entries(data).forEach(([k, v]) => {
                    if (v !== "" && v !== null && v !== undefined) {
                        cleanData[k] = v;
                    }
                });
                return cleanData;
            },
        },
    },
});

// Types (new block)
//
// These are `type` aliases rather than `interface`s on purpose: a store's
// state has to satisfy `StateTree`, and TypeScript gives type aliases an
// implicit index signature while interfaces get none. An `interface` here
// silently collapses the inferred state to `unknown` at every read site.
type Task = {
    id: number;
    title: string;
    status: "pending" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    completed: boolean;
};

type AppState = {
    currentView: "list" | "board" | "calendar";
    filters: {
        status: "all" | "pending" | "in-progress" | "done";
        priority: "all" | "low" | "medium" | "high";
    };
    pagination: {
        page: number;
        limit: number;
    };
    sidebar: {
        collapsed: boolean;
        user: string;
    };
    tasks: Task[];
};

// Note: no explicit generics on `createStore`. Supplying `S` pins `G` and
// `A` at their defaults, so the getters and actions below would vanish from
// the resulting type — and an `interface` fails the `StateTree` constraint
// outright, since interfaces get no implicit index signature. Annotating the
// state factory gives the same checking with nothing lost.
export const appStateStore = createStore(
    "appStateStore",
    {
        state: (): AppState => ({
            currentView: "list" as "list" | "board" | "calendar",
            filters: {
                status: "all" as "all" | "pending" | "in-progress" | "done",
                priority: "medium" as "all" | "low" | "medium" | "high",
            },
            pagination: {
                page: 1,
                limit: 5, // Small for demo pagination
            },
            sidebar: {
                collapsed: false,
                user: "Guest",
            },
            tasks: [
                {
                    id: 1,
                    title: "Review PR",
                    status: "in-progress",
                    priority: "high",
                    completed: false,
                },
                {
                    id: 2,
                    title: "Update docs",
                    status: "pending",
                    priority: "medium",
                    completed: false,
                },
                {
                    id: 3,
                    title: "Fix bug",
                    status: "done",
                    priority: "low",
                    completed: true,
                },
            ] as Task[],
        }),
        getters: {
            filteredTasks: (state) => {
                let tasks = state.tasks.length ? [...state.tasks] : []; // Copy for immutability
                if (state.filters.status !== "all")
                    tasks = tasks.filter(
                        (t) => t.status === state.filters.status
                    );
                if (state.filters.priority !== "all")
                    tasks = tasks.filter(
                        (t) => t.priority === state.filters.priority
                    );
                return tasks;
            },
        },
        actions: {
            setView(view: "list" | "board" | "calendar") {
                this.currentView = view;
            },
            // `Partial<AppState["filters"]>`, not `Partial<typeof this.filters>`:
            // referring to `this` in a *parameter* position of a contextually
            // typed action is circular, and TypeScript resolves it by giving
            // up on the whole actions object — every action then disappears
            // from the store's type.
            updateFilters(updates: Partial<AppState["filters"]>) {
                this.filters = { ...this.filters, ...updates };
                this.pagination.page = 1; // Reset pagination
            },
            setPage(page: number) {
                this.pagination.page = Math.max(1, page);
            },
            toggleSidebar() {
                this.sidebar.collapsed = !this.sidebar.collapsed;
            },
            addTask(title: string) {
                const id = Date.now();
                this.tasks.push({
                    id,
                    title,
                    status: "pending",
                    priority: "medium",
                    completed: false,
                });
            },
            toggleTask(id: number) {
                const task = this.tasks.find((t) => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    task.status = task.completed ? "done" : "in-progress";
                }
            },
            // Bonus: Update priority
            updateTaskPriority(id: number, priority: string) {
                const task = this.tasks.find((t) => t.id === id);
                if (task) {
                    task.priority = priority as "low" | "medium" | "high";
                }
            },
        },
        persist: {
            adapter: new LocalStorageAdapter("app-state"),
            debounceMs: 200,
            include: ["currentView", "filters", "sidebar", "tasks"],
            exclude: ["pagination"],
            transform: {
                out: (data) => {
                    // Prune old completed tasks if >50 (demo cleanup)
                    if (data.tasks?.length > 50) {
                        data.tasks = data.tasks
                            .filter((t: any) => !t.completed)
                            .slice(0, 50);
                    }
                    return data;
                },
            },
        },
    }
);

export const crossTabStore = createStore("crossTabStore", {
    state: () => ({
        lastUpdated: new Date().toLocaleTimeString(),
        tabCount: 1,
    }),
    actions: {
        updateTimestamp() {
            this.lastUpdated = new Date().toLocaleTimeString();
            this.tabCount++;
        },
    },
    persist: {
        adapter: new LocalStorageAdapter("cross-tab-demo"),
        debounceMs: 100,
    },
});
