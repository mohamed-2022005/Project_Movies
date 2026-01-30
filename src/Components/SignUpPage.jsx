import React, { useState, useEffect } from "react";
import * as Yup from "yup"; 
import { loginStyles as signUpStyles } from "../assets/dummyStyles";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Film, Eye, EyeOff, User, Mail,
    Phone, Calendar, Clapperboard, Popcorn
} from "lucide-react";

const SignUpPage = () => {
    const navigate = useNavigate();
    
    // Form state management
    const [formData, setFormData] = useState({
        fullName: "", username: "", email: "",
        phone: "", birthDate: "", password: "",
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const loraFontStyle = { fontFamily: "'Lora', serif" };

    // Validation rules using Yup
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().min(3, "Too short!").required("Required"),
        username: Yup.string().min(4, "Too short!").required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        phone: Yup.string().matches(/^[0-9]+$/, "Numbers only").min(11, "Must be 11 digits"),
        birthDate: Yup.string().required("Required"),
        password: Yup.string()
            .min(6, "At least 6 characters")
            .matches(/[a-zA-Z]/, "Must contain letters") // Force letters
            .matches(/[0-9]/, "Must contain numbers")   // Force numbers
            .required("Required"),
    });

    // Check if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/');
        }
    }, [navigate]);

    // Update state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate all fields
            await validationSchema.validate(formData, { abortEarly: false });

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = users.some(u => u.email === formData.email);

            setTimeout(() => {
                if (userExists) {
                    setIsLoading(false);
                    toast.error('Email already exists!');
                    return;
                }

                // Save user to local storage
                users.push(formData);
                localStorage.setItem('users', JSON.stringify(users));

                setIsLoading(false);
                toast.success("Account created successfully!");
                setTimeout(() => { navigate('/login'); }, 2000);
            }, 1500);

        } catch (err) {
            setIsLoading(false);
            // Show validation errors in toasts
            if (err.inner) {
                err.inner.forEach((error) => {
                    toast.error(error.message);
                });
            }
        }
    };

    return (
        <div className={signUpStyles.pageContainer}>
            <ToastContainer theme="dark" />

            <div className="relative w-full max-w-2xl z-10 px-4">
                {/* Navigation Back */}
                <div className={signUpStyles.backButtonContainer}>
                    <button onClick={() => navigate(-1)} className={signUpStyles.backButton}>
                        <ArrowLeft size={20} className={signUpStyles.backButtonIcon} />
                        <span className={signUpStyles.backButtonText}>BACK</span>
                    </button>
                </div>

                <div className={signUpStyles.cardContainer}>
                    <div className={signUpStyles.cardContent}>
                        {/* Header Section */}
                        <div className={signUpStyles.headerContainer}>
                            <div className={signUpStyles.headerIconContainer}>
                                <Film className={signUpStyles.headerIcon} size={28} />
                                <h2 className={signUpStyles.headerTitle} style={loraFontStyle}>JOIN OUR CINEMA</h2>
                            </div>
                            <p className={signUpStyles.headerSubtitle}>Create your account and start your journey.</p>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className={signUpStyles.inputGroup}>
                                <label className={signUpStyles.label} style={loraFontStyle}>FULL NAME</label>
                                <div className={signUpStyles.inputContainer}>
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} className={signUpStyles.input} placeholder="Full Name" />
                                    <div className={signUpStyles.passwordToggle} style={{ pointerEvents: 'none' }}><User size={18} color="#e11d48" /></div>
                                </div>
                            </div>

                            <div className={signUpStyles.inputGroup}>
                                <label className={signUpStyles.label} style={loraFontStyle}>USERNAME</label>
                                <div className={signUpStyles.inputContainer}>
                                    <input name="username" value={formData.username} onChange={handleChange} className={signUpStyles.input} placeholder="Username" />
                                    <div className={signUpStyles.passwordToggle} style={{ pointerEvents: 'none' }}><Clapperboard size={18} color="#e11d48" /></div>
                                </div>
                            </div>

                            <div className={signUpStyles.inputGroup}>
                                <label className={signUpStyles.label} style={loraFontStyle}>EMAIL ADDRESS</label>
                                <div className={signUpStyles.inputContainer}>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={signUpStyles.input} placeholder="Email" />
                                    <div className={signUpStyles.passwordToggle} style={{ pointerEvents: 'none' }}><Mail size={18} color="#e11d48" /></div>
                                </div>
                            </div>

                            <div className={signUpStyles.inputGroup}>
                                <label className={signUpStyles.label} style={loraFontStyle}>PHONE NUMBER</label>
                                <div className={signUpStyles.inputContainer}>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={signUpStyles.input} placeholder="Phone" />
                                    <div className={signUpStyles.passwordToggle} style={{ pointerEvents: 'none' }}><Phone size={18} color="#e11d48" /></div>
                                </div>
                            </div>

                            <div className={signUpStyles.inputGroup}>
                                <label className={signUpStyles.label} style={loraFontStyle}>DATE OF BIRTH</label>
                                <div className={signUpStyles.inputContainer}>
                                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={`${signUpStyles.input} custom-date-input`} />
                                    <div className={signUpStyles.passwordToggle} style={{ pointerEvents: 'none' }}><Calendar size={18} color="#e11d48" /></div>
                                </div>
                            </div>

                            <div className={signUpStyles.inputGroup}>
                                <label className={signUpStyles.label} style={loraFontStyle}>PASSWORD</label>
                                <div className={signUpStyles.inputContainer}>
                                    {/* Placeholder changed to Password */}
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={signUpStyles.inputWithIcon} placeholder="Password" />
                                    <button type="button" className={signUpStyles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Eye size={18} color="#e11d48" /> : <EyeOff size={18} color="#e11d48" />}
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <button type="submit" disabled={isLoading} className={`${signUpStyles.submitButton} ${isLoading ? signUpStyles.submitButtonDisabled : ""}`}>
                                    <div className={signUpStyles.buttonContent}>
                                        {!isLoading && <Popcorn size={18} className={signUpStyles.buttonIcon} />}
                                        <span className={signUpStyles.buttonText} style={loraFontStyle}>
                                            {isLoading ? "PROCESSING..." : "CREATE ACCOUNT"}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </form>

                        {/* Footer Link */}
                        <div className={signUpStyles.footerContainer}>
                            <p className={signUpStyles.footerText}>
                                Already have an account?{" "}
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className={signUpStyles.footerLink} 
                                    style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
                ${signUpStyles.customCSS}
                .custom-date-input::-webkit-calendar-picker-indicator {
                    position: absolute; left: 0; top: 0; width: 100%; height: 100%;
                    margin: 0; padding: 0; cursor: pointer; opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default SignUpPage;