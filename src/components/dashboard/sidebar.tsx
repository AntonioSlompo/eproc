"use client";

import { Home, Package, ShoppingCart, Users, Building2, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: ShoppingCart, label: "Requisições", href: "/dashboard/requisitions" },
    { icon: Package, label: "Produtos", href: "/dashboard/products" },
    { icon: Building2, label: "Fornecedores", href: "/dashboard/suppliers" },
    { icon: Users, label: "Usuários", href: "/dashboard/users" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card border border-white/10 hover:border-blue-500 transition-all"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen w-sidebar glass-card border-r border-white/10 
          flex flex-col z-40 transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                {/* Logo */}
                <div className="p-density-lg border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-density-sm group">
                        <div className="w-sidebar-logo h-sidebar-logo rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 neon-border flex items-center justify-center font-bold text-white group-hover:scale-105 transition-transform text-density-base">
                            E
                        </div>
                        <span className="text-density-xl font-bold tracking-tight">E-Procurement</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-density-md space-y-density-xs overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                  flex items-center gap-density-sm px-density-md h-nav-item rounded-lg transition-all group
                  ${isActive
                                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500 neon-border text-blue-400"
                                        : "hover:bg-white/5 border border-transparent hover:border-white/10"
                                    }
                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-neutral-400 group-hover:text-neutral-300"}`} />
                                <span className={`font-medium text-density-sm ${isActive ? "text-blue-400" : "group-hover:text-neutral-300"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-density-md border-t border-white/10">
                    <div className="glass-card p-density-sm text-density-xs text-neutral-400 text-center">
                        <div className="flex items-center justify-center gap-density-xs mb-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            Sistema Online
                        </div>
                        <div>v1.0.0</div>
                    </div>
                </div>
            </aside>
        </>
    );
}
