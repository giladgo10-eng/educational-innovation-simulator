/**
 * סימולטור מרכז חדשנות חינוכי יישובי - מנוע חישובים תקציביים ומשאבים
 * כל החישובים מציגים נוסחאות שקופות, הנחות עבודה ותיוג אמינות
 * כל עלות מוגדרת במפורש כהערכה לתכנון ואינה מהווה תקן רשמי או הוצאה מאושרת.
 */

function formatNIS(val) {
  if (val === undefined || val === null || isNaN(val)) return "0 ₪";
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0
  }).format(val);
}

function formatNumber(val) {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return new Intl.NumberFormat("he-IL").format(val);
}

/**
 * חילוץ מספר חיובי בטוח (מונע NaN, ערכים שליליים ומחרוזות פגומות)
 */
function safePosNum(val, defaultVal = 0) {
  if (val === undefined || val === null || val === "") return defaultVal;
  const num = parseFloat(val);
  if (isNaN(num)) return defaultVal;
  return Math.max(0, num);
}

/**
 * חישוב שטחי המרכז (מ"ר)
 */
function calculateSpaces(spaces) {
  let totalArea = 0;
  const breakdown = [];

  for (const [key, space] of Object.entries(spaces || {})) {
    if (space && space.included) {
      const area = safePosNum(space.size, 0);
      totalArea += area;
      breakdown.push({
        key,
        desc: space.desc || key,
        size: area
      });
    }
  }

  return {
    totalArea,
    breakdown,
    formula: "סה\"כ שטח מ\"ר = סכום שטחי אזורי הפעילות שנבחרו (מפגש, מעבדה, מייקרס, חקר שקט, הצגה, לאונג', שירות)"
  };
}

/**
 * חישוב עלויות הקמה חד-פעמיות (CAPEX)
 */
function calculateCapex(capexConfig, totalArea) {
  const cfg = capexConfig || {};
  const area = safePosNum(totalArea, 0);
  const sqMeterRate = safePosNum(cfg.renovationCostPerSqMeter, 0);
  const renovation = area * sqMeterRate;
  const furniture = safePosNum(cfg.flexibleFurniture, 0);
  const techMaker = safePosNum(cfg.techAndMakerEquipment, 0);
  const networkAv = safePosNum(cfg.networkAndAvInfrastructure, 0);
  
  const directTotal = renovation + furniture + techMaker + networkAv;
  const contingencyPct = safePosNum(cfg.contingencyPercent, 0);
  const contingency = directTotal * (contingencyPct / 100);
  const totalCapex = directTotal + contingency;

  return {
    totalArea: area,
    sqMeterRate,
    renovationCost: renovation,
    furnitureCost: furniture,
    techMakerCost: techMaker,
    networkAvCost: networkAv,
    directTotal,
    contingencyPct,
    contingencyCost: contingency,
    totalCapex,
    formula: `עלות הקמה כוללת (CAPEX) = [(${area} מ"ר × ${sqMeterRate.toLocaleString('he-IL')} ₪ שיפוץ) + ${furniture.toLocaleString('he-IL')} ₪ ריהוט + ${techMaker.toLocaleString('he-IL')} ₪ ציוד ומייקרס + ${networkAv.toLocaleString('he-IL')} ₪ תקשוב ורשת] × (1 + ${contingencyPct}% בצ"מ)`,
    assumptionsNote: "הערכת תכנון ראשונית — אינה מהווה תקן רשמי או עלות מאושרת: עלות שיפוץ מבוססת על אומדן ממוצע להתאמת מבנה קיים (2,000–2,800 ₪/מ\"ר). במידה ומדובר בבינוי חדש מהיסוד (תב\"ר), העלות נגזרת מתחשיבי משרד החינוך ומשרד הבינוי וטעונה אישור מהנדס עיר."
  };
}

/**
 * חישוב עלויות תפעול שנתיות (OPEX)
 */
function calculateOpex(opexConfig) {
  const cfg = opexConfig || {};
  const manager = safePosNum(cfg.managerCost, 0);
  const positions = safePosNum(cfg.instructorPositions, 0);
  const costPerPos = safePosNum(cfg.instructorCostPerPosition, 0);
  const instructors = positions * costPerPos;
  const adminTech = safePosNum(cfg.adminAndTechSupport, 0);
  const staffTotal = manager + instructors + adminTech;

  const maintenance = safePosNum(cfg.maintenanceAndUtilities, 0);
  const insuranceSec = safePosNum(cfg.insuranceAndSecurity, 0);
  const consumables = safePosNum(cfg.consumableMaterials, 0);
  const software = safePosNum(cfg.softwareLicenses, 0);
  const operationsTotal = maintenance + insuranceSec + consumables + software;

  const scholarships = safePosNum(cfg.scholarshipAndTransportFund, 0);
  const marketing = safePosNum(cfg.marketingAndCommunityEvents, 0);
  const equityAndCommunityTotal = scholarships + marketing;

  const totalOpex = staffTotal + operationsTotal + equityAndCommunityTotal;

  return {
    managerCost: manager,
    instructorPositions: positions,
    instructorCostPerPosition: costPerPos,
    instructorsTotalCost: instructors,
    adminTechCost: adminTech,
    staffTotal,
    operationsTotal,
    equityAndCommunityTotal,
    totalOpex,
    staffSharePct: totalOpex > 0 ? (staffTotal / totalOpex) * 100 : 0,
    formula: `תפעול שנתי כולל (OPEX) = שכר צוות (${manager.toLocaleString('he-IL')} מנהל + ${positions} משרות × ${costPerPos.toLocaleString('he-IL')} מדריכים + ${adminTech.toLocaleString('he-IL')} תמיכה) + תפעול ומבנה (${operationsTotal.toLocaleString('he-IL')}) + קרן מלגות, הסעות וקהילה (${equityAndCommunityTotal.toLocaleString('he-IL')})`,
    assumptionsNote: "הערכת תכנון ראשונית — אינה מהווה תקן רשמי או עלות מאושרת: שכר עובדים כולל אומדן עלות מעביד מלאה (הפרשות סוציאליות, פנסיה, פיצויים, דמי הבראה וביטוח לאומי). מודל ההעסקה תלוי בהחלטת הרשות (עובדי רשות, חברה עירונית או ספקים) וטעון בדיקה ואימות מול מחלקת השכר והגזברות."
  };
}

/**
 * ניתוח איזון תקציבי ומקורות מימון
 */
function calculateFundingBalance(totalOpex, fundingSources) {
  const funds = fundingSources || {};
  const municipal = safePosNum(funds.municipalBudget, 0);
  const moe = safePosNum(funds.moeGefenAndGrants, 0);
  const philanthropy = safePosNum(funds.philanthropyAndIndustry, 0);
  const parentFees = safePosNum(funds.subsidizedParentFees, 0);

  const totalFunding = municipal + moe + philanthropy + parentFees;
  const balance = totalFunding - totalOpex;

  const municipalPct = totalOpex > 0 ? (municipal / totalOpex) * 100 : 0;
  const moePct = totalOpex > 0 ? (moe / totalOpex) * 100 : 0;
  const philanthropyPct = totalOpex > 0 ? (philanthropy / totalOpex) * 100 : 0;
  const parentFeesPct = totalOpex > 0 ? (parentFees / totalOpex) * 100 : 0;

  let riskLevel = "low";
  let riskMessage = "מבנה המימון מאוזן ויציב, עם עוגן רשותי וממשלתי מובהק.";

  if (totalOpex === 0 && totalFunding === 0) {
    riskLevel = "neutral";
    riskMessage = "טרם הוזנו עלויות תפעול או מקורות מימון (מאזן 0 ₪).";
  } else if (balance < 0) {
    riskLevel = "high";
    riskMessage = `גרעון תפעולי שנתי חזוי בסך ${formatNIS(Math.abs(balance))}! נדרשת התאמת היקף הפעילות או גיוס מקורות נוספים.`;
  } else if (totalOpex > 0 && philanthropyPct > 25) {
    riskLevel = "medium";
    riskMessage = `תלות גבוהה בפילנתרופיה ותרומות חיצוניות (${philanthropyPct.toFixed(1)}% מהתקציב). קיים סיכון המשכיות במידה והתרומה תופסק.`;
  } else if (totalOpex > 0 && municipalPct < 30) {
    riskLevel = "medium";
    riskMessage = `שיעור השתתפות עצמית של הרשות נמוך מ-30% (${municipalPct.toFixed(1)}%). מומלץ לעגן מחויבות תקציבית רב-שנתית של הנהלת העיר.`;
  }

  return {
    municipal,
    moe,
    philanthropy,
    parentFees,
    totalFunding,
    balance,
    municipalPct,
    moePct,
    philanthropyPct,
    parentFeesPct,
    riskLevel,
    riskMessage
  };
}
