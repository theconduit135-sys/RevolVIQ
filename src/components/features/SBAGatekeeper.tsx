"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

type RiskLevel = "READY" | "CAUTION" | "HIGH_RISK";

interface AssessmentResult {
    program: "7a" | "504" | "Microloan";
    status: RiskLevel;
    reasons: string[];
}

export function SBAGatekeeper() {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [results, setResults] = useState<AssessmentResult[] | null>(null);

    const handleAnswer = (key: string, value: any) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const calculateResults = () => {
        // Basic Mock Logic (Advisory Only)
        const timeInBusiness = answers["timeInBusiness"] || 0;
        const creditScore = answers["creditScore"] || 0;
        const hasBankruptcy = answers["hasBankruptcy"] === true;

        const results: AssessmentResult[] = [];

        // 7(a) Logic
        if (hasBankruptcy || creditScore < 640) {
            results.push({ program: "7a", status: "HIGH_RISK", reasons: ["Credit Score < 640", "Bankruptcy History"] });
        } else if (timeInBusiness < 2) {
            results.push({ program: "7a", status: "CAUTION", reasons: ["< 2 Years in Business"] });
        } else {
            results.push({ program: "7a", status: "READY", reasons: ["Matches core criteria"] });
        }

        // Microloan Logic
        // More lenient
        if (creditScore > 500 && !hasBankruptcy) {
            results.push({ program: "Microloan", status: "READY", reasons: ["Microloans are flexible"] });
        } else {
            results.push({ program: "Microloan", status: "CAUTION", reasons: ["Requires strong business plan"] });
        }

        setResults(results);
        setStep(3);
    };

    return (
        <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-6 shadow-xl max-w-3xl mx-auto">
            <div className="mb-6 border-b border-midnight-700 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Info className="text-gold-500" />
                    SBA Gatekeeper™
                </h2>
                <p className="text-slate-400">Advisory readiness check for SBA 7(a), 504, and Microloans.</p>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-white font-medium">Time in Business (Years)</label>
                        <input
                            type="number"
                            className="w-full bg-midnight-900 border border-midnight-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            onChange={(e) => handleAnswer("timeInBusiness", parseInt(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-white font-medium">Estimated Personal Credit Score</label>
                        <input
                            type="number"
                            className="w-full bg-midnight-900 border border-midnight-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                            onChange={(e) => handleAnswer("creditScore", parseInt(e.target.value))}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="bk"
                            className="w-5 h-5 accent-gold-500"
                            onChange={(e) => handleAnswer("hasBankruptcy", e.target.checked)}
                        />
                        <label htmlFor="bk" className="text-white">Any personal bankruptcy in last 7 years?</label>
                    </div>

                    <button
                        onClick={calculateResults}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-midnight-900 font-bold py-3 rounded-lg transition-all"
                    >
                        Check Readiness
                    </button>
                </div>
            )}

            {step === 3 && results && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid gap-4">
                        {results.map((res) => (
                            <div key={res.program} className="bg-midnight-900 p-4 rounded-lg border border-slate-700 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">SBA {res.program}</h3>
                                    <ul className="text-sm text-slate-400 list-disc list-inside">
                                        {res.reasons.map(r => <li key={r}>{r}</li>)}
                                    </ul>
                                </div>

                                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider
                              ${res.status === "READY" ? "bg-green-500/10 text-green-500" :
                                        res.status === "CAUTION" ? "bg-yellow-500/10 text-yellow-500" :
                                            "bg-red-500/10 text-red-500"}`}>
                                    {res.status.replace("_", " ")}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-400">
                        <p><strong>Disclaimer:</strong> This is an advisory estimation only. Final approval decisions are made by individual lenders and the SBA.</p>
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        className="w-full border border-slate-600 hover:bg-slate-800 text-white font-medium py-2 rounded-lg transition-all"
                    >
                        Start Over
                    </button>
                </div>
            )}
        </div>
    );
}
