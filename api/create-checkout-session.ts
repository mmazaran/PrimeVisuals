import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { packageId } = req.body;

    if (!packageId) {
        return res.status(400).json({ error: 'Missing packageId' });
    }

    try {
        const origin = req.headers.origin || 'https://primevisualsny.com'; // fallback for safety

        // Create session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
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
            success_url: `${origin}/Home?checkout=success`,
            cancel_url: `${origin}/Bookings?checkout=cancel`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe Session Error:', err);
        res.status(500).json({ error: err.message || 'Error creating Stripe session' });
    }
}
