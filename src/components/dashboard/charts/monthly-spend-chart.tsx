"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", total: 12000 },
    { name: "Fev", total: 18000 },
    { name: "Mar", total: 15000 },
    { name: "Abr", total: 22000 },
    { name: "Mai", total: 28000 },
    { name: "Jun", total: 35000 },
];

export function MonthlySpendChart() {
    return (
        <div className="w-full h-[300px] glass-card p-4 rounded-xl border border-white/10 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-white/90">Evolução Mensal (R$)</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(17, 24, 39, 0.8)",
                                borderColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(4px)",
                                color: "#f3f4f6",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "#a78bfa" }}
                            formatter={(value: any) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Total"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
