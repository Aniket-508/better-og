import { Geist } from "next/font/google";
import type { ReactNode } from "react";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const RootLayout = (props: { children: ReactNode }) => (
  <html lang="en" className={geist.className}>
    <body>{props.children}</body>
  </html>
);

export default RootLayout;
