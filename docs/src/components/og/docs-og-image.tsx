import type { ReactNode } from "react";

import { LogoMark } from "@/components/logo";
import { SITE } from "@/constants/site";

interface DocsOgImageProps {
  title: ReactNode;
  description?: ReactNode;
  fontFamily?: string;
  descriptionFontFamily?: string;
  safeAreaBottom?: number;
}

const DocsOgImage = ({
  title,
  description,
  fontFamily,
  descriptionFontFamily,
  safeAreaBottom = 0,
}: DocsOgImageProps) => (
  <div
    style={{
      alignItems: "stretch",
      background:
        "linear-gradient(135deg, rgb(13, 25, 44) 0%, rgb(23, 58, 112) 52%, rgb(73, 147, 214) 100%)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily,
      height: "100%",
      justifyContent: "space-between",
      padding: 64,
      paddingBottom: 64 + safeAreaBottom,
      width: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginBottom: "40px",
          textWrap: "pretty",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "#a1a1aa",
            fontFamily: descriptionFontFamily,
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineClamp: 2,
            lineHeight: 1.4,
            maxWidth: "95%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </span>
      </div>
    </div>

    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: "20px",
      }}
    >
      <LogoMark width={36} height={36} />
      <span
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          opacity: 0.9,
        }}
      >
        {SITE.NAME}
      </span>
      <div style={{ flexGrow: 1 }} />
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: 2,
          height: 4,
          opacity: 0.9,
          width: 60,
        }}
      />
      <span
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.2em",
          opacity: 0.9,
          textTransform: "uppercase",
        }}
      >
        Documentation
      </span>
    </div>
  </div>
);

export default DocsOgImage;
