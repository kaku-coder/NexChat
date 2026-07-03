import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Sparkles } from "lucide-react";
import { useForm } from "../hooks/useForm";
import { authService } from "../service/authService";
import { registerContent, brandContent } from "../content/authContent";

const RegisterPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");

  const {
    values: formData,
    loading,
    setLoading,
    handleChange,
  } = useForm({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData.userName, formData.email, formData.password);
      alert("Registration successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleOAuthUrl();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-6 font-sans antialiased selection:bg-rose-500 selection:text-white overflow-y-auto">
      {/* Glow effects in background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[60%] h-[60%] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div
        className={`w-full max-w-5xl bg-zinc-950/80 backdrop-blur-2xl rounded-3xl border border-zinc-900 overflow-hidden shadow-2xl transition-all duration-1000 ease-out transform z-10 grid grid-cols-1 lg:grid-cols-12 ${
          isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Left Side: Video & Image Section */}
        <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-[500px] bg-zinc-900 overflow-hidden m-2.5 rounded-2xl group">
          {/* Placeholder/Static Image Background */}
          <img 
            src="/images/auth-placeholder.png" 
            alt="NexChat Background" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Looping Ambient Video on top (with fade-in) */}
          <video
            src="/videos/login-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
            onPlay={(e) => e.target.classList.remove('opacity-0')}
            onError={(e) => {
              // Fail silently and keep opacity-0 so the beautiful generated image shows
              console.log("Video fail, showing image.");
            }}
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

          {/* Floating Brand Badge */}
          <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 z-20">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-white/90">{brandContent.logoText}</span>
          </div>

          {/* Video bottom metadata overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">{brandContent.statusText}</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight mb-1 text-white leading-tight">
              {brandContent.videoHeadingMain} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-450">
                {brandContent.videoHeadingSub}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
              {brandContent.videoDescription}
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <div className="w-full max-w-md mx-auto">
            {/* Heading */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{registerContent.title}</h2>
              <p className="text-zinc-500 text-xs">{registerContent.subtitle}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-rose-500" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{registerContent.usernameLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Sparkles className="h-4.5 w-4.5 text-zinc-600" />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder={registerContent.usernamePlaceholder}
                    className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800 focus:border-rose-500/50 rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{registerContent.emailLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-zinc-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={registerContent.emailPlaceholder}
                    className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800 focus:border-rose-500/50 rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{registerContent.passwordLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-zinc-600" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={registerContent.passwordPlaceholder}
                    className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800 focus:border-rose-500/50 rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{registerContent.confirmPasswordLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-zinc-600" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder={registerContent.confirmPasswordPlaceholder}
                    className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800 focus:border-rose-500/50 rounded-xl text-white placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2.5 py-3 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl font-bold tracking-wide shadow-md shadow-rose-950/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 text-xs"
              >
                {loading ? "Registering..." : registerContent.submitButtonText}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900"></div>
              </div>
              <span className="relative bg-zinc-950 px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                or
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 px-4 bg-transparent hover:bg-zinc-900 active:bg-zinc-900/50 text-white border border-zinc-800 hover:border-zinc-700 rounded-xl font-bold tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 transform active:scale-[0.98] text-xs"
            >
              {/* Google Colored Logo */}
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.93 1 12 1 7.37 1 3.42 3.66 1.5 7.55l3.75 2.91C6.15 7.03 8.84 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.91 3.43-8.54z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.25 14.73A7.16 7.16 0 0 1 4.8 12c0-.96.16-1.9.45-2.77L1.5 6.32A11.96 11.96 0 0 0 0 12c0 2.06.52 4.01 1.5 5.68l3.75-2.95z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.16 0-5.85-1.99-6.8-4.97L1.44 16.3A11.96 11.96 0 0 0 12 23z"
                />
              </svg>
              {registerContent.googleButtonText}
            </button>

            {/* Bottom link */}
            <p className="mt-6 text-center text-xs text-zinc-650">
              {registerContent.footerText}{" "}
              <Link
                to={registerContent.footerLinkPath}
                className="text-rose-500 hover:text-rose-400 font-semibold underline underline-offset-4 transition-colors"
              >
                {registerContent.footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
