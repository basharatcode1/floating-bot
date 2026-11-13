"use client";

import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

const contactItems = [
  {
    label: "Email",
    value: "hello@staffsync.ai",
    href: "mailto:hello@staffsync.ai",
  },
  { label: "Phone", value: "+1 (800) 123-4567", href: "tel:+18001234567" },
];

const highlights = [
  "Live platform walkthrough",
  "AI-matched talent recommendations",
  "Dedicated demo for your hiring goals",
  "No commitment required",
];

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function CTA() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik<FormData>({
    initialValues: {
      fullName: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: (values) => {
      const result = formSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      }
      return errors;
    },
    onSubmit: async (_) => {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      formik.resetForm();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    },
  });

  const register = (name: keyof FormData) => formik.getFieldProps(name);
  const handleSubmit = (fn: any) => formik.handleSubmit;
  const onSubmit = () => {};

  const errors = useMemo(() => {
    const errs: Record<string, { message?: string }> = {};
    for (const [key, value] of Object.entries(formik.errors)) {
      if (typeof value === "string") {
        errs[key] = { message: value };
      }
    }
    return errs;
  }, [formik.errors]);

  return (
    <section
      className="relative overflow-hidden py-8 md:py-12 theme-transition"
      style={{
        background: "linear-gradient(180deg, var(--dark-bg) 0%, #050A12 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-[-8rem] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 28%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[-6rem] top-1/3 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "color-mix(in srgb, var(--accent-secondary) 18%, transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(96,165,250,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.14) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <div className="max-w-2xl">
          <h2
            className="text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-[3.65rem]"
            style={{ color: "var(--text-on-dark)" }}
          >
            See StaffSync in Action -{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              }}
            >
              Book Your Demo Today
            </span>
          </h2>

          <p
            className="mt-6 max-w-2xl text-base leading-8 md:text-lg"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            In 30 minutes, we&apos;ll walk through the platform from first job
            posting to reviewing AI-matched submissions. No slides, no fluff,
            just a live demo shaped around your hiring goals.
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm md:text-base"
                style={{ color: "var(--text-on-dark)" }}
              >
                <span
                  className="mt-2 h-2 w-2 rounded-full shrink-0"
                  style={{
                    background: "var(--accent-secondary)",
                    boxShadow:
                      "0 0 14px color-mix(in srgb, var(--accent-secondary) 50%, transparent)",
                  }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-row gap-2.5 sm:gap-4">
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:brightness-110 shadow-2xl whitespace-nowrap"
              style={{
                background:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              }}
            >
              Book a Demo
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl border px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg font-semibold transition-all duration-300 hover:bg-white/10 whitespace-nowrap"
              style={{
                color: "var(--text-on-dark)",
                borderColor: "var(--ghost-btn-border)",
                backgroundColor: "transparent",
              }}
            >
              Talk to Sales
            </Link>
          </div>

          <div
            className="mt-8 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:gap-8"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <span className="text-[11px] uppercase tracking-[0.2em]">
                  {item.label}
                </span>
                <span>{item.value}</span>
              </a>
            ))}
          </div>
        </div>

        <div
          className="rounded-[28px] border p-6 md:p-8"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "rgba(148, 163, 184, 0.16)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          }}
        >
          <div className="mb-6">
            <h3
              className="text-2xl font-bold"
              style={{ color: "var(--text-on-dark)" }}
            >
              Contact Sales
            </h3>
            <p
              className="mt-3 text-sm leading-6"
              style={{ color: "var(--text-on-dark-muted)" }}
            >
              Fill out the form and our team will reach out within 24 hours.
            </p>
          </div>

          {submitSuccess && (
            <div
              className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center text-green-400"
              role="alert"
            >
              <p className="font-medium">Thank you for your message!</p>
              <p className="text-sm">We&apos;ll contact you within 24 hours.</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Input
                  {...register("fullName")}
                  placeholder="Full Name"
                  style={{
                    color: "var(--text-on-dark)",
                    borderColor: "rgba(148, 163, 184, 0.16)",
                  }}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  {...register("phone")}
                  placeholder="Contact Number"
                  style={{
                    color: "var(--text-on-dark)",
                    borderColor: "rgba(148, 163, 184, 0.16)",
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Input
                {...register("email")}
                placeholder="Email Address"
                style={{
                  color: "var(--text-on-dark)",
                  borderColor: "rgba(148, 163, 184, 0.16)",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("subject")}
                placeholder="Subject"
                style={{
                  color: "var(--text-on-dark)",
                  borderColor: "rgba(148, 163, 184, 0.16)",
                }}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <Textarea
                {...register("message")}
                placeholder="Your Message"
                rows={5}
                style={{
                  color: "var(--text-on-dark)",
                  borderColor: "rgba(148, 163, 184, 0.16)",
                }}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="  text-white w-full rounded-xl hover:brightness-110 shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
