/**
 * taxCalculations.js — the core tax logic
 *
 * This is the most important file in the project.
 * It contains PURE FUNCTIONS — functions that take inputs and return outputs
 * with no side effects (they don't modify anything outside themselves).
 *
 * Why keep this separate from the UI components?
 * → You can test each function individually (type it in the browser console)
 * → If tax rates change, you only update this one file — not every component
 * → It makes the codebase easier to explain in an interview ("separation of concerns")
 *
 * All monetary values are in Nigerian Naira (NGN).
 * Rates are sourced from FIRS (Federal Inland Revenue Service) — Finance Act 2023.
 */


// ─────────────────────────────────────────────────────────────────────────────
// 1. CIT — Company Income Tax
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Calculates Company Income Tax (CIT) based on FIRS thresholds.
 *
 * How CIT works:
 * - FIRS categorises companies by annual turnover into three sizes.
 * - Small companies (under ₦25m) pay ZERO CIT — this incentivises SME growth.
 * - Medium companies (₦25m–₦100m) pay 20% of TAXABLE PROFIT (not turnover).
 * - Large companies (above ₦100m) pay 30% of taxable profit.
 *
 * Taxable profit = Turnover minus allowable deductions (business expenses,
 * depreciation, etc. that FIRS permits you to subtract before applying the rate).
 *
 * @param {number} annualTurnover - Total revenue for the year
 * @param {number} allowableDeductions - Permitted business expenses
 * @returns {object} - Category, rate, taxable profit, and tax due
 */
export function calcCIT(annualTurnover, allowableDeductions = 0) {
  // Taxable profit cannot be negative — Math.max(0, ...) prevents that
  const taxableProfit = Math.max(0, annualTurnover - allowableDeductions);

  let rate = 0;
  let category = "Small";
  let description = "Exempt from CIT (turnover below ₦25 million)";

  if (annualTurnover >= 100_000_000) {
    rate = 0.3;
    category = "Large";
    description = "Turnover above ₦100 million — 30% CIT rate applies";
  } else if (annualTurnover >= 25_000_000) {
    rate = 0.2;
    category = "Medium";
    description = "Turnover ₦25m–₦100m — 20% CIT rate applies";
  }

  return {
    category,
    rate,
    description,
    annualTurnover,
    allowableDeductions,
    taxableProfit,
    // The actual tax owed
    tax: parseFloat((taxableProfit * rate).toFixed(2)),
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// 2. VAT — Value Added Tax
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Calculates VAT at the standard Nigerian rate of 7.5%.
 *
 * How VAT works:
 * - VAT is a consumption tax added to the price of goods and services.
 * - The standard rate in Nigeria is 7.5% (raised from 5% by the Finance Act 2020).
 * - Registered businesses collect VAT from customers and remit it to FIRS monthly.
 * - Some items are VAT-exempt (basic food, medical items, educational materials).
 *
 * This calculator covers the standard VATable supplies only.
 *
 * @param {number} vatableAmount - The pre-VAT value of goods/services sold
 * @returns {object} - VAT charged and total price including VAT
 */
export function calcVAT(vatableAmount) {
  const rate = 0.075; // 7.5% — Finance Act 2020

  return {
    rate,
    vatableAmount: parseFloat(vatableAmount.toFixed(2)),
    // VAT the business must remit to FIRS
    vatCharged: parseFloat((vatableAmount * rate).toFixed(2)),
    // What the customer pays in total
    totalWithVAT: parseFloat((vatableAmount * (1 + rate)).toFixed(2)),
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. WHT — Withholding Tax
// ─────────────────────────────────────────────────────────────────────────────
/**
 * WHT rates by transaction type — FIRS schedule.
 *
 * WHT is a mechanism for collecting tax at source.
 * When you pay a vendor/contractor, you deduct WHT from the payment
 * and remit it to FIRS on their behalf. The vendor gets a tax credit for it.
 *
 * Rates vary by transaction type as defined by the FIRS WHT schedule.
 */
export const WHT_RATES = {
  "Rent (individuals)":            0.10,
  "Rent (companies)":              0.10,
  "Dividend":                      0.10,
  "Interest on loans":             0.10,
  "Royalties":                     0.10,
  "Professional / consultancy fees": 0.10,
  "Management fees":               0.10,
  "Director fees":                 0.10,
  "Construction contracts":        0.05,
  "Commission / brokerage":        0.05,
  "Technical / engineering fees":  0.05,
};

/**
 * Calculates WHT to deduct from a payment.
 *
 * @param {string} transactionType - Must be a key from WHT_RATES above
 * @param {number} grossAmount - Full amount before WHT deduction
 * @returns {object} - Rate, WHT deducted, and net amount payable to vendor
 */
export function calcWHT(transactionType, grossAmount) {
  // Default to 5% if an unknown transaction type is passed
  const rate = WHT_RATES[transactionType] ?? 0.05;

  return {
    transactionType,
    rate,
    grossAmount: parseFloat(grossAmount.toFixed(2)),
    // Amount deducted and remitted to FIRS
    whtAmount: parseFloat((grossAmount * rate).toFixed(2)),
    // What actually gets paid to the vendor
    netPayable: parseFloat((grossAmount * (1 - rate)).toFixed(2)),
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. PAYE — Pay As You Earn (Employee Income Tax)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Nigeria's PAYE tax bands — graduated rates from Finance Act 2020.
 *
 * Nigeria uses a GRADUATED system: each portion of income is taxed at
 * a different rate. Only the portion within each band is taxed at that rate.
 * This is the same principle as UK Income Tax or US Federal Tax.
 *
 * Example: ₦1.2m taxable income
 * → First ₦300k taxed at 7% = ₦21,000
 * → Next ₦300k taxed at 11% = ₦33,000
 * → Remaining ₦600k taxed at 15% = ₦90,000
 * → Total = ₦144,000
 */
const PAYE_BANDS = [
  { limit: 300_000,   rate: 0.07 },  // First ₦300k — 7%
  { limit: 300_000,   rate: 0.11 },  // Next ₦300k — 11%
  { limit: 500_000,   rate: 0.15 },  // Next ₦500k — 15%
  { limit: 500_000,   rate: 0.19 },  // Next ₦500k — 19%
  { limit: 1_600_000, rate: 0.21 },  // Next ₦1.6m — 21%
  { limit: Infinity,  rate: 0.24 },  // Balance above — 24%
];

/**
 * Calculates PAYE for a single employee's annual gross salary.
 *
 * The key concept is the Consolidated Relief Allowance (CRA):
 * Before applying the graduated bands, Nigeria law allows you to deduct
 * a relief — which reduces the taxable income significantly.
 *
 * CRA formula (whichever is higher):
 *   ₦200,000 flat  OR  1% of gross salary
 *   PLUS 20% of gross salary
 *
 * @param {number} annualGrossSalary - Employee's total annual salary before deductions
 * @returns {object} - Full PAYE breakdown including monthly deduction
 */
export function calcPAYE(annualGrossSalary) {
  // Step 1: Calculate Consolidated Relief Allowance (CRA)
  const flatRelief = Math.max(200_000, annualGrossSalary * 0.01);
  const percentageRelief = annualGrossSalary * 0.20;
  const consolidatedRelief = flatRelief + percentageRelief;

  // Step 2: Taxable income = gross minus CRA
  // Cannot be negative — if salary is very low, taxable income = 0
  const taxableIncome = Math.max(0, annualGrossSalary - consolidatedRelief);

  // Step 3: Apply graduated bands to taxable income
  let remaining = taxableIncome;
  let totalTax = 0;
  const bands = [];

  for (const band of PAYE_BANDS) {
    if (remaining <= 0) break;

    // Only tax up to the band limit — or whatever remains if less
    const taxableInBand = Math.min(remaining, band.limit);
    const taxInBand = taxableInBand * band.rate;

    bands.push({
      taxableInBand: parseFloat(taxableInBand.toFixed(2)),
      rate: band.rate,
      taxInBand: parseFloat(taxInBand.toFixed(2)),
    });

    totalTax += taxInBand;
    remaining -= taxableInBand;
  }

  // Step 4: Effective rate = total tax / taxable income (not gross)
  const effectiveRate = taxableIncome > 0 ? totalTax / taxableIncome : 0;

  return {
    annualGrossSalary,
    consolidatedRelief: parseFloat(consolidatedRelief.toFixed(2)),
    taxableIncome: parseFloat(taxableIncome.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    // What gets deducted from each monthly payslip
    monthlyTax: parseFloat((totalTax / 12).toFixed(2)),
    effectiveRate: parseFloat(effectiveRate.toFixed(4)),
    // The band-by-band breakdown (useful for showing in a table)
    bands,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. Sole Trader vs Company Comparison
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Compares the tax burden of operating as a sole trader vs a registered company.
 *
 * Why this matters:
 * Many Nigerian entrepreneurs don't realise that the legal structure of their
 * business significantly affects how much tax they pay. This comparison helps
 * them make an informed decision.
 *
 * Sole trader: pays PAYE on the entire profit (treated as personal income)
 * Company: pays CIT on profit, then owner pays PAYE on salary drawn from company
 *
 * @param {number} annualProfit - Net profit (revenue minus expenses)
 * @param {number} ownerSalary - Salary the owner pays themselves (companies only)
 * @returns {object} - Side-by-side breakdown for both structures
 */
export function calcComparison(annualProfit, ownerSalary) {
  // --- SOLE TRADER ---
  // Profit is treated as personal income — PAYE applies to the whole amount
  const soleTraderPAYE = calcPAYE(annualProfit);

  const soleTrader = {
    structure: "Sole trader",
    profit: annualProfit,
    // No CIT for sole traders — they pay personal income tax instead
    businessTax: 0,
    // The entire profit is personal income — PAYE applies
    incomeTax: soleTraderPAYE.totalTax,
    totalTax: parseFloat(soleTraderPAYE.totalTax.toFixed(2)),
    takeHome: parseFloat((annualProfit - soleTraderPAYE.totalTax).toFixed(2)),
    effectiveRate: parseFloat((soleTraderPAYE.totalTax / annualProfit).toFixed(4)),
    notes: "Simple structure. All profit taxed as personal income via PAYE.",
  };

  // --- REGISTERED COMPANY ---
  // The company pays CIT on profit, then the owner draws a salary (on which PAYE applies)
  const companyCIT = calcCIT(annualProfit, ownerSalary); // Salary is a deductible expense
  const ownerPAYE = calcPAYE(ownerSalary);

  const totalCompanyTax = companyCIT.tax + ownerPAYE.totalTax;

  const company = {
    structure: "Limited company",
    profit: annualProfit,
    businessTax: parseFloat(companyCIT.tax.toFixed(2)),
    incomeTax: parseFloat(ownerPAYE.totalTax.toFixed(2)),
    totalTax: parseFloat(totalCompanyTax.toFixed(2)),
    takeHome: parseFloat((annualProfit - totalCompanyTax).toFixed(2)),
    effectiveRate: parseFloat((totalCompanyTax / annualProfit).toFixed(4)),
    citCategory: companyCIT.category,
    notes: "Salary is deducted before CIT. Owner pays PAYE only on drawn salary.",
  };

  // Which structure saves more tax?
  const saving = Math.abs(soleTrader.totalTax - company.totalTax);
  const betterStructure =
    soleTrader.totalTax <= company.totalTax ? "Sole trader" : "Limited company";

  return {
    soleTrader,
    company,
    saving: parseFloat(saving.toFixed(2)),
    betterStructure,
    recommendation:
      `${betterStructure} saves ${formatNaira(saving)} in tax at this profit level.`,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. Utility helpers
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Formats a number as Nigerian Naira currency.
 * Uses the built-in Intl.NumberFormat API — no library needed.
 *
 * Example: formatNaira(1500000) → "₦1,500,000.00"
 */
export function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a decimal as a percentage string.
 * Example: formatPercent(0.075) → "7.5%"
 */
export function formatPercent(decimal) {
  return `${(decimal * 100).toFixed(1)}%`;
}
