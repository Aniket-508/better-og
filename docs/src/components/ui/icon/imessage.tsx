import type { SVGProps } from "react";

const IMessage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={250}
    height={250}
    viewBox="0 0 66.146 66.146"
    {...props}
  >
    <title>iMessage logo</title>
    <defs>
      <linearGradient id="a">
        <stop
          style={{
            stopColor: "#0cbd2a",
            stopOpacity: 1,
          }}
          offset={0}
        />
        <stop
          style={{
            stopColor: "#5bf675",
            stopOpacity: 1,
          }}
          offset={1}
        />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="b"
        x1={-25.273}
        y1={207.521}
        x2={-25.273}
        y2={152.998}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-1.065 3.796)scale(.9821)"
      />
    </defs>
    <g transform="translate(59.483 -145.846)">
      <rect
        ry={14.568}
        rx={14.568}
        y={145.846}
        x={-59.483}
        height={66.146}
        width={66.146}
        style={{
          fill: "url(#b)",
          fillOpacity: 1,
          opacity: 1,
          paintOrder: "markers stroke fill",
          stroke: "none",
          strokeDasharray: "none",
          strokeDashoffset: 0,
          strokeLinecap: "square",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeOpacity: 1,
          strokeWidth: 1.336_347_58,
        }}
      />
      <path
        d="M-26.41 157.296a24.278 20.222 0 0 0-24.278 20.222 24.278 20.222 0 0 0 11.794 17.316 27.365 20.222 0 0 1-4.245 5.942 23.857 20.222 0 0 0 9.86-3.874 24.278 20.222 0 0 0 6.869.838 24.278 20.222 0 0 0 24.278-20.222 24.278 20.222 0 0 0-24.278-20.222"
        style={{
          fill: "#fff",
          fillOpacity: 1,
          opacity: 1,
          paintOrder: "markers stroke fill",
          stroke: "none",
          strokeDasharray: "none",
          strokeDashoffset: 0,
          strokeLinecap: "square",
          strokeLinejoin: "miter",
          strokeMiterlimit: 4,
          strokeOpacity: 1,
          strokeWidth: 1.564_096_21,
        }}
      />
    </g>
  </svg>
);

export { IMessage };
