/**
 * Disclaimer.jsx — legal disclaimer shown at the bottom of the app
 *
 * Why include a disclaimer?
 * Tax calculators can influence financial decisions.
 * A disclaimer makes clear this tool is for estimation and education only —
 * not a substitute for professional tax advice.
 *
 * Including this shows maturity in your thinking as a developer.
 * In a KPMG interview, you can say: "I included a disclaimer because tax figures
 * affect real financial decisions, and I wanted to be clear about the tool's limitations."
 *
 * This is a "pure presentational" component — no props, no state, just JSX.
 */

export default function Disclaimer() {
  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        fontSize: "12px",
        color: "#6b7280",
        lineHeight: "1.7",
      }}
    >
      {/* Icon + title row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        {/* Warning icon rendered as a Unicode character — no image needed */}
        <span style={{ fontSize: "16px" }}>⚠️</span>
        <strong style={{ color: "#374151", fontSize: "13px" }}>
          Disclaimer — for estimation purposes only
        </strong>
      </div>

      <p style={{ margin: "0 0 8px" }}>
        This calculator provides estimates based on current FIRS (Federal Inland Revenue Service)
        tax rates and the provisions of the Finance Acts 2020–2023. It is intended for
        educational and preliminary planning purposes only.
      </p>

      <p style={{ margin: "0 0 8px" }}>
        Tax computations for official filings should be prepared or reviewed by a qualified
        tax professional or chartered accountant familiar with your specific business circumstances.
        Individual results may vary based on specific reliefs, exemptions, incentives, or
        State-level tax rules that this tool does not account for.
      </p>

      <p style={{ margin: "0 0 8px" }}>
        VAT-exempt supplies (basic food items, medical and pharmaceutical products, educational
        materials) are not factored into the VAT calculation above. PAYE rates are for federal
        purposes — State tax authorities may apply additional levies.
      </p>

      <p style={{ margin: 0 }}>
        Tax rates are subject to change. Verify current rates at{" "}
        {/* Opens in a new tab — target="_blank" with rel="noopener noreferrer" is the 
            secure way to open external links in a new tab */}
        <a
          href="https://www.nrs.gov.ng"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1d4ed8", textDecoration: "underline" }}
        >
          nrs.gov.ng
        </a>
        . Last updated: 2025.
      </p>
    </div>
  );
}
