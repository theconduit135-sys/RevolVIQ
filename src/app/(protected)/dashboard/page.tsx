import { SBAGatekeeper } from "@/components/features/SBAGatekeeper";
import Link from "next/link";
import { ArrowRight, FileText, ShieldCheck, Zap } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-midnight-900 p-6 md:p-12 space-y-12">

            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">Capital Readiness Dashboard</h1>
                    <p className="text-slate-400">Welcome back, User.</p>
                </div>
                <div className="px-4 py-1 rounded-full bg-gold-500/10 text-gold-500 text-sm font-medium border border-gold-500/20">
                    Tier: DIY Plan
                </div>
            </div>

            {/* Main Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card 1: Scan */}
                <div className="col-span-1 md:col-span-2 bg-midnight-800 border border-midnight-700 rounded-xl p-6 hover:border-gold-500/50 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={120} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Underwriting Scan™</h3>
                            <p className="text-slate-400 mt-1 max-w-md">Upload your credit report for an instant 73-point inspection and capital readiness action plan.</p>
                        </div>
                        <Link href="/scan" className="inline-flex items-center gap-2 text-gold-500 font-bold hover:translate-x-1 transition-transform">
                            Run New Scan <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Card 2: Knowledge Base */}
                <div className="bg-midnight-800 border border-midnight-700 rounded-xl p-6 hover:border-gold-500/50 transition-colors">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Resource Center</h3>
                        <p className="text-slate-400 text-sm">Access the list of pledge-secured lenders, soft-pull cards, and builder vendors.</p>
                        <button className="text-slate-300 hover:text-white text-sm font-medium underline">Browse Resources</button>
                    </div>
                </div>
            </div>

            {/* SBA Gatekeeper Section */}
            <div className="max-w-6xl mx-auto">
                <SBAGatekeeper />
            </div>

        </div>
    );
}
