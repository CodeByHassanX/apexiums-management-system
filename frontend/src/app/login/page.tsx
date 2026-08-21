"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post('/auth/login', { email, password });
      
      const { accessToken, refreshToken, user } = res.data.data;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Route based on role
      if (user.role === 'SUPER_ADMIN') {
        sessionStorage.setItem("superAdmin", "true");
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (!err.response) {
        setError("Network Error: Cannot connect to the server. Please make sure NEXT_PUBLIC_API_URL is set correctly in Vercel.");
      } else {
        setError(err.response?.data?.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      
      {/* Left Side - Information */}
      <div className="hidden lg:flex w-1/2 bg-[#1b2028] text-white p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#12b4a3]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8ae8dd]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-lg mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Apexiums<br/><span className="text-[#12b4a3]">Management Softwares</span>
          </h1>
          
          <div className="space-y-8 text-lg text-gray-400">
            <p className="leading-relaxed">
              We deals in all kind of management softwares.
              <br />
              <span className="text-white font-bold mt-2 block">Contact us : 03405542097</span>
            </p>
            
            <div className="pt-8 border-t border-gray-700">
              <p className="text-xl font-bold text-white mb-4">
                Collaborate with us and make your business digital
              </p>
              
              <a href="https://wa.me/923405542097" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#1ebd5c] text-white rounded-full transition-all shadow-lg shadow-[#25D366]/30">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="flex items-center space-x-4 mb-12">
            <div className="h-12 w-12 bg-[#12b4a3] rounded-xl flex items-center justify-center shadow-lg shadow-[#12b4a3]/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Apexiums Retail<br/><span className="text-gray-500 font-medium">Management software</span>
            </h2>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-8">Access your software</h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12b4a3] focus:border-transparent outline-none transition text-gray-900 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-3.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12b4a3] focus:border-transparent outline-none transition text-gray-900 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#12b4a3] text-white rounded-xl font-bold text-lg hover:bg-[#0e9688] transition-all shadow-lg shadow-[#12b4a3]/20 disabled:opacity-70 mt-4"
            >
              {loading ? "Authenticating..." : "Log in"}
            </button>
          </form>
          
        </div>
      </div>
      
    </div>
  );
}
