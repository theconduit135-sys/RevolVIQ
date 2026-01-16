"use client";

import { useState } from "react";
import { ChevronRight, Bookmark, ExternalLink } from "lucide-react";

type Category = "PLEDGE_LOANS" | "SECURED_CARDS" | "NO_HARD_PULL" | "SBA" | "BANK_INTERNAL";

interface Resource {
    title: string;
    summary: string;
    link?: string;
    tags: string[];
}

const RESOURCES: Record<Category, Resource[]> = {
    PLEDGE_LOANS: [
        { title: "Navy Federal Pledge Loan", summary: "High-impact credit mix builder. No credit check required. Unlocks high limits.", tags: ["Credit Mix", "High Impact"] },
        { title: "PenFed Share Secured", summary: "Excellent for building relationship with PenFed. Low interest rates.", tags: ["Credit Union", "Secured"] }
    ],
    SECURED_CARDS: [
        { title: "Bank of America Business Advantage", summary: "Graduates to unsecured. Reports to business bureaus.", tags: ["Business Credit", "Top Tier"] },
        { title: "Wells Fargo Business Secured", summary: "Strong builder card. 1.5% cash back options.", tags: ["Business Credit"] }
    ],
    NO_HARD_PULL: [
        { title: "Gauss", summary: "Credit building line of credit. No hard pull to apply.", tags: ["Fintech", "Revolving"] },
        { title: "Grow Credit", summary: "Build credit with subscriptions you already pay.", tags: ["Alternative Data"] }
    ],
    SBA: [
        { title: "SBA Lender Match", summary: "Official SBA tool to find lenders approved for your industry.", link: "https://www.sba.gov/funding-programs/loans/lender-match", tags: ["Official"] },
        { title: "7(a) Loan Program", summary: "The SBA's primary program for small businesses.", tags: ["Working Capital"] }
    ],
    BANK_INTERNAL: [
        { title: "Understanding Bank Internal Scores", summary: "Banks score you on deposits, average daily balance, and overdrafts before they check FICO.", tags: ["Education"] },
        { title: "The 30-Day Deposit Rule", summary: "Maximize your internal score by parking funds for 30+ days before applying.", tags: ["Strategy"] }
    ]
};

export function KnowledgeBase() {
    const [activeCategory, setActiveCategory] = useState<Category>("PLEDGE_LOANS");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-2">
                {(Object.keys(RESOURCES) as Category[]).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between
              ${activeCategory === cat ? "bg-gold-500 text-midnight-900 font-bold" : "bg-midnight-800 text-slate-400 hover:text-white"}`}
                    >
                        {cat.replace(/_/g, " ")} <ChevronRight size={16} className={activeCategory === cat ? "opacity-100" : "opacity-0"} />
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                    {activeCategory.replace(/_/g, " ")} Resources
                </h2>
                {RESOURCES[activeCategory].map((res, i) => (
                    <div key={i} className="bg-midnight-800 border border-midnight-700 p-6 rounded-xl hover:border-gold-500/30 transition-colors group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors flex items-center gap-2">
                                    {res.title}
                                    {res.link && <ExternalLink size={14} className="text-slate-500" />}
                                </h3>
                                <p className="text-slate-400 mt-2">{res.summary}</p>

                                <div className="flex gap-2 mt-4">
                                    {res.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded text-xs bg-midnight-900 border border-slate-700 text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-gold-500">
                                <Bookmark size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
