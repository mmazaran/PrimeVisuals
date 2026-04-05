import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

type PackageConfig = {
    id: string;
    name: string;
    price: string;
    badge: string;
    includes: string[];
    callout: string;
};

const packages: PackageConfig[] = [
    {
        id: 'prod_UHWf7FcijPxuB4',
        name: 'The Essential Suite',
        price: '$350',
        badge: 'THE ALL-IN-ONE BASE',
        includes: ['Interior/Exterior HDR Photos', 'Floor Plan', 'Aerial Photos'],
        callout: 'Includes Aerials & Floor Plan ($200 value included).',
    },
    {
        id: 'prod_UHWgbBXCNOcDeO',
        name: 'The Professional Series',
        price: '$550',
        badge: 'MOST POPULAR',
        includes: [
            'Interior/Exterior HDR Photos',
            'Floor Plan',
            'Aerial Photos',
            'Advanced Post-Production',
            'Item Removal',
        ],
        callout: 'Perfect for occupied homes needing high-end retouching.',
    },
    {
        id: 'prod_UHWhkwSGJE0lDl',
        name: 'The Signature Prime',
        price: '$750',
        badge: 'THE FULL PRODUCTION',
        includes: [
            'Interior/Exterior HDR Photos',
            'Floor Plan',
            'Aerial Photos',
            'Advanced Post-Production',
            'Item Removal',
            'AI Virtual Staging',
            '60s Trending Social Reel',
        ],
        callout: 'Complete cinematic marketing for luxury listings.',
    },
];

export const Bookings: React.FC = () => {
    const [selectedPackage, setSelectedPackage] = useState<PackageConfig | null>(null);
    const navigate = useNavigate();

    useCalendlyEventListener({
        onEventScheduled: (e) => {
            if (selectedPackage) {
                // Redirect to checkout once scheduled
                navigate(`/checkout?packageId=${selectedPackage.id}`);
            }
        },
    });

    return (
        <div className="w-full min-h-screen bg-[#030303] text-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {!selectedPackage ? (
                    <>
                        <div className="text-center mb-20 animate-[fadeIn_0.5s_ease-out]">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">Select Your Production</h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                                Premium media packages tailored for impact. Clear pricing, cinematic quality.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {packages.map((pkg, i) => (
                                <div
                                    key={pkg.id}
                                    className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full bg-white/5 border-white/10 hover:border-prime-500/50 hover:bg-white/10 hover:-translate-y-2 group cursor-pointer animate-[fadeIn_0.5s_ease-out_${i * 0.2}s_both]`}
                                    onClick={() => setSelectedPackage(pkg)}
                                >
                                    <div className="absolute -top-4 left-6">
                                        <span className="bg-prime-500 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-prime-500/20">
                                            {pkg.badge}
                                        </span>
                                    </div>

                                    <div className="mt-4 mb-8">
                                        <h3 className="text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold text-white">{pkg.price}</span>
                                            <span className="text-gray-400">/ listing</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-prime-500/10 border border-prime-500/20 mb-8">
                                        <p className="text-prime-300 text-sm font-medium">{pkg.callout}</p>
                                    </div>

                                    <div className="flex-grow">
                                        <ul className="space-y-4 mb-8">
                                            {pkg.includes.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                    <CheckCircle2 size={20} className="text-prime-500 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/10">
                                        <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                            Select Package
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <button
                            onClick={() => setSelectedPackage(null)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Packages</span>
                        </button>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">Schedule your {selectedPackage.name}</h2>
                                <p className="text-gray-400 text-lg">Pick a date and time for the shoot. You'll proceed to securely checkout after.</p>
                            </div>
                            <div className="bg-prime-500/20 text-prime-300 px-6 py-3 rounded-xl border border-prime-500/30 font-bold text-xl inline-flex shadow-lg shadow-prime-500/10">
                                Total: {selectedPackage.price}
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[750px]">
                            <InlineWidget
                                url="https://calendly.com/primevisuals/listing-shoot-appointment"
                                styles={{ height: '750px', width: '100%' }}
                                prefill={{
                                    customAnswers: {
                                        a1: selectedPackage.name,
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
