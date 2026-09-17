"use client";
import React, { useState } from "react";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold font-serif text-gold-500">
          Reset Link Sent
        </h2>
        <p className="text-xs text-sandy-500 leading-relaxed">
          If an account exists with the email address {email}, we have sent a secure link to reset your password.
        </p>
        <Link href="/login" className="inline-block mt-4">
          <CustomButton variant="outline" size="sm">
            Back to Sign In
          </CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-serif text-[var(--foreground)] tracking-wide">
          Reset Password
        </h2>
        <p className="mt-1.5 text-xs text-sandy-500">
          Enter your email and we'll send a recovery link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div>
          <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none transition-all duration-300"
            placeholder="payal@shloka.afi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <CustomButton
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Sending link..." : "Send Reset Link"}
        </CustomButton>
      </form>

      <div className="border-t border-sandy-500/10 pt-4 text-center">
        <p className="text-xs text-sandy-500">
          Remember your password?{" "}
          <Link href="/login" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
