/**
 * LoginSkeleton — pulse-animated placeholder that mirrors the login page's
 * split-screen layout (left brand heading + right glass login card).
 *
 * Follows the same pattern as GetStartedSkeleton in /get-started.
 */
export function LoginSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 lg:py-2 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 my-auto animate-pulse">
      {/* ===== LEFT SIDE: Brand heading skeleton ===== */}
      <div className="flex-1 flex flex-col justify-center text-left max-w-xl w-full">
        {/* STAFFSYNC title */}
        <div className="h-12 sm:h-14 lg:h-16 xl:h-[72px] bg-slate-700/30 rounded-xl w-3/4 mb-2" />

        {/* Tagline */}
        <div className="mt-3 space-y-2 max-w-md">
          <div className="h-4 sm:h-5 bg-slate-700/30 rounded-md w-full" />
          <div className="h-4 sm:h-5 bg-slate-700/30 rounded-md w-3/5" />
        </div>

        {/* Dot indicators */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700/40" />
            <div className="h-3 bg-slate-700/30 rounded w-24" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700/40" />
            <div className="h-3 bg-slate-700/30 rounded w-28" />
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE: Glass login card skeleton ===== */}
      <div className="flex-1 flex justify-center lg:justify-end w-full">
        <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
          <div className="w-full rounded-[24px] bg-white/[0.02] border border-white/[0.05] p-3 sm:p-4 shadow-2xl overflow-hidden">
            {/* Email label + input */}
            <div className="mb-3">
              <div className="h-2.5 bg-slate-700/30 rounded w-10 mb-1.5" />
              <div className="h-9 bg-slate-700/30 rounded-xl w-full" />
            </div>

            {/* Password label + input */}
            <div className="mb-2">
              <div className="h-2.5 bg-slate-700/30 rounded w-14 mb-1.5" />
              <div className="h-9 bg-slate-700/30 rounded-xl w-full" />
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end mb-3 mt-2">
              <div className="h-2.5 bg-slate-700/30 rounded w-24" />
            </div>

            {/* Sign In button */}
            <div className="h-9 bg-slate-700/30 rounded-xl w-full mb-3" />

            {/* OR divider */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-[1px] bg-slate-700/20" />
              <div className="h-2.5 bg-slate-700/30 rounded w-4" />
              <div className="flex-1 h-[1px] bg-slate-700/20" />
            </div>

            {/* Google button */}
            <div className="h-9 bg-slate-700/30 rounded-xl w-full mb-3" />

            {/* Sign-up footer */}
            <div className="flex flex-col items-center gap-1.5 mt-2">
              <div className="h-2.5 bg-slate-700/30 rounded w-48" />
              <div className="h-2.5 bg-slate-700/30 rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
