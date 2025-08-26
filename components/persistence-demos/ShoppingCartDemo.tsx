/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuantaStore } from '@quantajs/react';
import { shoppingCartStore } from './stores';

export function ShoppingCartDemo() {
    const store = useQuantaStore(shoppingCartStore);

    const addItem = (product: { id: number; name: string; price: number }) => store.addItem(product);
    const removeItem = (id: number) => store.removeItem(id);
    const updateQuantity = (id: number, qty: number) => store.updateQuantity(id, qty);
    const clearCart = () => store.clearCart();

    const itemCount = store.items.length;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow space-y-6">
            <h3 className="text-lg font-semibold">Shopping Cart Demo</h3>

            {/* Products */}
            <div>
                <h4 className="font-medium mb-3">Available Products</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { id: 1, name: 'Laptop', price: 999 },
                        { id: 2, name: 'Mouse', price: 29 },
                        { id: 3, name: 'Keyboard', price: 89 },
                    ].map((p) => (
                        <div
                            key={p.id}
                            className="p-4 rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm flex flex-col items-start"
                        >
                            <h5 className="font-semibold">{p.name}</h5>
                            <p className="text-gray-600 dark:text-gray-400">${p.price}</p>
                            <button
                                onClick={() => addItem(p)}
                                className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
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
                    <p className="text-gray-500">Your cart is empty</p>
                ) : (
                    <div className="space-y-3">
                        {store.items.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm"
                            >
                                <span className="font-medium">{item.name}</span>
                                <span>${item.price}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                    className="w-16 border rounded-md px-2 py-1 text-center dark:bg-gray-800 dark:border-gray-600"
                                />
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="text-right font-bold text-lg">
                            Total: ${store.total}
                        </div>
                        <button
                            onClick={clearCart}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
