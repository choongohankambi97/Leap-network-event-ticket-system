"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Loader2, 
  Smartphone, 
  CreditCard, 
  AlertCircle, 
  RefreshCw, 
  X, 
  ExternalLink,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { CreatePaymentResponse, PaymentStatus, TicketDetails } from "../lib/types";
import { fetchPaymentStatus, simulatePaymentApproval } from "../lib/api";

interface PaymentStatusModalProps {
  paymentData: CreatePaymentResponse;
  customerPhone: string;
  onSuccess: (ticket: TicketDetails) => void;
  onClose: () => void;
  onRetry: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  paymentData,
  customerPhone,
  onSuccess,
  onClose,
  onRetry,
}) => {
  const [currentStatus, setCurrentStatus] = useState<PaymentStatus>("PENDING");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<TicketDetails | null>(null);
  const isPollingRef = useRef(true);

  const reference = paymentData.reference;

  useEffect(() => {
    isPollingRef.current = true;
    let pollInterval: NodeJS.Timeout;

    const poll = async () => {
      if (!isPollingRef.current) return;

      try {
        const result = await fetchPaymentStatus(reference);
        setCurrentStatus(result.status);

        if (result.status === "SUCCESSFUL" && result.ticket) {
          isPollingRef.current = false;
          setConfirmedTicket(result.ticket);
          // Show confirmation screen in modal for 2.2 seconds before transitioning to ticket
          setTimeout(() => {
            onSuccess(result.ticket!);
          }, 2200);
        } else if (result.status === "FAILED" || result.status === "CANCELLED") {
          isPollingRef.current = false;
          setErrorMessage(result.failureReason || "Payment was declined or cancelled. Please try again.");
        } else {
          setPollCount(prev => prev + 1);
        }
      } catch (err: any) {
        console.warn("Polling status warning:", err.message);
      }
    };

    // Initial poll immediate
    poll();

    // Poll every 2.5 seconds
    pollInterval = setInterval(poll, 2500);

    return () => {
      isPollingRef.current = false;
      clearInterval(pollInterval);
    };
  }, [reference, onSuccess]);

  const handleSimulateInstantApproval = async () => {
    setIsSimulating(true);
    try {
      const res = await simulatePaymentApproval(reference);
      if (res.ticket) {
        isPollingRef.current = false;
        setConfirmedTicket(res.ticket);
        setCurrentStatus("SUCCESSFUL");
        setTimeout(() => {
          onSuccess(res.ticket);
        }, 2000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#E8DACB] shadow-2xl relative overflow-hidden text-center my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button on Failed/Cancelled */}
        {(currentStatus === "FAILED" || currentStatus === "CANCELLED") && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-[#78716C] hover:bg-[#FAF0E6] hover:text-[#1A1715] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 1. SUCCESS STATE CONFIRMATION SCREEN */}
        {currentStatus === "SUCCESSFUL" && (
          <div className="space-y-6 py-4 animate-scale-in">
            {/* Animated Celebration Icon */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                ✓ PAYMENT CONFIRMED
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#1A1715] mt-3">
                Deposit Received!
              </h3>
              <p className="text-xs text-[#57534E] mt-2 max-w-xs mx-auto">
                Your payment of <strong className="text-emerald-700 font-black">K{paymentData.amount} ZMW</strong> has been verified by Lipila.
              </p>
            </div>

            {/* Minting Ticket Indicator */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DACB] text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#E25619]">
                <Sparkles className="w-4 h-4 animate-spin text-[#D9931E]" />
                <span>Generating Your Verifiable Pass & QR Code...</span>
              </div>
              <div className="w-full bg-[#E8DACB] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#E25619] to-emerald-500 h-full rounded-full animate-pulse w-full" />
              </div>
            </div>

            <button
              onClick={() => confirmedTicket && onSuccess(confirmedTicket)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <span>View Official Ticket Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. ACTIVE PENDING / PROCESSING STATE */}
        {currentStatus === "PENDING" && (
          <div className="space-y-5 sm:space-y-6">
            
            {/* Pulsing Radar Animation */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#E25619]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-[#D9931E]/30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-[#FAF0E6] border-2 border-[#E25619] flex items-center justify-center text-[#E25619] shadow-inner">
                {paymentData.paymentMethod === "MOBILE_MONEY" ? (
                  <Smartphone className="w-8 h-8 animate-bounce" />
                ) : (
                  <CreditCard className="w-8 h-8" />
                )}
              </div>
            </div>

            {/* Status Heading */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF0E6] border border-[#E8DACB]">
                <span className="w-2 h-2 rounded-full bg-[#E25619] animate-ping" />
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#E25619]">
                  PAYMENT IN PROGRESS
                </span>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1A1715] mt-3">
                Waiting for payment confirmation...
              </h3>
              <p className="text-xs text-[#78716C] mt-1.5 max-w-sm mx-auto break-all">
                Ref: <span className="font-mono font-semibold text-[#1A1715]">{reference}</span>
              </p>
            </div>

            {/* Step Checklist for User Clarity */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DACB] text-left space-y-3">
              <div className="flex items-start space-x-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-[#1A1715]">Lipila Gateway Connected</p>
                  <p className="text-[#78716C] text-[11px]">Collection request active for K{paymentData.amount} ZMW</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-[#E25619]/15 text-[#E25619] flex items-center justify-center shrink-0 font-bold text-[10px] animate-pulse">
                  2
                </div>
                <div>
                  <p className="font-bold text-[#1A1715]">Check Your Phone Handset</p>
                  <p className="text-[#57534E] text-[11px]">
                    Enter your Mobile Money PIN on <strong className="text-[#1A1715]">{customerPhone}</strong> to authorize payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  3
                </div>
                <div>
                  <p className="font-bold text-[#1A1715]">Automatic Confirmation</p>
                  <p className="text-[#78716C] text-[11px]">The screen will automatically update as soon as you authorize.</p>
                </div>
              </div>
            </div>

            {/* If 3D Secure / Card Redirection is provided */}
            {paymentData.cardRedirectionUrl && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <a
                  href={paymentData.cardRedirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#B45309] hover:underline inline-flex items-center space-x-1"
                >
                  <span>Click here to complete 3D Secure Card Verification</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Waiting Spinner Indicator */}
            <div className="flex items-center justify-center space-x-2 text-xs text-[#78716C]">
              <Loader2 className="w-4 h-4 animate-spin text-[#E25619]" />
              <span>Listening for Lipila webhook approval ({pollCount + 1})...</span>
            </div>

            {/* Developer Sandbox Testing Shortcut */}
            <div className="pt-3 border-t border-[#F0E6DA]">
              <button
                type="button"
                onClick={handleSimulateInstantApproval}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#E25619] hover:from-amber-600 hover:to-[#C0420E] text-white text-xs font-bold tracking-wide flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isSimulating ? "Simulating approval..." : "Instant Test Approval (Sandbox Mode)"}</span>
              </button>
            </div>

          </div>
        )}

        {/* 3. FAILED / CANCELLED STATE */}
        {(currentStatus === "FAILED" || currentStatus === "CANCELLED") && (
          <div className="space-y-6 py-2">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>

            <div>
              <h3 className="font-editorial text-2xl font-bold text-[#1A1715]">
                Payment {currentStatus === "CANCELLED" ? "Cancelled" : "Unsuccessful"}
              </h3>
              <p className="text-xs text-[#78716C] mt-2">
                {errorMessage || "We could not confirm your payment with Lipila."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onRetry}
                className="flex-1 py-3 px-4 rounded-xl bg-[#E25619] hover:bg-[#C0420E] text-white font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-[#FAF6F0] hover:bg-[#FAF0E6] text-[#57534E] font-semibold text-sm border border-[#E8DACB]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
