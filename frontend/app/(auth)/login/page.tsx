"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        let errMsg = "Invalid email or password.";
        try {
          const parsed = JSON.parse(res.error);
          if (parsed.detail) errMsg = parsed.detail;
        } catch {
          if (res.error.includes("Invalid")) errMsg = res.error;
        }
        setError(errMsg);
      } else {
        router.push("/workspace");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred contacting the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-serif text-[var(--foreground)] tracking-wide">
          Welcome back
        </h2>
        <p className="mt-1.5 text-xs text-sandy-500">
          Enter your researcher credentials to continue.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 font-sans">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500">
            {error}
          </div>
        )}

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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-gold-500 hover:text-gold-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none transition-all duration-300"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <CustomButton
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </CustomButton>
      </form>

      <div className="border-t border-sandy-500/10 pt-4 text-center">
        <p className="text-xs text-sandy-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
