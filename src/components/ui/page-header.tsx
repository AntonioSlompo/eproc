import { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <div className="mb-[var(--spacing-lg)]">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-[var(--spacing-xs)] text-[var(--text-sm)] mb-[var(--spacing-sm)]" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-neutral-500" />
                            )}
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="text-neutral-400 hover:text-neutral-300 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-neutral-300">{crumb.label}</span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[var(--text-3xl)] font-bold mb-[var(--spacing-xs)]">{title}</h1>
                    {description && (
                        <p className="text-neutral-400 text-[var(--text-base)]">{description}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </div>
    );
}
