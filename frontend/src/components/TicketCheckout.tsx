"use client";

import React, { useState } from "react";
import {
  Ticket,
  Smartphone,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  Check,
  Lock,
  ArrowRight,
  Info
} from "lucide-react";
import { PaymentMethod, CreatePaymentDTO, CreatePaymentResponse } from "../lib/types";
import { createPayment } from "../lib/api";

interface TicketCheckoutProps {
  onPaymentInitiated: (response: CreatePaymentResponse, paymentData: CreatePaymentDTO) => void;
}


export const TicketCheckout: React.FC<TicketCheckoutProps> = ({ onPaymentInitiated }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MOBILE_MONEY");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const unitPrice = 500;
  const subtotal = unitPrice * quantity;



  const handleIncrement = () => {
    if (quantity < 20) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setErrorMessage("Please provide a valid email address for receiving your ticket.");
      return;
    }

    const cleanPhone = phone.replace(/[\s+-]/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage("Please provide a valid phone number used for payment (e.g. 0979333751).");
      return;
    }

    const payload: CreatePaymentDTO = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      quantity,
      paymentMethod,
      ticketTierId: 'standard'
    };

    setIsLoading(true);

    try {
      const response = await createPayment(payload);
      onPaymentInitiated(response, payload);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to initiate payment. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="checkout" className="py-20 bg-[#FAF6F0] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#E25619]">
            Secure Ticket Checkout
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#1A1715] mt-2">
            RESERVE YOUR PASS
          </h2>
          <p className="text-[#78716C] mt-3 text-sm sm:text-base">
            Complete your purchase securely via Lipila. Your official digital pass with QR code will be generated immediately.
          </p>
        </div>

        {/* Main Checkout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Form Details (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DACB] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-semibold">Unable to proceed</p>
                    <p className="text-xs mt-0.5 text-red-600">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Step 1: Select Ticket Tier */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1715] mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#E25619] text-xs font-black flex items-center justify-center">1</span>
                  <span>Select Ticket Option</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Standard Pass */}
                  <div
                    className="p-4 rounded-2xl border-2 border-[#E25619] bg-[#FAF0E6]/50 shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#1A1715]">
                        Standard Pass
                      </span>
                      <div className="w-4 h-4 rounded-full border-2 border-[#E25619] bg-[#E25619] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <p className="text-xl font-black font-editorial text-[#E25619] mb-1">K500</p>
                    <p className="text-[11px] text-[#78716C]">Full event admission & dinner</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Attendee Info */}
              <div className="pt-4 border-t border-[#F0E6DA]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1715] mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#E25619] text-xs font-black flex items-center justify-center">2</span>
                  <span>Ticket Holder Information</span>
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold text-[#2D2824] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[#E25619]">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Banda"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DACB] bg-[#FAF6F0]/40 text-[#1A1715] text-sm focus:outline-none focus:ring-2 focus:ring-[#E25619] focus:bg-white transition-all placeholder:text-[#A8A29E]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-[#2D2824] uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-[#E25619]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DACB] bg-[#FAF6F0]/40 text-[#1A1715] text-sm focus:outline-none focus:ring-2 focus:ring-[#E25619] focus:bg-white transition-all placeholder:text-[#A8A29E]"
                    />
                    <p className="text-[11px] text-[#78716C] mt-1 flex items-center space-x-1">
                      <Info className="w-3 h-3 text-[#A8A29E]" />
                      <span>Your printable ticket & receipt will be delivered here.</span>
                    </p>
                  </div>

                  {/* Phone / Payment Number */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-[#2D2824] uppercase tracking-wider mb-1.5">
                      Number used for payment <span className="text-[#E25619]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0979333751 or 096... / 095..."
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E8DACB] bg-[#FAF6F0]/40 text-[#1A1715] text-sm focus:outline-none focus:ring-2 focus:ring-[#E25619] focus:bg-white transition-all placeholder:text-[#A8A29E]"
                      />
                    </div>
                    <p className="text-[11px] text-[#78716C] mt-1">
                      For Mobile Money (Airtel, MTN, Zamtel), this number will receive the PIN prompt.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Quantity Selector */}
              <div className="pt-4 border-t border-[#F0E6DA]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1715] mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#E25619] text-xs font-black flex items-center justify-center">3</span>
                  <span>Ticket Quantity</span>
                </h3>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DACB]">
                  <div>
                    <p className="text-xs text-[#78716C]">K{unitPrice} per ticket</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 rounded-full bg-white border border-[#E8DACB] text-[#1A1715] flex items-center justify-center hover:bg-[#FAF0E6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="font-editorial text-xl font-black text-[#1A1715] w-8 text-center">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={quantity >= 20}
                      aria-label="Increase quantity"
                      className="w-9 h-9 rounded-full bg-white border border-[#E8DACB] text-[#1A1715] flex items-center justify-center hover:bg-[#FAF0E6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="pt-4 border-t border-[#F0E6DA]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1715] mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#FAF0E6] text-[#E25619] text-xs font-black flex items-center justify-center">4</span>
                  <span>Choose Payment Method (Lipila)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Mobile Money Card */}
                  <label
                    onClick={() => setPaymentMethod("MOBILE_MONEY")}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start space-x-3 ${paymentMethod === "MOBILE_MONEY"
                      ? "border-[#E25619] bg-[#FAF0E6]/50 shadow-sm"
                      : "border-[#E8DACB] bg-white hover:border-[#D9C8B5]"
                      }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "MOBILE_MONEY" ? "border-[#E25619] bg-[#E25619]" : "border-[#A8A29E]"
                        }`}>
                        {paymentMethod === "MOBILE_MONEY" && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Smartphone className="w-4 h-4 text-[#E25619]" />
                        <span className="text-sm font-bold text-[#1A1715]">Mobile Money</span>
                      </div>
                      <p className="text-[11px] text-[#78716C] leading-snug">
                        Airtel Money, MTN MoMo, Zamtel Kwacha
                      </p>
                    </div>
                  </label>

                  {/* Card Payment Card */}
                  <label
                    onClick={() => setPaymentMethod("CARD")}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start space-x-3 ${paymentMethod === "CARD"
                      ? "border-[#E25619] bg-[#FAF0E6]/50 shadow-sm"
                      : "border-[#E8DACB] bg-white hover:border-[#D9C8B5]"
                      }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "CARD" ? "border-[#E25619] bg-[#E25619]" : "border-[#A8A29E]"
                        }`}>
                        {paymentMethod === "CARD" && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="w-4 h-4 text-[#D9931E]" />
                        <span className="text-sm font-bold text-[#1A1715]">Debit / Credit Card</span>
                      </div>
                      <p className="text-[11px] text-[#78716C] leading-snug">
                        Visa, Mastercard, Amex via Lipila
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  id="submit-payment-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-[#E25619] hover:bg-[#C0420E] text-white font-bold text-base tracking-wider uppercase shadow-lg shadow-[#E25619]/25 flex items-center justify-center space-x-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Initiating Lipila Gateway...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay K{subtotal.toLocaleString()} & Get Ticket</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DACB] shadow-sm sticky top-28">

              <div className="flex items-center space-x-2 pb-4 border-b border-[#F0E6DA]">
                <Ticket className="w-5 h-5 text-[#E25619]" />
                <h3 className="font-editorial text-xl font-bold text-[#1A1715]">Order Summary</h3>
              </div>

              {/* Event Mini Details */}
              <div className="py-4 border-b border-[#F0E6DA] space-y-2">
                <p className="text-xs uppercase tracking-wider font-bold text-[#E25619]">Event</p>
                <h4 className="font-bold text-sm text-[#1A1715]">LEAP NETWORKS – FOUNDERS CONNECT</h4>
                <div className="text-xs text-[#78716C] space-y-0.5">
                  <p>📅 10 October 2026 • 12:00 PM – 10:00 PM</p>
                  <p>📍 August Loft Water Falls, Lusaka</p>
                </div>
              </div>

              {/* Cost Calculation Breakdown */}
              <div className="py-4 border-b border-[#F0E6DA] space-y-3 text-sm">
                <div className="flex items-center justify-between text-[#57534E]">
                  <span className="font-semibold text-[#1A1715]">K{unitPrice}</span>
                </div>
                <div className="flex items-center justify-between text-[#57534E]">
                  <span>Quantity</span>
                  <span className="font-semibold text-[#1A1715]">× {quantity}</span>
                </div>
                <div className="flex items-center justify-between text-[#57534E]">
                  <span>Processing Fee</span>
                  <span className="text-[#16A34A] font-semibold">Free (Covered)</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="py-4 flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#78716C]">Total Amount</p>
                  <p className="text-[11px] text-[#A8A29E]">Zambian Kwacha (ZMW)</p>
                </div>
                <div className="text-right">
                  <span className="font-editorial text-3xl font-black text-[#E25619]">
                    K{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 p-4 rounded-2xl bg-[#FAF0E6] border border-[#E8DACB] flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#57534E]">
                  <p className="font-bold text-[#1A1715]">Verified Lipila Gateway</p>
                  <p className="mt-0.5">
                    Your payment is processed securely. Secret API credentials are kept strictly isolated on the backend server.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
