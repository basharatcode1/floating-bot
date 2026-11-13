"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GetStartedButton from "./GetStartedButton";
import { useAuthModal } from "@/app/components/auth/AuthModalContext";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/#testimonials" },
];

/**
 * "Signal Dock" navbar.
 */
export default function Navbar() {
  const router = useRouter();
  const { openSignup } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [navbarTheme, setNavbarTheme] = useState("dark");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = document.querySelectorAll("[data-section-theme]");
      let currentTheme = "dark";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 40 && rect.bottom >= 40) {
          currentTheme = section.getAttribute("data-section-theme") || "dark";
        }
      });

      setNavbarTheme(currentTheme);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled
            ? navbarTheme === "light"
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(8, 13, 23, 0.6)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          borderBottom: scrolled
            ? navbarTheme === "light"
              ? "1px solid var(--card-light-border)"
              : "1px solid var(--card-dark-border)"
            : "1px solid transparent",
        }}
      >
        {/* signal scanline: only visible once docked */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none transition-opacity duration-500"
          style={{ opacity: scrolled ? 1 : 0 }}
        >
          <motion.div
            className="h-full w-1/3"
            style={{
              background:
                "linear-gradient(to right, transparent, hsla(221, 83%, 53%, 0.8), hsla(262, 83%, 53%, 0.6), transparent)",
            }}
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[72px] md:h-[80px]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <span
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                }}
              />
              <span
                className="absolute inset-0 rounded-xl animate-ping"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  opacity: 0.35,
                  animationDuration: "2.4s",
                }}
              />
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                S
              </div>
            </div>
            <span
              className="font-bold text-xl tracking-tight transition-colors duration-500"
              style={{
                color:
                  navbarTheme === "light"
                    ? "var(--text-on-light)"
                    : "var(--text-on-dark)",
              }}
            >
              StaffSync
            </span>
          </Link>

          <div
            className="hidden md:flex items-center gap-1 relative px-1.5 py-1.5 rounded-full"
            style={{
              background:
                navbarTheme === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "hsla(221, 83%, 53%, 0.06)",
              border:
                navbarTheme === "light"
                  ? "1px solid var(--card-light-border)"
                  : "1px solid hsla(221, 83%, 53%, 0.16)",
            }}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10"
                style={{
                  color:
                    hoveredLink === link.label
                      ? navbarTheme === "light"
                        ? "var(--text-on-light)"
                        : "var(--text-on-dark)"
                      : navbarTheme === "light"
                        ? "var(--text-on-light-muted)"
                        : "var(--text-on-dark-muted)",
                }}
                onMouseEnter={() => setHoveredLink(link.label)}
              >
                {hoveredLink === link.label && (
                  <motion.span
                    layoutId="nav-signal-pill"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, hsla(221, 83%, 53%, 0.22), hsla(262, 83%, 53%, 0.18))",
                      border: "1px solid hsla(221, 83%, 53%, 0.4)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap bg-transparent border-none cursor-pointer"
              style={{
                color:
                  navbarTheme === "light"
                    ? "var(--text-on-light-muted)"
                    : "var(--text-on-dark-muted)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  navbarTheme === "light"
                    ? "var(--text-on-light)"
                    : "var(--text-on-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  navbarTheme === "light"
                    ? "var(--text-on-light-muted)"
                    : "var(--text-on-dark-muted)")
              }
            >
              Log In
            </Link>
            <GetStartedButton
              text="Get Started"
              buttonWidth={135}
              buttonHeight={44}
              radius={12}
              borderSize={1.5}
              fontSize={14}
              fontWeight={600}
              onClick={() => router.push("/get-started")}
            />
          </div>

          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="absolute block w-6 h-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  navbarTheme === "light"
                    ? "var(--text-on-light)"
                    : "var(--text-on-dark)",
                transform: mobileOpen ? "rotate(45deg)" : "translateY(-6px)",
              }}
            />
            <span
              className="absolute block w-6 h-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  navbarTheme === "light"
                    ? "var(--text-on-light)"
                    : "var(--text-on-dark)",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="absolute block w-6 h-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  navbarTheme === "light"
                    ? "var(--text-on-light)"
                    : "var(--text-on-dark)",
                transform: mobileOpen ? "rotate(-45deg)" : "translateY(6px)",
              }}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 right-0 z-45 w-full md:hidden transition-transform duration-300 border-b ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          backgroundColor: "var(--dark-bg)",
          borderColor: "var(--card-dark-border)",
          zIndex: 45,
        }}
      >
        <div className="flex flex-col pt-24 pb-8 px-4 sm:px-6 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              style={{ color: "var(--text-on-dark-muted)" }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-on-dark)";
                e.currentTarget.style.backgroundColor =
                  "var(--ghost-btn-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-on-dark-muted)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="border-t my-4"
            style={{ borderColor: "var(--card-dark-border)" }}
          />

          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 text-left bg-transparent border-none cursor-pointer block"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            Log In
          </Link>
          <div className="mt-2 pl-4">
            <GetStartedButton
              text="Get Started"
              buttonWidth={160}
              buttonHeight={44}
              radius={12}
              borderSize={1.5}
              fontSize={14}
              fontWeight={600}
              onClick={() => {
                setMobileOpen(false);
                router.push("/get-started");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
