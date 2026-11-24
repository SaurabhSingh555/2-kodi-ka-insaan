import React from "react";
import { Lock } from "lucide-react";
import { CertificateData } from "../types";
import { GoldCertificationSeal, ChiefSignatureSVG } from "./BrandMark";

interface CertificateCardProps {
  data: CertificateData;
  locked?: boolean;
  onUnlockClick?: () => void;
  className?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  data,
  locked = false,
  onUnlockClick,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full aspect-[3/2] certificate-paper border-2 border-[#111111] select-none overflow-hidden shadow-[6px_6px_0px_#111111] ${className}`}
    >
      {/* Outer Ornamental & Security Border */}
      <div className="absolute inset-1.5 sm:inset-2.5 border-2 border-[#781C24] pointer-events-none" />
      <div
        className="absolute inset-2.5 sm:inset-4 border border-dashed border-[#B68D40] pointer-events-none"
      />

      {/* Corner Ornaments */}
      <svg
        className="absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-8 sm:h-8 text-[#781C24] pointer-events-none"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <circle cx="11" cy="11" r="2.2" fill="#B68D40" />
      </svg>
      <svg
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 text-[#781C24] pointer-events-none rotate-90"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <circle cx="11" cy="11" r="2.2" fill="#B68D40" />
      </svg>
      <svg
        className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-5 h-5 sm:w-8 sm:h-8 text-[#781C24] pointer-events-none -rotate-90"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <circle cx="11" cy="11" r="2.2" fill="#B68D40" />
      </svg>
      <svg
        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 text-[#781C24] pointer-events-none rotate-180"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M2 2 L18 2 L18 6 L6 6 L6 18 L2 18 Z" fill="currentColor" />
        <circle cx="11" cy="11" r="2.2" fill="#B68D40" />
      </svg>

      {/* Subtle Repeating Brand Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] flex flex-wrap items-center justify-around -rotate-12 scale-125 overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, idx) => (
          <span
            key={idx}
            className="font-display font-black text-base sm:text-xl tracking-widest text-[#781C24] px-4 py-3 whitespace-nowrap"
          >
            ₹2 KA INSAAN • UNOFFICIAL
          </span>
        ))}
      </div>

      {/* Main Certificate Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-between px-4 py-3 sm:px-8 sm:py-5 transition-all duration-300 ${
          locked ? "blur-[2.2px]" : ""
        }`}
      >
        {/* Top Authority Header */}
        <div className="flex items-start justify-between gap-2">
          {/* Mini Original Brand Seal */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg viewBox="0 0 64 72" className="w-6 h-7 sm:w-9 sm:h-10 shrink-0" aria-hidden="true">
              <path
                d="M18 16 L22 7 L28 13 L32 4 L36 13 L42 7 L46 16 Z"
                fill="#B68D40"
                stroke="#111111"
                strokeWidth="1.8"
              />
              <circle cx="32" cy="42" r="24" fill="#781C24" stroke="#111111" strokeWidth="2" />
              <circle cx="32" cy="42" r="18" fill="#F5ECD7" stroke="#B68D40" strokeWidth="1.5" />
              <text
                x="32"
                y="49"
                textAnchor="middle"
                fill="#111111"
                fontFamily="'Playfair Display', Georgia, serif"
                fontWeight="900"
                fontSize="18"
              >
                ₹2
              </text>
            </svg>
            <div className="leading-none">
              <p className="font-display font-black text-[8px] sm:text-[11px] text-[#111111] tracking-tight">
                2 KA INSAAN
              </p>
              <p className="font-mono-code text-[6px] sm:text-[8px] text-[#781C24] uppercase tracking-wider">
                Parody Division
              </p>
            </div>
          </div>

          {/* Center Authority Header */}
          <div className="text-center flex-1">
            <p className="font-mono-code text-[6.5px] sm:text-[9px] uppercase tracking-[0.18em] text-[#781C24] font-bold">
              INTERNATIONAL AUKAAT CERTIFICATION AUTHORITY
            </p>
            <h3 className="font-display font-black text-sm sm:text-2xl md:text-[26px] tracking-wide text-[#111111] leading-tight mt-0.5">
              CERTIFICATE OF AUKAAT
            </h3>
            <div className="mx-auto mt-1 h-[1.5px] w-24 sm:w-48 bg-[#B68D40]" />
          </div>

          {/* Ref ID */}
          <div className="text-right leading-tight shrink-0">
            <p className="font-mono-code text-[6px] sm:text-[8px] uppercase text-[#111111]/70">
              Ref ID
            </p>
            <p className="font-mono-code text-[6.5px] sm:text-[9px] font-bold text-[#111111]">
              {data.certId}
            </p>
          </div>
        </div>

        {/* Center Proclamation */}
        <div className="text-center my-auto px-1 sm:px-6">
          <p className="font-serif-formal italic text-[9px] sm:text-sm text-[#111111]/85">
            This is to officially and unnecessarily certify that
          </p>

          <div className="my-1 sm:my-1.5 inline-block border-b-2 border-[#B68D40] px-3 sm:px-8 pb-0.5">
            <p className="font-display font-black text-base sm:text-3xl text-[#781C24] tracking-tight break-words max-w-[240px] sm:max-w-[460px] leading-tight">
              {data.name}
            </p>
          </div>

          <p className="font-serif-formal italic text-[9px] sm:text-sm text-[#111111]/85">
            has successfully achieved the prestigious title of
          </p>

          <div className="my-1 sm:my-1.5 inline-flex items-center gap-2 bg-[#111111] text-[#F5ECD7] px-3 py-0.5 sm:px-5 sm:py-1 border border-[#B68D40]">
            <span className="font-display font-black text-xs sm:text-xl tracking-widest text-[#B68D40]">
              ₹2 KA INSAAN
            </span>
          </div>

          <p className="text-[8.5px] sm:text-xs font-bold text-[#111111] mt-0.5 sm:mt-1">
            Designation:{" "}
            <span className="text-[#781C24] underline decoration-[#B68D40] underline-offset-2">
              {data.designation}
            </span>
          </p>

          <p className="font-serif-formal text-[7.5px] sm:text-[11px] text-[#111111]/80 max-w-xl mx-auto mt-1 sm:mt-1.5 leading-snug">
            After absolutely no examination, interview, background verification, or meaningful achievement,
            the authority hereby declares that the above-mentioned individual is officially worth ₹2 in our
            completely fictional universe.
          </p>

          {/* 3 Humorous Metrics */}
          <div className="mt-1.5 sm:mt-2.5 grid grid-cols-3 gap-1 sm:gap-3 max-w-lg mx-auto border-y border-[#B68D40]/60 py-1 sm:py-1.5">
            <div>
              <p className="font-mono-code text-[5.5px] sm:text-[8px] uppercase text-[#111111]/65">
                Market Value
              </p>
              <p className="font-display font-extrabold text-[8px] sm:text-xs text-[#781C24]">
                ₹2
              </p>
            </div>
            <div className="border-x border-[#B68D40]/60">
              <p className="font-mono-code text-[5.5px] sm:text-[8px] uppercase text-[#111111]/65">
                Self Confidence
              </p>
              <p className="font-display font-extrabold text-[8px] sm:text-xs text-[#111111]">
                ₹2 Crore
              </p>
            </div>
            <div>
              <p className="font-mono-code text-[5.5px] sm:text-[8px] uppercase text-[#111111]/65">
                Qualification
              </p>
              <p className="font-display font-extrabold text-[8px] sm:text-xs text-[#111111]">
                Existing Successfully
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Seal, Date & Signature */}
        <div className="flex items-end justify-between gap-2 pt-0.5">
          {/* Date */}
          <div className="text-left leading-tight">
            <p className="font-mono-code text-[6px] sm:text-[8px] uppercase text-[#111111]/65">
              Issue Date
            </p>
            <p className="font-mono-code text-[7px] sm:text-[10px] font-bold text-[#111111]">
              {data.issueDate}
            </p>
            <p className="font-mono-code text-[5px] sm:text-[7px] text-[#111111]/60 mt-0.5">
              Unofficial parody certificate. For entertainment purposes only.
            </p>
          </div>

          {/* Gold Seal */}
          <div className="shrink-0 -mb-1 sm:-mb-2">
            <GoldCertificationSeal className="w-10 h-10 sm:w-16 sm:h-16" />
          </div>

          {/* Signature */}
          <div className="text-right flex flex-col items-end leading-tight">
            <ChiefSignatureSVG className="w-14 h-5 sm:w-28 sm:h-8 -mb-0.5" />
            <div className="border-t border-[#111111] pt-0.5 w-20 sm:w-32">
              <p className="font-display font-bold text-[7px] sm:text-[10px] text-[#111111]">
                Chief Bakchodi Officer
              </p>
              <p className="font-mono-code text-[5px] sm:text-[7px] text-[#781C24] uppercase">
                2 Ka Insaan Authority
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Locked Watermark Overlay */}
      {locked && (
        <div className="absolute inset-0 z-20 bg-[#F5ECD7]/45 backdrop-blur-[1.5px] flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-[#111111] text-[#F5ECD7] border-2 border-[#B68D40] px-4 py-3 sm:px-6 sm:py-4 shadow-[4px_4px_0px_#781C24] max-w-xs">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#781C24] text-[#B68D40] mb-1.5">
              <Lock className="w-4 h-4" />
            </div>
            <p className="font-display font-black text-sm sm:text-base tracking-wide text-[#F5ECD7]">
              PREVIEW LOCKED — ₹2 ONLY
            </p>
            <p className="text-[11px] sm:text-xs text-[#F5ECD7]/80 mt-1">
              Watermark hatane aur HD PNG + Instagram Story download karne ke liye ₹2 pay karein.
            </p>
            {onUnlockClick && (
              <button
                type="button"
                onClick={onUnlockClick}
                className="mt-3 w-full bg-[#B68D40] hover:bg-[#c99e4e] text-[#111111] font-bold text-xs sm:text-sm py-2 px-4 border border-[#F5ECD7] transition-colors cursor-pointer"
              >
                UNLOCK MY AUKAAT — ₹2
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
