import type { SVGProps } from "react";

export const LogoMark = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M0 0h3.2v16H0z" />
    <path d="M0 0h16v4H0zm0 12h16v4H0z" />
    <path d="M12.8 0H16v6h-3.2zm0 10H16v6h-3.2zM6.4 6h6.4v4H6.4z" />
  </svg>
);
