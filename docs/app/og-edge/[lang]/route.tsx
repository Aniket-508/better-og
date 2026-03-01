import { createOgHandler } from "better-og/edge";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const revalidate = false;

const getLocaleFromRequest = (request: Request): string | undefined => {
  const { pathname } = new URL(request.url);
  const [, routeName, locale] = pathname.split("/");

  if (routeName !== "og-edge") {
    return undefined;
  }

  return locale || undefined;
};

const handler = createOgHandler({
  component: (
    <div
      style={{
        alignItems: "stretch",
        background:
          "linear-gradient(140deg, rgb(14, 16, 42) 0%, rgb(29, 85, 122) 48%, rgb(68, 188, 155) 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        height: "100%",
        justifyContent: "space-between",
        padding: 64,
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
            fontSize: 28,
            letterSpacing: 3,
            opacity: 0.8,
            textTransform: "uppercase",
          }}
        >
          better-og edge
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Next Edge runtime with Takumi WASM
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          opacity: 0.92,
        }}
      >
        This route uses better-og/edge and passes the Next WASM module
        explicitly.
      </div>
    </div>
  ),
  fallbackFonts: true,
  localeFromRequest: getLocaleFromRequest,
});

export const GET = handler;
