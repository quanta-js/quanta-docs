/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useQuantaStore } from '@quantajs/react';
import { shoppingCartStore, userPreferencesStore } from './stores';

export function ShoppingCartDemo() {
    const store = useQuantaStore(shoppingCartStore);
    const themeStore = useQuantaStore(userPreferencesStore); // Local theme read
    const [showCode, setShowCode] = useState(false);
    const isDark = themeStore.theme === 'dark';
    const addItem = (product: { id: number; name: string; price: number }) => store.addItem(product);
    const removeItem = (id: number) => store.removeItem(id);
    const updateQuantity = (id: number, qty: number) => store.updateQuantity(id, qty);
    const clearCart = () => store.clearCart();
    const itemCount = store.items?.length;

    return (
        <div className={`p-6 rounded-2xl shadow-lg space-y-6 transition-all duration-300 ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
            }`}>
            <div className="flex justify-between items-start">
                <div className={`text-2xl font-semibold ${isDark ? 'text-white': 'text-black'}`}>Shopping Cart</div>
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
                        title="Resets cart to empty & wipes localStorage"
                        className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
                        aria-label="Reset cart store"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Use Case Blurb */}
            <div className={`p-3 rounded-lg text-sm border-l-4 ${isDark ? 'bg-green-900/20 border-green-500 text-green-300' : 'bg-green-50 border-green-500 text-green-700'
                }`}>
                <span className={`font-semibold ${isDark ? 'text-white': 'text-black'}`}>Real Use Case:</span> E-commerce—carts persist abandoned sessions, boosting recovery by 15%. Nested qty updates auto-save without full re-render.
            </div>

            {/* Products */}
            <div>
                <h4 className="font-medium mb-3">Products</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { id: 1, name: 'Laptop', price: 999 },
                        { id: 2, name: 'Mouse', price: 29 },
                        { id: 3, name: 'Keyboard', price: 89 },
                    ].map((p) => (
                        <div
                            key={p.id}
                            className={`p-4 rounded-xl border shadow-sm flex flex-col items-start hover:shadow-md transition-shadow ${isDark ? 'bg-gray-700 dark:border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <h5 className="font-semibold">{p.name}</h5>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>${p.price}</p>
                            <button
                                onClick={() => addItem(p)}
                                className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                                aria-label={`Add ${p.name} to cart`}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div>
                <h4 className="font-medium mb-3">Your Cart ({itemCount} items)</h4>
                {itemCount === 0 ? (
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>Empty—add items above!</p>
                ) : (
                    <div className="space-y-3">
                        {store.items?.map((item: any) => (
                            <div
                                key={item.id}
                                className={`flex justify-between items-center rounded-lg p-3 shadow-sm hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors ${isDark ? 'bg-gray-700' : 'bg-gray-50'
                                    }`}
                            >
                                <span className="font-medium">{item.name}</span>
                                <span>${item.price}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                    className={`w-16 border rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-ring ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    aria-label={`Quantity for ${item.name}`}
                                />
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} font-medium transition-colors`}
                                    aria-label={`Remove ${item.name}`}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="text-right font-bold text-xl">
                            Total: <span className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>${store.total?.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={clearCart}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                            aria-label="Clear entire cart"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>

            {/* Debounce Viz + Tip */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                <div className={`w-1/3 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                    <div className={`h-2 rounded-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                        }`} style={{ width: '80%' }} /> {/* Debounce progress */}
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    Debounced save (500ms) • <span className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>Synced!</span>
                </p>
            </div>

            {/* Code Snippet */}
            {showCode && (
                <pre className={`${isDark ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-800'} p-3 rounded-lg text-xs overflow-x-auto mt-4 border border-gray-600`}>
                    <code>{`actions: {
  addItem(product) {
    // ... mutation
    this.items = [...this.items]; // Reassign for deep reactivity
    this.updateTotal();
  }
},
persist: {
  include: ["items", "total"], // Only essentials
  debounceMs: 500,
}`}</code>
                </pre>
            )}
        </div>
    );
}