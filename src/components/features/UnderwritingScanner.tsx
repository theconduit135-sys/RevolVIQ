"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, FileText } from "lucide-react";

export function UnderwritingScanner() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"IDLE" | "UPLOADING" | "PROCESSING" | "COMPLETE" | "ERROR">("IDLE");
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type !== "application/pdf") {
                alert("Only PDF files are supported.");
                return;
            }
            await startUpload(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await startUpload(e.target.files[0]);
        }
    };

    const startUpload = async (file: File) => {
        setFileName(file.name);
        setUploadStatus("UPLOADING");

        try {
            // 1. Get Signed URL from GraphQL (Mocked here)
            // const { data } = await uploadDocumentMutation(...)

            // 2. Upload to Cloud Storage
            // await fetch(data.signedUploadUrl, { method: 'PUT', body: file ... })

            // Mocking delay
            setTimeout(() => {
                setUploadStatus("PROCESSING");
                setTimeout(() => {
                    setUploadStatus("COMPLETE");
                }, 3000);
            }, 1500);

        } catch (err) {
            setUploadStatus("ERROR");
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Upload Credit Report</h2>
                <p className="text-slate-400">Upload your PDF credit report for instant AI underwriting analysis.</p>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDragOver ? "border-gold-500 bg-midnight-800" : "border-slate-700 bg-midnight-900"
                    }`}
            >
                <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileSelect}
                    disabled={uploadStatus !== "IDLE" && uploadStatus !== "ERROR"}
                />

                {uploadStatus === "IDLE" && (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="p-4 bg-midnight-800 rounded-full border border-slate-700">
                            <UploadCloud size={40} className="text-gold-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium text-white">Click to upload or drag and drop</p>
                            <p className="text-sm text-slate-500">PDF up to 10MB</p>
                        </div>
                    </label>
                )}

                {uploadStatus === "UPLOADING" && (
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <FileText size={48} className="text-gold-500" />
                        <p className="text-gold-500 font-medium">Uploading {fileName}...</p>
                    </div>
                )}

                {uploadStatus === "PROCESSING" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                        <div className="space-y-1">
                            <p className="text-white font-medium">Analyzing Underwriting Factors...</p>
                            <p className="text-xs text-slate-500">Extracting trade lines, calculating debt ratio, scanning for negatives.</p>
                        </div>
                    </div>
                )}

                {uploadStatus === "COMPLETE" && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle size={56} className="text-green-500" />
                        <div className="space-y-1">
                            <p className="text-xl font-bold text-white">Analysis Complete</p>
                            <button className="text-gold-500 hover:text-gold-400 font-medium underline">
                                View Results
                            </button>
                        </div>
                    </div>
                )}

                {uploadStatus === "ERROR" && (
                    <div className="flex flex-col items-center gap-4">
                        <AlertTriangle size={56} className="text-red-500" />
                        <p className="text-red-400">Upload failed. Please try again.</p>
                        <button
                            onClick={() => setUploadStatus("IDLE")}
                            className="text-sm text-slate-400 underline"
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
