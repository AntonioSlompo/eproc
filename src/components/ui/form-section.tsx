import { ReactNode } from "react";

interface FormSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <div className="glass-card p-[var(--spacing-lg)] rounded-lg border border-white/10">
            {(title || description) && (
                <div className="mb-[var(--spacing-lg)]">
                    {title && <h2 className="text-[var(--text-xl)] font-semibold mb-[var(--spacing-xs)]">{title}</h2>}
                    {description && <p className="text-[var(--text-sm)] text-neutral-400">{description}</p>}
                </div>
            )}
            <div className="space-y-[var(--spacing-md)]">{children}</div>
        </div>
    );
}
