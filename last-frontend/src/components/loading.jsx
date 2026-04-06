import { FaHeartbeat } from "react-icons/fa";

export default function Loading() {
    return (
        <div className="flex min-h-55 w-full items-center justify-center">
            <div className="relative flex flex-col items-center">
                <div className="absolute h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="absolute h-28 w-28 rounded-full bg-sky-200/30 blur-2xl" />

                <div className="relative flex h-28 w-28 items-center justify-center">
                    <div className="absolute h-28 w-28 animate-spin rounded-full border-[6px] border-sky-100 border-t-sky-500" />
                    <div className="absolute h-20 w-20 animate-[spin_3s_linear_infinite_reverse] rounded-full border-[5px] border-emerald-100 border-t-emerald-500" />
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-sky-500 shadow-[0_12px_30px_rgba(16,185,129,0.35)]">
                        <FaHeartbeat className="animate-pulse text-white" size={18} />
                    </div>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-800">Loading Dashboard</h3>
                <p className="mt-1 text-sm text-black/55">Please wait while we prepare everything...</p>
            </div>
        </div>
    );
}