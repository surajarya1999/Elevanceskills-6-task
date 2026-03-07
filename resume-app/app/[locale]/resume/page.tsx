"use client";

import { useAppSelector } from "@/hooks/redux";
import ResumeForm from "@/components/resume/ResumeForm";
import OtpStep from "@/components/resume/OtpStep";
import PaymentStep from "@/components/payment/PaymentStep";
import ResumePreview from "@/components/resume/ResumePreview";
import StepIndicator from "@/components/resume/StepIndicator";

export default function ResumePage() {
  const step = useAppSelector(s => s.resume.step);

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator current={step} />
      {step === "form"    && <ResumeForm />}
      {step === "otp"     && <OtpStep />}
      {step === "payment" && <PaymentStep />}
      {step === "preview" && <ResumePreview />}
    </div>
  );
}
