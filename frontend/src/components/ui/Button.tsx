import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white",
        "hover:bg-slate-800 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
