"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          organization: institution,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errData = await res.json().catch(() => null);
        let errorMsg = "Registration failed. Please check your inputs.";
        if (errData?.detail) {
          if (Array.isArray(errData.detail)) {
            errorMsg = errData.detail[0]?.msg || errorMsg;
          } else if (typeof errData.detail === "string") {
            errorMsg = errData.detail;
          }
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError("An unexpected error occurred. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };



  if (success) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-bold font-serif text-gold-500">
          Account Created
        </h2>
        <p className="text-xs text-sandy-500 leading-relaxed">
          Your account has been successfully verified and created. You can now log in using your email and password.
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
          Create an Account
        </h2>
        <p className="mt-1.5 text-xs text-sandy-500">
          Sign up to start annotating and exploring the knowledge graph.
        </p>
      </div>

      {error && (
        <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-500 text-xs rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4 font-sans">
        <div>
          <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1.5">
            Full name
          </label>
          <input
            type="text"
            required
            className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none transition-all duration-300"
            placeholder="Dr. Payal Dev"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1.5">
            Institution / Org
          </label>
          <input
            type="text"
            required
            className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none transition-all duration-300"
            placeholder="Vedic AI Institute"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none transition-all duration-300"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1.5">
            Choose Password
          </label>
          <input
            type="password"
            required
            className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none transition-all duration-300"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-[10px] text-sandy-500/60">
            Must be at least 8 chars, with 1 uppercase, 1 lowercase, 1 digit.
          </p>
        </div>

        <CustomButton
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </CustomButton>
      </form>

      <div className="border-t border-sandy-500/10 pt-4 text-center">
        <p className="text-xs text-sandy-500">
          Already have credentials?{" "}
          <Link href="/login" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
