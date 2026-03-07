import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
}

export const Separator = ({ className }: SeparatorProps) => (
  <div
    className={cn(
      "relative flex h-7 w-full border-y border-border lg:h-10",
      "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed [--pattern-fg:rgba(0,0,0,0.05)] dark:[--pattern-fg:rgba(255,255,255,0.1)]",
      className
    )}
  />
);

export const VerticalSeparator = ({ className }: SeparatorProps) => (
  <div
    className={cn(
      "row-span-full row-start-1 hidden border-x border-border",
      "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed [--pattern-fg:rgba(0,0,0,0.07)] md:block dark:[--pattern-fg:rgba(255,255,255,0.08)]",
      className
    )}
  />
);
