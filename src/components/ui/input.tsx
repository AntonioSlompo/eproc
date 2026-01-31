import * as React from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, helperText, ...props }, ref) => {
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
                <input
                    type={type}
                    className={`
            w-full px-[var(--spacing-md)] rounded-lg
            h-[var(--input-height)]
            text-[var(--text-base)]
            glass-card border
            ${error ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"}
            focus:neon-border outline-none
            transition-all
            placeholder:text-neutral-500
            disabled:opacity-50 disabled:cursor-not-allowed
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
Input.displayName = "Input";

export { Input };
