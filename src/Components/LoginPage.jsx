import React, { useState, useEffect } from "react";
import * as Yup from "yup"; 
import { loginStyles } from "../assets/dummyStyles";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Film, Eye, EyeOff, Popcorn, Clapperboard } from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loraFontStyle = { fontFamily: "'Lora', serif" };

    // 1. Define Login Validation Schema
    const loginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    // --- Auth Guard: Redirect if already logged in ---
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/'); 
        }
    }, [navigate]);

    // --- Update form state ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // --- Handle Login Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 2. Run Yup Validation
            await loginSchema.validate(formData, { abortEarly: false });

            // Fetch users from LocalStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const foundUser = users.find(u => u.email === formData.email && u.password === formData.password);

            setTimeout(() => {
                if (foundUser) {
                    setIsLoading(false);
                    // Set login session
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(foundUser));
                    
                    toast.success("Welcome back to the Cinema!");
                    setTimeout(() => { navigate('/'); }, 1500);
                } else {
                    setIsLoading(false);
                    toast.error("Invalid email or password!");
                }
            }, 1500);

        } catch (err) {
            setIsLoading(false);
            // 3. Display Yup errors in Toasts
            if (err.inner) {
                err.inner.forEach((error) => {
                    toast.error(error.message);
                });
            }
        }
    };

    return (
        <div className={loginStyles.pageContainer}>
            <ToastContainer theme="dark" />

            <div className="relative w-full max-w-md z-10 px-4">
                {/* Back Navigation */}
                <div className={loginStyles.backButtonContainer}>
                    <button onClick={() => navigate(-1)} className={loginStyles.backButton}>
                        <ArrowLeft size={20} className={loginStyles.backButtonIcon} />
                        <span className={loginStyles.backButtonText}>Back</span>
                    </button>
                </div>

                <div className={loginStyles.cardContainer}>
                    <div className={loginStyles.cardContent}>
                        {/* Header */}
                        <div className={loginStyles.headerContainer}>
                            <div className={loginStyles.headerIconContainer}>
                                <Film className={loginStyles.headerIcon} size={28} />
                                <h2 className={loginStyles.headerTitle} style={loraFontStyle}>CINEMA ACCESS</h2>
                            </div>
                            <p className={loginStyles.headerSubtitle}>Ready for the show?</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} noValidate /* Disables HTML5 tooltips */>
                            {/* Email Input */}
                            <div className={loginStyles.inputGroup}>
                                <label className={loginStyles.label} style={loraFontStyle}>EMAIL ADDRESS</label>
                                <div className={loginStyles.inputContainer}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={loginStyles.input}
                                        placeholder="Email Address"
                                    />
                                    <div className={loginStyles.passwordToggle} style={{ pointerEvents: 'none' }}>
                                        <Clapperboard size={18} color="#e11d48" />
                                    </div>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className={loginStyles.inputGroup}>
                                <label className={loginStyles.label} style={loraFontStyle}>PASSWORD</label>
                                <div className={loginStyles.inputContainer}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={loginStyles.inputWithIcon}
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        className={loginStyles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye size={18} color="#e11d48" /> : <EyeOff size={18} color="#e11d48" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`${loginStyles.submitButton} ${isLoading ? loginStyles.submitButtonDisabled : ""}`}
                            >
                                <div className={loginStyles.buttonContent}>
                                    {!isLoading && <Popcorn size={18} className={loginStyles.buttonIcon} />}
                                    <span className={loginStyles.buttonText} style={loraFontStyle}>
                                        {isLoading ? "LOADING..." : "ACCESS YOUR ACCOUNT"}
                                    </span>
                                </div>
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className={loginStyles.footerContainer}>
                            <p className={loginStyles.footerText}>
                                Don’t have an account?{" "}
                                <button 
                                    onClick={() => navigate('/signup')} 
                                    className={loginStyles.footerLink} 
                                    style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    Create one now
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
                ${loginStyles.customCSS}
                /* Extra reset to ensure no underlines in the cinema journey */
                .${loginStyles.footerLink} { text-decoration: none !important; }
                button { text-decoration: none !important; }
            `}</style>
        </div>
    );
};

export default LoginPage;