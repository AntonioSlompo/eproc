import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ShoppingCart, Package, Building2, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="mb-density-lg">
                    <h2 className="text-density-3xl font-bold mb-density-xs">Bem-vindo ao Dashboard</h2>
                    <p className="text-density-sm text-neutral-400">Visão geral do sistema de procurement</p>
                </div>
                <Link
                    href="/dashboard/requisitions/new"
                    className="inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-[var(--text-sm)] transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Nova Requisição
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-density-md mb-density-lg">
                <StatCard
                    icon={ShoppingCart}
                    label="Total de Requisições"
                    value="127"
                    trend={{ value: "12% este mês", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Pendentes de Aprovação"
                    value="23"
                    trend={{ value: "5 novas hoje", isPositive: false }}
                    color="orange"
                />
                <StatCard
                    icon={Building2}
                    label="Fornecedores Ativos"
                    value="45"
                    trend={{ value: "3 novos", isPositive: true }}
                    color="green"
                />
                <StatCard
                    icon={Package}
                    label="Produtos Cadastrados"
                    value="892"
                    trend={{ value: "18% este mês", isPositive: true }}
                    color="purple"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-lg)]">
                {/* Recent Activity - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <RecentActivity />
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-density-lg rounded-xl border border-white/10">
                    <h3 className="text-density-xl font-bold mb-density-md">Ações Rápidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-density-sm">
                        <Link
                            href="/dashboard/requisitions/new"
                            className="flex flex-col items-center gap-density-sm p-density-md rounded-lg border border-white/10 hover:border-blue-500 hover:bg-white/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <span className="text-density-sm font-medium group-hover:text-blue-400 transition-colors">Nova Requisição</span>
                        </Link>

                        <Link
                            href="/dashboard/products"
                            className="flex flex-col items-center gap-density-sm p-density-md rounded-lg border border-white/10 hover:border-purple-500 hover:bg-white/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <Package className="w-5 h-5" />
                            </div>
                            <span className="text-density-sm font-medium group-hover:text-purple-400 transition-colors">Gerenciar Produtos</span>
                        </Link>

                        <Link
                            href="/dashboard/suppliers"
                            className="flex flex-col items-center gap-density-sm p-density-md rounded-lg border border-white/10 hover:border-green-500 hover:bg-white/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="text-density-sm font-medium group-hover:text-green-400 transition-colors">Fornecedores</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
