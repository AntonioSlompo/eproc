import { ReactNode } from "react";

interface FormSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <div className="glass-card p-6 rounded-lg border border-white/10">
            {(title || description) && (
                <div className="mb-6">
                    {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
                    {description && <p className="text-sm text-neutral-400">{description}</p>}
                </div>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    );
}
