
import { useState, type FormEvent } from "react";
import { apiRequest } from "../../lib/api";
import { useLanguage } from "../../lib/useLanguage";
import { LanguageSelector } from "../ui/LanguageSelector";

type Mode = "login" | "signup" | "forgot" | "reset";

export default function AccountPage() {
  const { t, registerTexts, prepareTexts } = useLanguage();
  const [mode, setMode] = useState<Mode>(() => {
    if (window.location.pathname === "/signup") return "signup"
    if (window.location.pathname === "/reset-password") return "reset"
    if (window.location.pathname === "/forgot-password") return "forgot"
    return "login"
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    try {
      if (mode === "forgot") {
        const result = await apiRequest<{ message: string }>(
          "/auth/forgot-password",
          { method: "POST", body: { email } }
        );
        setMessage(result.message);
        return;
      }

      if (mode === "reset") {
        const result = await apiRequest<{ message: string }>(
          "/auth/reset-password",
          { method: "POST", body: { token: new URLSearchParams(window.location.search).get("token"), password: form.get("password") } }
        );
        setMessage(result.message);
        return;
      }

      const body =
        mode === "signup"
          ? {
              fullName: form.get("fullName"),
              email,
              password: form.get("password"),
            }
          : {
              email,
              password: form.get("password"),
            };

      await apiRequest(`/auth/${mode}`, {
        method: "POST",
        body,
      });

      window.location.assign(mode === "signup" ? "/" : "/account");
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "Something went wrong.";
      registerTexts([errorText]);
      try { await prepareTexts([errorText]); } catch { /* Preserve the original English API message if translation is unavailable. */ }
      setError(errorText);
    } finally {
      setBusy(false);
    }
  }

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  return (
    <main className="account-page">
      <a className="account-brand" href="/">
        MERKATO <span>FUND</span>
      </a>
      <LanguageSelector compact />

      <section className="account-card">
        <div className="account-mark">M</div>

        <p className="account-eyebrow">
          {t(isForgot || isReset ? "ACCOUNT RECOVERY" : "WELCOME TO MERKATO FUND")}
        </p>

        <h1>
          {isReset
            ? t("Choose a new password")
            : isForgot
              ? t("Reset your password")
            : isSignup
              ? t("Create your account")
              : t("Welcome back")}
        </h1>

        <p className="account-subtitle">
          {isReset
            ? t("Choose a strong password. Reset links expire and can only be used once.")
            : isForgot
              ? t("Enter your email to request a password reset.")
            : isSignup
              ? t("Join Merkato Fund and get started.")
              : t("Sign in to continue to your account.")}
        </p>

        {!isForgot && !isReset && (
          <div className="account-tabs">
            <button
              type="button"
              className={!isSignup ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
            >
              {t("Sign In")}
            </button>

            <button
              type="button"
              className={isSignup ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
            >
              {t("Create Account")}
            </button>
          </div>
        )}

        <form
          className="account-form"
          onSubmit={handleSubmit}
          key={mode}
        >
          {isSignup && (
            <label>
              {t("Full Name")}
              <input
                name="fullName"
                type="text"
                placeholder={t("Enter your full name")}
                autoComplete="name"
                minLength={2}
                maxLength={120}
                required
              />
            </label>
          )}

          {!isReset && <label>
              {t("Email Address")}
            <input
              name="email"
              type="email"
              placeholder={t("you@example.com")}
              autoComplete="email"
              maxLength={254}
              required
            />
          </label>}

          {!isForgot && !isReset && (
            <label>
              {t("Password")}
              <input
                name="password"
                type="password"
                placeholder={t("Enter your password")}
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 12 : 1}
                maxLength={128}
                required
              />
              {isSignup && (
                <small>{t("Use at least 12 characters.")}</small>
              )}
            </label>
          )}

          {isReset && (
            <label>
              {t("New Password")}
              <input
                name="password"
                type="password"
                placeholder={t("Choose a new password")}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
              />
            </label>
          )}

          {error && (
            <p className="account-error" role="alert">
              {t(error)}
            </p>
          )}

          {message && (
            <p className="account-success" role="status">
              {message}
            </p>
          )}

          <button className="account-submit" disabled={busy}>
            {busy
              ? t("Please wait...")
              : isForgot
                ? t("Send Reset Link")
                : isReset
                  ? t("Reset Password")
                : isSignup
                  ? t("Create Account")
                  : t("Sign In")}
          </button>
        </form>

        {!isForgot && !isReset && !isSignup && (
          <button
            type="button"
            className="account-text-link forgot-link"
            onClick={() => {
              setMode("forgot");
              setError("");
              setMessage("");
            }}
          >
            {t("Forgot your password?")}
          </button>
        )}

        {(isForgot || isReset) && (
          <button
            type="button"
            className="account-text-link"
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
          >
            {t("← Back to sign in")}
          </button>
        )}

        <p className="account-footer">
          {t("Secure access to your Merkato Fund account.")}
        </p>

        <a href="/" className="account-back">
          {t("← Return to website")}
        </a>
      </section>
    </main>
  );
}
