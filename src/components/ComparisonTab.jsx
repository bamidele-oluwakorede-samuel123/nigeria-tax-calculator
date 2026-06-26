/**
 * ComparisonTab.jsx — Sole Trader vs Limited Company comparison
 *
 * This tab helps a business owner decide which legal structure
 * minimises their tax burden for a given profit level.
 *
 * Key concept used here: "conditional rendering"
 * React can show or hide elements based on state.
 * We use a simple ternary (condition ? showThis : showThat)
 * and short-circuit evaluation (condition && showThis) throughout.
 *
 * Props: none — this tab manages its own form state internally
 */

import { useState } from "react";
import { calcComparison, formatNaira, formatPercent } from "../lib/taxCalculations";

export default function ComparisonTab() {
  // Local state for this tab's inputs
  const [profit, setProfit] = useState("");
  const [ownerSalary, setOwnerSalary] = useState("");
  const [result, setResult] = useState(null);

  const INPUT_STYLE = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    marginTop: "6px",
    color: "#111827",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  function handleCompare(e) {
    e.preventDefault();
    const profitNum = Number(profit);
    const salaryNum = Number(ownerSalary) || profitNum * 0.5; // Default: 50% of profit as salary
    setResult(calcComparison(profitNum, salaryNum));
  }

  /**
   * Renders a comparison column for one business structure.
   * Called twice — once for sole trader, once for company.
   *
   * @param {object} data - The structure data from calcComparison()
   * @param {boolean} isWinner - Whether this structure has the lower tax burden
   */
  function StructureColumn({ data, isWinner }) {
    return (
      <div
        style={{
          flex: 1,
          border: isWinner ? "2px solid #1d4ed8" : "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          position: "relative",
          background: isWinner ? "#eff6ff" : "#ffffff",
        }}
      >
        {/* "Lower tax" badge — only shows on the winning structure */}
        {isWinner && (
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1d4ed8",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "600",
              padding: "3px 12px",
              borderRadius: "20px",
              whiteSpace: "nowrap",
            }}
          >
            Lower tax
          </div>
        )}

        <h4
          style={{
            margin: "8px 0 16px",
            fontSize: "14px",
            fontWeight: "600",
            color: isWinner ? "#1d4ed8" : "#374151",
            textAlign: "center",
          }}
        >
          {data.structure}
        </h4>

        {/* Row helper — defined inside the function for access to data */}
        {[
          { label: "Annual profit", value: formatNaira(data.profit) },
          { label: "Business tax (CIT)", value: formatNaira(data.businessTax) },
          { label: "Income tax (PAYE)", value: formatNaira(data.incomeTax) },
          { label: "Total tax", value: formatNaira(data.totalTax), highlight: true },
          { label: "Take-home", value: formatNaira(data.takeHome), highlight: true },
          {
            label: "Effective rate",
            value: formatPercent(data.effectiveRate),
          },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "7px 0",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "2px" }}>
              {row.label}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: row.highlight ? "600" : "400",
                color: row.highlight ? (isWinner ? "#1d4ed8" : "#111827") : "#374151",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}

        <p
          style={{
            margin: "12px 0 0",
            fontSize: "12px",
            color: "#9ca3af",
            fontStyle: "italic",
          }}
        >
          {data.notes}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Explanation of what this tab does */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "10px",
          padding: "14px 16px",
          marginBottom: "24px",
        }}
      >
        <p style={{ margin: 0, fontSize: "13px", color: "#1e40af", lineHeight: "1.6" }}>
          <strong>How this works:</strong> A sole trader pays personal income tax (PAYE)
          on all profit. A registered company pays CIT on profit, then the owner pays
          PAYE only on the salary they draw from the company. Depending on your profit
          level, one structure can save significantly more tax than the other.
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={handleCompare}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "500",
            color: "#374151",
          }}
        >
          Annual net profit (₦)
        </label>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: "3px 0 6px" }}>
          Revenue minus allowable business expenses
        </p>
        <input
          style={INPUT_STYLE}
          type="number"
          placeholder="e.g. 12000000"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          min="0"
          required
        />

        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "500",
            color: "#374151",
            marginTop: "18px",
          }}
        >
          Owner's annual salary (₦) — for company comparison
        </label>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: "3px 0 6px" }}>
          The salary the business owner pays themselves. Leave blank to default to
          50% of profit.
        </p>
        <input
          style={INPUT_STYLE}
          type="number"
          placeholder="e.g. 6000000 (leave blank for 50% of profit)"
          value={ownerSalary}
          onChange={(e) => setOwnerSalary(e.target.value)}
          min="0"
        />

        <button
          type="submit"
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "13px",
            background: "#1d4ed8",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Compare structures →
        </button>
      </form>

      {/* Results — only shown after form is submitted */}
      {/*
        Conditional rendering with &&:
        If result is not null/undefined, React renders everything after &&.
        This is the React way of doing "if (result) { render this }".
      */}
      {result && (
        <div style={{ marginTop: "32px" }}>
          {/* Recommendation banner */}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderLeft: "4px solid #059669",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#065f46" }}>
              {result.recommendation}
            </p>
          </div>

          {/* Side-by-side comparison columns */}
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <StructureColumn
              data={result.soleTrader}
              isWinner={result.betterStructure === "Sole trader"}
            />
            <StructureColumn
              data={result.company}
              isWinner={result.betterStructure === "Limited company"}
            />
          </div>

          {/* Tax saving callout */}
          <div
            style={{
              marginTop: "20px",
              background: "#1d4ed8",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "14px", opacity: 0.85 }}>
              Potential tax saving
            </div>
            <div style={{ fontSize: "22px", fontWeight: "700" }}>
              {formatNaira(result.saving)}
            </div>
          </div>

          <button
            className="no-print"
            onClick={() => window.print()}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "11px",
              background: "transparent",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            Save as PDF / Print
          </button>
        </div>
      )}
    </div>
  );
}
