/**
 * סימולטור מרכז חדשנות חינוכי יישובי
 * מודול ייבוא נתונים מקובץ (JSON ו-CSV) כמסלול עצמאי ונפרד
 * 
 * עקרונות ליבה:
 * 1. קריאת קבצים מקומית לחלוטין בדפדפן (FileReader) - ללא תלות ברשת או בשירות חיצוני.
 * 2. אימות קפדני של שדות, סוגי נתונים וערכים לפני טעינה.
 * 3. תצוגה מקדימה מלאה (Preview) והצגת שגיאות/אזהרות לפני אישור המשתמש.
 * 4. בחירה מפורשת של המשתמש: טעינה זמנית להרצה נוכחית או שמירה כפרויקט פעיל.
 * 5. במקרה של קובץ שגוי/פגום - המערכת והנתונים הקיימים אינם משתנים כלל.
 */

// משתנה זמני לאחסון נתוני הקובץ המיובא שנבדק ואושר לתצוגה מקדימה
let pendingImportData = null;

/**
 * יצירת תבנית CSV להורדה (מותאמת לעריכה ב-Microsoft Excel וב-Google Sheets)
 * כולל קידומת UTF-8 BOM לתמיכה מלאה בעברית ב-Excel
 */
function generateCsvTemplate() {
  const blank = getBlankProjectData();
  const demo = getDemoAuthorityData();

  const rows = [
    ["שלב", "מפתח_שדה", "ערך_למילוי", "ערך_לדוגמה", "הסבר_והנחיות"],
    ["שלב 1: יישוב וחזון", "stage1.authorityName", "", demo.stage1.authorityName, "שם הרשות המקומית"],
    ["שלב 1: יישוב וחזון", "stage1.cbsCluster", "", "5", "אשכול למ\"ס 1 עד 10"],
    ["שלב 1: יישוב וחזון", "stage1.totalPopulation", "", "48000", "סה\"כ אוכלוסייה ברשות"],
    ["שלב 1: יישוב וחזון", "stage1.studentCount", "", "9200", "מספר תלמידים כולל"],
    ["שלב 1: יישוב וחזון", "stage1.geographicArea", "", "מרכז", "אזור גאוגרפי (צפון / מרכז / דרום / פריפריה)"],
    ["שלב 1: יישוב וחזון", "stage1.visionStatement", "", demo.stage1.visionStatement, "משפט חזון מוביל של המרכז"],
    ["שלב 1: יישוב וחזון", "stage1.focusDomains", "", "stem,entrepreneurship,leadership", "תחומי מיקוד מופרדים בפסיקים (stem, arts, entrepreneurship, leadership, interdisciplinary, sustainability)"],
    ["שלב 1: יישוב וחזון", "stage1.desiredOutcomes", "", demo.stage1.desiredOutcomes, "תוצאות רצויות ויעדים"],
    ["שלב 1: יישוב וחזון", "stage1.notes", "", "", "הערות נוספות לשלב 1"],

    ["שלב 2: מיפוי צרכים", "stage2.targetPopulations", "", demo.stage2.targetPopulations, "אוכלוסיות יעד מרכזיות"],
    ["שלב 2: מיפוי צרכים", "stage2.identifiedNeeds", "", demo.stage2.identifiedNeeds, "צרכים יישוביים שזוהו"],
    ["שלב 2: מיפוי צרכים", "stage2.strengths", "", demo.stage2.strengths, "עוגנים ונקודות חוזק קיימות"],
    ["שלב 2: מיפוי צרכים", "stage2.barriers.transportation", "", demo.stage2.barriers.transportation, "חסמי תחבורה ונגישות פיזית"],
    ["שלב 2: מיפוי צרכים", "stage2.barriers.socioeconomic", "", demo.stage2.barriers.socioeconomic, "חסמים סוציו-אקונומיים"],
    ["שלב 2: מיפוי צרכים", "stage2.barriers.languageCulture", "", demo.stage2.barriers.languageCulture, "חסמי שפה ותרבות"],
    ["שלב 2: מיפוי צרכים", "stage2.barriers.infrastructure", "", demo.stage2.barriers.infrastructure, "חסמי תשתיות ומבנים"],
    ["שלב 2: מיפוי צרכים", "stage2.dataSources", "", demo.stage2.dataSources, "מקורות המידע והנתונים"],
    ["שלב 2: מיפוי צרכים", "stage2.updateDate", "", "2026-10-01", "תאריך עדכון נתונים (YYYY-MM-DD)"],

    ["שלב 4: פערים וחפיפות", "stage4.unaddressedNeeds", "", demo.stage4.unaddressedNeeds, "צרכים ללא מענה כיום"],
    ["שלב 4: פערים וחפיפות", "stage4.underservedPopulations", "", demo.stage4.underservedPopulations, "אוכלוסיות בתת-ייצוג"],
    ["שלב 4: פערים וחפיפות", "stage4.programOverlaps", "", demo.stage4.programOverlaps, "כפילויות וחפיפות שיש לייעל"],
    ["שלב 4: פערים וחפיפות", "stage4.partnershipOpportunities", "", demo.stage4.partnershipOpportunities, "הזדמנויות לשיתופי פעולה"],

    ["שלב 5: בחירת מודל", "stage5.modelType", "", "hub_and_spoke", "מודל הפעלה: centralized (אחוד) / hub_and_spoke (שלוחות) / mobile (נייד) / ecosystem_network (רשת)"],
    ["שלב 5: בחירת מודל", "stage5.activityFrequency", "", "afternoon_and_morning", "תדירות פעילות (afternoon_and_morning / afternoon_only / morning_only / flexible)"],
    ["שלב 5: בחירת מודל", "stage5.estimatedParticipantsPerYear", "", "600", "אומדן תלמידים משתתפים בשנה"],
    ["שלב 5: בחירת מודל", "stage5.admissionPolicy", "", "mixed_portfolios", "מדיניות קבלה: mixed_portfolios / open_lottery / teacher_recommendation / exams_only"],
    ["שלב 5: בחירת מודל", "stage5.communityOpenness", "", "high", "פתיחות לקהילה: low / medium / high"],
    ["שלב 5: בחירת מודל", "stage5.modelRationale", "", demo.stage5.modelRationale, "נימוק לבחירת המודל"],

    ["שלב 6: פדגוגיה ומרחב", "stage6.pedagogicalConcept", "", demo.stage6.pedagogicalConcept, "תפיסה פדגוגית מובילה"],
    ["שלב 6: פדגוגיה ומרחב", "stage6.governanceStructure", "", demo.stage6.governanceStructure, "מבנה הובלה ומשילות"],
    ["שלב 6: פדגוגיה ומרחב", "stage6.keyPartners", "", demo.stage6.keyPartners, "שותפים מובילים"],
    ["שלב 6: פדגוגיה ומרחב", "stage6.staffingRoles", "", demo.stage6.staffingRoles, "מבנה צוות ותפקידים"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.plenaryArea.size", "", "80", "שטח מרחב התכנסות במ\"ר"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.investigationLab.size", "", "70", "שטח מעבדת חקר במ\"ר"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.makerspace.size", "", "90", "שטח סדנת מייקרס במ\"ר"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.quietReflection.size", "", "40", "שטח חדר שקט לעבודה אישית במ\"ר"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.showcasePitch.size", "", "50", "שטח גלריית הצגה ופיצ'ינג במ\"ר"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.wellbeingSocial.size", "", "45", "שטח לאונג' ורווחה אישית במ\"ר"],
    ["שלב 6: מרחבים (מ\"ר)", "stage6.spaces.storageLogistics.size", "", "35", "שטח מחסן ושירות במ\"ר"],

    ["שלב 7: תקציב הקמה CAPEX", "stage7.capex.renovationCostPerSqMeter", "", "2400", "עלות שיפוץ למ\"ר (הערכה לתכנון, ₪)"],
    ["שלב 7: תקציב הקמה CAPEX", "stage7.capex.flexibleFurniture", "", "280000", "ריהוט דינמי ומודולרי (₪)"],
    ["שלב 7: תקציב הקמה CAPEX", "stage7.capex.techAndMakerEquipment", "", "450000", "ציוד טכנולוגי ומעבדות מייקרס (₪)"],
    ["שלב 7: תקציב הקמה CAPEX", "stage7.capex.networkAndAvInfrastructure", "", "160000", "תשתיות רשת, שמע ווידאו (₪)"],
    ["שלב 7: תקציב הקמה CAPEX", "stage7.capex.contingencyPercent", "", "10", "בצ\"מ (אחוז לבלתי מתוכנן, 0-20%)"],

    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.managerCost", "", "310000", "עלות שנתית מנהל מרכז (הערכת מעביד, ₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.instructorPositions", "", "3.5", "מספר משרות מדריכים ומובילי תוכן"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.instructorCostPerPosition", "", "140000", "עלות שנתית ממוצעת למשרת מדריך (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.adminAndTechSupport", "", "140000", "תמיכה טכנית ואדמיניסטרציה (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.maintenanceAndUtilities", "", "130000", "אחזקה שוטפת, חשמל וניקיון (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.insuranceAndSecurity", "", "45000", "ביטוח ואבטחה (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.consumableMaterials", "", "90000", "חומרים מתכלים לפעילות ומייקרס (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.softwareLicenses", "", "60000", "רישיונות תוכנה ופלטפורמות ענן (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.scholarshipAndTransportFund", "", "120000", "קרן מלגות, שוויון והסעות יישוביות (₪)"],
    ["שלב 7: תפעול שנתי OPEX", "stage7.opex.marketingAndCommunityEvents", "", "40000", "פרסום, אירועי קהילה וירידי שיא (₪)"],

    ["שלב 7: מקורות מימון", "stage7.fundingSources.municipalBudget", "", "650000", "השתתפות עצמית של הרשות המקומית (מאצ'ינג, ₪)"],
    ["שלב 7: מקורות מימון", "stage7.fundingSources.moeGefenAndGrants", "", "420000", "השתתפות משרד החינוך / גפ\"ן / קולות קוראים (₪)"],
    ["שלב 7: מקורות מימון", "stage7.fundingSources.philanthropyAndIndustry", "", "250000", "קרנות, פילנתרופיה ושותפים עסקיים (₪)"],
    ["שלב 7: מקורות מימון", "stage7.fundingSources.subsidizedParentFees", "", "105000", "דמי השתתפות הורים מסובסדים (₪)"],
    ["שלב 7: מקורות מימון", "stage7.fundingRiskAssessment", "", demo.stage7.fundingRiskAssessment, "הערכת סיכוני מימון והמשכיות"],

    ["שלב 8: תוכנית הקמה", "stage8.processIndicators", "", demo.stage8.processIndicators, "מדדי תהליך והקמה"],
    ["שלב 8: תוכנית הקמה", "stage8.outcomeIndicators", "", demo.stage8.outcomeIndicators, "מדדי תוצאה והשפעה"],
    ["שלב 8: תוכנית הקמה", "stage8.evaluationMethodology", "", demo.stage8.evaluationMethodology, "מתודולוגיית הערכה ומחקר מלווה"]
  ];

  const escapeCsv = (str) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvContent = "\uFEFF" + rows.map(r => r.map(escapeCsv).join(",")).join("\r\n");
  return csvContent;
}

/**
 * יצירת תבנית JSON מלאה ומובנית להורדה
 */
function generateJsonTemplate() {
  const blank = getBlankProjectData();
  blank.metadata = {
    templateVersion: "1.0",
    description: "תבנית נתונים יישובית להזנת תכנון מרכז חדשנות חינוכי",
    instructions: "מלא את שדות הרשות ושמור כקובץ JSON. ניתן להעלות את הקובץ לסימולטור בנתיב 'ייבוא נתונים מקובץ'."
  };
  return JSON.stringify(blank, null, 2);
}

/**
 * הורדת קובץ ישירות בדפדפן
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * ניתוח קובץ CSV לתוך אובייקט פרויקט
 */
function parseCsvToProjectData(csvText) {
  const lines = csvText.split(/\r\n|\n|\r/);
  const data = getBlankProjectData();
  let rowCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // פירוק שורת CSV תוך תמיכה במירכאות
    const cols = parseCsvLine(line);
    if (cols.length < 3) continue;

    const key = cols[1]?.trim();
    let val = cols[2]?.trim();

    // דילוג על שורת כותרת
    if (key === "מפתח_שדה" || key === "key" || !key.startsWith("stage")) {
      continue;
    }

    if (val !== undefined && val !== "") {
      setDeepValue(data, key, val);
      rowCount++;
    }
  }

  if (rowCount === 0) {
    throw new Error("קובץ ה-CSV אינו כולל שורות נתונים מזוהות לפי מפתחות המערכת (stage1-stage8).");
  }

  return data;
}

/**
 * פירוק שורת CSV יחידה עם התחשבות במירכאות
 */
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * השמת ערך באובייקט מקונן לפי מפתח עם נקודות (e.g. stage7.capex.flexibleFurniture)
 */
function setDeepValue(obj, path, value) {
  const parts = path.split(".");
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!curr[p] || typeof curr[p] !== "object") {
      curr[p] = {};
    }
    curr = curr[p];
  }
  const lastKey = parts[parts.length - 1];

  // עיבוד מיוחד לשדות מערכים ומספרים
  if (path === "stage1.focusDomains" || path === "stage1.corePrinciples") {
    curr[lastKey] = value.split(",").map(s => s.trim()).filter(Boolean);
  } else if (path.includes("Cost") || path.includes("Budget") || path.includes("Equipment") || 
             path.includes("Furniture") || path.includes("Infrastructure") || path.includes("Fund") || 
             path.includes("size") || path.includes("contingency") || path.includes("Positions") || 
             path.includes("fees") || path.includes("Licenses") || path.includes("Materials") ||
             path.includes("Utilities") || path.includes("Security") || path.includes("Events") ||
             path.includes("Participants") || path.includes("Population") || path.includes("Count")) {
    const num = parseFloat(value);
    curr[lastKey] = isNaN(num) ? value : num;
  } else {
    curr[lastKey] = value;
  }
}

/**
 * פונקציית הליבה: קריאה, פענוח ואימות של קובץ המשתמש
 */
function parseImportFile(fileContent, fileName = "") {
  if (!fileContent || !fileContent.trim()) {
    return {
      success: false,
      errors: ["הקובץ שהועלה ריק לחלוטין. אנא בחר קובץ עם נתוני תכנון."],
      warnings: []
    };
  }

  let parsedData = null;
  const isCsv = fileName.toLowerCase().endsWith(".csv") || fileContent.trim().startsWith("שלב") || fileContent.includes("stage1.");

  try {
    if (isCsv) {
      parsedData = parseCsvToProjectData(fileContent);
    } else {
      // נסיון פיענוח JSON
      try {
        parsedData = JSON.parse(fileContent);
      } catch (jsonErr) {
        return {
          success: false,
          errors: [`שגיאה בפענוח קובץ JSON: תחביר הקובץ אינו תקין (${jsonErr.message}). ודא שהקובץ נשמר בפורמט JSON תקין.`],
          warnings: []
        };
      }
    }
  } catch (err) {
    return {
      success: false,
      errors: [`שגיאה בקריאת הקובץ: ${err.message}`],
      warnings: []
    };
  }

  // אימות שלמות ותקינות נתוני הפרויקט
  const validation = validateProjectData(parsedData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings
    };
  }

  // בניית סיכום תצוגה מקדימה (Preview)
  const preview = buildImportPreview(validation.cleanedData);

  return {
    success: true,
    data: validation.cleanedData,
    errors: [],
    warnings: validation.warnings,
    preview: preview
  };
}

/**
 * אימות וניקוי נתוני הפרויקט (Data Sanitization & Schema Validation)
 */
function validateProjectData(raw) {
  const errors = [];
  const warnings = [];

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      success: false,
      errors: ["מבנה הנתונים אינו תקין: הנתונים חייבים להיות אובייקט פרויקט מובנה."],
      warnings: []
    };
  }

  // מילוי ערכי ברירת מחדל כדי להבטיח מבנה תקין לכל השלבים
  const blank = getBlankProjectData();
  const cleaned = JSON.parse(JSON.stringify(blank));

  // מיזוג נתונים משלב 1
  if (raw.stage1 && typeof raw.stage1 === "object") {
    cleaned.stage1.authorityName = String(raw.stage1.authorityName || "").trim();
    cleaned.stage1.cbsCluster = String(raw.stage1.cbsCluster || "").trim();
    cleaned.stage1.totalPopulation = raw.stage1.totalPopulation || "";
    cleaned.stage1.studentCount = raw.stage1.studentCount || "";
    cleaned.stage1.geographicArea = String(raw.stage1.geographicArea || "").trim();
    cleaned.stage1.visionStatement = String(raw.stage1.visionStatement || "").trim();
    cleaned.stage1.focusDomains = Array.isArray(raw.stage1.focusDomains) ? raw.stage1.focusDomains : [];
    cleaned.stage1.corePrinciples = Array.isArray(raw.stage1.corePrinciples) ? raw.stage1.corePrinciples : [];
    cleaned.stage1.desiredOutcomes = String(raw.stage1.desiredOutcomes || "").trim();
    cleaned.stage1.notes = String(raw.stage1.notes || "").trim();
  } else {
    warnings.push("שלב 1 (פרטי יישוב וחזון) לא נמצא בקובץ או היה חסר — אותחלו ערכים ריקים.");
  }

  if (!cleaned.stage1.authorityName) {
    warnings.push("שם הרשות המקומית (שלב 1) לא צוין בקובץ.");
  }

  // מיזוג שלב 2
  if (raw.stage2 && typeof raw.stage2 === "object") {
    cleaned.stage2.targetPopulations = String(raw.stage2.targetPopulations || "").trim();
    cleaned.stage2.identifiedNeeds = String(raw.stage2.identifiedNeeds || "").trim();
    cleaned.stage2.strengths = String(raw.stage2.strengths || "").trim();
    cleaned.stage2.dataSources = String(raw.stage2.dataSources || "").trim();
    cleaned.stage2.updateDate = String(raw.stage2.updateDate || "").trim();
    cleaned.stage2.missingDataNotes = String(raw.stage2.missingDataNotes || "").trim();
    
    if (raw.stage2.barriers && typeof raw.stage2.barriers === "object") {
      cleaned.stage2.barriers.transportation = String(raw.stage2.barriers.transportation || "").trim();
      cleaned.stage2.barriers.socioeconomic = String(raw.stage2.barriers.socioeconomic || "").trim();
      cleaned.stage2.barriers.languageCulture = String(raw.stage2.barriers.languageCulture || "").trim();
      cleaned.stage2.barriers.infrastructure = String(raw.stage2.barriers.infrastructure || "").trim();
    }
    if (Array.isArray(raw.stage2.neighborhoods)) {
      cleaned.stage2.neighborhoods = raw.stage2.neighborhoods;
    }
    if (Array.isArray(raw.stage2.ageGroups)) {
      cleaned.stage2.ageGroups = raw.stage2.ageGroups;
    }
  }

  // מיזוג שלב 3
  if (raw.stage3 && typeof raw.stage3 === "object") {
    if (Array.isArray(raw.stage3.programs)) {
      cleaned.stage3.programs = raw.stage3.programs;
    }
  }

  // מיזוג שלב 4
  if (raw.stage4 && typeof raw.stage4 === "object") {
    cleaned.stage4.unaddressedNeeds = String(raw.stage4.unaddressedNeeds || "").trim();
    cleaned.stage4.underservedPopulations = String(raw.stage4.underservedPopulations || "").trim();
    cleaned.stage4.programOverlaps = String(raw.stage4.programOverlaps || "").trim();
    cleaned.stage4.partnershipOpportunities = String(raw.stage4.partnershipOpportunities || "").trim();
    cleaned.stage4.notes = String(raw.stage4.notes || "").trim();
  }

  // מיזוג שלב 5
  if (raw.stage5 && typeof raw.stage5 === "object") {
    const validModels = ["centralized", "hub_and_spoke", "mobile", "ecosystem_network"];
    const model = String(raw.stage5.modelType || "hub_and_spoke").trim();
    cleaned.stage5.modelType = validModels.includes(model) ? model : "hub_and_spoke";
    if (!validModels.includes(model) && raw.stage5.modelType) {
      warnings.push(`מודל פעולה '${raw.stage5.modelType}' אינו מוכר — הוגדר 'hub_and_spoke' כברירת מחדל.`);
    }

    cleaned.stage5.activityFrequency = String(raw.stage5.activityFrequency || "afternoon_and_morning").trim();
    cleaned.stage5.estimatedParticipantsPerYear = safePosNum(raw.stage5.estimatedParticipantsPerYear, 600);
    cleaned.stage5.admissionPolicy = String(raw.stage5.admissionPolicy || "mixed_portfolios").trim();
    cleaned.stage5.communityOpenness = String(raw.stage5.communityOpenness || "high").trim();
    cleaned.stage5.modelRationale = String(raw.stage5.modelRationale || "").trim();
  }

  // מיזוג שלב 6 (מרחבים)
  if (raw.stage6 && typeof raw.stage6 === "object") {
    cleaned.stage6.governanceStructure = String(raw.stage6.governanceStructure || "").trim();
    cleaned.stage6.keyPartners = String(raw.stage6.keyPartners || "").trim();
    cleaned.stage6.staffingRoles = String(raw.stage6.staffingRoles || "").trim();
    cleaned.stage6.pedagogicalConcept = String(raw.stage6.pedagogicalConcept || "").trim();

    if (raw.stage6.spaces && typeof raw.stage6.spaces === "object") {
      for (const [key, sp] of Object.entries(raw.stage6.spaces)) {
        if (cleaned.stage6.spaces[key] && sp && typeof sp === "object") {
          const rawSize = sp.size;
          const numSize = safePosNum(rawSize, cleaned.stage6.spaces[key].size);
          if (rawSize !== undefined && rawSize !== null && (isNaN(parseFloat(rawSize)) || parseFloat(rawSize) < 0)) {
            warnings.push(`שטח עבור מרחב '${cleaned.stage6.spaces[key].desc}' הכיל ערך שגוי ("${rawSize}") ואופס/תוקן ל-${numSize} מ"ר.`);
          }
          cleaned.stage6.spaces[key].size = numSize;
          if (typeof sp.included === "boolean") {
            cleaned.stage6.spaces[key].included = sp.included;
          }
        }
      }
    }
  }

  // מיזוג שלב 7 (CAPEX / OPEX / מימון)
  if (raw.stage7 && typeof raw.stage7 === "object") {
    // CAPEX
    if (raw.stage7.capex && typeof raw.stage7.capex === "object") {
      const c = raw.stage7.capex;
      cleaned.stage7.capex.renovationCostPerSqMeter = sanitizeNumberField(c.renovationCostPerSqMeter, 2400, "עלות שיפוץ למ\"ר", warnings);
      cleaned.stage7.capex.flexibleFurniture = sanitizeNumberField(c.flexibleFurniture, 280000, "ריהוט דינמי", warnings);
      cleaned.stage7.capex.techAndMakerEquipment = sanitizeNumberField(c.techAndMakerEquipment, 450000, "ציוד מעבדות", warnings);
      cleaned.stage7.capex.networkAndAvInfrastructure = sanitizeNumberField(c.networkAndAvInfrastructure, 160000, "תשתיות תקשוב", warnings);
      cleaned.stage7.capex.contingencyPercent = sanitizeNumberField(c.contingencyPercent, 10, "בצ\"מ", warnings);
    }

    // OPEX
    if (raw.stage7.opex && typeof raw.stage7.opex === "object") {
      const o = raw.stage7.opex;
      cleaned.stage7.opex.managerCost = sanitizeNumberField(o.managerCost, 310000, "שכר מנהל", warnings);
      cleaned.stage7.opex.instructorPositions = sanitizeNumberField(o.instructorPositions, 3.5, "משרות הדרכה", warnings);
      cleaned.stage7.opex.instructorCostPerPosition = sanitizeNumberField(o.instructorCostPerPosition, 140000, "עלות משרת הדרכה", warnings);
      cleaned.stage7.opex.adminAndTechSupport = sanitizeNumberField(o.adminAndTechSupport, 140000, "תמיכה אדמיניסטרטיבית", warnings);
      cleaned.stage7.opex.maintenanceAndUtilities = sanitizeNumberField(o.maintenanceAndUtilities, 130000, "אחזקה ומבנה", warnings);
      cleaned.stage7.opex.insuranceAndSecurity = sanitizeNumberField(o.insuranceAndSecurity, 45000, "ביטוח ואבטחה", warnings);
      cleaned.stage7.opex.consumableMaterials = sanitizeNumberField(o.consumableMaterials, 90000, "חומרים מתכלים", warnings);
      cleaned.stage7.opex.softwareLicenses = sanitizeNumberField(o.softwareLicenses, 60000, "רישיונות תוכנה", warnings);
      cleaned.stage7.opex.scholarshipAndTransportFund = sanitizeNumberField(o.scholarshipAndTransportFund, 120000, "קרן מלגות והסעות", warnings);
      cleaned.stage7.opex.marketingAndCommunityEvents = sanitizeNumberField(o.marketingAndCommunityEvents, 40000, "אירועים וקהילה", warnings);
    }

    // מימון
    if (raw.stage7.fundingSources && typeof raw.stage7.fundingSources === "object") {
      const f = raw.stage7.fundingSources;
      cleaned.stage7.fundingSources.municipalBudget = sanitizeNumberField(f.municipalBudget, 0, "השתתפות רשות", warnings);
      cleaned.stage7.fundingSources.moeGefenAndGrants = sanitizeNumberField(f.moeGefenAndGrants, 0, "משרד החינוך", warnings);
      cleaned.stage7.fundingSources.philanthropyAndIndustry = sanitizeNumberField(f.philanthropyAndIndustry, 0, "פילנתרופיה", warnings);
      cleaned.stage7.fundingSources.subsidizedParentFees = sanitizeNumberField(f.subsidizedParentFees, 0, "השתתפות הורים", warnings);
    }

    cleaned.stage7.fundingRiskAssessment = String(raw.stage7.fundingRiskAssessment || "").trim();
  }

  // מיזוג שלב 8
  if (raw.stage8 && typeof raw.stage8 === "object") {
    cleaned.stage8.processIndicators = String(raw.stage8.processIndicators || "").trim();
    cleaned.stage8.outcomeIndicators = String(raw.stage8.outcomeIndicators || "").trim();
    cleaned.stage8.evaluationMethodology = String(raw.stage8.evaluationMethodology || "").trim();
    if (Array.isArray(raw.stage8.milestones)) {
      cleaned.stage8.milestones = raw.stage8.milestones;
    }
    if (Array.isArray(raw.stage8.statutoryApprovals)) {
      cleaned.stage8.statutoryApprovals = raw.stage8.statutoryApprovals;
    }
  }

  cleaned.isDemo = false;
  cleaned.lastImported = new Date().toISOString();

  return {
    success: errors.length === 0,
    cleanedData: cleaned,
    errors,
    warnings
  };
}

function sanitizeNumberField(val, defaultVal, label, warnings) {
  if (val === undefined || val === null || val === "") {
    return defaultVal;
  }
  const parsed = parseFloat(val);
  if (isNaN(parsed) || parsed < 0) {
    warnings.push(`השדה '${label}' הכיל ערך בלתי תקין ("${val}") ותוקן לערך הברירת מחדל (${defaultVal}).`);
    return defaultVal;
  }
  return parsed;
}

/**
 * בניית תצוגה מקדימה לחישובי הקובץ לפני טעינה
 */
function buildImportPreview(data) {
  const spaceRes = calculateSpaces(data.stage6?.spaces);
  const capexRes = calculateCapex(data.stage7?.capex, spaceRes.totalArea);
  const opexRes = calculateOpex(data.stage7?.opex);
  const fundRes = calculateFundingBalance(opexRes.totalOpex, data.stage7?.fundingSources);

  const modelLabels = {
    centralized: "מרכז פיזי אחוד",
    hub_and_spoke: "מרכז ראשי ושלוחות (Hub & Spoke)",
    mobile: "מודל נייד (Mobile Maker)",
    ecosystem_network: "רשת שותפים מבוזרת (Ecosystem)"
  };

  return {
    authorityName: data.stage1?.authorityName || "רשות לא הוגדרה",
    cbsCluster: data.stage1?.cbsCluster || "לא צוין",
    modelName: modelLabels[data.stage5?.modelType] || data.stage5?.modelType || "לא נבחר",
    totalArea: spaceRes.totalArea,
    totalCapex: capexRes.totalCapex,
    totalOpex: opexRes.totalOpex,
    totalFunding: fundRes.totalFunding,
    balance: fundRes.balance,
    riskMessage: fundRes.riskMessage,
    riskLevel: fundRes.riskLevel,
    neighborhoodsCount: data.stage2?.neighborhoods?.length || 0,
    programsCount: data.stage3?.programs?.length || 0
  };
}

// =============================================================================
// ממשק משתמש למודאל ייבוא נתונים
// =============================================================================

function openImportModal() {
  const modal = document.getElementById("importModal");
  if (modal) {
    modal.style.display = "flex";
    resetImportModalUI();
  }
}

function closeImportModal() {
  const modal = document.getElementById("importModal");
  if (modal) {
    modal.style.display = "none";
    resetImportModalUI();
  }
}

function resetImportModalUI() {
  pendingImportData = null;
  const fileInput = document.getElementById("importFileInput");
  if (fileInput) fileInput.value = "";

  const previewBox = document.getElementById("importPreviewBox");
  if (previewBox) previewBox.style.display = "none";

  const errorBox = document.getElementById("importErrorBox");
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
  }

  const warningBox = document.getElementById("importWarningBox");
  if (warningBox) {
    warningBox.style.display = "none";
    warningBox.innerHTML = "";
  }

  const confirmBtn = document.getElementById("importConfirmBtn");
  if (confirmBtn) confirmBtn.disabled = true;
}

/**
 * טיפול בבחירת קובץ על ידי המשתמש (FileReader)
 */
function handleImportFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;
    processImportedContent(content, file.name);
  };

  reader.onerror = function() {
    showImportError("שגיאה בקריאת הקובץ מהמחשב. ייתכן שהקובץ נעול או שאין הרשאת קריאה.");
  };

  reader.readAsText(file, "UTF-8");
}

function processImportedContent(content, fileName) {
  const errorBox = document.getElementById("importErrorBox");
  const warningBox = document.getElementById("importWarningBox");
  const previewBox = document.getElementById("importPreviewBox");
  const confirmBtn = document.getElementById("importConfirmBtn");

  const result = parseImportFile(content, fileName);

  if (!result.success) {
    pendingImportData = null;
    if (confirmBtn) confirmBtn.disabled = true;
    if (previewBox) previewBox.style.display = "none";
    if (errorBox) {
      errorBox.style.display = "block";
      errorBox.innerHTML = `<strong>⚠️ שגיאות בייבוא הקובץ (הנתונים לא שונו):</strong><ul>` + 
        result.errors.map(err => `<li>${escapeHtml(err)}</li>`).join("") + `</ul>`;
    }
    return;
  }

  // הקובץ תקין
  pendingImportData = result.data;
  if (errorBox) errorBox.style.display = "none";

  // הצגת אזהרות אם יש
  if (result.warnings && result.warnings.length > 0 && warningBox) {
    warningBox.style.display = "block";
    warningBox.innerHTML = `<strong>💡 שימת לב / שדות שתוקנו או הושלמו:</strong><ul>` +
      result.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join("") + `</ul>`;
  } else if (warningBox) {
    warningBox.style.display = "none";
  }

  // הצגת תצוגה מקדימה
  renderImportPreview(result.preview);
  if (confirmBtn) confirmBtn.disabled = false;
}

function showImportError(msg) {
  const errorBox = document.getElementById("importErrorBox");
  if (errorBox) {
    errorBox.style.display = "block";
    errorBox.innerHTML = `<strong>⚠️ שגיאה:</strong> ${escapeHtml(msg)}`;
  }
}

function renderImportPreview(p) {
  const previewBox = document.getElementById("importPreviewBox");
  const previewContent = document.getElementById("importPreviewContent");
  if (!previewBox || !previewContent) return;

  const balanceColor = p.balance >= 0 ? "var(--success)" : "var(--danger)";

  previewContent.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;">
      <div class="meta-card meta-card-known">
        <strong>רשות מתוכננת:</strong>
        <div>${escapeHtml(p.authorityName)} (אשכול ${escapeHtml(p.cbsCluster)})</div>
      </div>
      <div class="meta-card meta-card-known">
        <strong>מודל הפעלה:</strong>
        <div>${escapeHtml(p.modelName)}</div>
      </div>
      <div class="meta-card meta-card-known">
        <strong>שטח כולל מתוכנן:</strong>
        <div>${p.totalArea} מ"ר</div>
      </div>
      <div class="meta-card meta-card-known">
        <strong>עלות הקמה חזויה (CAPEX):</strong>
        <div>${formatNIS(p.totalCapex)}</div>
      </div>
      <div class="meta-card meta-card-known">
        <strong>תפעול שנתי חזוי (OPEX):</strong>
        <div>${formatNIS(p.totalOpex)}</div>
      </div>
      <div class="meta-card ${p.balance >= 0 ? 'meta-card-known' : 'meta-card-missing'}">
        <strong>מאזן מימון חזוי:</strong>
        <div style="font-weight:bold; color:${balanceColor}">${formatNIS(p.balance)}</div>
      </div>
    </div>
    <div style="margin-top: 0.75rem; font-size: 0.85rem; color: #475569;">
      <span><strong>הערכת סיכון תקציבי:</strong> ${escapeHtml(p.riskMessage)}</span>
    </div>
  `;

  previewBox.style.display = "block";
}

/**
 * אישור הטעינה ע"י המשתמש
 */
function confirmImport() {
  if (!pendingImportData) {
    alert("לא נבחר קובץ תקין לטעינה.");
    return;
  }

  const saveModeRadio = document.querySelector('input[name="importSaveMode"]:checked');
  const shouldSaveToStorage = saveModeRadio ? saveModeRadio.value === "persistent" : false;

  // טעינת הנתונים למערכת
  appData = JSON.parse(JSON.stringify(pendingImportData));

  if (shouldSaveToStorage) {
    saveData(false);
  }

  // עדכון ממשק וחישובים
  currentStep = 1;
  populateFormFields();
  updateBudgetAndSpaceCalculations();
  renderCurrentStep();
  renderExecutiveSummary();

  closeImportModal();

  const msg = shouldSaveToStorage ? 
    "הנתונים נטענו בהצלחה ונשמרו כפרויקט הפעיל בדפדפן!" : 
    "הנתונים נטענו להרצה נוכחית (שינויים יישמרו ל-LocalStorage רק בלחיצה על 'שמור עבודה').";

  showToast(msg, "success");
}
