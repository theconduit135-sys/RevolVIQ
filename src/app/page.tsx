import { PricingTable } from "@/components/features/PricingTable";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight-900 text-slate-300 flex flex-col font-sans">

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 text-center">
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
            RevolvIQ
          </h1>
          <p className="text-xl md:text-2xl text-slate-400">
            Underwriting Intelligence by The 1787 Group
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-midnight-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-gold-500/20">
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="w-full space-y-8 pt-12">
          <h2 className="text-2xl font-bold text-white">Choose Your Path to Capital Readiness</h2>
          <PricingTable />
        </div>
      </main>

      <footer className="p-6 text-center text-slate-600 text-sm">
        &copy; {new Date().getFullYear()} RevolvIQ. All rights reserved.
      </footer>
    </div>
  );
}
