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

export const appStateStore = createStore("appStateStore", {
    state: () => ({
        currentView: "dashboard",
        filters: {
            category: "all",
            status: "active",
            dateRange: "week",
        },
        pagination: {
            page: 1,
            pageSize: 10,
        },
        sidebarCollapsed: false,
    }),
    actions: {
        setView(view: string) {
            this.currentView = view;
        },
        updateFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters };
            this.pagination.page = 1; // Reset to first page when filters change
        },
        setPage(page: number) {
            this.pagination.page = page;
        },
        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
        },
    },
    persist: {
        adapter: new LocalStorageAdapter("app-state"),
        debounceMs: 200,
        exclude: ["pagination"],
    },
});

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
