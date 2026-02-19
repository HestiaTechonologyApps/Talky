import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/common/Authservices";
import { Heart } from "lucide-react";

interface Errors {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = (value: string): string => {
        if (!value) return "* Email is required";
        if (!emailRegex.test(value)) return "* Please enter a valid email address";
        return "";
    };

    const validatePassword = (value: string): string => {
        if (!value) return "* Password is required";
        return "";
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value.toLowerCase().trim(); // Normalize to lowercase
        setEmail(value);
        if (submitted) setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setPassword(value);
        if (submitted) setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setSubmitted(true);

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        setErrors({ email: emailError, password: passwordError });

        if (!emailError && !passwordError) {
            setIsLoading(true);

            try {
                // Call the actual API through AuthService with normalized email
                const response = await AuthService.login({
                    email: email.toLowerCase().trim(), // Ensure email is lowercase
                    password: password
                });

                console.log('Login response:', response);

                // Check if login was successful
                if (response.isSucess && response.value) {
                    toast.success(response.customMessage || "Login successful!");

                    // Clear form
                    setEmail("");
                    setPassword("");
                    setSubmitted(false);

                    // Navigate to dashboard (Dashboard component will handle user data refresh)
                    navigate("/dashboard");
                } else {
                    // Handle unsuccessful login
                    const errorMessage = response.customMessage || response.error || "Invalid email or password";
                    toast.error(errorMessage);
                }

            } catch (error: any) {
                console.error('Login error:', error);

                // Handle different error scenarios
                let errorMessage = "An error occurred during login. Please try again.";

                if (error?.response?.data) {
                    // API returned an error response
                    errorMessage = error.response.data.customMessage
                        || error.response.data.error
                        || error.response.data.message
                        || errorMessage;
                } else if (error?.message) {
                    // Network or other error
                    errorMessage = error.message;
                }

                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const togglePassword = (): void => setShowPassword(!showPassword);

    return (
        <>

            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: 'Urbanist', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          flex: 1;
          background: linear-gradient(145deg, hsl(0,65%,22%), hsl(0,55%,32%));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .left-blob-1 {
          position: absolute; width: 18rem; height: 18rem;
          top: -4rem; right: -4rem; border-radius: 9999px;
          background: hsl(0,60%,40%); filter: blur(70px); opacity: 0.25;
          pointer-events: none;
        }
        .left-blob-2 {
          position: absolute; width: 14rem; height: 14rem;
          bottom: -3rem; left: -3rem; border-radius: 9999px;
          background: hsl(270,50%,50%); filter: blur(60px); opacity: 0.15;
          pointer-events: none;
        }
        .left-content {
          position: relative; z-index: 2;
          text-align: center; width: 100%; max-width: 340px;
        }
        .brand-row {
          display: flex; align-items: center;
          justify-content: center; gap: 0.6rem; margin-bottom: 1.4rem;
        }
        .brand-logo {
          width: 2.4rem; height: 2.4rem; border-radius: 0.7rem;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .brand-name {
          font-size: 2rem; font-weight: 800; color: white; letter-spacing: -0.5px;
        }
        .left-tagline {
          font-size: 1.25rem; font-weight: 700; color: white;
          line-height: 1.4; margin-bottom: 0.5rem;
        }
        .left-sub {
          font-size: 0.8rem; color: rgba(255,255,255,0.65);
          line-height: 1.65; margin-bottom: 1.8rem;
        }
        .feature-list {
          display: flex; flex-direction: column; gap: 0.6rem; width: 100%;
        }
        .feature-pill {
          display: flex; align-items: center; gap: 0.65rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 0.8rem;
          padding: 0.55rem 0.85rem;
          backdrop-filter: blur(6px);
          text-align: left;
        }
        .feature-pill-icon {
          width: 1.75rem; height: 1.75rem; border-radius: 0.45rem;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 0.82rem;
        }
        .feature-pill-title {
          font-size: 0.76rem; font-weight: 700; color: white; line-height: 1.2;
        }
        .feature-pill-desc {
          font-size: 0.67rem; color: rgba(255,255,255,0.6); line-height: 1.3;
          margin-top: 0.1rem;
        }
        .stats-row {
          display: flex; justify-content: center; gap: 1.5rem;
          margin-top: 1.4rem; padding-top: 1.2rem;
          border-top: 1px solid rgba(255,255,255,0.12);
          width: 100%;
        }
        .stat-item { text-align: center; }
        .stat-value { font-size: 1.1rem; font-weight: 800; color: white; }
        .stat-label { font-size: 0.6rem; color: rgba(255,255,255,0.55); margin-top: 0.1rem; }

        /* ── RIGHT PANEL ── */
        .right-panel {
          width: 390px;
          min-width: 320px;
          background: #f7f7f7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
          overflow-y: auto;
        }
        .login-card {
          background: white;
          border-radius: 1.2rem;
          padding: 1.8rem 1.6rem;
          width: 100%;
          box-shadow: 0 8px 40px rgba(136,38,38,0.1);
          border: 1px solid rgba(136,38,38,0.07);
        }
        .login-card-logo-wrap {
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; margin-bottom: 0.25rem;
        }
        .login-card-logo-icon {
          width: 1.9rem; height: 1.9rem; border-radius: 0.5rem;
          background: linear-gradient(135deg, #882626, #c45c5c);
          display: flex; align-items: center; justify-content: center;
        }
        .login-card-title {
          font-size: 1.25rem; font-weight: 800;
          color: #882626; text-align: center; margin-bottom: 0.15rem;
        }
        .login-card-sub {
          font-size: 0.75rem; color: #aaa; text-align: center; margin-bottom: 1rem;
        }
        .admin-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          background: #fff5f5; color: #882626;
          font-size: 0.67rem; font-weight: 700;
          padding: 0.22rem 0.65rem; border-radius: 9999px;
          border: 1px solid rgba(136,38,38,0.14);
          margin-bottom: 1.2rem;
        }
        .field-wrap { margin-bottom: 0.8rem; }
        .field-label {
          font-size: 0.73rem; font-weight: 600; color: #666;
          margin-bottom: 0.28rem; display: block;
        }
        .field-input {
          width: 100%; padding: 0.52rem 0.75rem;
          border: 1.5px solid #e2e2e2; border-radius: 0.6rem;
          font-size: 0.8rem; color: #1a1a1a;
          outline: none; transition: border-color 0.2s;
          background: #fafafa; font-family: inherit;
        }
        .field-input:focus { border-color: #882626; background: white; }
        .field-input.has-error { border-color: #e53e3e; }
        .field-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-text {
          font-size: 0.68rem; color: #e53e3e;
          margin-top: 0.22rem; display: block;
        }
        .password-wrap { position: relative; }
        .password-toggle {
          position: absolute; right: 0.65rem; top: 50%;
          transform: translateY(-50%);
          cursor: pointer; color: #882626; font-size: 0.95rem;
          display: flex; align-items: center;
        }
        .forgot-btn {
          display: block; width: 100%; text-align: right;
          font-size: 0.7rem; font-weight: 700;
          color: #882626; text-decoration: underline;
          cursor: pointer; background: none; border: none;
          padding: 0; margin-bottom: 0.8rem; font-family: inherit;
        }
        .forgot-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-btn {
          width: 100%; padding: 0.62rem;
          background: linear-gradient(135deg, #882626, #c45c5c);
          color: white; border: none; border-radius: 0.65rem;
          font-size: 0.85rem; font-weight: 800;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .card-divider {
          width: 100%; height: 1px;
          background: rgba(136,38,38,0.09);
          margin: 1rem 0;
        }
        .terms-text {
          font-size: 0.67rem; color: #aaa;
          line-height: 1.55; text-align: center;
        }
        .terms-text span {
          text-decoration: underline; cursor: pointer; color: #882626;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-page { flex-direction: column; height: auto; min-height: 100vh; overflow-y: auto; }
          .left-panel { flex: none; padding: 2rem 1.5rem; }
          .right-panel { width: 100%; min-width: unset; padding: 1.5rem 1rem; }
        }
      `}</style>
            <div className="login-page">

                {/* ── LEFT PANEL ── */}
                <div className="left-panel">
                    <div className="left-blob-1" />
                    <div className="left-blob-2" />

                    <div className="left-content">
                        <div className="brand-row">
                            <div className="brand-logo">
                                <Heart size={16} color="white" fill="white" />
                            </div>
                            <span className="brand-name">Talky</span>
                        </div>

                        <h2 className="left-tagline">
                            പുതിയ സൗഹൃദങ്ങൾ,<br />ഒരു കോളിലൂടെ 💕
                        </h2>
                        <p className="left-sub">
                            ലോകത്തിന്റെ ഏത് ഭാഗത്തുനിന്നും<br />
                            പുതിയ സുഹൃത്തുക്കളുമായി ബന്ധപ്പെടൂ.
                        </p>

                        <div className="feature-list">
                            {[
                                { emoji: "📞", title: "റാൻഡം വോയ്‌സ് കോൾ", desc: "ലോകമെമ്പാടും ബന്ധം" },
                                { emoji: "🔒", title: "സുരക്ഷിതവും സേഫ്", desc: "End-to-end encrypted" },
                                { emoji: "⚡", title: "ഇൻസ്റ്റൻ്റ് കണക്ട്", desc: "ഒരു ടാപ്പ് മതി" },
                                { emoji: "🫂", title: "ഫ്രണ്ട്‌ലി കമ്മ്യൂണിറ്റി", desc: "10K+ ഉപയോക്താക്കൾ" },
                            ].map((f) => (
                                <div key={f.title} className="feature-pill">
                                    <div className="feature-pill-icon">{f.emoji}</div>
                                    <div>
                                        <div className="feature-pill-title">{f.title}</div>
                                        <div className="feature-pill-desc">{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="stats-row">
                            {[
                                { value: "10K+", label: "ഉപയോക്താക്കൾ" },
                                { value: "50K+", label: "ദൈനംദിന കോളുകൾ" },
                                { value: "4.9★", label: "റേറ്റിംഗ്" },
                            ].map((s) => (
                                <div key={s.label} className="stat-item">
                                    <div className="stat-value">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="right-panel">
                    <div className="login-card">

                        <div className="login-card-logo-wrap">
                            <div className="login-card-logo-icon">
                                <Heart size={13} color="white" fill="white" />
                            </div>
                        </div>
                        <h1 className="login-card-title">Welcome Back</h1>
                        <p className="login-card-sub">Sign in to continue</p>

                        <div style={{ textAlign: "center" }}>
                            <span className="admin-badge">🛡️ Admin Portal</span>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Email */}
                            <div className="field-wrap">
                                <label className="field-label">Email</label>
                                <input
                                    type="text"
                                    className={`field-input ${submitted && errors.email ? "has-error" : ""}`}
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                                {submitted && errors.email && (
                                    <span className="error-text">{errors.email}</span>
                                )}
                            </div>

                            {/* Password */}
                            <div className="field-wrap">
                                <label className="field-label">Password</label>
                                <div className="password-wrap">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`field-input ${submitted && errors.password ? "has-error" : ""}`}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                        style={{ paddingRight: "2.1rem" }}
                                    />
                                    <span
                                        className="password-toggle"
                                        onClick={togglePassword}
                                        style={{
                                            pointerEvents: isLoading ? "none" : "auto",
                                            opacity: isLoading ? 0.5 : 1,
                                        }}
                                    >
                                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                    </span>
                                </div>
                                {submitted && errors.password && (
                                    <span className="error-text">{errors.password}</span>
                                )}
                            </div>

                            {/* Forgot password */}
                            <button
                                type="button"
                                className="forgot-btn"
                                onClick={() => !isLoading && navigate("/forgot-password")}
                                disabled={isLoading}
                            >
                                Forgot your password?
                            </button>

                            {/* Submit */}
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Log in"}
                            </button>
                        </form>

                        <div className="card-divider" />

                        <p className="terms-text">
                            By continuing you agree to the{" "}
                            <span>Terms of use</span> and <span>Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export default Login;