'use client';
import Link from 'next/link';
import { Home, ArrowLeft, Bot } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] font-sans p-6">
      <div className="max-w-md w-full text-center">
        {/* Styled Icon/Visual matching Dashboard Hero gradient */}
        <div 
          className="relative w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
          }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20" />
          <Bot className="w-12 h-12 text-white relative z-10" />
          {/* Decorative elements inspired by Dashboard Hero */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/10" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-blue-500/20" />
        </div>

        <h1 className="text-6xl font-black text-[#1E293B] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Page Not Found</h2>
        <p className="text-[#64748B] mb-10 leading-relaxed">
          The requested resource could not be found. You might have typed the address incorrectly or the page has moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] text-sm font-semibold rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Subtle branding footer */}
        <div className="mt-16 text-xs text-[#64748B]/50 uppercase tracking-widest font-medium">
          MyTeamHQ HRMS
        </div>
      </div>
    </div>
  );
}