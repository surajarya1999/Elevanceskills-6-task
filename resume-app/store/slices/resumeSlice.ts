import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResumeFormData, ResumeStep } from "@/types";

interface ResumeState {
  formData: ResumeFormData | null;
  step: ResumeStep;
  otpVerified: boolean;
  paymentDone: boolean;
  paymentId: string | null;
  orderId: string | null;
}

const initialState: ResumeState = {
  formData: null,
  step: "form",
  otpVerified: false,
  paymentDone: false,
  paymentId: null,
  orderId: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<ResumeFormData>) {
      state.formData = action.payload;
    },
    setStep(state, action: PayloadAction<ResumeStep>) {
      state.step = action.payload;
    },
    setOtpVerified(state) {
      state.otpVerified = true;
      state.step = "payment";
    },
    setPaymentDone(state, action: PayloadAction<{ paymentId: string; orderId: string }>) {
      state.paymentDone = true;
      state.paymentId = action.payload.paymentId;
      state.orderId = action.payload.orderId;
      state.step = "preview";
    },
    resetResume() {
      return initialState;
    },
  },
});

export const { setFormData, setStep, setOtpVerified, setPaymentDone, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;
