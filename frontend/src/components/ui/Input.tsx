import { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
}

export default function Input({
  label,
  icon,
  rightSlot,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          className={clsx(
            "w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm",
            icon ? "pl-10 pr-10" : "px-3",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none",
            className
          )}
          {...props}
        />

        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}
