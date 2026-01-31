import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Activity {
    id: string;
    type: "created" | "approved" | "rejected" | "pending";
    title: string;
    description: string;
    timestamp: string;
    user: string;
}

const mockActivities: Activity[] = [
    {
        id: "1",
        type: "created",
        title: "Nova Requisição Criada",
        description: "Requisição #1234 - Material de Escritório",
        timestamp: "Há 5 minutos",
        user: "João Silva",
    },
    {
        id: "2",
        type: "approved",
        title: "Requisição Aprovada",
        description: "Requisição #1233 - Equipamentos de TI",
        timestamp: "Há 1 hora",
        user: "Maria Santos",
    },
    {
        id: "3",
        type: "pending",
        title: "Aguardando Aprovação",
        description: "Requisição #1232 - Mobiliário",
        timestamp: "Há 2 horas",
        user: "Pedro Costa",
    },
    {
        id: "4",
        type: "rejected",
        title: "Requisição Rejeitada",
        description: "Requisição #1231 - Material de Limpeza",
        timestamp: "Há 3 horas",
        user: "Ana Oliveira",
    },
];

const activityIcons = {
    created: { icon: Clock, color: "text-blue-400" },
    approved: { icon: CheckCircle, color: "text-green-400" },
    rejected: { icon: XCircle, color: "text-red-400" },
    pending: { icon: AlertCircle, color: "text-orange-400" },
};

export function RecentActivity() {
    return (
        <div className="glass-card p-density-lg rounded-xl border border-white/10">
            <h3 className="text-density-xl font-bold mb-density-md">Atividades Recentes</h3>

            <div className="space-y-density-sm">
                {mockActivities.map((activity, index) => {
                    const { icon: Icon, color } = activityIcons[activity.type];

                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-density-sm p-density-sm rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${color}`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-density-sm">{activity.title}</p>
                                <p className="text-density-xs text-neutral-400">{activity.description}</p>
                                <div className="flex items-center gap-density-xs text-density-xs text-neutral-500">
                                    <span>{activity.user}</span>
                                    <span>•</span>
                                    <span>{activity.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="w-full mt-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--text-sm)] text-blue-400 hover:text-blue-300 transition-colors">
                Ver todas as atividades →
            </button>
        </div>
    );
}
