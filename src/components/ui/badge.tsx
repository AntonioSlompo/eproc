import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "bg-white/10 text-neutral-300 border border-white/20",
                success: "bg-green-500/10 text-green-400 border border-green-500/30",
                warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
                danger: "bg-red-500/10 text-red-400 border border-red-500/30",
                info: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                purple: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={badgeVariants({ variant, className })} {...props} />
    );
}

export { Badge, badgeVariants };
