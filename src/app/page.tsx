import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, Box, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with Glass Effect */}
      <nav className="fixed w-full z-50 glass px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 neon-border flex items-center justify-center font-bold text-white">E</div>
            <span className="text-xl font-bold tracking-tight">E-Procurement</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm hover:text-blue-400 transition-colors">Login</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center space-y-8">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Procurement do <span className="neon-text">Futuro</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Gerencie aquisições, fornecedores e orçamentos com a eficiência e a elegância que sua empresa merece.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <Link
            href="/dashboard"
            className="group px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center gap-2"
          >
            Acessar Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-3 rounded-full glass hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20">
            Saiba Mais
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-6xl px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="glass-card p-8 flex flex-col items-center text-center space-y-4 hover:neon-border transition-all group">
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <Box size={32} />
            </div>
            <h3 className="text-xl font-bold">Gestão de Pedidos</h3>
            <p className="text-sm text-neutral-400">Fluxo completo de requisições, cotações e aprovações em tempo real.</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center space-y-4 hover:neon-border transition-all group">
            <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold">Compliance</h3>
            <p className="text-sm text-neutral-400">Rastreabilidade total e controle de orçamentos por centro de custo.</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center space-y-4 hover:neon-border transition-all group">
            <div className="p-4 rounded-full bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform duration-300">
              <CreditCard size={32} />
            </div>
            <h3 className="text-xl font-bold">Fornecedores</h3>
            <p className="text-sm text-neutral-400">Cadastro centralizado e avaliação de performance de fornecedores.</p>
          </div>
        </div>
      </main>

      <footer className="glass py-8 border-t border-white/5">
        <div className="container mx-auto text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} E-Procurement System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
