"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import clsx from "clsx";

type Animation =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "fadeIn"
  | "scaleUp"
  | "slideUp";

interface AnimateProps {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animations: Record<Animation, { from: string; to: string }> = {
  fadeUp: { from: "opacity-0 translate-y-10", to: "opacity-100 translate-y-0" },
  fadeDown: {
    from: "opacity-0 -translate-y-10",
    to: "opacity-100 translate-y-0",
  },
  fadeLeft: {
    from: "opacity-0 translate-x-10",
    to: "opacity-100 translate-x-0",
  },
  fadeRight: {
    from: "opacity-0 -translate-x-10",
    to: "opacity-100 translate-x-0",
  },
  fadeIn: { from: "opacity-0", to: "opacity-100" },
  scaleUp: { from: "opacity-0 scale-95", to: "opacity-100 scale-100" },
  slideUp: {
    from: "opacity-0 translate-y-16",
    to: "opacity-100 translate-y-0",
  },
};

export default function Animate({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.15,
}: AnimateProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const anim = animations[animation];

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all",
        isVisible ? anim.to : anim.from,
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
