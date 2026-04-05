import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const packageId = searchParams.get('packageId');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!packageId) {
            setError("No valid package selected for checkout.");
            return;
        }

        const initCheckout = async () => {
            try {
                // @ts-ignore: Vite env typings
                const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
                if (!stripeSecretKey) {
                    throw new Error("Stripe configuration missing. Contact support.");
                }

                const payload = {
                    success_url: `${window.location.origin}/Home?checkout=success`,
                    cancel_url: `${window.location.origin}/Bookings?checkout=cancel`,
                    line_items: [
                        {
                            // Because we are using the Product ID and not a specific Price ID directly natively without prices, 
                            // Wait, does Stripe Checkout require Price IDs instead of Product IDs in `line_items`? 
                            // Typically line_items needs a `price`. If the user provided a `prod_` ID, we technically need the associated `price_` ID 
                            // OR we can dynamically create a price on the fly using the product id.
                            price_data: {
                                currency: 'usd',
                                product: packageId,
                                unit_amount: packageId === 'prod_UHWf7FcijPxuB4' ? 35000 :
                                    packageId === 'prod_UHWgbBXCNOcDeO' ? 55000 : 75000,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                };

                const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${stripeSecretKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        success_url: payload.success_url,
                        cancel_url: payload.cancel_url,
                        mode: payload.mode,
                        'line_items[0][price_data][currency]': payload.line_items[0].price_data.currency,
                        'line_items[0][price_data][product]': payload.line_items[0].price_data.product,
                        'line_items[0][price_data][unit_amount]': payload.line_items[0].price_data.unit_amount.toString(),
                        'line_items[0][quantity]': '1',
                    }),
                });

                const data = await res.json();

                if (data.url) {
                    // Stripe returns a checkout url
                    window.location.href = data.url;
                } else {
                    setError(data.error?.message || "Failed to generate checkout session.");
                }

            } catch (err: any) {
                setError(err.message || 'An error occurred during secure checkout initialization.');
            }
        };

        initCheckout();
    }, [packageId]);

    return (
        <div className="w-full min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6">
            {!error ? (
                <div className="flex flex-col items-center animate-pulse">
                    <Loader2 className="w-12 h-12 text-prime-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold tracking-widest text-gray-200">INITIALIZING SECURE PAYMENT</h2>
                    <p className="text-gray-500 mt-4">Transferring you to Stripe...</p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="inline-flex w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 items-center justify-center mb-6">
                        <span className="text-red-500 font-bold text-xl">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Checkout Error</h2>
                    <p className="text-gray-400">{error}</p>
                    <a href="/Bookings" className="inline-block mt-8 text-prime-400 hover:text-prime-300 underline underline-offset-4">
                        Return to Bookings
                    </a>
                </div>
            )}
        </div>
    );
};
