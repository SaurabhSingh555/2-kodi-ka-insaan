import React, { useState } from "react";
import { X, Copy, Check, Smartphone, ShieldCheck, IndianRupee } from "lucide-react";
import { CONFIG } from "../../config.js";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPaid: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirmPaid,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(
    CONFIG.receiverName
  )}&am=${CONFIG.amount}&cu=INR&tn=${encodeURIComponent("2 Ka Insaan Certificate")}`;

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy method
      const input = document.createElement("input");
      input.value = CONFIG.upiId;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#F5ECD7] border-2 border-[#111111] shadow-[8px_8px_0px_#781C24] overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Royal Header Bar */}
        <div className="bg-[#781C24] text-[#F5ECD7] px-5 py-4 border-b-2 border-[#111111] flex items-center justify-between">
          <div>
            <p className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#B68D40] font-bold">
              Trust-Based UPI Checkout
            </p>
            <h2 id="payment-modal-title" className="font-display font-black text-xl sm:text-2xl tracking-tight">
              IZZAT KI KEEMAT — ₹{CONFIG.amount}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment modal"
            className="w-8 h-8 flex items-center justify-center bg-[#111111] text-[#F5ECD7] border border-[#B68D40] hover:bg-[#B68D40] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-sm sm:text-base font-semibold text-[#111111] text-center">
            "Certificate toh ban gaya, ab ₹{CONFIG.amount} dekar izzat unlock karo."
          </p>

          {/* Static QR Code Frame */}
          <div className="bg-[#FAF3E3] border-2 border-[#111111] p-4 flex flex-col items-center">
            <div className="w-48 h-48 sm:w-52 sm:h-52 border-2 border-dashed border-[#B68D40] bg-white p-2 flex items-center justify-center">
              {!imgError ? (
                <img
                  src={CONFIG.qrImage}
                  alt={`UPI QR Code for ${CONFIG.receiverName}`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-3">
                  <IndianRupee className="w-8 h-8 mx-auto text-[#781C24] mb-1" />
                  <p className="font-mono-code text-xs font-bold text-[#111111]">
                    UPI QR NOT FOUND
                  </p>
                  <p className="text-[11px] text-[#111111]/70 mt-1">
                    Use UPI ID or Pay via UPI App below.
                  </p>
                </div>
              )}
            </div>

            {/* Receiver & Amount Details */}
            <div className="w-full mt-3 pt-3 border-t border-[#111111]/15 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-mono-code text-[10px] uppercase text-[#111111]/60">
                  Receiver Name
                </p>
                <p className="font-bold text-[#111111] truncate">{CONFIG.receiverName}</p>
              </div>
              <div className="text-right">
                <p className="font-mono-code text-[10px] uppercase text-[#111111]/60">
                  Amount
                </p>
                <p className="font-display font-black text-base text-[#781C24]">
                  ₹{CONFIG.amount}
                </p>
              </div>
            </div>

            {/* UPI ID + Copy Button */}
            <div className="w-full mt-3 flex items-center justify-between gap-2 bg-[#F5ECD7] border border-[#111111] px-3 py-2">
              <div className="min-w-0">
                <p className="font-mono-code text-[9px] uppercase text-[#111111]/60">UPI ID</p>
                <p className="font-mono-code text-xs font-bold text-[#111111] truncate">
                  {CONFIG.upiId}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="shrink-0 inline-flex items-center gap-1.5 bg-[#111111] text-[#F5ECD7] hover:bg-[#781C24] text-xs font-bold px-3 py-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#B68D40]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy UPI ID
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Honest Trust Notice */}
          <div className="bg-[#FAF3E3] border-l-4 border-[#B68D40] px-3.5 py-2.5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#781C24] shrink-0 mt-0.5" />
            <p className="text-xs text-[#111111]/85 leading-relaxed">
              Ye website bharose par chalti hai. Certificate unlock karne se pehle ₹{CONFIG.amount} pay zaroor karein.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <a
              href={upiDeepLink}
              className="w-full flex items-center justify-center gap-2 bg-[#FAF3E3] hover:bg-[#B68D40]/25 text-[#111111] border-2 border-[#111111] font-bold text-sm py-3 px-4 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-[#781C24]" />
              Pay via UPI App (₹{CONFIG.amount})
            </a>

            <button
              type="button"
              onClick={onConfirmPaid}
              className="w-full flex items-center justify-center gap-2 bg-[#781C24] hover:bg-[#5e151c] text-[#F5ECD7] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111111] font-display font-black text-base py-3.5 px-4 transition-all cursor-pointer"
            >
              I've Paid ₹{CONFIG.amount} — Unlock Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
