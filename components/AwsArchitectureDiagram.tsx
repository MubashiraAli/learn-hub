"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AwsArchitectureDiagram({ className }: { className?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setStep(3), 1300),
      setTimeout(() => setStep(4), 1800),
      setTimeout(() => setStep(5), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        viewBox="0 0 800 520"
        className="w-full max-w-2xl"
        aria-label="AWS infrastructure hierarchy: Global Infrastructure contains Regions, each Region contains multiple Availability Zones, and Edge Locations exist worldwide"
        role="img"
      >
        <defs>
          <linearGradient id="regionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="azGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global label */}
        <text
          x="400"
          y="30"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="600"
          fill="#64748b"
          className={cn("transition-opacity duration-500", step >= 0 ? "opacity-100" : "opacity-0")}
        >
          AWS Global Infrastructure
        </text>

        {/* Region box */}
        <g
          className={cn(
            "transition-all duration-700",
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <rect x="120" y="50" width="560" height="240" rx="12" fill="none" stroke="url(#regionGrad)" strokeWidth="2.5" strokeDasharray="6 3" />
          <rect x="120" y="50" width="140" height="28" rx="6" fill="url(#regionGrad)" />
          <text x="190" y="69" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="600" fill="white">
            Region (us-east-1)
          </text>
          <text x="400" y="275" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#64748b">
            Geographically isolated area with multiple AZs
          </text>
        </g>

        {/* AZ boxes */}
        {[
          { x: 155, label: "AZ-A", delay: step >= 2 },
          { x: 335, label: "AZ-B", delay: step >= 2 },
          { x: 515, label: "AZ-C", delay: step >= 2 },
        ].map((az, i) => (
          <g
            key={az.label}
            className={cn(
              "transition-all duration-700",
              az.delay ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <rect x={az.x} y="90" width="140" height="150" rx="10" fill="url(#azGrad)" fillOpacity="0.1" stroke="url(#azGrad)" strokeWidth="1.5" />
            <rect x={az.x} y="90" width="140" height="26" rx="6" fill="url(#azGrad)" fillOpacity="0.9" />
            <text x={az.x + 70} y="108" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600" fill="white">
              {az.label}
            </text>
            {/* Server icons inside each AZ */}
            {[0, 1, 2].map((j) => (
              <g key={j}>
                <rect x={az.x + 25} y={128 + j * 32} width="90" height="22" rx="4" fill="#e0f2fe" fillOpacity="0.6" stroke="#0ea5e9" strokeWidth="1" />
                <circle cx={az.x + 38} cy={139 + j * 32} r="3" fill="#22c55e" />
                <rect x={az.x + 48} y={135 + j * 32} width="50" height="3" rx="1.5" fill="#0ea5e9" fillOpacity="0.5" />
                <rect x={az.x + 48} y={141 + j * 32} width="30" height="2" rx="1" fill="#0ea5e9" fillOpacity="0.3" />
              </g>
            ))}
            <text x={az.x + 70} y={230} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fill="#64748b">
              Independent data center
            </text>
          </g>
        ))}

        {/* Connection lines from Region to AZs */}
        <g
          className={cn(
            "transition-opacity duration-500",
            step >= 2 ? "opacity-40" : "opacity-0",
          )}
        >
          <line x1="400" y1="78" x2="225" y2="90" stroke="#3b82f6" strokeWidth="1" />
          <line x1="400" y1="78" x2="405" y2="90" stroke="#3b82f6" strokeWidth="1" />
          <line x1="400" y1="78" x2="585" y2="90" stroke="#3b82f6" strokeWidth="1" />
        </g>

        {/* Edge Locations section */}
        <g
          className={cn(
            "transition-all duration-700",
            step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <rect x="120" y="320" width="560" height="180" rx="12" fill="none" stroke="url(#edgeGrad)" strokeWidth="2" strokeDasharray="4 4" />
          <rect x="120" y="320" width="170" height="28" rx="6" fill="url(#edgeGrad)" />
          <text x="205" y="339" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="600" fill="white">
            Edge Locations (200+)
          </text>

          {/* Edge location dots */}
          {[
            { cx: 180, cy: 380 }, { cx: 260, cy: 395 }, { cx: 340, cy: 375 },
            { cx: 420, cy: 400 }, { cx: 500, cy: 385 }, { cx: 580, cy: 370 },
            { cx: 220, cy: 430 }, { cx: 380, cy: 445 }, { cx: 540, cy: 425 },
            { cx: 300, cy: 465 }, { cx: 460, cy: 470 }, { cx: 620, cy: 460 },
          ].map((dot, i) => (
            <g
              key={i}
              className="transition-opacity duration-300"
              style={{ transitionDelay: `${400 + i * 80}ms` }}
            >
              <circle cx={dot.cx} cy={dot.cy} r="6" fill="url(#edgeGrad)" fillOpacity="0.8" filter={step >= 5 ? "url(#glow)" : undefined} />
              <circle cx={dot.cx} cy={dot.cy} r="3" fill="white" fillOpacity="0.9" />
            </g>
          ))}

          <text x="400" y="500" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#64748b">
            CDN nodes that cache content closer to end users
          </text>
        </g>

        {/* Connection line Region → Edge */}
        <path
          d="M 400 290 C 400 310, 400 315, 400 320"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className={cn("transition-opacity duration-500", step >= 4 ? "opacity-50" : "opacity-0")}
        />
      </svg>
    </div>
  );
}
