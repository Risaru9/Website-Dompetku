import { HTMLAttributes } from "react";
import clsx from "clsx";

export default function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "w-full max-w-md rounded-xl bg-white shadow-lg px-8 py-8",
        className
      )}
      {...props}
    />
  );
}
