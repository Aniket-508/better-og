import { forwardRef } from "react";
import type { SVGProps } from "react";

export const BetterOgLogo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      fill="none"
      viewBox="0 0 256 160"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <mask id="og-star-cutout">
          <rect fill="white" height="160" width="256" />
          <polygon
            fill="black"
            points="64,40 72,60 88,56 84,72 104,80 84,88 88,104 72,100 64,120 56,100 40,104 44,88 24,80 44,72 40,56 56,60"
          />
        </mask>
      </defs>

      <g fill="currentColor" mask="url(#og-star-cutout)">
        <rect height="128" width="128" x="0" y="16" />
        <rect height="128" width="32" x="96" y="16" />
        <rect height="32" width="160" x="96" y="16" />
        <rect height="32" width="160" x="96" y="112" />
        <rect height="48" width="32" x="224" y="16" />
        <rect height="48" width="32" x="224" y="96" />
        <rect height="32" width="64" x="160" y="64" />
      </g>
    </svg>
  )
);

BetterOgLogo.displayName = "BetterOgLogo";
