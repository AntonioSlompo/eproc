import * as React from "react";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        const id = props.id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-[var(--text-sm)] font-medium mb-[var(--spacing-xs)] text-neutral-300"
                    >
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    className={`
            w-full px-[var(--spacing-md)] py-[var(--spacing-sm)] rounded-lg
            text-[var(--text-base)]
            glass-card border
            ${error ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"}
            focus:neon-border outline-none
            transition-all
            placeholder:text-neutral-500
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[100px]
            ${className}
          `}
                    ref={ref}
                    id={id}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${id}-error`} className="mt-[var(--spacing-xs)] text-[var(--text-sm)] text-red-400">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${id}-helper`} className="mt-[var(--spacing-xs)] text-[var(--text-sm)] text-neutral-400">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
