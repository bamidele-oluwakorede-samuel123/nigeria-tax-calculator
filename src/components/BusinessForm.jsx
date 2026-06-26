/**
 * BusinessForm.jsx — the user input form
 *
 * This component manages all the form inputs using React's useState hook.
 *
 * Key concept — "controlled inputs":
 * In React, form inputs are "controlled" — meaning React state is the single
 * source of truth for what's in the input. Every keystroke updates the state,
 * and the state drives what's displayed in the input.
 *
 * This is different from plain HTML where the DOM holds the value.
 * Controlled inputs let you validate, format, or react to input in real time.
 *
 * Props:
 * @prop {function} onCalculate - Called when the form is submitted.
 *                                Receives the parsed form values as an object.
 */

import { useState } from "react";
import { WHT_RATES } from "../lib/taxCalculations";

// Reusable styles — defined once, reused across all inputs
// This avoids repeating the same style object for every input element
const INPUT_STYLE = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#111827",
  background: "#ffffff",
  marginTop: "6px",
  outline: "none",
  transition: "border-color 0.15s",
};

const LABEL_STYLE = {
  display: "block",
  fontSize: "13px",
  fontWeight: "500",
  color: "#374151",
  marginTop: "18px",
};

const HINT_STYLE = {
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "3px",
};

export default function BusinessForm({ onCalculate }) {
  /**
   * useState — React's way of storing data that can change.
   * When state changes, React re-renders the component automatically.
   *
   * Here we store all form values in a single "form" state object.
   * This is called the "single state object" pattern — cleaner than
   * having one useState for every input.
   */
  const [form, setForm] = useState({
    turnover: "",
    deductions: "",
    vatableAmount: "",
    whtType: Object.keys(WHT_RATES)[0], // Default to first WHT type
    whtAmount: "",
    employeeSalary: "",
  });

  /**
   * Generic change handler — works for all inputs.
   *
   * e.target.name matches the "name" attribute on the input element.
   * e.target.value is what the user typed.
   *
   * The spread operator (...form) copies all existing form values,
   * then we overwrite only the one that changed.
   * This prevents losing the other fields when one changes.
   */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /**
   * Form submit handler.
   *
   * e.preventDefault() stops the browser from refreshing the page —
   * the default HTML form behaviour. In React SPAs, we handle
   * submission ourselves via JavaScript.
   *
   * Number() converts the string from the input into a number.
   * Inputs always return strings — even if the user types "5000000".
   */
  function handleSubmit(e) {
    e.preventDefault();
    onCalculate({
      turnover: Number(form.turnover),
      deductions: Number(form.deductions) || 0,
      vatableAmount: Number(form.vatableAmount) || 0,
      whtType: form.whtType,
      whtAmount: Number(form.whtAmount) || 0,
      employeeSalary: Number(form.employeeSalary) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* ── SECTION: Company Income Tax ──────────────────────────── */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#1d4ed8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          Company income tax (CIT)
        </div>

        <label style={LABEL_STYLE}>Annual turnover (₦)</label>
        <p style={HINT_STYLE}>Total revenue your business earned this year</p>
        <input
          style={INPUT_STYLE}
          type="number"
          name="turnover"
          placeholder="e.g. 50000000"
          value={form.turnover}
          onChange={handleChange}
          min="0"
          required
        />

        <label style={LABEL_STYLE}>Allowable deductions (₦)</label>
        <p style={HINT_STYLE}>
          Business expenses FIRS permits you to deduct (salaries, rent, depreciation)
        </p>
        <input
          style={INPUT_STYLE}
          type="number"
          name="deductions"
          placeholder="e.g. 10000000"
          value={form.deductions}
          onChange={handleChange}
          min="0"
        />
      </div>

      {/* ── SECTION: VAT ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#059669",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          Value added tax (VAT)
        </div>

        <label style={LABEL_STYLE}>VATable sales / supplies (₦)</label>
        <p style={HINT_STYLE}>
          Value of goods or services sold that are subject to 7.5% VAT
        </p>
        <input
          style={INPUT_STYLE}
          type="number"
          name="vatableAmount"
          placeholder="e.g. 20000000"
          value={form.vatableAmount}
          onChange={handleChange}
          min="0"
        />
      </div>

      {/* ── SECTION: WHT ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#d97706",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          Withholding tax (WHT)
        </div>

        <label style={LABEL_STYLE}>Transaction type</label>
        <p style={HINT_STYLE}>Select the nature of the payment being made</p>
        {/*
          The <select> element renders a dropdown.
          Its value is controlled by form.whtType in state.
          We map over WHT_RATES keys to generate the <option> elements dynamically —
          this means if we add a new rate to taxCalculations.js, it auto-appears here.
        */}
        <select
          style={INPUT_STYLE}
          name="whtType"
          value={form.whtType}
          onChange={handleChange}
        >
          {Object.keys(WHT_RATES).map((type) => (
            <option key={type} value={type}>
              {type} — {(WHT_RATES[type] * 100).toFixed(0)}%
            </option>
          ))}
        </select>

        <label style={LABEL_STYLE}>Gross transaction amount (₦)</label>
        <p style={HINT_STYLE}>Full amount before WHT deduction</p>
        <input
          style={INPUT_STYLE}
          type="number"
          name="whtAmount"
          placeholder="e.g. 5000000"
          value={form.whtAmount}
          onChange={handleChange}
          min="0"
        />
      </div>

      {/* ── SECTION: PAYE ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#7c3aed",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
            paddingBottom: "8px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          PAYE — employee income tax
        </div>

        <label style={LABEL_STYLE}>Employee annual gross salary (₦)</label>
        <p style={HINT_STYLE}>
          Total salary before any deductions. Used to calculate monthly PAYE.
        </p>
        <input
          style={INPUT_STYLE}
          type="number"
          name="employeeSalary"
          placeholder="e.g. 3600000"
          value={form.employeeSalary}
          onChange={handleChange}
          min="0"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "13px",
          background: "#1d4ed8",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseOver={(e) => (e.target.style.background = "#1e40af")}
        onMouseOut={(e) => (e.target.style.background = "#1d4ed8")}
      >
        Calculate taxes →
      </button>
    </form>
  );
}
