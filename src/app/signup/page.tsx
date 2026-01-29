"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { registerUser, loginWithGoogle, loginWithGithub } from "@/lib/actions/auth";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setIsLoading(true);

        const result = await registerUser(name, email, password);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
    };

    const handleGithubLogin = async () => {
        await loginWithGithub();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
            </div>

            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Signup Container */}
            <div className="w-full max-w-md mx-auto animate-fade-in-up">
                <div className="glass-card p-8 md:p-10 space-y-6">

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 neon-border flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold">E-Procurement</span>
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Criar Conta</h2>
                        <p className="text-neutral-400">Comece sua jornada de procurement inteligente</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Social Signup Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-500 transition-all group flex items-center justify-center gap-2 min-h-[48px]"
                        >
                            <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleGithubLogin}
                            className="p-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-500 transition-all group flex items-center justify-center gap-2 min-h-[48px]"
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">GitHub</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[var(--card-bg)] text-neutral-400">ou cadastre com email</span>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                required
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3 rounded-lg glass-card border border-white/10 focus:border-blue-500 focus:neon-border outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3 rounded-lg glass-card border border-white/10 focus:border-blue-500 focus:neon-border outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Criar senha (mín. 6 caracteres)"
                                required
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3 rounded-lg glass-card border border-white/10 focus:border-blue-500 focus:neon-border outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmar senha"
                                required
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3 rounded-lg glass-card border border-white/10 focus:border-blue-500 focus:neon-border outline-none transition-all placeholder:text-neutral-500 disabled:opacity-50"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    Criar conta
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-sm text-neutral-400">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                            Fazer login
                        </Link>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-neutral-500 mt-6">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Termos de Serviço
                    </Link>
                    {" "}e{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Política de Privacidade
                    </Link>
                </p>
            </div>
        </div>
    );
}
