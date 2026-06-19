"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export default function StatsCounter({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-y border-neutral-100 bg-white">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1360px] grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-6 py-14 text-center lg:px-10 lg:py-16 ${
              i < stats.length - 1 ? "border-r border-neutral-100" : ""
            }`}
          >
            <div className="text-5xl font-black tracking-tight text-[#080808] lg:text-6xl">
              <CountUp value={stat.value} active={visible} />
              <span className="text-[0.5em] text-[#C0152A]">{stat.suffix}</span>
            </div>
            <p className="mt-2 text-[15px] font-bold text-neutral-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ value, active }: { value: number; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setCount(Math.round(eased * value));
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [active, value]);
  return <>{count}</>;
}
