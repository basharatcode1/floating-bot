"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const VENDOR_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with basic platform access.",
    features: [
      "Access to standard C-C contracts",
      "Up to 1 active candidate profile",
      "Standard payment terms (Net 30)",
      "Community support",
    ],
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$999",
    period: "/month",
    description: "For established agencies looking to scale fast.",
    features: [
      "Access to premium C-H & C-C contracts",
      "Unlimited active candidate profiles",
      "Accelerated payment terms (Net 15)",
      "Priority candidate matching",
      "Dedicated account manager",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "High-volume bespoke solutions for large firms.",
    features: [
      "Direct API integration",
      "White-labeled candidate portal",
      "Custom payment terms",
      "Quarterly business reviews",
      "24/7 dedicated support team",
    ],
    highlighted: false,
  },
];

export function VendorSubscriptionClient() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("professional");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    // Simulate API call to save subscription choice
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/vendor/dashboard");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-8 items-stretch">
        {VENDOR_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className={`relative flex flex-col p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 bg-[var(--dash-card-bg-solid)] ${
                isSelected
                  ? "border-2 border-indigo-600 ring-4 ring-indigo-500/10 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                  : plan.highlighted
                    ? "border-2 border-indigo-500/40 shadow-md shadow-indigo-500/5 hover:border-indigo-500/70 hover:shadow-lg"
                    : "border border-[var(--dash-card-border)] shadow-sm hover:border-[var(--dash-card-border)] hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-white text-[9px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Most Popular
                </div>
              )}

              {/* Selection indicator */}
              <div
                className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 shadow-sm"
                    : "border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]"
                }`}
              >
                {isSelected && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--dash-text-primary)] mb-1">
                  {plan.name}
                </h3>
                <p className="text-[var(--dash-text-secondary)] text-xs h-8 leading-snug">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-[var(--dash-divider)]">
                <span className="text-3xl sm:text-4xl font-black text-[var(--dash-text-primary)] tracking-tight">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-[var(--dash-text-secondary)] text-xs font-medium">
                    {plan.period}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dash-text-muted)] mb-3">
                  Included Features
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-indigo-500" strokeWidth={3} />
                      </div>
                      <span className="text-[var(--dash-text-secondary)] text-xs font-medium leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan || isProcessing}
          className={`h-11 px-8 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            selectedPlan
              ? "bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg shadow-indigo-500/25 border-0 hover:scale-[1.02] active:scale-[0.98] opacity-90 hover:opacity-100"
              : "bg-[var(--dash-card-border)] text-[var(--dash-text-muted)] cursor-not-allowed border-0"
          }`}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Continue to Dashboard
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        {!selectedPlan ? (
          <p className="text-[var(--dash-text-muted)] text-xs">Please select a plan to continue</p>
        ) : (
          <p className="text-[var(--dash-text-muted)] text-xs">Cancel or switch plans anytime from settings</p>
        )}
      </div>
    </div>
  );
}

