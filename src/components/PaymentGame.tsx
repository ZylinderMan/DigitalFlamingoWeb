"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ShoppingBag, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Method = "card" | "paypal";

function randomPrice() {
  return (Math.random() * (149 - 19) + 19).toFixed(2);
}

export default function PaymentGame() {
  const { t } = useLanguage();
  const [price, setPrice] = useState(randomPrice);
  const [method, setMethod] = useState<Method>("card");
  const [purchased, setPurchased] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-6">
      <AnimatePresence mode="wait">
        {!purchased ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2 text-white">
              <ShoppingBag size={22} className="text-neutral-400" />
              <span className="text-2xl font-semibold">${price}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMethod("card")}
                aria-label="Credit card"
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                  method === "card"
                    ? "border-white bg-neutral-700 text-white"
                    : "border-neutral-700 text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <CreditCard size={18} />
              </button>
              <button
                onClick={() => setMethod("paypal")}
                aria-label="PayPal"
                className={`w-11 h-11 rounded-lg border flex items-center justify-center font-bold transition-colors ${
                  method === "paypal"
                    ? "border-white bg-neutral-700 text-white"
                    : "border-neutral-700 text-neutral-500 hover:text-neutral-300"
                }`}
              >
                P
              </button>
            </div>

            <button
              onClick={() => setPurchased(true)}
              className="px-5 py-2 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              {t.showcase.payment.buyLabel}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-12 h-12 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center"
            >
              <Check size={24} />
            </motion.div>
            <p className="text-white font-medium">{t.showcase.payment.successMessage}</p>
            <button
              onClick={() => {
                setPrice(randomPrice());
                setPurchased(false);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-300 underline underline-offset-2"
            >
              {t.showcase.payment.resetLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}