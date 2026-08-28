export const mockSchemes = [
  {
    id: "epf_edli",
    title: "Employees' Provident Fund (EPF) & EDLI",
    category: "insurance",
    priority: "Apply Immediately",
    description: "If the deceased was a salaried employee in the private sector, the family is entitled to PF withdrawal, EDLI life insurance (up to ₹7 Lakh), and a monthly widow/orphan pension.",
    eligibility: [
      "Deceased was a private-sector salaried employee.",
      "Had an active PF (UAN) account."
    ],
    documents: [
      "Death Certificate",
      "Aadhaar Card of Deceased and Nominee",
      "Bank Account Details of Nominee (Cancelled Cheque)",
      "Form 20, 10D, and 5IF (EPFO forms)"
    ],
    steps: [
      "Contact the deceased's last employer to inform them.",
      "Submit the death certificate and fill out PF claim forms.",
      "The employer will attest and forward the forms to the local EPFO office."
    ],
    matchCriteria: (data) => data.supportType === "death" && data.employmentType === "private_salaried" && data.hadEPF === "yes"
  },
  {
    id: "pmjjby",
    title: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    category: "insurance",
    priority: "Apply Immediately",
    description: "A government-backed life insurance scheme that provides ₹2 Lakh to the nominee upon the death of the insured for any reason.",
    eligibility: [
      "Deceased had a bank account and this scheme was active (auto-debited ₹436/year)."
    ],
    documents: [
      "Death Certificate",
      "Bank Passbook of Deceased showing PMJJBY premium deduction",
      "Aadhaar & PAN of Nominee",
      "Claim Form and Discharge Receipt"
    ],
    steps: [
      "Visit the bank branch where the deceased held an account.",
      "Check if PMJJBY premium was deducted in the last year.",
      "Submit the claim form along with the death certificate within 30 days."
    ],
    matchCriteria: (data) => data.supportType === "death" && data.hadBankAccount === "yes"
  },
  {
    id: "pmsby",
    title: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    category: "accident_compensation",
    priority: "Important",
    description: "If the death occurred due to an accident, this bank-linked insurance provides ₹2 Lakh to the nominee.",
    eligibility: [
      "Death was due to an accident.",
      "Deceased had an active bank account with ₹20/year auto-deduction."
    ],
    documents: [
      "Death Certificate",
      "FIR / Police Panchnama",
      "Post-mortem Report",
      "Bank Passbook"
    ],
    steps: [
      "File an FIR immediately if it was an unnatural or accidental death.",
      "Visit the bank branch to submit the accidental death claim."
    ],
    matchCriteria: (data) => data.supportType === "death" && data.causeOfDeath === "accident" && data.hadBankAccount === "yes"
  },
  {
    id: "widow_pension",
    title: "National Family Benefit Scheme & Widow Pension",
    category: "financial_assistance",
    priority: "Important",
    description: "State and Central government scheme offering monthly pension to widows and a one-time lump sum (NFBS) for families below the poverty line upon the death of the primary earner.",
    eligibility: [
      "Family falls under Below Poverty Line (BPL) / Low Income category.",
      "Deceased was the primary breadwinner aged between 18 and 59."
    ],
    documents: [
      "Death Certificate",
      "Income Certificate / BPL Ration Card",
      "Age Proof of Deceased",
      "Bank Account of Widow/Dependent"
    ],
    steps: [
      "Visit the local Tehsildar, Gram Panchayat, or municipal office.",
      "Apply for the National Family Benefit Scheme (one-time grant).",
      "Apply for the Widow Pension scheme (monthly)."
    ],
    matchCriteria: (data) => data.supportType === "death" && (data.incomeLevel === "low" || data.incomeLevel === "bpl")
  },
  {
    id: "motor_tribunal",
    title: "Motor Accident Claims Tribunal (MACT)",
    category: "accident_compensation",
    priority: "Apply Immediately",
    description: "If the deceased passed away in a road traffic accident involving a vehicle, the family can file a claim for substantial compensation against the vehicle owner/insurer.",
    eligibility: [
      "Death occurred in a road traffic accident."
    ],
    documents: [
      "FIR, Panchnama, and Charge Sheet",
      "Post-mortem Report",
      "Death Certificate",
      "Proof of Age and Income of Deceased"
    ],
    steps: [
      "Ensure an FIR is registered against the offending vehicle.",
      "Engage an advocate specialized in MACT cases.",
      "File the claim petition in the MACT court having jurisdiction."
    ],
    matchCriteria: (data) => data.supportType === "death" && data.accidentType === "road"
  },
  {
    id: "esic",
    title: "ESIC Dependent Benefit",
    category: "financial_assistance",
    priority: "Apply Immediately",
    description: "If the deceased died due to an employment injury or occupational hazard while covered under ESIC, dependents receive a monthly pension (90% of wages).",
    eligibility: [
      "Deceased was a private-sector employee covered under ESIC.",
      "Death occurred due to work-related injury."
    ],
    documents: [
      "Death Certificate",
      "ESIC Pehchan Card / E-Sik card",
      "Accident Report from Employer",
      "Form 15 (Claim for Dependent Benefit)"
    ],
    steps: [
      "Employer must report the accident immediately.",
      "Submit claim forms to the local ESIC branch office."
    ],
    matchCriteria: (data) => data.supportType === "death" && data.employmentType === "private_salaried" && data.accidentType === "workplace"
  },
  {
    id: "pmmvy",
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "maternity_benefit",
    priority: "Apply Immediately",
    description: "A maternity benefit program providing ₹5,000 in three installments to pregnant women and lactating mothers for their first living child.",
    eligibility: [
      "Pregnant women and lactating mothers.",
      "Applicable for the first living child.",
      "Not applicable for regular government employees."
    ],
    documents: [
      "Aadhaar Card",
      "Bank Account Details",
      "Mother and Child Protection (MCP) Card"
    ],
    steps: [
      "Register pregnancy at an Anganwadi Centre (AWC) or approved health facility within 150 days of LMP.",
      "Submit Form 1-A with required documents."
    ],
    matchCriteria: (data) => data.supportType === "pregnancy"
  },
  {
    id: "jsy",
    title: "Janani Suraksha Yojana (JSy)",
    category: "maternity_benefit",
    priority: "Important",
    description: "A safe motherhood intervention under the National Health Mission to reduce maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
    eligibility: [
      "Pregnant women belonging to BPL households.",
      "Delivering in a government or accredited private health facility."
    ],
    documents: [
      "BPL Card",
      "Aadhaar Card",
      "Bank Passbook",
      "JAP (Janani Suraksha Yojana) Card / MCP Card"
    ],
    steps: [
      "Register with the local ASHA worker.",
      "Ensure delivery takes place in a government hospital or accredited private facility."
    ],
    matchCriteria: (data) => data.supportType === "pregnancy" && (data.incomeLevel === "bpl" || data.incomeLevel === "low")
  }
];
