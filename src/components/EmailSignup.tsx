"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const ERROR_CODE_MAP: Record<string, TranslationKey> = {
  REQUIRED: "apiErrorRequired",
  FORMAT: "apiErrorFormat",
  DISPOSABLE: "apiErrorDisposable",
  NO_DOMAIN: "apiErrorNoDomain",
  DOMAIN_NOT_EXIST: "apiErrorDomainNotExist",
  SERVER: "apiErrorServer",
};

export default function EmailSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 201) {
        setStatus("success");
        setMessage(t("apiSuccess"));
        setEmail("");
      } else if (res.status === 200 && data.code === "ALREADY") {
        setStatus("already");
        setMessage(t("apiAlready"));
        setEmail("");
      } else {
        setStatus("error");
        const key = ERROR_CODE_MAP[data.code] || "apiErrorServer";
        setMessage(t(key));
      }
    } catch {
      setStatus("error");
      setMessage(t("apiErrorNetwork"));
    }

    setTimeout(() => setStatus("idle"), 5000);
  }

  const isActive = status === "success" || status === "error" || status === "already";

  return (
    <div className="signup">
      <h3>{t("signupTitle")}</h3>
      <p>{t("signupDesc")}</p>

      {isActive && (
        <div className={`signup-toast ${status}`}>
          <span className="signup-toast-icon">
            {status === "success" && "🎉"}
            {status === "already" && "👋"}
            {status === "error" && "⚠️"}
          </span>
          <span>{message}</span>
        </div>
      )}

      <form className="email-form" onSubmit={handleSubmit}>
        <div className="email-input-wrapper">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            className={`email-input ${status === "error" ? "input-error" : ""}`}
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="notify-btn" disabled={status === "loading"}>
          {status === "loading" ? (
            <span className="btn-loading">
              <span className="spinner" />
              {t("checking")}
            </span>
          ) : (
            <>
              {t("notifyBtn")} 🔔
            </>
          )}
        </button>
      </form>
    </div>
  );
}
