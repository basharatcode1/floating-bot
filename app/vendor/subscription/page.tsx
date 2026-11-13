import { VendorSubscriptionClient } from "./VendorSubscriptionClient";

export const metadata = {
  title: "Select Subscription — StaffSync",
  description: "Choose a subscription plan to start accessing enterprise client contracts.",
};

export default function VendorSubscriptionPage() {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 relative flex flex-col justify-center overflow-x-hidden py-10">
      {/* Background subtle light glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-500/8 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2.5">
            Choose Your <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Subscription</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Select the plan that best fits your business needs to start deploying your bench talent to verified enterprise clients.
          </p>
        </div>

        <VendorSubscriptionClient />
      </div>
    </main>
  );
}

