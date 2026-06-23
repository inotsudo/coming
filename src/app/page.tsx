"use client";

import Image from "next/image";
import Countdown from "@/components/Countdown";
import Sparkles from "@/components/Sparkles";
import EmailSignup from "@/components/EmailSignup";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const FEATURE_KEYS = [
  { icon: "📖", key: "featureMagicalStories" as const },
  { icon: "🏆", key: "featureFunChallenges" as const },
  { icon: "👑", key: "featureChampionTreasure" as const },
  { icon: "💜", key: "featureNimiCommunity" as const },
  { icon: "🤖", key: "featureTalkToNimi" as const },
];

function CharacterNimi() {
  const { t } = useLanguage();
  return (
    <div className="character character-nimi">
      <div className="character-circle">
        <Image
          src="/nimi.png"
          alt={t("nimiAlt")}
          width={180}
          height={180}
          priority
        />
      </div>
      <div className="character-name">NIMI</div>
    </div>
  );
}

function CharacterPiko() {
  const { t } = useLanguage();
  return (
    <div className="character character-piko">
      <div className="character-circle">
        <Image
          src="/piko-circle.png.png"
          alt={t("pikoAlt")}
          width={180}
          height={180}
          priority
        />
      </div>
      <div className="character-name">PIKO</div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="app">
      <Sparkles />

      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <Image
            src="/nimi-logo.png"
            alt="NimiPiko logo"
            width={48}
            height={48}
            className="logo-img"
          />
          <div className="logo-text">
            <h1>NIMIPIKO</h1>
            <p>{t("tagline")}</p>
          </div>
        </div>
        <div className="header-right">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        {/* Desktop characters */}
        <div className="hidden md:block">
          <CharacterNimi />
          <CharacterPiko />
        </div>

        {/* Mobile characters */}
        <div className="characters-mobile md:hidden">
          <CharacterNimi />
          <CharacterPiko />
        </div>

        <div className="banner">
          <span className="banner-star">⭐</span>
          <h2>{t("bannerTitle")}</h2>
        </div>
        <span className="coming-soon-is">{t("comingIs")}</span>
        <div className="coming-text">{t("comingText")}</div>
        <div className="soon-text">{t("soonText")}</div>

        <div className="description">
          <p>
            {t("descLine1")}{" "}
            <span className="magic">{t("descMagic")}</span>.
          </p>
          <p>
            {t("descLine2")}{" "}
            <span className="kw-learn">{t("kwLearn")}</span>,{" "}
            <span className="kw-play">{t("kwPlay")}</span>,{" "}
            <span className="kw-create">{t("kwCreate")}</span> {t("kwAnd")}{" "}
            <span className="kw-grow">{t("kwGrow")}</span>!
          </p>
        </div>

        <Countdown />
        <EmailSignup />
      </section>

      {/* Features */}
      <div className="features">
        {FEATURE_KEYS.map((f) => (
          <div key={f.key} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <span>{t(f.key)}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          ❤️ {t("footer")} ✨
        </p>
      </footer>
    </div>
  );
}
