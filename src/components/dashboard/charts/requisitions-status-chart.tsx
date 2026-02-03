"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Pendente", value: 12, color: "#f59e0b" }, // Amber-500
    { name: "Aprovado", value: 19, color: "#3b82f6" }, // Blue-500
    { name: "Rejeitado", value: 5, color: "#ef4444" }, // Red-500
    { name: "Comprado", value: 8, color: "#10b981" }, // Emerald-500
];

export function RequisitionsStatusChart() {
    return (
        <div className="w-full h-[300px] glass-card p-4 rounded-xl border border-white/10 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-white/90">Status de Requisições</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(17, 24, 39, 0.8)",
                                borderColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(4px)",
                                color: "#f3f4f6",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "#f3f4f6" }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
