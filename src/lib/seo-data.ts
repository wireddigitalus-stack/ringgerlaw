export interface PracticeAreaPage {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  directAnswerSummary: string;
  statuteCitation: string;
  keyBenefits: string[];
  howItWorksSteps: {
    title: string;
    description: string;
  }[];
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface CountyLocationPage {
  slug: string;
  countyName: string;
  primaryCities: string[];
  zipCodes: string[];
  courtJurisdiction: string;
  courtAddress: string;
  drivingDistanceToOffice: string;
  metaTitle: string;
  metaDescription: string;
  directAnswerSummary: string;
  localEconomicContext: string;
  commonLocalIssues: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const FIRM_INFO = {
  name: "Ringger Law",
  legalName: "The Law Offices of Louis W. Ringger",
  attorney: "Louis W. Ringger Jr., Attorney at Law",
  founder: "Founded by Bill Ringger in 1981",
  yearsExperience: 45,
  phone: "731-421-1501",
  phoneFormatted: "(731) 421-1501",
  phoneHref: "tel:7314211501",
  email: "info@ringgerlaw.com",
  address: {
    street: "367 N. Parkway, Suite 1",
    city: "Jackson",
    state: "TN",
    zip: "38305",
    county: "Madison County",
    full: "367 N. Parkway, Suite 1, Jackson, TN 38305",
  },
  courtInfo: {
    name: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division)",
    address: "111 South Highland Avenue, Jackson, TN 38301",
  },
  louisPortraitUrl:
    "https://static.wixstatic.com/media/44d8da_50b497936b394f05978c2296d23a252d~mv2.png/v1/fill/w_600,h_800,al_c,q_90/LR%20edit.png",
  logoIconUrl:
    "https://static.wixstatic.com/media/44d8da_12006cbb9ad540a190391bb3b12d7015~mv2.png/v1/fill/w_192,h_192,lg_1/44d8da_12006cbb9ad540a190391bb3b12d7015~mv2.png",
  testimonials: [
    {
      quote:
        "Ringger Law helped us with our Bankruptcy. They made the process very simple and painless. I highly recommend them.",
      author: "Mary B.",
      location: "Jackson, TN (Madison County)",
      caseType: "Chapter 7 Debt Discharge",
      rating: 5,
    },
    {
      quote:
        "The friendly staff at Ringger Law exceeded my bankruptcy needs!! They are very professional, helpful and caring. I highly recommend The Law Office of Louis W. Ringger for all of your legal needs.",
      author: "Kathy D.",
      location: "Jackson, TN",
      caseType: "Chapter 13 Foreclosure Defense",
      rating: 5,
    },
    {
      quote: "One of the best and smartest lawyers in West TN.",
      author: "Saidi F.",
      location: "West Tennessee",
      caseType: "Personal Debt Relief",
      rating: 5,
    },
  ],
};

export const PRACTICE_AREAS: PracticeAreaPage[] = [
  {
    slug: "chapter-7-bankruptcy-jackson-tn",
    title: "Chapter 7 Bankruptcy in Jackson, TN",
    shortTitle: "Chapter 7 Bankruptcy",
    metaTitle: "Chapter 7 Bankruptcy Lawyer Jackson TN | $0 Down Debt Discharge | Ringger Law",
    metaDescription:
      "Eliminate credit card bills, medical debt, and payday loans in 90-120 days with Chapter 7 bankruptcy in Jackson, TN. Keep your home and car under Tennessee exemptions.",
    heroBadge: "Complete Unsecured Debt Elimination • $0 Money Down Available",
    heroHeadline: "Wipe Out Credit Card, Medical & Personal Loan Debt in 90–120 Days.",
    heroSubheadline:
      "Chapter 7 bankruptcy gives honest West Tennessee families a complete financial reset—while Tennessee property exemptions protect your home, car, and retirement.",
    directAnswerSummary:
      "Chapter 7 bankruptcy in Jackson, Tennessee (filed in the U.S. Bankruptcy Court for the Western District of Tennessee, Eastern Division) permanently discharges unsecured debts including credit cards, hospital bills, collection judgments, and payday loans within 3 to 4 months. Under Tennessee exemptions (Tenn. Code Ann. § 26-2-103 and § 26-2-301), over 98% of Ringger Law Chapter 7 clients keep all of their property, including their primary home and vehicles.",
    statuteCitation: "11 U.S.C. Chapter 7 & Tenn. Code Ann. §§ 26-2-101 et seq.",
    keyBenefits: [
      "100% permanent discharge of credit card balances, medical bills, and signature loans",
      "Immediate Automatic Stay (11 U.S.C. § 362) halts all collection calls, lawsuits, and wage garnishments",
      "Keep your home, car, household goods, and 401(k)/retirement under Tennessee bankruptcy exemptions",
      "Start with $0 Money Down consultation and fast electronic filing in Madison County & West TN",
    ],
    howItWorksSteps: [
      {
        title: "Free Chapter 7 Means Test Evaluation",
        description:
          "We compare your last 6 months of household income against the Tennessee Median Income thresholds (or deduct allowed living expenses) to confirm your Chapter 7 eligibility.",
      },
      {
        title: "Tennessee Exemption Asset Protection Audit",
        description:
          "Louis W. Ringger Jr. applies Tennessee's homestead exemption ($35,000–$52,500+) and $10,000 personal property wildcard exemption so you keep what is yours.",
      },
      {
        title: "Electronic Petition Filing & Automatic Stay",
        description:
          "The moment we file your petition with the Western District of Tennessee court, creditors are legally barred from calling you, suing you, or garnishing your wages.",
      },
      {
        title: "341 Meeting & Final Debt Discharge",
        description:
          "After a brief virtual/phone 341 meeting of creditors, the court issues your official discharge order in roughly 90 to 120 days—wiping your slate clean.",
      },
    ],
    comparisonTable: {
      headers: ["Debt Type", "Discharged in TN Chapter 7?", "What Happens Upon Filing"],
      rows: [
        ["Credit Card Balances & Late Fees", "Yes — 100% Eliminated", "Collection calls & interest stop immediately"],
        ["Hospital, ER & Medical Bills", "Yes — 100% Eliminated", "Medical lawsuits & billing notices halted"],
        ["Payday Loans & Cash Advances", "Yes — 100% Eliminated", "Stop predatory ACH bank withdrawals"],
        ["Civil Court Judgments & Garnishments", "Yes — 100% Eliminated", "Paycheck garnishments stop immediately"],
        ["Old Deficiency Balances (Repo/Foreclosure)", "Yes — 100% Eliminated", "Remaining balance wiped out in full"],
      ],
    },
    faqs: [
      {
        question: "Will I lose my house or car if I file Chapter 7 in Jackson, Tennessee?",
        answer:
          "In the vast majority of cases, no. Tennessee law provides strong Homestead Exemptions (up to $35,000 for individuals, $52,500 for joint filers, and higher for seniors or parents with minor dependents) plus a $10,000 personal property wildcard exemption per filer. As long as your equity is within legal exemptions and your loan payments are current, you keep your home and vehicle.",
      },
      {
        question: "What is the income limit for Chapter 7 bankruptcy in Tennessee?",
        answer:
          "Eligibility is based on the Tennessee Means Test, which compares your average gross income over the past 6 months to the median income for a Tennessee household of your size. Even if your income is above the median, deducting taxes, mortgage/car payments, childcare, and healthcare expenses often qualifies you for Chapter 7.",
      },
      {
        question: "How fast can Chapter 7 stop a wage garnishment in Madison County?",
        answer:
          "Immediately upon filing. Once Ringger Law electronically files your Chapter 7 case and notifies your payroll department and the General Sessions Court, the federal Automatic Stay prohibits another dime from being garnished.",
      },
    ],
  },
  {
    slug: "chapter-13-bankruptcy-jackson-tn",
    title: "Chapter 13 Bankruptcy in Jackson, TN",
    shortTitle: "Chapter 13 Bankruptcy",
    metaTitle: "Chapter 13 Bankruptcy Attorney Jackson TN | Save Your Home & Car | Ringger Law",
    metaDescription:
      "Stop foreclosure and repossession immediately in Jackson, TN. Chapter 13 bankruptcy lets you catch up on missed mortgage and car payments over 3 to 5 years.",
    heroBadge: "Court-Protected Repayment & Asset Preservation",
    heroHeadline: "Protect Your Home & Vehicle With One Affordable Monthly Plan.",
    heroSubheadline:
      "Behind on your mortgage or car note? Chapter 13 stops foreclosure and repossession dead in their tracks and gives you 36 to 60 months to catch up.",
    directAnswerSummary:
      "Chapter 13 bankruptcy in Jackson, Tennessee is a court-approved 3-to-5-year debt reorganization plan designed for homeowners, vehicle owners, and wage earners who need to stop foreclosure or repossession immediately. Filing Chapter 13 halts any scheduled foreclosure sale, consolidates past-due mortgage arrears, car loans, tax debts, and unsecured bills into one manageable payment, and often discharges pennies on the dollar for credit cards and medical debt.",
    statuteCitation: "11 U.S.C. Chapter 13 (11 U.S.C. §§ 1301–1330)",
    keyBenefits: [
      "Immediately stops home foreclosure sales—even if the auction is scheduled for tomorrow",
      "Cure past-due mortgage arrears gradually over 36 to 60 months without lender harassment",
      "Lower high-interest car payments and potentially 'cram down' vehicle loan balances to fair market value",
      "Co-Debtor Stay (11 U.S.C. § 1301) protects family members or spouses who co-signed your consumer debts",
    ],
    howItWorksSteps: [
      {
        title: "Emergency Case Assessment & Payment Calculation",
        description:
          "We calculate one consolidated monthly payment based on what your household budget can actually afford—not what aggressive collectors demand.",
      },
      {
        title: "Instant Automatic Stay & Co-Debtor Protection",
        description:
          "Filing immediately halts foreclosure proceedings, vehicle repo agents, IRS/tax levies, and protects co-signers on your personal loans.",
      },
      {
        title: "3-to-5 Year Reorganization Plan",
        description:
          "Priority debts and mortgage arrears are caught up steadily while unsecured creditors (credit cards and medical bills) often receive only a fraction of what is owed at 0% interest.",
      },
      {
        title: "Remaining Unsecured Debt Discharged",
        description:
          "Upon completing your plan, any remaining eligible unsecured medical and credit card debt is permanently wiped out.",
      },
    ],
    comparisonTable: {
      headers: ["Feature", "Chapter 7 (Liquidation)", "Chapter 13 (Reorganization)"],
      rows: [
        ["Typical Timeline", "90 to 120 Days", "3 to 5 Years (36–60 Months)"],
        ["Stops Foreclosure & Cures Mortgage Arrears?", "Temporary pause only", "Yes — Cures past-due payments over 5 years"],
        ["Recovers Recently Repossessed Vehicle?", "Rarely", "Yes — Can force return if filed before auction"],
        ["Income / Means Test Limit?", "Must pass TN Means Test", "No maximum income cap for wage earners"],
        ["Protects Non-Filing Co-Signers?", "No", "Yes — Automatic Co-Debtor Stay applies"],
      ],
    },
    faqs: [
      {
        question: "Can Chapter 13 stop a foreclosure sale that is already scheduled in Jackson, TN?",
        answer:
          "Yes. As long as your Chapter 13 petition is filed before the foreclosure auction gavel falls, the federal Automatic Stay legally halts the sale immediately and allows you to spread your past-due mortgage balance over up to 60 months.",
      },
      {
        question: "Do I have to pay back 100% of my credit cards in a Chapter 13 plan?",
        answer:
          "Not necessarily. How much unsecured creditors receive depends on your disposable income and non-exempt assets. Many West Tennessee Chapter 13 filers pay only a small percentage of their credit card and medical bills at 0% interest, with the remainder discharged at the end of the plan.",
      },
      {
        question: "Can Chapter 13 lower my monthly car payment?",
        answer:
          "Yes. Through Chapter 13, we can often reduce high auto loan interest rates (using the Supreme Court 'Till rate') and, if you purchased the vehicle more than 910 days ago, potentially 'cram down' the loan principal to the car's current retail value.",
      },
    ],
  },
  {
    slug: "stop-foreclosure-jackson-tn",
    title: "Stop Foreclosure in Jackson & West Tennessee",
    shortTitle: "Stop Foreclosure",
    metaTitle: "Stop Foreclosure Lawyer Jackson TN | Emergency Bankruptcy Filing | Ringger Law",
    metaDescription:
      "Received a Notice of Trustee Sale in Jackson or West TN? Ringger Law files emergency bankruptcy petitions to stop home foreclosures immediately and save your house.",
    heroBadge: "Emergency Foreclosure Defense • Same-Day Filing Available",
    heroHeadline: "Stop the Foreclosure Sale of Your Home Before It’s Too Late.",
    heroSubheadline:
      "In Tennessee, lenders can foreclose without going to court in as little as 21 days after publishing notice. Federal bankruptcy law gives you the power to force them to stop immediately.",
    directAnswerSummary:
      "Because Tennessee is a non-judicial foreclosure state, mortgage lenders do not need a judge's permission to auction your home after publishing a Notice of Trustee's Sale for three weeks. Filing a Chapter 13 bankruptcy with Ringger Law in Jackson, TN triggers an immediate federal injunction (11 U.S.C. § 362 Automatic Stay) that cancels the foreclosure sale and forces the mortgage company to let you catch up on missed payments over 3 to 5 years.",
    statuteCitation: "11 U.S.C. § 362 (Automatic Stay) & Tenn. Code Ann. § 35-5-101",
    keyBenefits: [
      "Immediate federal court order stopping any scheduled Trustee's Sale in Madison County or West TN",
      "Eliminates the requirement to pay thousands of dollars in lump-sum reinstatement arrears",
      "Wipes out second mortgages or HELOCs that are wholly underwater ('lien stripping')",
      "Eliminates credit card and medical bills simultaneously so you can afford your house payment",
    ],
    howItWorksSteps: [
      {
        title: "Bring Your Foreclosure Notice Immediately",
        description:
          "Call (731) 421-1501 as soon as you receive a breach letter or Notice of Trustee's Sale. We offer same-day emergency consultations.",
      },
      {
        title: "Emergency Skeleton Filing (If Auction Is Days Away)",
        description:
          "If your sale date is imminent, we can file an emergency bankruptcy petition to get a federal case number within hours and fax notice directly to the foreclosing trustee.",
      },
      {
        title: "Cure Arrears Over 60 Months",
        description:
          "Instead of paying $10,000+ upfront to reinstate your loan, your past-due payments are broken into affordable monthly installments.",
      },
      {
        title: "Keep Your Family in Your Home",
        description:
          "Resume your normal ongoing mortgage payment while court protection shields your home from mortgage servicers.",
      },
    ],
    faqs: [
      {
        question: "How late can I file bankruptcy to stop a foreclosure in Tennessee?",
        answer:
          "Legally, a bankruptcy petition stops a foreclosure sale as long as it is filed before the auction takes place on the courthouse steps. However, you should contact Ringger Law as early as possible so we can prepare your full protection plan without last-minute stress.",
      },
      {
        question: "Why won't my mortgage company accept a partial payment?",
        answer:
          "Once a loan enters foreclosure in Tennessee, mortgage servicers almost always refuse partial payments and demand 100% of the past-due balance plus legal fees in a single lump sum. Chapter 13 bankruptcy overrides their refusal and legally forces them to accept a 3-to-5-year catch-up schedule.",
      },
    ],
  },
  {
    slug: "stop-repossession-jackson-tn",
    title: "Stop Car Repossession in Jackson & West TN",
    shortTitle: "Stop Car Repossession",
    metaTitle: "Stop Car Repossession Attorney Jackson TN | Keep Your Vehicle | Ringger Law",
    metaDescription:
      "Behind on car or truck payments in Jackson, TN? Stop vehicle repossession immediately or recover a recently repossessed car with Ringger Law.",
    heroBadge: "Vehicle Protection & Repo Recovery • West Tennessee",
    heroHeadline: "Keep the Car or Truck You Need to Work and Support Your Family.",
    heroSubheadline:
      "Auto lenders in Tennessee can repossess your vehicle without warning after a missed payment. We use federal bankruptcy law to stop repo trucks immediately—and can even get your car back if it was just taken.",
    directAnswerSummary:
      "Filing Chapter 7 or Chapter 13 bankruptcy in Jackson, TN immediately activates the Automatic Stay, making it illegal for an auto lender or repo agent to take your car, truck, or motorcycle. If your vehicle was already repossessed within the last few days and has not yet been sold at auction, filing Chapter 13 bankruptcy can legally compel the lender to return your vehicle while restructuring your past-due balance and high interest rate.",
    statuteCitation: "11 U.S.C. § 362 & 11 U.S.C. § 1325(a)(9) (910-Day Car Cram-Down Rule)",
    keyBenefits: [
      "Stops repo agents from taking your car from your driveway or workplace",
      "Can force lenders to return a recently repossessed vehicle before auction",
      "Reduces predatory 18%–29% subprime auto interest rates down to a court-approved rate",
      "Wipes out old repo deficiency balances if a previous car was already sold",
    ],
    howItWorksSteps: [
      {
        title: "Immediate Repo Shield",
        description:
          "We file your petition electronically and issue your federal case number to the auto lender's recovery department immediately.",
      },
      {
        title: "Restructure the Auto Loan",
        description:
          "Past-due payments are folded into your plan, and high interest rates are slashed so your monthly payment becomes affordable.",
      },
      {
        title: "910-Day Cram-Down Evaluation",
        description:
          "If you bought your vehicle more than 2.5 years (910 days) ago, you may only have to pay what the car is currently worth—not the inflated loan balance.",
      },
      {
        title: "Drive With Peace of Mind",
        description:
          "Keep reliable transportation for work and family throughout Madison County and West Tennessee.",
      },
    ],
    faqs: [
      {
        question: "My car was repossessed yesterday in Jackson, TN. Can Ringger Law get it back?",
        answer:
          "Yes, if we act immediately before the lender sells the vehicle at auction! Call (731) 421-1501 right away. By filing an emergency Chapter 13 petition, we can demand turnover of your vehicle and roll the past-due balance and tow fees into your repayment plan.",
      },
      {
        question: "What if they already sold my repossessed car and are suing me for the difference?",
        answer:
          "When a lender sells a repossessed car for less than you owed, the remaining balance is an unsecured 'deficiency balance.' Chapter 7 bankruptcy wipes out 100% of repo deficiency balances and stops any lawsuit or wage garnishment over that old car.",
      },
    ],
  },
  {
    slug: "stop-wage-garnishment-jackson-tn",
    title: "Stop Wage Garnishment & Bank Levies in Jackson, TN",
    shortTitle: "Stop Wage Garnishment",
    metaTitle: "Stop Wage Garnishment Lawyer Jackson TN | Protect Your Paycheck | Ringger Law",
    metaDescription:
      "Creditors taking up to 25% of your paycheck in Jackson, TN? Stop wage garnishments, bank levies, and General Sessions lawsuits immediately with Ringger Law.",
    heroBadge: "Immediate Paycheck Protection • Madison County & West TN",
    heroHeadline: "Stop Creditors From Taking 25% of Your Hard-Earned Paycheck.",
    heroSubheadline:
      "When a creditor gets a judgment in General Sessions Court, they can garnish a quarter of your take-home pay and freeze your bank account. We stop wage garnishments the same day we file.",
    directAnswerSummary:
      "Under Tennessee law, judgment creditors can garnish up to 25% of your disposable wages every pay period. Filing bankruptcy with Ringger Law in Jackson, TN immediately halts wage garnishments and bank levies under federal law—and permanently eliminates the underlying court judgment so the creditor can never garnish your paycheck again.",
    statuteCitation: "11 U.S.C. § 362 & Tenn. Code Ann. § 26-2-106",
    keyBenefits: [
      "Halts payroll deductions immediately—we fax the federal Notice of Automatic Stay directly to your HR/payroll office and the court clerk",
      "Permanently discharges the underlying credit card, medical, or loan judgment",
      "Unfreezes levied bank accounts and protects your exempt wages",
      "Starts with $0 Money Down so you can afford legal protection even while being garnished",
    ],
    howItWorksSteps: [
      {
        title: "Free Garnishment Review",
        description:
          "Tell us which court issued the garnishment (such as Madison County General Sessions) and when your next payroll cutoff is.",
      },
      {
        title: "Electronic Filing & Instant Notice",
        description:
          "We file your bankruptcy petition and send immediate legal notice to the General Sessions Court clerk, the collection attorney, and your employer's payroll department.",
      },
      {
        title: "Full Paycheck Restored",
        description:
          "Your employer must stop withholding garnished funds immediately upon receiving notice of the federal filing.",
      },
      {
        title: "Judgment Debt Eliminated Forever",
        description:
          "The underlying debt is discharged so the collector can never renew the judgment or come after your wages again.",
      },
    ],
    faqs: [
      {
        question: "Will my employer fire me if they receive a notice stopping my wage garnishment?",
        answer:
          "No. Federal law (11 U.S.C. § 525) strictly prohibits employers from firing or discriminating against an employee for filing bankruptcy. In fact, HR departments usually prefer stopping the administrative hassle of processing creditor garnishments.",
      },
      {
        question: "Can I get back wages that were already garnished before I filed?",
        answer:
          "In some cases, if more than $600 was garnished within the 90 days immediately prior to your bankruptcy filing and we can exempt those funds under Tennessee's wildcard exemption, we can demand those garnished wages back for you.",
      },
    ],
  },
  {
    slug: "no-money-down-bankruptcy-jackson-tn",
    title: "$0 Down Bankruptcy Filing in Jackson, TN",
    shortTitle: "$0 Down Bankruptcy",
    metaTitle: "No Money Down Bankruptcy Attorney Jackson TN | Free Consultation | Ringger Law",
    metaDescription:
      "Need to file bankruptcy in Jackson, TN but can't afford huge upfront attorney fees? Learn how Ringger Law's $0 Down bankruptcy options get your case filed fast.",
    heroBadge: "Fast & Affordable Debt Relief • Since 1981",
    heroHeadline: "Get Started Today With $0 Money Down & a Free Consultation.",
    heroSubheadline:
      "When you are drowning in bills or facing a garnishment, you shouldn't have to come up with thousands of dollars upfront just to get legal protection.",
    directAnswerSummary:
      "Ringger Law offers $0 Down bankruptcy filing options for qualifying West Tennessee clients. Through flexible payment structures and Chapter 13 plans where attorney fees are built directly into your court-approved monthly payment, you can obtain immediate federal protection from debt collectors, foreclosures, and repossessions without paying large upfront retainer fees.",
    statuteCitation: "Western District of Tennessee Local Bankruptcy Rules — Fee Guidelines",
    keyBenefits: [
      "100% Free, no-obligation phone, virtual, or in-person consultation with Louis W. Ringger Jr.",
      "Zero upfront attorney fee options to stop urgent foreclosures, repossessions, and wage garnishments",
      "Transparent, flat-rate pricing with no hidden surprises",
      "Immediate collector referral: the moment you retain us, tell every bill collector to call Ringger Law instead of you",
    ],
    howItWorksSteps: [
      {
        title: "60-Second Online Qualifier or Phone Call",
        description:
          "Check your eligibility online in 60 seconds or call (731) 421-1501 to speak directly with our Jackson office.",
      },
      {
        title: "Select Your $0-Down Filing Path",
        description:
          "We structure your filing so you can stop creditor harassment and court actions immediately without financial strain.",
      },
      {
        title: "Stop Answering Collector Calls Today",
        description:
          "Once you retain Ringger Law, federal law forbids collectors from calling you directly—they must deal with us.",
      },
      {
        title: "Fresh Financial Start",
        description:
          "Rebuild your credit score faster without the crushing weight of high-interest debt.",
      },
    ],
    faqs: [
      {
        question: "How does a 'No Money Down' bankruptcy work if I am broke?",
        answer:
          "When you stop paying high-interest credit cards, payday loans, or a 25% wage garnishment, you immediately free up cash flow in your monthly budget. In Chapter 13 cases, attorney fees are folded into your affordable monthly plan payment. For Chapter 7 cases, we offer flexible, family-friendly structures so you can get relief immediately.",
      },
    ],
  },
];

export const COUNTY_LOCATIONS: CountyLocationPage[] = [
  {
    slug: "madison-county-tn",
    countyName: "Madison County",
    primaryCities: ["Jackson", "Medon", "Three Way", "Beech Bluff", "Denmark", "Pinson", "Oakfield"],
    zipCodes: ["38301", "38305", "38303", "38313", "38356", "38366"],
    courtJurisdiction: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division)",
    courtAddress: "111 South Highland Ave, Jackson, TN 38301",
    drivingDistanceToOffice: "Located right here in Jackson at 367 N. Parkway, Suite 1 (5 mins from I-40)",
    metaTitle: "Bankruptcy Attorney Madison County & Jackson TN | Ringger Law (Since 1981)",
    metaDescription:
      "Madison County's trusted bankruptcy law firm since 1981. Stop foreclosures, wage garnishments, and medical debt in Jackson, TN. Call (731) 421-1501 for a free consultation.",
    directAnswerSummary:
      "Ringger Law has served as Madison County's hometown bankruptcy law firm since Bill Ringger founded the practice in Jackson, Tennessee in 1981. Located at 367 N. Parkway, Suite 1, Jackson, TN 38305, Attorney Louis W. Ringger Jr. represents Jackson residents in Chapter 7 and Chapter 13 filings before the U.S. Bankruptcy Court at 111 S. Highland Ave.",
    localEconomicContext:
      "Jackson is the medical, manufacturing, and retail hub of West Tennessee. Rising housing costs, hospital bills from regional healthcare centers, and aggressive General Sessions Court debt collection lawsuits leave many hardworking Madison County families needing a clean legal slate.",
    commonLocalIssues: [
      "Stopping Madison County General Sessions Court wage garnishments and bank levies",
      "Halting home foreclosure sales in North Jackson, Midtown, Bemis, and Three Way",
      "Eliminating overwhelming medical debt and high-interest credit cards",
      "Protecting vehicles needed for manufacturing, healthcare, and logistics jobs along I-40",
    ],
    faqs: [
      {
        question: "Where is my bankruptcy court hearing held if I live in Jackson or Madison County?",
        answer:
          "Madison County cases are filed in the Eastern Division of the Western District of Tennessee, headquartered right in downtown Jackson at 111 South Highland Avenue. Most 341 Meetings of Creditors are now conducted conveniently by Zoom or telephone so you don't even have to miss work.",
      },
      {
        question: "Can I meet with Louis W. Ringger Jr. in person in Jackson or over the phone?",
        answer:
          "Both! You can visit our office at 367 N. Parkway, Suite 1 in Jackson, or complete your entire free consultation and document intake from your phone or computer.",
      },
    ],
  },
  {
    slug: "gibson-county-tn",
    countyName: "Gibson County",
    primaryCities: ["Humboldt", "Milan", "Trenton", "Medina", "Dyer", "Rutherford", "Bradford", "Gibson"],
    zipCodes: ["38343", "38358", "38382", "38355", "38330", "38369", "38316"],
    courtJurisdiction: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division, Jackson)",
    courtAddress: "111 South Highland Ave, Jackson, TN 38301",
    drivingDistanceToOffice: "15–25 minutes south via US-45W / US-45E (or 100% Virtual Phone Consultation)",
    metaTitle: "Bankruptcy Lawyer Gibson County TN (Milan, Humboldt, Trenton) | Ringger Law",
    metaDescription:
      "Experienced Chapter 7 & Chapter 13 bankruptcy attorney serving Gibson County, TN (Milan, Humboldt, Trenton, Medina). Stop foreclosure & debt collectors today.",
    directAnswerSummary:
      "Residents of Gibson County, Tennessee—including Milan, Humboldt, Trenton, Medina, and Dyer—file bankruptcy in the Eastern Division of the U.S. Bankruptcy Court in Jackson, TN. Ringger Law has helped hundreds of Gibson County families eliminate medical bills, credit card debt, and stop foreclosures for over 45 years, offering both virtual phone consultations and in-person meetings just down Highway 45.",
    localEconomicContext:
      "Families across Milan, Humboldt, Trenton, and Medina work hard in manufacturing, agriculture, education, and small business. When unexpected illness, plant layoffs, or inflation strike, predatory payday lenders and debt collectors move fast in Gibson County General Sessions Court.",
    commonLocalIssues: [
      "Stopping wage garnishments filed in Gibson County General Sessions Court (Trenton & Humboldt)",
      "Saving family homes and rural acreage in Milan, Medina, and Trenton from foreclosure",
      "Wiping out medical bills, payday loans, and finance company debt",
      "100% remote phone & Zoom consultations so Gibson County clients don't have to drive unless they want to",
    ],
    faqs: [
      {
        question: "Do I have to drive to Jackson to file bankruptcy if I live in Milan, Humboldt, or Trenton?",
        answer:
          "No! Ringger Law offers 100% phone and virtual consultations plus electronic document signing for all Gibson County residents. If you prefer to meet face-to-face, our office on North Parkway in Jackson is right off Highway 45.",
      },
    ],
  },
  {
    slug: "haywood-county-tn",
    countyName: "Haywood County",
    primaryCities: ["Brownsville", "Stanton"],
    zipCodes: ["38012", "38069"],
    courtJurisdiction: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division, Jackson)",
    courtAddress: "111 South Highland Ave, Jackson, TN 38301",
    drivingDistanceToOffice: "25 minutes east via I-40 (or 100% Virtual Phone Consultation)",
    metaTitle: "Bankruptcy Attorney Brownsville & Haywood County TN | Ringger Law",
    metaDescription:
      "Stop foreclosure, car repossession, and wage garnishment in Brownsville and Haywood County, TN. Over 45 years of West Tennessee bankruptcy experience.",
    directAnswerSummary:
      "Ringger Law provides Chapter 7 and Chapter 13 bankruptcy representation to residents of Brownsville, Stanton, and all of Haywood County, Tennessee. With BlueOval City and regional growth driving up housing and living costs in Haywood County, we help local workers and homeowners protect their homes, vehicles, and paychecks with $0-down bankruptcy options.",
    localEconomicContext:
      "As Haywood County and Brownsville experience rapid economic shifts around BlueOval City, property values, rent, and everyday living expenses have surged—while auto lenders and collection agencies aggressively target local commuters.",
    commonLocalIssues: [
      "Protecting commuter trucks and cars from repossession along the I-40 corridor",
      "Stopping Haywood County General Sessions wage garnishments",
      "Saving family homes and inherited property in Brownsville and Stanton",
      "Eliminating high-interest finance company loans and hospital debt",
    ],
    faqs: [
      {
        question: "Can I protect my truck from repossession if I commute from Brownsville to work?",
        answer:
          "Yes. Filing Chapter 13 or Chapter 7 with Ringger Law triggers an immediate federal Automatic Stay that stops repo agents from taking your vehicle and can lower your monthly car payment.",
      },
    ],
  },
  {
    slug: "crockett-county-tn",
    countyName: "Crockett County",
    primaryCities: ["Alamo", "Bells", "Maury City", "Gadsden", "Friendship"],
    zipCodes: ["38001", "38006", "38050", "38337", "38034"],
    courtJurisdiction: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division, Jackson)",
    courtAddress: "111 South Highland Ave, Jackson, TN 38301",
    drivingDistanceToOffice: "20 minutes east via US-412 (or 100% Virtual Phone Consultation)",
    metaTitle: "Bankruptcy Lawyer Crockett County TN (Alamo & Bells) | Ringger Law",
    metaDescription:
      "Crockett County bankruptcy attorney serving Alamo, Bells, Maury City & Gadsden. Wipe out credit card & medical debt or stop foreclosure with Ringger Law.",
    directAnswerSummary:
      "For over four decades, Ringger Law has represented families across Crockett County—including Alamo, Bells, Maury City, and Gadsden—in Chapter 7 and Chapter 13 bankruptcy cases. Just 20 minutes down Highway 412 in Jackson, we offer free phone and in-person consultations to stop foreclosures, repossessions, and collection lawsuits.",
    localEconomicContext:
      "Crockett County families value self-reliance and keeping family land and homes intact. When medical emergencies or high-interest debt threaten your household, Tennessee bankruptcy exemptions protect your home, vehicles, and farm/work tools.",
    commonLocalIssues: [
      "Protecting Crockett County homes and property from mortgage foreclosure",
      "Stopping creditor lawsuits and paycheck garnishments in Alamo",
      "Discharging medical bills and high-interest credit card debt",
    ],
    faqs: [
      {
        question: "Will people in Crockett County know I filed bankruptcy?",
        answer:
          "While bankruptcy filings are public federal court records, they are not published in local Crockett County newspapers for consumer Chapter 7 or 13 cases. Normally, only you, your attorney, the court, and your listed creditors ever receive notice.",
      },
    ],
  },
  {
    slug: "chester-county-tn",
    countyName: "Chester County",
    primaryCities: ["Henderson", "Enville", "Jacks Creek"],
    zipCodes: ["38340", "38332", "38347"],
    courtJurisdiction: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division, Jackson)",
    courtAddress: "111 South Highland Ave, Jackson, TN 38301",
    drivingDistanceToOffice: "20 minutes north via US-45N (or 100% Virtual Phone Consultation)",
    metaTitle: "Bankruptcy Attorney Henderson & Chester County TN | Ringger Law",
    metaDescription:
      "Eliminate credit card & medical debt or stop foreclosure in Henderson and Chester County, TN. Call Ringger Law at (731) 421-1501 for a free consultation.",
    directAnswerSummary:
      "Ringger Law helps residents of Henderson and Chester County, Tennessee eliminate overwhelming credit card debt, hospital bills, and personal loans through Chapter 7 and Chapter 13 bankruptcy. With 45+ years of experience in the Western District of Tennessee Bankruptcy Court, we provide fast, compassionate debt relief.",
    localEconomicContext:
      "Located just south of Jackson along Highway 45, Henderson and Chester County families can access full federal debt protection without leaving home through our virtual phone consultation and online intake portal.",
    commonLocalIssues: [
      "Eliminating credit card, medical, and personal loan debt in Henderson, TN",
      "Stopping foreclosure and catching up on mortgage payments via Chapter 13",
      "Halting wage garnishments and aggressive collection agencies",
    ],
    faqs: [
      {
        question: "How quickly can a Chester County resident get a free bankruptcy consultation?",
        answer:
          "Same day or next business day. Call (731) 421-1501 or use our 60-second online qualifier to schedule your free phone or office consultation.",
      },
    ],
  },
  {
    slug: "henderson-county-tn",
    countyName: "Henderson County",
    primaryCities: ["Lexington", "Scotts Hill", "Sardis", "Wildersville", "Huron"],
    zipCodes: ["38351", "38374", "38371", "38388", "38345"],
    courtJurisdiction: "U.S. Bankruptcy Court — Western District of Tennessee (Eastern Division, Jackson)",
    courtAddress: "111 South Highland Ave, Jackson, TN 38301",
    drivingDistanceToOffice: "30 minutes west via I-40 / US-412 (or 100% Virtual Phone Consultation)",
    metaTitle: "Bankruptcy Lawyer Lexington & Henderson County TN | Ringger Law",
    metaDescription:
      "Trusted Chapter 7 & Chapter 13 bankruptcy lawyer serving Lexington and Henderson County, TN since 1981. Stop foreclosure, repossession & debt calls today.",
    directAnswerSummary:
      "Ringger Law represents individuals and married couples throughout Lexington and Henderson County, Tennessee in Chapter 7 and Chapter 13 bankruptcy filings. Whether you need to wipe out medical and credit card debt or stop a home foreclosure or car repossession, Attorney Louis W. Ringger Jr. guides you through all 4 steps.",
    localEconomicContext:
      "Hardworking families in Lexington, Scotts Hill, and across Henderson County deserve a fresh financial start without losing their homes or vehicles to out-of-state debt buyers.",
    commonLocalIssues: [
      "Stopping Henderson County General Sessions wage garnishments",
      "Saving homes in Lexington and rural Henderson County from foreclosure",
      "Discharging unsecured credit cards, medical debt, and old repo balances",
    ],
    faqs: [
      {
        question: "Can my spouse and I file together or can I file individually in Henderson County?",
        answer:
          "Either! Married couples in Tennessee can file a joint petition for a single court filing fee to wipe out both spouses' debts, or one spouse can file individually while leaving the other spouse's credit untouched.",
      },
    ],
  },
];

export const TENNESSEE_EXEMPTIONS_TABLE = [
  {
    assetCategory: "Homestead Exemption (Primary Residence)",
    statutoryAmount: "$35,000 Individual / $52,500 Joint (Up to $50,000+ with minor dependents or age 62+)",
    tennesseeStatute: "Tenn. Code Ann. § 26-2-301",
    practicalMeaning:
      "Protects the equity in your primary home or mobile home. If your home value minus your mortgage balance is within the exemption, the Chapter 7 trustee cannot touch your house.",
  },
  {
    assetCategory: "Personal Property 'Wildcard' Exemption",
    statutoryAmount: "$10,000 per filer ($20,000 for Married Joint Filers)",
    tennesseeStatute: "Tenn. Code Ann. § 26-2-103",
    practicalMeaning:
      "Can be applied to ANY personal property you own—including your car or truck equity, bank account balances, electronics, or tax refunds.",
  },
  {
    assetCategory: "Wearing Apparel, Household Goods & Furnishings",
    statutoryAmount: "100% Exempt (Necessary clothing, beds, appliances, family portraits & Bible)",
    tennesseeStatute: "Tenn. Code Ann. § 26-2-104",
    practicalMeaning: "No one comes to your house to take your furniture, TV, appliances, or clothes.",
  },
  {
    assetCategory: "Tools of the Trade",
    statutoryAmount: "$1,900 per filer ($3,800 Joint) + Combinable with $10,000 Wildcard",
    tennesseeStatute: "Tenn. Code Ann. § 26-2-111(4)",
    practicalMeaning: "Protects mechanic tools, carpentry equipment, computers, and implements needed for your livelihood.",
  },
  {
    assetCategory: "401(k), IRA, Pensions & Tennessee Consolidated Retirement (TCRS)",
    statutoryAmount: "100% Exempt (Virtually Unlimited for Qualified Plans)",
    tennesseeStatute: "Tenn. Code Ann. § 26-2-105 & 11 U.S.C. § 522(b)(3)(C)",
    practicalMeaning:
      "Your retirement accounts and pensions are completely shielded. Never cash out your 401(k) to pay credit cards before talking to a bankruptcy attorney!",
  },
  {
    assetCategory: "Social Security, SSI, SSDI, VA Benefits & Child Support",
    statutoryAmount: "100% Exempt",
    tennesseeStatute: "Tenn. Code Ann. § 26-2-111(1)",
    practicalMeaning: "Government disability, Social Security retirement, veterans benefits, and child support are protected.",
  },
];
