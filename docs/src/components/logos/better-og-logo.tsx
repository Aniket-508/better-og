import { forwardRef } from "react";
import type { SVGProps } from "react";

export const BetterOgLogo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="300"
      height="300"
      viewBox="0 0 300 300"
      {...props}
    >
      {/* O letter (ring) */}
      <path
        fillRule="evenodd"
        d="M 30 150 A 55 55 0 0 1 140 150 A 55 55 0 0 1 30 150 Z M 55 150 A 30 30 0 0 0 115 150 A 30 30 0 0 0 55 150 Z"
        fill="currentColor"
      />
      {/* G letter body (C-shape) */}
      <path
        d="M 260 182 A 55 55 0 1 0 260 118 L 240 133 A 30 30 0 1 1 240 167 Z"
        fill="currentColor"
      />
      {/* G letter bar */}
      <path d="M 212 142 L 262 142 L 262 158 L 212 158 Z" fill="currentColor" />
      {/* Star sparkle */}
      <path
        d="M 150 133 L 153 147 L 167 150 L 153 153 L 150 167 L 147 153 L 133 150 L 147 147 Z"
        fill="currentColor"
      />
    </svg>
  )
);
BetterOgLogo.displayName = "BetterOgLogo";
