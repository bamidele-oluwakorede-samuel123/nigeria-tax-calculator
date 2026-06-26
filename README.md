# Nigeria Business Tax Calculator

A production-ready React application that estimates Nigerian business taxes — CIT, VAT, WHT, and PAYE — based on current FIRS rates (Finance Act 2023).

Built as a portfolio project targeting consulting and advisory firms (KPMG, Deloitte, PwC, EY).

---

## What it does

**Tab 1 — Tax calculator**
- **CIT (Company Income Tax):** Determines company size (small/medium/large) and computes tax on taxable profit
- **VAT (Value Added Tax):** Calculates 7.5% VAT on VATable supplies
- **WHT (Withholding Tax):** Deducts WHT at source by transaction type per NRS schedule
- **PAYE:** Applies Nigeria's graduated income tax bands with Consolidated Relief Allowance

**Tab 2 — Sole trader vs company comparison**
- Compares the total tax burden of operating as a sole trader vs a registered limited company
- Recommends the more tax-efficient structure for a given profit level

---

## Tech stack

- **React 18** — UI library
- **Vite** — build tool and dev server
- **JavaScript (ES Modules)** — no TypeScript, no external libraries beyond React
- **CSS-in-JS (inline styles)** — scoped styles per component

---

## Project structure

```
src/
├── lib/
│   └── taxCalculations.js   ← All tax logic (pure functions)
├── components/
│   ├── BusinessForm.jsx     ← Controlled form with all inputs
│   ├── TaxBreakdown.jsx     ← Displays CIT/VAT/WHT/PAYE results
│   ├── ComparisonTab.jsx    ← Sole trader vs company tab
│   ├── SummaryCard.jsx      ← Reusable result card component
│   └── Disclaimer.jsx       ← Legal disclaimer
├── App.jsx                  ← Root component, tab navigation, state management
├── main.jsx                 ← React entry point
└── index.css                ← Global baseline styles
```

---

## Setup

**Requirements:** Node.js v18 or above

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

**Build for production:**
```bash
npm run build
```
The output goes to `/dist` — deploy this folder to Vercel or Netlify.

---

## Key concepts demonstrated

| Concept | Where it appears |
|---|---|
| Separation of concerns | Tax logic in `taxCalculations.js`, UI in components |
| Pure functions | Every function in `taxCalculations.js` |
| Controlled inputs | All form inputs in `BusinessForm.jsx` |
| Lifting state up | Results stored in `App.jsx`, passed to `TaxBreakdown.jsx` |
| Conditional rendering | Results only shown after calculation; tabs show different content |
| Array.map() for lists | WHT dropdown, PAYE band table, tab buttons |
| Component reusability | `SummaryCard` used for all four tax results |

---

## Tax rates reference

| Tax | Rate | Authority |
|---|---|---|
| CIT (large companies) | 30% | NRS / CITA |
| CIT (medium companies) | 20% | NRS / CITA |
| CIT (small companies) | 0% | Finance Act 2020 |
| VAT | 7.5% | NRS / Finance Act 2020 |
| WHT (most types) | 10% | NRS WHT schedule |
| WHT (construction, commission) | 5% | NRS WHT schedule |
| PAYE bands | 7%–24% (graduated) | PITA / Finance Act 2020 |

---

## Disclaimer

This tool provides estimates for educational and planning purposes only. It is not a substitute for professional tax advice. Consult a qualified tax professional for official filings. Rates are based on Finance Act 2023 provisions.

---

## Author

Built by [BAMIDELE OLUWAKOREDE SAMUEL] — frontend developer portfolio project.

**Live demo:** [your-vercel-url]  
**GitHub:** [your-github-url]
