import type { SVGProps } from "react";

const Bun = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" {...props}>
    <path
      fill="#fbf0df"
      d="M71.1 34.3c0-12-12.1-22.6-28.1-25.4C41.4 5.2 38.2 2 34.3 2c-3.3 0-6 2.2-7 5.3C11.5 10.4 0 20.4 0 32.6c0 2.3.4 4.5 1.1 6.6C.4 41.4 0 43.7 0 46c0 17.7 17.9 32 40 32s40-14.3 40-32c0-4.4-1.1-8.6-3.1-12.3-.3-1.1-.5-2.2-.5-3.3z"
    />
    <ellipse
      cx="40"
      cy="46"
      fill="#fbf0df"
      stroke="#000"
      strokeWidth="3.5"
      rx="38"
      ry="30"
    />
    <path
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeWidth="3"
      d="M20.5 52c3 5 10.5 10 19.5 10s16.5-5 19.5-10"
    />
    <ellipse cx="28" cy="42" fill="#000" rx="4" ry="5" />
    <ellipse cx="52" cy="42" fill="#000" rx="4" ry="5" />
    <ellipse cx="29" cy="40.5" fill="#fff" rx="1.5" ry="2" />
    <ellipse cx="53" cy="40.5" fill="#fff" rx="1.5" ry="2" />
    <path
      fill="#ccbe9d"
      d="M19.5 32c-2-4-1-10 3-14 2-2 5-3 8-2M60.5 32c2-4 1-10-3-14-2-2-5-3-8-2M44 24c0-5-2-12-4-16M36 24c0-5 2-12 4-16"
    />
  </svg>
);

export { Bun };
