import Image from "next/image";

const HomePage = () => (
  <main
    style={{
      display: "grid",
      gap: "1rem",
      margin: "0 auto",
      maxWidth: 960,
      padding: "4rem 1.5rem",
    }}
  >
    <h1 style={{ margin: 0 }}>better-og docs</h1>
    <p style={{ lineHeight: 1.6, margin: 0 }}>
      This app exposes both OG runtime modes: `/og/[lang]` uses `better-og/next`
      (Node runtime) and `/og-edge/[lang]` uses `better-og/edge` with
      `@takumi-rs/wasm/next` passed explicitly. The proxy rewrites both paths to
      add an `aspect_ratio` query string based on the caller&apos;s user agent.
    </p>
    <p style={{ lineHeight: 1.6, margin: 0 }}>
      Try loading <code>/og/en</code>, <code>/og-edge/en</code>,{" "}
      <code>/og/ja</code>, or <code>/og-edge/ar</code> directly to compare the
      Node and Edge handlers.
    </p>
    <Image
      alt="Sample OG card"
      height={630}
      src="/og/en"
      sizes="(max-width: 1008px) calc(100vw - 3rem), 960px"
      style={{
        border: "1px solid #d6d6d6",
        borderRadius: 16,
        display: "block",
        height: "auto",
        maxWidth: "100%",
        width: "100%",
      }}
      unoptimized
      width={1200}
    />
    <Image
      alt="Sample edge OG card"
      height={630}
      src="/og-edge/en"
      sizes="(max-width: 1008px) calc(100vw - 3rem), 960px"
      style={{
        border: "1px solid #d6d6d6",
        borderRadius: 16,
        display: "block",
        height: "auto",
        maxWidth: "100%",
        width: "100%",
      }}
      unoptimized
      width={1200}
    />
  </main>
);

export default HomePage;
