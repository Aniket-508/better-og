import type { SVGProps } from "react";

const Pnpm = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
    <rect width="78" height="78" x="175" y="0" fill="#f9ad00" rx="4" />
    <rect width="78" height="78" x="87" y="0" fill="#f9ad00" rx="4" />
    <rect width="78" height="78" x="0" y="0" fill="#f9ad00" rx="4" />
    <rect width="78" height="78" x="175" y="88" fill="#f9ad00" rx="4" />
    <rect width="78" height="78" x="87" y="88" fill="currentColor" rx="4" />
    <rect width="78" height="78" x="87" y="176" fill="currentColor" rx="4" />
    <rect width="78" height="78" x="175" y="176" fill="currentColor" rx="4" />
    <rect width="78" height="78" x="0" y="176" fill="currentColor" rx="4" />
  </svg>
);

export { Pnpm };
