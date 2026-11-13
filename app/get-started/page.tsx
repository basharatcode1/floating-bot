import Link from "next/link";
import { ImageBackground } from "./ImageBackground";
import { GetStartedClient } from "./GetStartedClient";
import { ArrowLeft } from "lucide-react";
import "@/app/components/auth/auth-modal.css";

const BG_IMAGE_URL = "/images/get-started-bg.png";

export const metadata = {
  title: "Get Started — StaffSync Talent Network",
  description:
    "Join the StaffSync Talent Network. Connect directly with vetted tech talent and top software consultancies on C-C and C-H contracts.",
};

export default function GetStartedPage() {
  return (
    <ImageBackground imageUrl={BG_IMAGE_URL}>
      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-5 pb-1 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] backdrop-blur-md text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Logo in Nav */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-[#005A9C] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#005A9C]/25">
            S
          </div>
          <span className="font-bold text-lg text-white tracking-tight hidden sm:inline-block">
            StaffSync
          </span>
        </Link>
      </header>

      {/* Main Split-Screen Section */}
      <main className="w-full flex-1 flex items-center justify-center overflow-x-hidden overflow-y-hidden ">
        <GetStartedClient />
      </main>

      {/* Footer Bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-white/[0.05]">
        <p>© {new Date().getFullYear()} StaffSync Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-slate-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-slate-400 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </ImageBackground>
  );
}
