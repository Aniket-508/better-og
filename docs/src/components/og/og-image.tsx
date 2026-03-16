import type { ReactNode } from "react";

import { LogoMark } from "@/components/logo";
import { SITE } from "@/constants/site";

interface OgImageProps {
  title: ReactNode;
  description?: ReactNode;
  category?: string;
  fontFamily?: string;
  descriptionFontFamily?: string;
  safeAreaBottom?: number;
}

const OgImage = ({
  title,
  description,
  category,
  fontFamily,
  descriptionFontFamily,
  safeAreaBottom = 0,
}: OgImageProps) => (
  <div
    style={{
      background: "#0a0a0a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily,
      height: "100%",
      position: "relative",
      width: "100%",
    }}
  >
    <div
      style={{
        background:
          "radial-gradient(circle at center, rgba(59, 130, 246, 0.12), transparent 70%)",
        bottom: -60,
        height: 500,
        position: "absolute",
        right: -60,
        width: 500,
      }}
    />

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "space-between",
        padding: 64,
        paddingBottom: 64 + safeAreaBottom,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </span>
        {description && (
          <span
            style={{
              color: "#71717a",
              fontFamily: descriptionFontFamily,
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineClamp: 2,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </span>
        )}
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <LogoMark width={32} height={32} />
        <span
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginLeft: 16,
          }}
        >
          {SITE.NAME}
        </span>
        <div style={{ flexGrow: 1 }} />
        {category && (
          <div
            style={{
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              color: "rgba(255,255,255,0.5)",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.06em",
              padding: "8px 24px",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default OgImage;
