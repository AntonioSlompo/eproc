import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    color?: "blue" | "purple" | "green" | "orange";
}

const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/10 text-blue-400 border-blue-500/20",
    purple: "from-purple-500/10 to-purple-600/10 text-purple-400 border-purple-500/20",
    green: "from-green-500/10 to-green-600/10 text-green-400 border-green-500/20",
    orange: "from-orange-500/10 to-orange-600/10 text-orange-400 border-orange-500/20",
};

export function StatCard({ icon: Icon, label, value, trend, color = "blue" }: StatCardProps) {
    return (
        <div className="glass-card p-6 hover:neon-border transition-all group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-neutral-400 mb-2">{label}</p>
                    <p className="text-3xl font-bold mb-1">{value}</p>
                    {trend && (
                        <p className={`text-sm ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
                            {trend.isPositive ? "↑" : "↓"} {trend.value}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
