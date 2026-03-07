export interface ResumeFormData {
  // Personal Info
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string; // base64

  // Objective
  objective: string;

  // Education
  education: Education[];

  // Experience
  experience: Experience[];

  // Skills
  skills: string[];

  // Certifications
  certifications: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  percentage: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export type ResumeStep = "form" | "otp" | "payment" | "preview";

export interface ResumeState {
  formData: ResumeFormData | null;
  step: ResumeStep;
  email: string;
  otpSent: boolean;
  otpVerified: boolean;
  paymentDone: boolean;
  orderId: string | null;
}
