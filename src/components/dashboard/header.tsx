"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/actions/auth";

export function Header() {
    const { data: session } = useSession();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U";
    const userName = session?.user?.name || "Usuário";
    const userEmail = session?.user?.email || "";
    const userRole = session?.user?.role || "REQUESTER";

    const roleLabels: Record<string, string> = {
        ADMIN: "Administrador",
        REQUESTER: "Solicitante",
        APPROVER: "Aprovador",
    };

    return (
        <header className="sticky top-0 z-30 glass-card border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left side - could add breadcrumbs here */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button
                        className="relative p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-neutral-400 group-hover:text-neutral-300" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                        >
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={userName}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                    {userInitial}
                                </div>
                            )}
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium">{userName}</div>
                                <div className="text-xs text-neutral-400">{roleLabels[userRole] || userRole}</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[var(--background)] border border-white/20 rounded-lg shadow-2xl overflow-hidden animate-fade-in-up backdrop-blur-xl">
                                <div className="p-3 border-b border-white/10 bg-white/5">
                                    <div className="font-medium">{userName}</div>
                                    <div className="text-sm text-neutral-400">{userEmail}</div>
                                </div>
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left group">
                                        <User className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300" />
                                        <span className="group-hover:text-neutral-300">Perfil</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left group">
                                        <Settings className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300" />
                                        <span className="group-hover:text-neutral-300">Configurações</span>
                                    </button>
                                </div>
                                <div className="p-2 border-t border-white/10">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-all text-left group text-red-400"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
