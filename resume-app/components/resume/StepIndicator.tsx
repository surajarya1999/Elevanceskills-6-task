"use client";

import { useTranslations } from "next-intl";
import type { ResumeStep } from "@/types";

const STEPS: ResumeStep[] = ["form", "otp", "payment", "preview"];

const ICONS: Record<ResumeStep, string> = {
  form: "📝", otp: "🔐", payment: "💳", preview: "✅"
};

export default function StepIndicator({ current }: { current: ResumeStep }) {
  const t = useTranslations("resume.steps");
  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-0 py-6 print:hidden">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${active ? "bg-blue-600 text-white shadow-md" : done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              <span>{done ? "✓" : ICONS[step]}</span>
              <span className="hidden sm:inline">{t(step)}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < currentIndex ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
