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
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Atividades Recentes</h3>

            <div className="space-y-4">
                {mockActivities.map((activity, index) => {
                    const { icon: Icon, color } = activityIcons[activity.type];

                    return (
                        <div
                            key={activity.id}
                            className="flex gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0 hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-all"
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${color}`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium mb-1">{activity.title}</p>
                                <p className="text-sm text-neutral-400 mb-1">{activity.description}</p>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <span>{activity.user}</span>
                                    <span>•</span>
                                    <span>{activity.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Ver todas as atividades →
            </button>
        </div>
    );
}
