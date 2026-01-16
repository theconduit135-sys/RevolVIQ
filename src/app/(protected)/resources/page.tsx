import { KnowledgeBase } from "@/components/features/KnowledgeBase";

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-midnight-900 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Resource Center</h1>
                    <p className="text-slate-400">Curated lenders, vendors, and strategies for capital readiness.</p>
                </div>
                <KnowledgeBase />
            </div>
        </div>
    );
}
