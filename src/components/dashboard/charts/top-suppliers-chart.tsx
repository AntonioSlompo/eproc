"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
    { name: "Tech Soluções", value: 45000 },
    { name: "Office Supply", value: 28000 },
    { name: "Logística Express", value: 22000 },
    { name: "Construtora", value: 18000 },
    { name: "Serviços Gerais", value: 12000 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export function TopSuppliersChart() {
    return (
        <div className="w-full h-[300px] glass-card p-4 rounded-xl border border-white/10 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-white/90">Top Fornecedores</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            contentStyle={{
                                backgroundColor: "rgba(17, 24, 39, 0.8)",
                                borderColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(4px)",
                                color: "#f3f4f6",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "#f3f4f6" }}
                            formatter={(value: any) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Gasto"]}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
