import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      
      // Cookie also sets, but explicitly setting token in localStorage facilitates Authorization headers
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm tracking-wider uppercase">Authenticating and linking...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
