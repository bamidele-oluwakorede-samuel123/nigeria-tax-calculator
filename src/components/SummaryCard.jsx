/**
 * SummaryCard.jsx — a single tax result card
 *
 * This is a "presentational component" — it only displays data,
 * it doesn't calculate anything or manage any state.
 *
 * It receives data via "props" (properties passed from the parent component)
 * and renders it inside a styled card.
 *
 * Props:
 * @prop {string} title       - The tax name e.g. "Company Income Tax (CIT)"
 * @prop {string} accentColor - Left border colour to visually distinguish each tax
 * @prop {Array}  rows        - Array of { label, value, bold } for table rows
 * @prop {string} [note]      - Optional small note shown at the bottom of the card
 */

export default function SummaryCard({ title, accentColor, rows, note }) {
  return (
    <div
      style={{
        // Card container — white background, subtle border, rounded corners
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: "12px",
        padding: "18px 20px",
        marginBottom: "16px",
      }}
    >
      {/* Card title */}
      <h4
        style={{
          margin: "0 0 14px",
          fontSize: "12px",
          fontWeight: "600",
          color: accentColor,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {title}
      </h4>

      {/* Rows of label / value pairs */}
      {rows.map((row, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // Only add border between rows, not after the last one
            borderBottom: index < rows.length - 1 ? "1px solid #f3f4f6" : "none",
            padding: "8px 0",
            fontSize: "14px",
          }}
        >
          <span style={{ color: "#6b7280" }}>{row.label}</span>
          <span
            style={{
              fontWeight: row.bold ? "600" : "400",
              color: row.bold ? accentColor : "#111827",
            }}
          >
            {row.value}
          </span>
        </div>
      ))}

      {/* Optional note at the bottom */}
      {note && (
        <p
          style={{
            margin: "12px 0 0",
            fontSize: "12px",
            color: "#9ca3af",
            fontStyle: "italic",
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
