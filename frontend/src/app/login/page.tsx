"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* Left Side - Dark Brand Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1b2028] flex-col justify-between p-12 lg:p-16 relative">
        <div className="mt-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Run your whole store<br />from one screen.
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Point of sale, inventory, customers, debt tracking and finance — all in sync, all in real time.
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 inline-block border border-white/10">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-bold text-base mr-2">Rs 48,120</span> 
              sold today
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center bg-white px-4 sm:px-6 lg:px-20 xl:px-32">
        <div className="mx-auto w-full max-w-md">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="h-10 w-10 bg-[#12b4a3] rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">APEXIUMS</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sign in to your store
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter your details to access your dashboard.
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input
                  type="email" required
                  placeholder="name@business.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-transparent bg-[#f7f6f2] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12b4a3] focus:bg-white focus:border-transparent transition-all sm:text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"} required
                  placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border-transparent bg-[#f7f6f2] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#12b4a3] focus:bg-white focus:border-transparent transition-all sm:text-sm font-medium"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-[#12b4a3] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-[#12b4a3] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" onClick={() => alert("Please contact your Store Administrator or HQ to reset your password.")} className="text-sm font-bold text-[#12b4a3] hover:text-[#0e9082]">Forgot password?</button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#12b4a3] hover:bg-[#0e9082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#12b4a3] disabled:opacity-50 transition-colors"
              >
                <span>{loading ? "Signing in..." : "Sign in"}</span>
                {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

