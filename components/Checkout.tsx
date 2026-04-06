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
                const res = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ packageId }),
                });

                const data = await res.json();

                if (data.url) {
                    // Stripe returns a checkout url
                    window.location.href = data.url;
                } else {
                    setError(data.error || "Failed to generate secure checkout session.");
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
