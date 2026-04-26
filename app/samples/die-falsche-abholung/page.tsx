export default function DieFalscheAbholungSamplePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 5vw, 64px) 20px",
        background:
          "radial-gradient(circle at top, rgba(85, 80, 67, 0.18), transparent 28%), radial-gradient(circle at 20% 30%, rgba(91, 102, 123, 0.13), transparent 30%), linear-gradient(180deg, #090a0d 0%, #060608 48%, #020203 100%)",
        color: "#f2efe8",
        fontFamily:
          '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif'
      }}
    >
      <section
        style={{
          width: "min(100%, 920px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.72fr) minmax(0, 1fr)",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background:
            "linear-gradient(180deg, rgba(18, 18, 23, 0.94), rgba(8, 8, 11, 0.98))",
          boxShadow: "0 24px 90px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "420px",
            background:
              "linear-gradient(180deg, rgba(26, 26, 31, 0.9), rgba(12, 12, 15, 0.98))"
          }}
        >
          <img
            src="/images/die_falsche_abholung.png"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "saturate(0.88) contrast(1.05) brightness(0.72)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.16) 46%, rgba(0, 0, 0, 0.78) 100%)"
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "20px",
              top: "20px",
              padding: "8px 11px",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              background: "rgba(10, 10, 14, 0.74)",
              color: "#fff6ed",
              fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase"
            }}
          >
            Leseprobe
          </span>
        </div>

        <div
          style={{
            display: "grid",
            alignContent: "center",
            padding: "clamp(32px, 5vw, 58px)",
            textAlign: "left"
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(242, 239, 232, 0.48)",
              fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase"
            }}
          >
            EMBER Buchprobe
          </p>
          <h1
            style={{
              margin: "18px 0 0",
              color: "#f2efe8",
              fontFamily: '"Didot", "Bodoni 72", "Iowan Old Style", "Times New Roman", serif',
              fontSize: "clamp(42px, 7vw, 76px)",
              fontWeight: 400,
              lineHeight: 0.94,
              letterSpacing: "0.04em"
            }}
          >
            Die falsche Abholung
          </h1>
          <div
            style={{
              marginTop: "30px",
              padding: "22px 0",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#c7b18b",
                fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
                fontSize: "clamp(18px, 3vw, 28px)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                lineHeight: 1.25,
                textTransform: "uppercase"
              }}
            >
              REGIE WIRD BEARBEITET
            </p>
          </div>
          <p
            style={{
              maxWidth: "34rem",
              margin: "24px 0 0",
              color: "rgba(242, 239, 232, 0.76)",
              fontSize: "18px",
              lineHeight: 1.55
            }}
          >
            Die Leseprobe wird gerade neu ausgerichtet und ist vorübergehend
            nicht verfügbar.
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              marginTop: "34px",
              minHeight: "48px",
              padding: "0 22px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "linear-gradient(180deg, #f1e6d5, #d7bb95)",
              color: "#17120e",
              fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textDecoration: "none"
            }}
          >
            Zur Storefront
          </a>
        </div>
      </section>
    </main>
  )
}
