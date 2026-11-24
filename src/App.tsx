import React, { useRef, useState } from "react";
import {
  Award,
  Check,
  ChevronDown,
  Copy,
  Download,
  Camera,
  Lock,
  MessageCircle,
  RefreshCw,
  Share2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { CONFIG } from "../config.js";
import { CertificateData } from "./types";
import { BrandLogo } from "./components/BrandMark";
import { CertificateCard } from "./components/CertificateCard";
import { PaymentModal } from "./components/PaymentModal";
import {
  generateCertificatePngBlob,
  generateInstagramStoryBlob,
  triggerBlobDownload,
} from "./utils/certificateCanvas";

const DESIGNATION_OPTIONS = [
  "Certified Nalla",
  "Professional Overthinker",
  "Senior Single Launda",
  "Corporate Majdoor",
  "बेरोजगार लेकिन संस्कारी",
  "CEO of Timepass",
  "International Bakchod",
  "Ex Ka Sataya Hua",
  "Gharwalo Ki Aakhri Umeed",
  "Future Crorepati, Currently Broke",
  "Professional Delulu",
  "Unpaid Legend",
];

const MEME_QUOTES = [
  "Engineering ki degree se zyada useful nahi hai.",
  "100% unofficial. 200% unnecessary.",
  "Mummy ko mat dikhana.",
  "LinkedIn par mat daal dena.",
  "Government se approved nahi, doston se roasted hai.",
  "Aukaat chhoti ho sakti hai, certificate nahi.",
];

const FAQ_ITEMS = [
  {
    q: "Is this certificate government approved?",
    a: "Bhai, government ko aur bhi kaam hain.",
  },
  {
    q: "Can I add this to my resume?",
    a: "Kar sakte ho, naukri ki guarantee hum nahi lenge.",
  },
  {
    q: "Why ₹2?",
    a: "Inflation ke zamane mein itni hi izzat afford kar sakte hain.",
  },
  {
    q: "Is my personal information stored?",
    a: "No. Your certificate is generated locally in your browser.",
  },
  {
    q: "Is payment automatically verified?",
    a: "No. This website uses a trust-based payment system.",
  },
];

const SAMPLE_CERTIFICATE: CertificateData = {
  name: "Aarav Sharma",
  designation: "Professional Overthinker",
  certId: "2KI-000002",
  issueDate: "14 AUG 2026",
};

const SHARE_MESSAGE =
  "Bhai, ab mere paas officially ₹2 ka insaan hone ka certificate bhi hai. Tumhari kitni aukaat hai? 😂";

function sanitizeInput(value: string, maxLen: number): string {
  return value.replace(/[\u0000-\u001F\u007F<>]/g, "").slice(0, maxLen);
}

function generateCertId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "2KI-";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function formatIssueDate(): string {
  return new Date()
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
  duration: string;
  size: number;
}

export function App() {
  const [nameInput, setNameInput] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState(DESIGNATION_OPTIONS[0]);
  const [customDesignation, setCustomDesignation] = useState("");
  const [formError, setFormError] = useState("");

  const [generatedCert, setGeneratedCert] = useState<CertificateData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [isDownloadingHd, setIsDownloadingHd] = useState(false);
  const [isDownloadingStory, setIsDownloadingStory] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const generatorRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => nameInputRef.current?.focus(), 450);
  };

  const triggerConfetti = () => {
    const colors = ["#781C24", "#B68D40", "#111111", "#FAF3E3"];
    const pieces: ConfettiPiece[] = Array.from({ length: 42 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      delay: `${(Math.random() * 0.45).toFixed(2)}s`,
      duration: `${(2.1 + Math.random() * 1.4).toFixed(2)}s`,
      size: 7 + Math.floor(Math.random() * 7),
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3800);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = sanitizeInput(nameInput, 36).trim();
    const cleanedCustom = sanitizeInput(customDesignation, 44).trim();

    if (!cleanedName) {
      setFormError("Apna naam toh daalo bhai — bina naam ke aukaat kaise certify hogi?");
      nameInputRef.current?.focus();
      return;
    }

    setFormError("");
    const finalDesignation = cleanedCustom || selectedDesignation;

    const cert: CertificateData = {
      name: cleanedName,
      designation: finalDesignation,
      certId: generateCertId(),
      issueDate: formatIssueDate(),
    };

    setGeneratedCert(cert);
    setIsUnlocked(false);
    setIsPaymentModalOpen(true);

    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleConfirmPaid = () => {
    setIsPaymentModalOpen(false);
    setIsUnlocked(true);
    triggerConfetti();
  };

  const handleDownloadHd = async () => {
    if (!generatedCert || !isUnlocked) return;
    try {
      setIsDownloadingHd(true);
      const blob = await generateCertificatePngBlob(generatedCert);
      const safeName = generatedCert.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "insaan";
      triggerBlobDownload(blob, `2-ka-insaan-${safeName}.png`);
    } finally {
      setIsDownloadingHd(false);
    }
  };

  const handleDownloadStory = async () => {
    if (!generatedCert || !isUnlocked) return;
    try {
      setIsDownloadingStory(true);
      const blob = await generateInstagramStoryBlob(generatedCert);
      const safeName = generatedCert.name.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "insaan";
      triggerBlobDownload(blob, `2-ka-insaan-story-${safeName}.png`);
    } finally {
      setIsDownloadingStory(false);
    }
  };

  const handleWhatsAppShare = () => {
    const fullText = `${SHARE_MESSAGE} ${CONFIG.websiteUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (!generatedCert || !isUnlocked) return;

    try {
      if (navigator.share) {
        const shareData: ShareData = {
          title: `${CONFIG.brandName} — Certificate of Aukaat`,
          text: SHARE_MESSAGE,
          url: CONFIG.websiteUrl,
        };

        // Attach PNG file if browser supports file sharing
        if (navigator.canShare) {
          try {
            const blob = await generateCertificatePngBlob(generatedCert);
            const file = new File([blob], "2-ka-insaan-certificate.png", { type: "image/png" });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                ...shareData,
                files: [file],
              });
              return;
            }
          } catch {
            // Fall through to text/URL share
          }
        }

        await navigator.share(shareData);
      } else {
        await handleCopyWebsiteLink();
        setShareFeedback("Mobile share sheet unavailable — website link copied!");
        setTimeout(() => setShareFeedback(""), 2800);
      }
    } catch {
      // User cancelled native share sheet — ignore silently
    }
  };

  const handleCopyWebsiteLink = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.websiteUrl);
    } catch {
      const input = document.createElement("input");
      input.value = CONFIG.websiteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  const handleReset = () => {
    setGeneratedCert(null);
    setIsUnlocked(false);
    setNameInput("");
    setCustomDesignation("");
    setSelectedDesignation(DESIGNATION_OPTIONS[0]);
    setFormError("");
    scrollToGenerator();
  };

  return (
    <div className="min-h-screen paper-texture text-[#111111] flex flex-col">
      {/* Confetti Overlay */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="confetti-piece absolute top-0 block"
              style={
                {
                  left: piece.left,
                  width: `${piece.size}px`,
                  height: `${Math.round(piece.size * 1.4)}px`,
                  backgroundColor: piece.color,
                  animationDelay: piece.delay,
                  "--fall-duration": piece.duration,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Top Parody Notice Strip */}
      <div className="bg-[#111111] text-[#F5ECD7] border-b border-[#B68D40] px-4 py-1.5 text-center">
        <p className="font-mono-code text-[10px] sm:text-xs tracking-wider uppercase">
          100% Unofficial Parody Website • Pure Entertainment • No Login Required
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#F5ECD7]/95 backdrop-blur-xs border-b-2 border-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <a href="#" className="focus:outline-none">
            <BrandLogo compact />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <a href="#generator" className="hover:text-[#781C24] transition-colors">
              Certificate Banao
            </a>
            <a href="#faq" className="hover:text-[#781C24] transition-colors">
              Faltu FAQ
            </a>
            <a href="#legal" className="hover:text-[#781C24] transition-colors">
              Privacy & Terms
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToGenerator}
            className="bg-[#781C24] hover:bg-[#5e151c] text-[#F5ECD7] font-bold text-xs sm:text-sm px-3.5 py-2 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer whitespace-nowrap"
          >
            Certify — ₹{CONFIG.amount}
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-14 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#FAF3E3] border-2 border-[#111111] px-3 py-1 shadow-[3px_3px_0px_#B68D40]">
                <Award className="w-4 h-4 text-[#781C24]" />
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Duniya ne aukaat nahi batayi? Hum bata denge.
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-[52px] leading-[1.06] tracking-tight text-[#111111]">
                AAJ TAK LOG BOLTE THE...
                <span className="block text-[#781C24] mt-1.5">
                  AB CERTIFICATE BHI MILEGA.
                </span>
              </h1>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#111111] border-l-4 border-[#B68D40] pl-3.5">
                Officially Become a ₹2 Ka Insaan.
              </h2>

              <p className="text-base sm:text-lg text-[#111111]/85 leading-relaxed max-w-xl">
                "Duniya ne tumhari value samjhi ho ya nahi, humne samajh li hai. Sirf ₹2 mein apni
                aukaat ka certificate banwao."
              </p>

              <div className="pt-1 space-y-2.5">
                <button
                  type="button"
                  onClick={scrollToGenerator}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#781C24] hover:bg-[#5e151c] text-[#F5ECD7] font-display font-black text-base sm:text-lg px-7 py-4 border-2 border-[#111111] shadow-[5px_5px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0px_#111111] transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#B68D40]" />
                  APNI AUKAAT CERTIFY KARO — ₹{CONFIG.amount}
                </button>
                <p className="font-mono-code text-xs font-bold text-[#111111]/75">
                  No Login. No Subscription. Sirf ₹2 Ki Izzat.
                </p>
              </div>
            </div>

            {/* Right Sample Certificate */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-code text-[11px] font-bold uppercase tracking-widest bg-[#111111] text-[#B68D40] px-2.5 py-1">
                    Sample Certificate Preview
                  </span>
                  <span className="font-mono-code text-[11px] text-[#781C24] font-bold">
                    3:2 HD Landscape
                  </span>
                </div>
                <CertificateCard data={SAMPLE_CERTIFICATE} />
                <p className="mt-3 text-center font-mono-code text-[11px] text-[#111111]/70">
                  "Government se approved nahi, doston se roasted hai."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VIRAL HUMOR STRIP */}
        <section className="border-y-2 border-[#111111] bg-[#FAF3E3] py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MEME_QUOTES.map((quote, idx) => (
                <div
                  key={idx}
                  className="bg-[#F5ECD7] border border-[#111111] px-4 py-2.5 flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 bg-[#781C24] shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-[#111111]">"{quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATE GENERATOR SECTION */}
        <section
          id="generator"
          ref={generatorRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        >
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-block font-mono-code text-xs font-bold uppercase tracking-[0.2em] text-[#781C24] border-b-2 border-[#B68D40] pb-1 mb-3">
              Instant Browser Generator
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111]">
              APNA CERTIFICATE BANAO
            </h2>
            <p className="text-sm sm:text-base text-[#111111]/80 mt-2">
              "Engineering ki degree se zyada useful nahi hai." — Par Instagram Story par mast lagega.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Generator Form */}
            <div className="lg:col-span-5 bg-[#FAF3E3] border-2 border-[#111111] p-5 sm:p-7 shadow-[6px_6px_0px_#111111]">
              <form onSubmit={handleGenerate} className="space-y-5" noValidate>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="user-name" className="block text-sm font-bold text-[#111111]">
                      Your Name <span className="text-[#781C24]">*</span>
                    </label>
                    <span className="font-mono-code text-[11px] text-[#111111]/60">
                      {nameInput.length}/36
                    </span>
                  </div>
                  <input
                    ref={nameInputRef}
                    id="user-name"
                    type="text"
                    required
                    maxLength={36}
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(sanitizeInput(e.target.value, 36));
                      if (formError) setFormError("");
                    }}
                    placeholder="e.g., Rahul Verma"
                    className="w-full bg-white border-2 border-[#111111] px-3.5 py-2.5 text-sm sm:text-base font-semibold text-[#111111] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#781C24]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="designation-select"
                    className="block text-sm font-bold text-[#111111] mb-1.5"
                  >
                    Select Your Designation <span className="text-[#781C24]">*</span>
                  </label>
                  <select
                    id="designation-select"
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    className="w-full bg-white border-2 border-[#111111] px-3.5 py-2.5 text-sm sm:text-base font-semibold text-[#111111] focus:outline-none focus:border-[#781C24]"
                  >
                    {DESIGNATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="custom-designation"
                      className="block text-sm font-bold text-[#111111]"
                    >
                      Custom Designation <span className="text-[#111111]/60 font-normal">(optional)</span>
                    </label>
                    <span className="font-mono-code text-[11px] text-[#111111]/60">
                      {customDesignation.length}/44
                    </span>
                  </div>
                  <input
                    id="custom-designation"
                    type="text"
                    maxLength={44}
                    value={customDesignation}
                    onChange={(e) => setCustomDesignation(sanitizeInput(e.target.value, 44))}
                    placeholder="Apni marzi ka funny title likho..."
                    className="w-full bg-white border-2 border-[#111111] px-3.5 py-2.5 text-sm sm:text-base font-semibold text-[#111111] placeholder:text-[#111111]/40 focus:outline-none focus:border-[#781C24]"
                  />
                  <p className="text-[11px] text-[#111111]/65 mt-1">
                    Agar blank chhodoge toh upar wala selected designation use hoga.
                  </p>
                </div>

                {formError && (
                  <div className="bg-[#781C24]/10 border-l-4 border-[#781C24] px-3 py-2 text-xs font-bold text-[#781C24]">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-[#781C24] text-[#F5ECD7] font-display font-black text-base sm:text-lg py-3.5 px-5 border-2 border-[#111111] shadow-[4px_4px_0px_#B68D40] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                >
                  MERI AUKAAT DIKHAO
                </button>

                <p className="text-center font-mono-code text-[11px] text-[#111111]/65">
                  100% browser-side generation • Zero data stored
                </p>
              </form>
            </div>

            {/* Live Preview & Download / Share Studio */}
            <div ref={previewRef} className="lg:col-span-7 space-y-5">
              {!generatedCert ? (
                <div className="bg-[#FAF3E3] border-2 border-dashed border-[#111111] p-6 sm:p-10 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-[#781C24] text-[#B68D40] border-2 border-[#111111] flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111]">
                    Tumhara Certificate Yahan Dikhega
                  </h3>
                  <p className="text-sm text-[#111111]/75 max-w-md mx-auto">
                    Apna naam aur designation select karke{" "}
                    <span className="font-bold text-[#781C24]">"MERI AUKAAT DIKHAO"</span> dabao.
                    Instant preview milega.
                  </p>
                  <p className="font-mono-code text-xs text-[#781C24] font-bold">
                    "Mummy ko mat dikhana."
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Status Header */}
                  {!isUnlocked ? (
                    <div className="bg-[#111111] text-[#F5ECD7] border-2 border-[#B68D40] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-[#B68D40] shrink-0" />
                        <p className="text-xs sm:text-sm font-bold">
                          Preview Ready! Sirf ₹{CONFIG.amount} pay karke watermark hatao.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="bg-[#B68D40] hover:bg-[#c99e4e] text-[#111111] font-bold text-xs px-3.5 py-1.5 border border-[#F5ECD7] cursor-pointer"
                      >
                        Pay ₹{CONFIG.amount} & Unlock
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#781C24] text-[#F5ECD7] border-2 border-[#111111] px-4 py-3.5 shadow-[4px_4px_0px_#111111]">
                      <p className="font-display font-black text-base sm:text-xl tracking-wide text-[#B68D40]">
                        BADHAI HO! AB TUM OFFICIALLY ₹2 KE INSAAN HO.
                      </p>
                      <p className="text-xs sm:text-sm text-[#F5ECD7]/90 mt-0.5">
                        "LinkedIn par mat daal dena." — Ab HD PNG ya Instagram Story download karo aur doston ko jalao.
                      </p>
                    </div>
                  )}

                  {/* Certificate Card */}
                  <CertificateCard
                    data={generatedCert}
                    locked={!isUnlocked}
                    onUnlockClick={() => setIsPaymentModalOpen(true)}
                  />

                  {/* Action Panel */}
                  {!isUnlocked ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="flex-1 bg-[#781C24] hover:bg-[#5e151c] text-[#F5ECD7] font-display font-black text-base py-3.5 px-5 border-2 border-[#111111] shadow-[4px_4px_0px_#111111] cursor-pointer"
                      >
                        IZZAT UNLOCK KARO — ₹{CONFIG.amount}
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="bg-[#FAF3E3] hover:bg-[#B68D40]/20 text-[#111111] font-bold text-sm py-3.5 px-5 border-2 border-[#111111] cursor-pointer"
                      >
                        Edit Details
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#FAF3E3] border-2 border-[#111111] p-4 sm:p-5 space-y-3 shadow-[4px_4px_0px_#111111]">
                      {/* Downloads */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={handleDownloadHd}
                          disabled={isDownloadingHd}
                          className="flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#781C24] text-[#F5ECD7] font-bold text-sm py-3 px-4 border-2 border-[#111111] transition-colors cursor-pointer disabled:opacity-60"
                        >
                          <Download className="w-4 h-4 text-[#B68D40]" />
                          {isDownloadingHd ? "Rendering HD PNG..." : "Download HD Certificate (PNG)"}
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadStory}
                          disabled={isDownloadingStory}
                          className="flex items-center justify-center gap-2 bg-[#781C24] hover:bg-[#5e151c] text-[#F5ECD7] font-bold text-sm py-3 px-4 border-2 border-[#111111] transition-colors cursor-pointer disabled:opacity-60"
                        >
                          <Camera className="w-4 h-4 text-[#B68D40]" />
                          {isDownloadingStory
                            ? "Rendering Story..."
                            : "Instagram Story (1080 × 1920)"}
                        </button>
                      </div>

                      {/* Share Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={handleWhatsAppShare}
                          className="flex items-center justify-center gap-2 bg-[#F5ECD7] hover:bg-[#B68D40]/25 text-[#111111] font-bold text-xs sm:text-sm py-2.5 px-3 border-2 border-[#111111] transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-[#781C24]" />
                          Share on WhatsApp
                        </button>

                        <button
                          type="button"
                          onClick={handleNativeShare}
                          className="flex items-center justify-center gap-2 bg-[#F5ECD7] hover:bg-[#B68D40]/25 text-[#111111] font-bold text-xs sm:text-sm py-2.5 px-3 border-2 border-[#111111] transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 text-[#781C24]" />
                          Share via Mobile
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyWebsiteLink}
                          className="flex items-center justify-center gap-2 bg-[#F5ECD7] hover:bg-[#B68D40]/25 text-[#111111] font-bold text-xs sm:text-sm py-2.5 px-3 border-2 border-[#111111] transition-colors cursor-pointer"
                        >
                          {linkCopied ? (
                            <>
                              <Check className="w-4 h-4 text-[#781C24]" />
                              Link Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#781C24]" />
                              Copy Website Link
                            </>
                          )}
                        </button>
                      </div>

                      {shareFeedback && (
                        <p className="text-center font-mono-code text-xs text-[#781C24] font-bold">
                          {shareFeedback}
                        </p>
                      )}

                      <div className="pt-2 border-t border-[#111111]/15 flex items-center justify-between flex-wrap gap-2">
                        <p className="font-mono-code text-[11px] text-[#111111]/65">
                          "Aukaat chhoti ho sakti hai, certificate nahi."
                        </p>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#781C24] hover:underline cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Create Another Certificate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FUNNY FAQ SECTION */}
        <section id="faq" className="border-t-2 border-[#111111] bg-[#FAF3E3] py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="font-mono-code text-xs font-bold uppercase tracking-[0.2em] text-[#781C24]">
                Honest Answers
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111] mt-1">
                FREQUENTLY ASKED BAKCHODI
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-[#F5ECD7] border-2 border-[#111111] shadow-[3px_3px_0px_#111111]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left font-bold text-sm sm:text-base text-[#111111] cursor-pointer"
                    >
                      <span>Q: {item.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-[#781C24] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-[#111111]/15 text-sm sm:text-base font-semibold text-[#781C24]">
                        A: {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRIVACY POLICY & TERMS SECTION */}
        <section id="legal" className="border-t-2 border-[#111111] bg-[#F5ECD7] py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2.5 mb-6">
              <ShieldAlert className="w-5 h-5 text-[#781C24]" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
                PRIVACY POLICY & TERMS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Privacy Policy */}
              <div className="bg-[#FAF3E3] border-2 border-[#111111] p-5 sm:p-6 shadow-[4px_4px_0px_#111111]">
                <h3 className="font-display font-black text-lg text-[#781C24] mb-3 border-b border-[#B68D40] pb-2">
                  Privacy Policy (Zero Data Collection)
                </h3>
                <ul className="space-y-2 text-sm text-[#111111]/85 list-disc pl-5">
                  <li>
                    <strong>No User Accounts:</strong> This website requires no signup, login, or
                    registration.
                  </li>
                  <li>
                    <strong>No Personal Data Stored:</strong> Your entered name and designation are
                    never sent to any server, database, or external form service.
                  </li>
                  <li>
                    <strong>100% Local Browser Generation:</strong> All certificate previews, HD PNGs,
                    and Instagram Story graphics are rendered locally inside your own browser.
                  </li>
                  <li>
                    <strong>No Trackers or Cookies:</strong> We do not use analytics scripts, ad
                    pixels, tracking cookies, or third-party AI APIs.
                  </li>
                </ul>
              </div>

              {/* Terms of Entertainment */}
              <div className="bg-[#FAF3E3] border-2 border-[#111111] p-5 sm:p-6 shadow-[4px_4px_0px_#111111]">
                <h3 className="font-display font-black text-lg text-[#781C24] mb-3 border-b border-[#B68D40] pb-2">
                  Terms & Payment Disclosure
                </h3>
                <ul className="space-y-2 text-sm text-[#111111]/85 list-disc pl-5">
                  <li>
                    <strong>Pure Entertainment Only:</strong> "{CONFIG.brandName}" is a humorous
                    parody internet experiment. Generated certificates carry zero official,
                    government, academic, or legal validity.
                  </li>
                  <li>
                    <strong>UPI App Payments:</strong> Any ₹{CONFIG.amount} contribution is handled
                    directly through your chosen UPI application using the displayed static QR/UPI ID.
                  </li>
                  <li>
                    <strong>Trust-Based Unlock:</strong> Payments are not automatically verified by a
                    payment gateway. Unlocking works on voluntary self-confirmation.
                  </li>
                  <li>
                    <strong>No Liability:</strong> Do not submit this certificate to employers,
                    universities, or your relatives expecting serious outcomes.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#111111] bg-[#111111] text-[#F5ECD7] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-display font-black text-lg tracking-wide text-[#B68D40]">
              {CONFIG.brandName}
            </p>
            <p className="font-mono-code text-xs text-[#F5ECD7]/75 mt-0.5">
              Duniya ne aukaat nahi batayi? Hum bata denge.
            </p>
          </div>
          <div className="text-xs text-[#F5ECD7]/70 space-y-1 sm:text-right">
            <p>Unofficial parody entertainment website. Not affiliated with any authority.</p>
            <p className="font-mono-code text-[11px] text-[#B68D40]">
              100% Unofficial • 200% Unnecessary • Browser-Only Generation
            </p>
          </div>
        </div>
      </footer>

      {/* Static UPI QR Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirmPaid={handleConfirmPaid}
      />
    </div>
  );
}

export default App;
