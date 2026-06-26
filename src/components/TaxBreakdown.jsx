/**
 * TaxBreakdown.jsx — displays the full tax calculation results
 *
 * This component receives the pre-calculated results and renders them.
 * It does NOT do any calculations — those all happen in taxCalculations.js.
 *
 * Pattern used here: "container and presentational" components.
 * - TaxBreakdown is the "container" — it organises the results data
 *   and passes the right pieces to SummaryCard (the presentational component).
 * - SummaryCard just renders whatever it receives.
 *
 * This separation makes each component simpler and easier to understand.
 *
 * Props:
 * @prop {object} results - { cit, vat, wht, paye } from taxCalculations.js functions
 */

import SummaryCard from "./SummaryCard";
import { formatNaira, formatPercent } from "../lib/taxCalculations";

export default function TaxBreakdown({ results }) {
  const { cit, vat, wht, paye } = results;

  /**
   * Total tax burden — the sum of all four taxes.
   * This gives the business a single headline number.
   */
  const totalTaxBurden = cit.tax + vat.vatCharged + wht.whtAmount + paye.totalTax;

  return (
    <div>
      <h3
        style={{
          margin: "0 0 20px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#111827",
        }}
      >
        Tax breakdown
      </h3>

      {/* ── CIT Card ──────────────────────────────────────────────── */}
      {/*
        We pass "rows" as an array of objects to SummaryCard.
        Each row has a label (left side) and a value (right side).
        bold: true highlights the most important figure in each card.
      */}
      <SummaryCard
        title="Company income tax (CIT)"
        accentColor="#1d4ed8"
        rows={[
          { label: "Company size", value: cit.category },
          { label: "CIT rate", value: formatPercent(cit.rate) },
          { label: "Annual turnover", value: formatNaira(cit.annualTurnover) },
          { label: "Allowable deductions", value: formatNaira(cit.allowableDeductions) },
          { label: "Taxable profit", value: formatNaira(cit.taxableProfit) },
          { label: "CIT payable", value: formatNaira(cit.tax), bold: true },
        ]}
        note={cit.description}
      />

      {/* ── VAT Card ──────────────────────────────────────────────── */}
      <SummaryCard
        title="Value added tax (VAT)"
        accentColor="#059669"
        rows={[
          { label: "VAT rate", value: formatPercent(vat.rate) },
          { label: "Pre-VAT amount", value: formatNaira(vat.vatableAmount) },
          { label: "VAT to remit to FIRS", value: formatNaira(vat.vatCharged), bold: true },
          { label: "Total charged to customer", value: formatNaira(vat.totalWithVAT) },
        ]}
        note="Registered businesses must file VAT returns monthly with FIRS."
      />

      {/* ── WHT Card ──────────────────────────────────────────────── */}
      <SummaryCard
        title="Withholding tax (WHT)"
        accentColor="#d97706"
        rows={[
          { label: "Transaction type", value: wht.transactionType },
          { label: "WHT rate", value: formatPercent(wht.rate) },
          { label: "Gross amount", value: formatNaira(wht.grossAmount) },
          { label: "WHT to deduct & remit", value: formatNaira(wht.whtAmount), bold: true },
          { label: "Net amount to vendor", value: formatNaira(wht.netPayable) },
        ]}
        note="Deduct WHT at source and remit to FIRS within 21 days of payment."
      />

      {/* ── PAYE Card ─────────────────────────────────────────────── */}
      <SummaryCard
        title="PAYE — employee income tax"
        accentColor="#7c3aed"
        rows={[
          { label: "Annual gross salary", value: formatNaira(paye.annualGrossSalary) },
          { label: "Consolidated relief (CRA)", value: formatNaira(paye.consolidatedRelief) },
          { label: "Taxable income", value: formatNaira(paye.taxableIncome) },
          { label: "Annual PAYE", value: formatNaira(paye.totalTax), bold: true },
          { label: "Monthly PAYE deduction", value: formatNaira(paye.monthlyTax), bold: true },
          {
            label: "Effective tax rate",
            value: formatPercent(paye.effectiveRate),
          },
        ]}
        note="PAYE must be remitted to the State Internal Revenue Service by the 10th of the following month."
      />

      {/* ── PAYE Band Breakdown Table ──────────────────────────────── */}
      {/*
        This table shows how the graduated bands were applied.
        It helps the user (and an interviewer!) see that you understand
        Nigeria's progressive tax system — not just a flat rate.
      */}
      {paye.bands.length > 0 && (
        <div
          style={{
            background: "#faf5ff",
            border: "1px solid #e5e7eb",
            borderLeft: "4px solid #7c3aed",
            borderRadius: "12px",
            padding: "18px 20px",
            marginBottom: "16px",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#7c3aed",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            PAYE — graduated band breakdown
          </h4>

          {/*
            Table — used for tabular data with clear rows and columns.
            width: 100% makes it fill its container.
            border-collapse: collapse removes double borders.
          */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #d8b4fe" }}>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#6b7280", fontWeight: "500" }}>
                  Taxable amount
                </th>
                <th style={{ textAlign: "center", padding: "6px 0", color: "#6b7280", fontWeight: "500" }}>
                  Rate
                </th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#6b7280", fontWeight: "500" }}>
                  Tax
                </th>
              </tr>
            </thead>
            <tbody>
              {/*
                .map() iterates over the bands array and returns a <tr> for each.
                "key" is required by React — it helps React efficiently update the list.
              */}
              {paye.bands.map((band, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "7px 0", color: "#111827" }}>
                    {formatNaira(band.taxableInBand)}
                  </td>
                  <td style={{ padding: "7px 0", textAlign: "center", color: "#6b7280" }}>
                    {formatPercent(band.rate)}
                  </td>
                  <td style={{ padding: "7px 0", textAlign: "right", fontWeight: "500", color: "#7c3aed" }}>
                    {formatNaira(band.taxInBand)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Total Tax Burden ──────────────────────────────────────── */}
      <div
        style={{
          background: "#1d4ed8",
          color: "#ffffff",
          borderRadius: "12px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>
            Combined tax liability
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6 }}>
            CIT + VAT + WHT + PAYE
          </div>
        </div>
        <div style={{ fontSize: "24px", fontWeight: "700" }}>
          {formatNaira(totalTaxBurden)}
        </div>
      </div>

      {/* Print button — uses window.print() which triggers browser's print dialog */}
      <button
        className="no-print"
        onClick={() => window.print()}
        style={{
          width: "100%",
          padding: "11px",
          background: "transparent",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          color: "#374151",
        }}
      >
        Save as PDF / Print
      </button>
    </div>
  );
}
