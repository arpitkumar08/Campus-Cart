import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

const SafetyModal = () => {
    const [checked, setChecked] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {/* Modal with subtle gray shiny border */}
                    <motion.div
                        className="w-[600px] max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl p-[2px] bg-gradient-to-r from-gray-300/40 to-gray-200/30 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {/* Inner dark card */}
                        <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-lg p-6">
                            <h1 className="text-2xl font-semibold text-center mb-4 border-b border-gray-700 pb-2">
                                🔐 Safety Tips for Users
                            </h1>

                            <div className="space-y-5 text-gray-300 text-sm">
                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        1. ✅ Keep the Conversation Within the App
                                    </h2>
                                    <p className="mt-1">
                                        Always use the built-in chat system to communicate. Don’t switch to WhatsApp, phone, or other platforms until you fully trust the other person.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        2. 💸 Never Pay in Advance
                                    </h2>
                                    <p className="mt-1">
                                        Do not transfer money before receiving the product or service. Fraudsters often ask for advance payments and then disappear.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        3. 📦 Meet in Safe Public Places
                                    </h2>
                                    <p className="mt-1">
                                        When meeting a buyer or seller, choose crowded places like cafes or malls. Avoid isolated locations to ensure safety.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        4. 🔍 Verify the Product Before Payment
                                    </h2>
                                    <p className="mt-1">
                                        Inspect the product carefully before handing over the money. Ensure it matches the description and photos provided.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        5. 🛑 Don’t Share Personal Information
                                    </h2>
                                    <p className="mt-1">
                                        Avoid giving your home address, bank details, or ID proofs to strangers. Keep your personal data private.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        6. ⚠️ Watch Out for Unrealistic Deals
                                    </h2>
                                    <p className="mt-1">
                                        If a deal sounds too good to be true, it probably is. Be cautious of extremely low prices or urgent sellers.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        7. 📞 Communicate Clearly
                                    </h2>
                                    <p className="mt-1">
                                        Clarify all details about the item or service, including condition, price, and payment method, before meeting in person.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        8. 🔒 Use Secure Payment Methods
                                    </h2>
                                    <p className="mt-1">
                                        Prefer cash on delivery or trusted payment gateways. Avoid sharing UPI PINs, passwords, or OTPs with anyone.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        9. 👀 Trust Your Instincts
                                    </h2>
                                    <p className="mt-1">
                                        If you feel uncomfortable or something seems suspicious, walk away from the deal. Safety comes first.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-gray-200">
                                        10. 📣 Report and Block Misuse
                                    </h2>
                                    <p className="mt-1">
                                        If someone misbehaves, scams, or harasses, use the Report/Block feature immediately to protect yourself and others.
                                    </p>
                                </div>
                            </div>

                            {/* Checkbox + Close Button */}
                            <div className="mt-6 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                        className="peer hidden"
                                    />
                                    <span
                                        className="w-5 h-5 flex items-center justify-center rounded-md border border-purple-400 peer-checked:border-purple-500 
                  peer-checked:bg-purple-500 transition-all"
                                    >
                                        <svg
                                            className={`w-3 h-3 text-gray-900 ${checked ? "opacity-100" : "opacity-0"} transition-opacity`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span>I have read and understood the safety tips</span>
                                </label>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={!checked}
                                    className={`px-4 py-2 rounded-lg text-white transition ${checked
                                        ? "bg-purple-700 hover:bg-purple-600 cursor-pointer"
                                        : "bg-gray-600 cursor-not-allowed"
                                        }`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SafetyModal;
