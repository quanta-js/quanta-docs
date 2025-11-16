/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LocalStorageAdapter, logger } from "@quantajs/core";
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
        total: 0,
    }),
    getters: {
        itemCount: (state) => state.items.length,
        isEmpty: (state) => state.items.length === 0,
    },
    actions: {
        addItem(product: { id: number; name: string; price: number }) {
            const existingItem = this.items.find(
                (item) => item.id === product.id
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.updateTotal();
        },
        removeItem(productId: number) {
            this.items = this.items.filter((item) => item.id !== productId);
            this.updateTotal();
        },
        updateQuantity(productId: number, quantity: number) {
            const item = this.items.find((item) => item.id === productId);
            if (item) {
                item.quantity = Math.max(0, quantity);
                if (item.quantity === 0) {
                    this.removeItem(productId);
                } else {
                    this.updateTotal();
                    this.items = [...this.items]; // Reassign for array reactivity
                }
            }
        },
        updateTotal() {
            this.total = this.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
        },
        clearCart() {
            this.items = [];
            this.total = 0;
        },
    },
    persist: {
        adapter: new LocalStorageAdapter("shopping-cart"),
        debounceMs: 500,
        include: ["items", "total"],
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
        updateField(field: keyof typeof this, value: string | number) {
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
interface Task {
    id: number;
    title: string;
    status: "pending" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    completed: boolean;
}

interface AppState {
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
}

type AppGDefs = {
    filteredTasks: (state: AppState) => Task[];
};

type AppRawActions = {
    setView: (view: "list" | "board" | "calendar") => void;
    updateFilters: (updates: Partial<AppState["filters"]>) => void;
    setPage: (page: number) => void;
    toggleSidebar: () => void;
    addTask: (title: string) => void;
    toggleTask: (id: number) => void;
    updateTaskPriority: (id: number, priority: string) => void;
};

export const appStateStore = createStore<AppState, AppGDefs, AppRawActions>(
    "appStateStore",
    {
        state: () => ({
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
            updateFilters(updates: Partial<typeof this.filters>) {
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
                this.tasks = [...this.tasks]; // Reassign for deep reactivity
            },
            toggleTask(id: number) {
                const task = this.tasks.find((t) => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    task.status = task.completed ? "done" : "in-progress";
                    this.tasks = [...this.tasks]; // Trigger save
                }
            },
            // Bonus: Update priority
            updateTaskPriority(id: number, priority: string) {
                const task = this.tasks.find((t) => t.id === id);
                if (task) {
                    task.priority = priority as "low" | "medium" | "high";
                    this.tasks = [...this.tasks];
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
