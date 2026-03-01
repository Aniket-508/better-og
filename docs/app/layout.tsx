import type { ReactNode } from "react";

const RootLayout = (props: { children: ReactNode }) => (
  <html lang="en">
    <body
      style={{
        fontFamily: "system-ui, sans-serif",
        margin: 0,
      }}
    >
      {props.children}
    </body>
  </html>
);

export default RootLayout;
