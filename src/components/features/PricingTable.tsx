"use client";

import { Check } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PricingTier {
    id: string; // Product ID
    name: string;
    price: number;
    features: string[];
    recommended?: boolean;
    type: "DIY" | "DWY" | "DFY";
}

const TIERS: PricingTier[] = [
    {
        id: "DIY_FULL",
        name: "DIY Plan",
        type: "DIY",
        price: 497,
        features: [
            "Lifetime Platform Access",
            "Unlimited Underwriting Scans",
            "PledgeBoost™ Strategy",
            "SBA Gatekeeper™"
        ]
    },
    {
        id: "DWY_FULL",
        name: "Do-It-With-You",
        type: "DWY",
        price: 747,
        features: [
            "Everything in DIY",
            "Priority Email Support",
            "Packaged Application Review",
            "Klarna Financing Available"
        ]
    },
    {
        id: "DFY_FULL",
        name: "Do-It-For-You",
        type: "DFY",
        price: 997,
        recommended: true,
        features: [
            "Everything in DWY",
            "Hands-on Capital Packaging",
            "Dedicated Account Manager",
            "Lender Match Introduction"
        ]
    }
];

export function PricingTable() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (tierId: string) => {
        if (!user) {
            router.push("/login?redirect=/dashboard");
            return;
        }

        setLoading(true);

        try {
            // 1. Get Viewer Org
            const viewerRes = await fetch("/api/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user ? `Bearer ${await user.getIdToken()}` : ""
                },
                body: JSON.stringify({
                    query: `query GetViewer { viewer { orgs { id } } }`
                })
            });
            const viewerJson = await viewerRes.json();
            const orgId = viewerJson.data?.viewer?.orgs?.[0]?.id;

            if (!orgId) {
                alert("You need to create an Organization/Business profile before purchasing.");
                router.push("/dashboard");
                setLoading(false);
                return;
            }

            // 2. Create Order
            const orderRes = await fetch("/api/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": user ? `Bearer ${await user.getIdToken()}` : ""
                },
                body: JSON.stringify({
                    query: `
                        mutation CreateOrder($input: JSON!) {
                            createOrder(input: $input) {
                                stripeCheckoutUrl
                            }
                        }
                    `,
                    variables: {
                        input: {
                            orgId,
                            items: [{ productId: tierId, quantity: 1 }],
                            successUrl: `${window.location.origin}/dashboard?success=true`,
                            cancelUrl: `${window.location.origin}/?canceled=true`
                        }
                    }
                })
            });
            const orderJson = await orderRes.json();

            if (orderJson.errors) {
                throw new Error(orderJson.errors[0].message);
            }

            const checkoutUrl = orderJson.data?.createOrder?.stripeCheckoutUrl;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                throw new Error("No URL returned");
            }

        } catch (e: any) {
            console.error(e);
            alert("Checkout Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TIERS.map((tier) => (
                <div
                    key={tier.type}
                    className={`relative bg-midnight-800 border rounded-2xl p-6 shadow-xl flex flex-col
                ${tier.recommended ? "border-gold-500 shadow-gold-500/20 scale-105 z-10" : "border-midnight-700"}`}
                >
                    {tier.recommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-midnight-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                    )}

                    <div className="text-center mb-6 space-y-2">
                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                        <div className="text-3xl font-bold text-gold-500">${tier.price}</div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">One-Time • Lifetime</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {tier.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <Check size={16} className="text-gold-500 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePurchase(tier.id)}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold transition-all
                ${tier.recommended
                                ? "bg-gold-500 hover:bg-gold-600 text-midnight-900 shadow-lg shadow-gold-500/20"
                                : "bg-midnight-900 hover:bg-slate-800 text-white border border-slate-700"}
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Processing..." : "Get Started"}
                    </button>
                </div>
            ))}
        </div>
    );
}
