import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from '../../Components/Input';
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading, message } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success("Password reset successfully, redirecting to login page...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen px-4 bg-zinc-900 overflow-hidden">
            {/* ✨ Subtle shiny greyish overlay */}
            <div className="absolute inset-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-zinc-700 opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-600 opacity-10 rounded-full blur-2xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md bg-zinc-800 bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 z-10"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Reset Password
                </h2>
                {error && <p className='text-red-400 text-sm mb-4'>{error}</p>}
                {message && <p className='text-green-400 text-sm mb-4'>{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Confirm New Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type='submit'
                        disabled={isLoading}
                        className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all mt-4 cursor-pointer disabled:opacity-50'
                    >
                        {isLoading ? "Resetting..." : "Set New Password"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
