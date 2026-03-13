import React from "react";
import { motion } from "framer-motion";
import { FaUserMd } from "react-icons/fa";

export default function Checking() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center space-y-6" >

                <FaUserMd className="text-6xl text-emerald-500 mx-auto" />

                <h1 className="text-3xl font-bold text-gray-800">
                    Account Under Review
                </h1>

                <p className="text-gray-500 leading-relaxed">
                    Your doctor account has been successfully registered.
                    Our admin team is currently reviewing your credentials.
                    Once approved, you will be able to access your dashboard.
                </p>

                <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                    ⏳ Approval usually takes a few hours.
                </div>

            </motion.div>

        </div>
    );
}