"use client";

import { useState } from "react";
import { AlertCircle, ChevronUp, X } from "lucide-react";
import { clsx } from "clsx";

// Mock Tier State (In real app, fetch from Auth/Context)
type Tier = "DIY" | "DWY" | "DFY";

interface PanicButtonProps {
    currentTier?: Tier;
}

export function PanicButton({ currentTier = "DIY" }: PanicButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Upgrade Logic / Pricing Difference
    const getUpgradeOffers = (tier: Tier) => {
        switch (tier) {
            case "DIY":
                return [
                    { label: "Upgrade to Do-It-With-You", price: "$250", id: "UPGRADE_DIY_DWY" },
                    { label: "Upgrade to Do-It-For-You", price: "$500", id: "UPGRADE_DIY_DFY" }
                ];
            case "DWY":
                return [
                    { label: "Upgrade to Do-It-For-You", price: "$250", id: "UPGRADE_DWY_DFY" }
                ];
            case "DFY":
                return [
                    { label: "Book Advisory Session", price: "$4,500", id: "CAPITAL_READINESS_ADVISORY" }
                ];
            default:
                return [];
        }
    };

    const offers = getUpgradeOffers(currentTier);

    // Handle Mock Checkout
    const handleUpgrade = (priceId: string) => {
        console.log("Trigger Upgrade Checkout:", priceId);
        // TODO: Call createUpgrade mutation
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* Expanded Menu */}
            {isOpen && (
                <div className="bg-white dark:bg-midnight-800 border border-gold-500/30 shadow-2xl rounded-xl p-4 w-80 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gold-500 flex items-center gap-2">
                            <AlertCircle size={18} />
                            Need Help?
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>

                    <p className="text-sm text-slate-300 mb-4">
                        Stuck? Upgrade your plan instantly. We only charge the difference.
                    </p>

                    <div className="space-y-2">
                        {offers.map((offer) => (
                            <button
                                key={offer.id}
                                onClick={() => handleUpgrade(offer.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-midnight-900 border border-midnight-700 hover:border-gold-500 hover:bg-midnight-700 transition-all group text-left"
                            >
                                <span className="text-sm font-medium text-slate-200 group-hover:text-gold-400">{offer.label}</span>
                                <span className="text-sm font-bold text-gold-500">{offer.price}</span>
                            </button>
                        ))}
                    </div>

                    <button className="w-full mt-3 py-2 text-xs text-center text-slate-500 hover:text-slate-300 underline">
                        Contact Support
                    </button>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-lg shadow-gold-500/20 transition-all hover:scale-105 active:scale-95",
                    isOpen ? "bg-midnight-700 text-white" : "bg-gold-500 text-midnight-900"
                )}
            >
                <AlertCircle size={20} />
                {isOpen ? "Close Help" : "Panic Button"}
                {!isOpen && <ChevronUp size={16} />}
            </button>
        </div>
    );
}
