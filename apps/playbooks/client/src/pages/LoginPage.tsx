import { useState } from 'react';
import { BRAND } from '@/lib/brand';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json().catch(() => ({})) as any;

      if (res.ok) {
        if (data.requires2FA) {
          setChallengeToken(data.challengeToken);
          setShow2FA(true);
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.error ?? "Invalid credentials");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body: any = { challengeToken };
      if (useRecovery) {
        body.recoveryCode = totpCode;
      } else {
        body.totpCode = totpCode;
      }

      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({})) as any;

      if (res.ok && data.success) {
        window.location.href = "/";
      } else {
        setError(data.error ?? "Invalid verification code");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (res.ok) {
        setResetSent(true);
      }
    } catch {
      // Still show success to prevent enumeration
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  };

  // 2FA verification step
  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
              Two-Factor Authentication
            </h1>
            <p className="text-muted-foreground text-sm">
              {useRecovery ? "Enter a recovery code" : "Enter the 6-digit code from your authenticator app"}
            </p>
          </div>

          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {useRecovery ? "Recovery Code" : "Verification Code"}
              </label>
              <input
                type="text"
                required
                autoFocus
                value={totpCode}
                onChange={e => setTotpCode(e.target.value.replace(/\s/g, ''))}
                placeholder={useRecovery ? "ABCD1234" : "000000"}
                maxLength={useRecovery ? 8 : 6}
                className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-center tracking-widest text-lg font-mono"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying…" : "Verify"}
            </button>

            <button
              type="button"
              onClick={() => { setUseRecovery(!useRecovery); setTotpCode(""); setError(""); }}
              className="w-full py-2.5 px-4 rounded-lg border border-border text-foreground text-sm hover:bg-card transition-colors"
            >
              {useRecovery ? "Use authenticator app instead" : "Use a recovery code"}
            </button>

            <button
              type="button"
              onClick={() => { setShow2FA(false); setChallengeToken(""); setTotpCode(""); setError(""); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
              Reset Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to receive reset instructions
            </p>
          </div>

          {!resetSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder={BRAND.adminEmail}
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resetLoading ? "Sending…" : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full py-2.5 px-4 rounded-lg border border-border text-foreground text-sm hover:bg-card transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-foreground font-medium">Check your notifications</p>
              <p className="text-muted-foreground text-sm">
                If that email is associated with an account, you'll receive reset instructions shortly.
              </p>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setResetSent(false); setResetEmail(""); }}
                className="w-full py-2.5 px-4 rounded-lg border border-border text-foreground text-sm hover:bg-card transition-colors mt-4"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-8">
            {BRAND.productName} · Operational Reference System
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
            {BRAND.productName}
          </h1>
          <p className="text-muted-foreground text-sm">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={BRAND.adminEmail}
              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
            {BRAND.productName} · {BRAND.tagline}
        </p>
      </div>
    </div>
  );
}
