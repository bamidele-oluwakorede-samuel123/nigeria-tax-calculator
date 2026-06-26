/**
 * App.jsx — the root component that wires everything together
 *
 * This is the "brain" of the application.
 * It manages:
 *   1. Which tab is currently active (state)
 *   2. The tax calculation results (state)
 *   3. Calling the calculation functions when the form is submitted
 *   4. Deciding what to render based on state
 *
 * Component tree:
 *   App
 *   ├── Header (inline JSX)
 *   ├── Tab buttons (inline JSX)
 *   ├── BusinessForm      → tab 1: input form
 *   ├── TaxBreakdown      → tab 1: results (shown after calculation)
 *   ├── ComparisonTab     → tab 2: sole trader vs company
 *   └── Disclaimer        → always shown at the bottom
 *
 * State management pattern used: "lifting state up"
 * The calculation results are stored in App (the parent) because
 * both BusinessForm (needs to trigger calculations) and TaxBreakdown
 * (needs to display results) are siblings — they can't share state
 * directly. The parent holds the shared state and passes it down as props.
 */

import { useState } from "react";
import BusinessForm from "./components/BusinessForm";
import TaxBreakdown from "./components/TaxBreakdown";
import ComparisonTab from "./components/ComparisonTab";
import Disclaimer from "./components/Disclaimer";
import { calcCIT, calcVAT, calcWHT, calcPAYE } from "./lib/taxCalculations";

export default function App() {
  /**
   * activeTab — tracks which tab the user is on.
   * "calculator" = main tax calculator
   * "comparison" = sole trader vs company
   */
  const [activeTab, setActiveTab] = useState("calculator");

  /**
   * results — stores the output from all four tax functions.
   * Starts as null (no results yet).
   * Set to an object when the user submits the form.
   */
  const [results, setResults] = useState(null);

  /**
   * handleCalculate — called by BusinessForm when the user submits.
   * Receives the parsed form values, runs all four calculations,
   * and stores the results in state.
   *
   * Because setResults triggers a re-render, TaxBreakdown will
   * appear automatically once results is not null.
   */
  function handleCalculate(inputs) {
    setResults({
      cit: calcCIT(inputs.turnover, inputs.deductions),
      vat: calcVAT(inputs.vatableAmount),
      wht: calcWHT(inputs.whtType, inputs.whtAmount),
      paye: calcPAYE(inputs.employeeSalary),
    });

    // Smooth-scroll to results after a short delay
    // setTimeout gives React time to render the results first
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  // Tab configuration — defined as an array so adding a new tab is easy
  const TABS = [
    { id: "calculator", label: "Tax calculator" },
    { id: "comparison", label: "Sole trader vs company" },
  ];

  return (
    <div
      style={{
        maxWidth: "580px",
        margin: "0 auto",
        padding: "32px 20px 60px",
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={{ marginBottom: "32px" }}>
        {/* Eyebrow label — small text above the main heading */}
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "11px",
            fontWeight: "600",
            color: "#1d4ed8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Nigeria NRS · Nigeria Tax Act 2025
        </p>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            lineHeight: "1.2",
          }}
        >
          Business tax calculator
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.6",
          }}
        >
          CIT · VAT · WHT · PAYE — estimated instantly. No signup required.
        </p>
      </header>

      {/* ── Tab navigation ─────────────────────────────────────── */}
      {/*
        The tab bar is built from the TABS array above using .map().
        Each tab button compares its own id against activeTab state
        to know whether to show as "active" (selected) or not.
      */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "4px",
          background: "#f3f4f6",
          padding: "4px",
          borderRadius: "10px",
          marginBottom: "28px",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "9px 12px",
                border: "none",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "400",
                // Active tab gets white background to "lift" it
                background: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#111827" : "#6b7280",
                cursor: "pointer",
                // Smooth transition between active and inactive states
                transition: "all 0.15s",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ────────────────────────────────────────── */}
      {/*
        Conditional rendering — shows different content based on activeTab.
        Only one tab's content is in the DOM at a time.

        When the user switches to "comparison", the calculator tab unmounts.
        When they switch back, it remounts — this resets its internal state.
        (The results are preserved in App state though, so they reappear.)
      */}

      {activeTab === "calculator" && (
        <div>
          {/* Input form */}
          <BusinessForm onCalculate={handleCalculate} />

          {/* Results section — only renders when results state is not null */}
          {results && (
            <div id="results-section" style={{ marginTop: "40px" }}>
              {/* Visual divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                  Calculated results
                </span>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              </div>

              <TaxBreakdown results={results} />
            </div>
          )}
        </div>
      )}

      {activeTab === "comparison" && <ComparisonTab />}

      {/* Disclaimer always appears at the bottom regardless of active tab */}
      <Disclaimer />
    </div>
  );
}
