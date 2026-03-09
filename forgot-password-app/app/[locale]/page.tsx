"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage({ params }: { params: { locale: string } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white text-center">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-extrabold">Welcome Back</h1>
            <p className="text-blue-200 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all pr-12" />
                <button onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <Link href={`/${params.locale}/forgot-password`}
                  className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">
              Sign In →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
