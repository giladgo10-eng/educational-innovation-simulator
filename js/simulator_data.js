/**
 * סימולטור מרכז חדשנות חינוכי יישובי
 * מודל נתונים ותרחיש הדגמה לרשות דמיונית ("נאות שקד")
 * 
 * עקרונות מחייבים:
 * 1. כל עלות מוצגת כהערכה לתכנון ואינה מהווה תקן רשמי או עלות מאושרת.
 * 2. אישורי בטיחות, נגישות, כיבוי אש ושימוש במבנה מנוסחים כנקודות לבדיקה מול הגורם המקצועי המוסמך.
 */

const STORAGE_KEY = "educational_innovation_simulator_v1";

// תבנית נקייה לנתוני משתמש
function getBlankProjectData() {
  return {
    isDemo: false,
    lastUpdated: new Date().toISOString(),
    
    // שלב 1: הגדרת היישוב והחזון
    stage1: {
      authorityName: "",
      cbsCluster: "", // אשכול למ"ס 1-10
      totalPopulation: "",
      studentCount: "",
      geographicArea: "", // צפון, מרכז, דרום, פריפריה חברתית
      visionStatement: "",
      focusDomains: [], // stem, arts, entrepreneurship, leadership, interdisciplinary
      corePrinciples: [], // equity, open_pathways, community, wellbeing
      desiredOutcomes: "",
      notes: ""
    },

    // שלב 2: מיפוי צרכים ואוכלוסיות
    stage2: {
      neighborhoods: [],
      ageGroups: [],
      targetPopulations: "",
      identifiedNeeds: "",
      strengths: "",
      barriers: {
        transportation: "",
        socioeconomic: "",
        languageCulture: "",
        infrastructure: ""
      },
      dataSources: "",
      updateDate: "",
      missingDataNotes: ""
    },

    // שלב 3: מיפוי תוכניות קיימות
    stage3: {
      programs: []
    },

    // שלב 4: זיהוי פערים וחפיפות
    stage4: {
      unaddressedNeeds: "",
      underservedPopulations: "",
      programOverlaps: "",
      partnershipOpportunities: "",
      causalityDisclaimerAcknowledged: false,
      notes: ""
    },

    // שלב 5: בחירת מודל מרכז ופורטפוליו
    stage5: {
      modelType: "hub_and_spoke", // centralized, hub_and_spoke, mobile, ecosystem_network
      activityFrequency: "afternoon_and_morning",
      estimatedParticipantsPerYear: 600,
      admissionPolicy: "mixed_portfolios", // exams_only, teacher_recommendation, open_lottery, mixed_portfolios
      communityOpenness: "high", // low, medium, high
      modelRationale: ""
    },

    // שלב 6: תכנון פדגוגי, ארגוני ומרחבי
    stage6: {
      governanceStructure: "",
      keyPartners: "",
      staffingRoles: "",
      pedagogicalConcept: "",
      spaces: {
        plenaryArea: { size: 80, desc: "מרחב התכנסות, שיח קבוצתי והרצאות קצרות", included: true },
        investigationLab: { size: 70, desc: "מעבדת חקר מדעי, סנסורים וניסויים", included: true },
        makerspace: { size: 90, desc: "סדנת ייצור, רובוטיקה, הדפסת תלת-ממד ואלקטרוניקה", included: true },
        quietReflection: { size: 40, desc: "חדר שקט לעבודה אישית, חשיבה וכתיבה", included: true },
        showcasePitch: { size: 50, desc: "גלריית הצגת תוצרים, פיצ'ינג וירידי יזמות", included: true },
        wellbeingSocial: { size: 45, desc: "לאונג' בלתי פורמלי, קפיטריה ורווחה אישית", included: true },
        storageLogistics: { size: 35, desc: "מחסן ציוד, שרתים ותשתיות שירות מונגשות", included: true }
      },
      oecdPrinciplesApplied: []
    },

    // שלב 7: היתכנות תקציבית (CAPEX & OPEX)
    stage7: {
      capex: {
        renovationCostPerSqMeter: 2400, // ₪ למ"ר (הערכה לתכנון ראשוני)
        flexibleFurniture: 280000,
        techAndMakerEquipment: 450000,
        networkAndAvInfrastructure: 160000,
        contingencyPercent: 10 // בצ"מ
      },
      opex: {
        managerCost: 310000, // הערכת עלות מעביד שנתית לתכנון
        instructorPositions: 3.5,
        instructorCostPerPosition: 140000,
        adminAndTechSupport: 140000,
        maintenanceAndUtilities: 130000,
        insuranceAndSecurity: 45000,
        consumableMaterials: 90000,
        softwareLicenses: 60000,
        scholarshipAndTransportFund: 120000,
        marketingAndCommunityEvents: 40000
      },
      fundingSources: {
        municipalBudget: 650000,
        moeGefenAndGrants: 420000,
        philanthropyAndIndustry: 250000,
        subsidizedParentFees: 105000
      },
      fundingRiskAssessment: ""
    },

    // שלב 8: תוכנית הקמה והערכה
    stage8: {
      milestones: [],
      statutoryApprovals: [],
      processIndicators: "",
      outcomeIndicators: "",
      evaluationMethodology: ""
    }
  };
}

// נתוני הדגמה מלאים ומפורטים לרשות הדמיונית "נאות שקד"
function getDemoAuthorityData() {
  return {
    isDemo: true,
    lastUpdated: "2026-10-13",
    
    stage1: {
      authorityName: "נאות שקד (נתוני הדגמה - רשות דמיונית)",
      cbsCluster: "5",
      totalPopulation: "48,500 תושבים",
      studentCount: "9,800 תלמידים (א'-י\"ב)",
      geographicArea: "עיר מעורבת בפריפריה הצפונית",
      visionStatement: "הקמת מרכז חדשנות ומצוינות יישובי המפתח סקרנות, חקר רב-תחומי וכושר המצאה לכלל ילדי היישוב, תוך טיפוח הון אנושי מוביל וצמצום פערים חברתיים-מרחביים.",
      focusDomains: [
        "חקר מדעי וטכנולוגי (STEM)",
        "יזמות ומנהיגות חברתית",
        "חיבור בין-תחומי (אמנות, מדע ועיצוב - STEAM)",
        "קיימות, אנרגיה ואקולוגיה עירונית"
      ],
      corePrinciples: [
        "הוגנות ונגישות לכל השכונות (Equity First)",
        "שערי כניסה מרובים (Multiple Gateways) ללא תלות במבחן יחיד",
        "רצף גילאי מגילאי גן ועד הכנה לאקדמיה ותעסוקה",
        "רווחה רגשית, שייכות וביטחון אישי (Wellbeing)"
      ],
      desiredOutcomes: "הרחבת מעגל המשתתפים בתוכניות חקר ב-40%, הגדלת שיעור הזכאים לבגרות מדעית-טכנולוגית איכותית מ-9% ל-16%, ופיתוח מיזמי קהילה מקומיים.",
      notes: "מודל ההדגמה נבנה על בסיס עקרונות המדריך האסטרטגי למנהלי חינוך ומודל מרכז רבין/אום אל-פחם. כל הנתונים הם להמחשה בלבד."
    },

    stage2: {
      neighborhoods: [
        { name: "קריית רבין (מרכז ותיק)", schools: 6, students: 2600, socioIndex: "אשכול 6", accessBarrier: "נגישות גבוהה ברגל ובתחב\"צ" },
        { name: "נווה הדרים (שכונה צעירה)", schools: 7, students: 3100, socioIndex: "אשכול 7", accessBarrier: "עומסי תנועה בבוקר, היעדר שבילי אופניים" },
        { name: "שכונת הרכבת (שכונה מוחלשת)", schools: 5, students: 2200, socioIndex: "אשכול 3", accessBarrier: "מחסור בתחבורה ציבורית סדירה, פערי מחשוב ביתי" },
        { name: "נאות אילנות (שכונה מרוחקת)", schools: 6, students: 1900, socioIndex: "אשכול 4", accessBarrier: "מרחק גאוגרפי 4.5 ק\"מ ממרכז העיר" }
      ],
      ageGroups: ["גני חובה", "יסודי (א'-ו')", "חטיבת ביניים (ז'-ט')", "חטיבה עליונה (י'-י\"ב)"],
      targetPopulations: "כלל תלמידי העיר, עם דגש מובחן על תלמידים בעלי פוטנציאל שלא אותר במבחנים הסטנדרטיים, ונערות בתחומי טכנולוגיה.",
      identifiedNeeds: "צורך דחוף במעבדות חקר מתקדמות (לחטיבות הביניים אין מעבדות פתוחות אחה\"צ); צורך במרחב יזמות לתלמידי תיכון; מחסור בתוכניות העשרה לגיל הרך.",
      strengths: "צוותי הוראה מחויבים, מכללה טכנולוגית סמוכה, נכונות של חברות היי-טק באזור התעשייה ללוות פרויקטים.",
      barriers: {
        transportation: "אין קו אוטובוס ישיר משכונת הרכבת ומנאות אילנות למיקום המיועד למרכז.",
        socioeconomic: "קושי של 35% מהמשפחות לשלם דמי רישום או לרכוש ציוד מחשוב מתקדם.",
        languageCulture: "אוכלוסייה רב-תרבותית הדורשת הנגשה בשפות עברית, ערבית ורוסית.",
        infrastructure: "מרבית מבני בתי הספר בנויים בתבנית מסורתית ללא מרחבים גמישים."
      },
      dataSources: "נתוני מיפוי שפ\"ח, דוח תנועות תחב\"צ עירוני, נתוני מצבת תלמידים מנב\"ס (תשפ\"ו).",
      updateDate: "2026-09-01",
      missingDataNotes: "חסר נתון מדויק לגבי שיעור בעלי מחשב אישי מחובר לרשת בשכונת הרכבת (מוגדר כהערכה בלבד)."
    },

    stage3: {
      programs: [
        {
          id: "prog_1",
          name: "מרכז העשרה למחוננים (יום שליפה אזורי)",
          operator: "משרד החינוך (האגף למחוננים)",
          domain: "העשרה כללית וחקר",
          targetAge: "כיתות ג'-ו'",
          location: "מחוץ לעיר (נסיעה של 25 דקות)",
          participants: 85,
          entryCriteria: "מבחן איתור שלב ב' של משרד החינוך בלבד (מאיון עליון)",
          costToFamily: "מסובסד (הערכה: כ-1,800 ₪ לשנה + הסעה)",
          sourceType: "verified",
          statusNotes: "מאומת מול פורטל הורים תשפ\"ו. משרת רק 0.8% מכלל התלמידים ברשות."
        },
        {
          id: "prog_2",
          name: "תוכנית סייבר ומחשבים 'מגשימים'",
          operator: "מרכז רש\"י ומשרד הביטחון",
          domain: "מדעי המחשב וסייבר",
          targetAge: "כיתות י'-י\"ב",
          location: "בניין אשכול פיס עירוני",
          participants: 40,
          entryCriteria: "מיונים קוגניטיביים ומבחני כניסה מתקדמים",
          costToFamily: "ללא עלות",
          sourceType: "verified",
          statusNotes: "מאומת מול דוח רכז המדעים העירוני. דרישות קדם גבוהות מאוד."
        },
        {
          id: "prog_3",
          name: "סדנאות רובוטיקה ויזמות צעירה",
          operator: "חברה למתנ\"סים והרשות המקומית",
          domain: "רובוטיקה ו-LEGO",
          targetAge: "כיתות ד'-ו'",
          location: "מתנ\"ס קריית רבין",
          participants: 60,
          entryCriteria: "רישום פתוח על בסיס מקום פנוי",
          costToFamily: "280 ₪ לחודש (תשלום מלא של ההורים)",
          sourceType: "self_reported",
          statusNotes: "דיווח עצמי של המתנ\"ס. השתתפות אפסית של תלמידים משכונת הרכבת עקב העלות."
        },
        {
          id: "prog_4",
          name: "חממת חקר ירוק וקיימות (גפ\"ן)",
          operator: "עמותה ירוקה בשיתוף בתי ספר",
          domain: "אקולוגיה וחקר סביבתי",
          targetAge: "כיתות ז'-ח'",
          location: "שני בתי ספר יסודיים בלבד",
          participants: 75,
          entryCriteria: "המלצת מורי מדעים",
          costToFamily: "ללא עלות (מימון סל גפ\"ן)",
          sourceType: "verified",
          statusNotes: "פועל רק במסגרת שעות הלימודים הפורמליות. אין מענה בשעות אחה\"צ."
        },
        {
          id: "prog_5",
          name: "תוכנית קידום 5 יחידות מתמטיקה ומדעים",
          operator: "הפיקוח על המדעים / קרן טראמפ",
          domain: "מתמטיקה מואצת",
          targetAge: "כיתות י'-י\"ב",
          location: "שלושת התיכונים בעיר",
          participants: 120,
          entryCriteria: "הישגים לימודיים במבחני חט\"ב (ציון 85+)",
          costToFamily: "ללא עלות",
          sourceType: "verified",
          statusNotes: "ממוקד בהוראה פרונטלית לבגרות ולא בחקר עצמאי או יזמות."
        }
      ]
    },

    stage4: {
      unaddressedNeeds: "אין בעיר שום מרחב פתוח להתנסות בייצור טכנולוגי (Makerspace), אלקטרוניקה ו-AI הפועל בשעות אחה\"צ; גילאי הגן ויסודי נמוך (א'-ב') מודרים לחלוטין מתוכניות חקר.",
      underservedPopulations: "תלמידי שכונת הרכבת ונאות אילנות (כ-42% מתלמידי העיר) זוכים לפחות מ-12% מכלל המקומות בתוכניות המצוינות הקיימות; תלמידים יצירתיים שלא אותרו במבחן המחוננים הפורמלי אינם מקבלים הזדמנות.",
      programOverlaps: "קיימת חפיפה ותחרות בין תוכנית מגשימים למגמת הנדסת תוכנה בתיכון על אותם 25 תלמידים מובילים.",
      partnershipOpportunities: "ניתן לרתום את המכללה הטכנולוגית להפעלת מעבדות וסדנאות סטודנטים במרכז, ולשלב את מתנדבי חברות ההייטק כחונכים (Mentors).",
      causalityDisclaimerAcknowledged: true,
      notes: "הערה מתודולוגית: הפערים זוהו בהצלבת מיפוי התוכניות עם מפות הרישום. הפער בהשתתפות נגזר מחסמי תחבורה ועלות ולא מחוסר עניין או יכולת."
    },

    stage5: {
      modelType: "hub_and_spoke", // מרכז ראשי מנחה + שלוחות פעילות
      activityFrequency: "afternoon_and_morning",
      estimatedParticipantsPerYear: 650,
      admissionPolicy: "mixed_portfolios", // מסלול גמיש: תיק עבודות, המלצת מחנך, מוטיבציה
      communityOpenness: "high",
      modelRationale: "מודל Hub & Spoke מאפשר להקים עוגן מרכזי מצויד היטב במרכז העיר (Hub), לצד שתי שלוחות קלות בשכונת הרכבת ובנאות אילנות, ובכך לנטרל את חסם התחבורה. שערי הכניסה מבוססים על המלצות מורים ותיקי עבודות ולא על מבחן פסיכומטרי יחיד."
    },

    stage6: {
      governanceStructure: "ועדת היגוי עירונית בראשות מנהל/ת אגף החינוך, מפקחת המחוז, נציג הגזברות, נציג הנהגת ההורים ומנהל/ת המרכז. ישיבות חודשיות עם פרוטוקול ומדדים גלויים.",
      keyPartners: "משרד החינוך (מינהל חדשנות וטכנולוגיה), המכללה הטכנולוגית האזורית, 2 חברות תעשייה מאזור התעשייה, וקרן פילנתרופית אזורית.",
      staffingRoles: "מנהל/ת מרכז (100% משרה, רקע פדגוגי וטכנולוגי), 3 מדריכי חקר ומייקרס (75% משרה כל אחד), רכז/ת קהילה ותקשוב (50% משרה), סטודנטים מלווים (קרן מלגות).",
      pedagogicalConcept: "למידה מבוססת פרויקטים ויזמות (PBL), פתרון אתגרים עירוניים אמיתיים (Urban Challenges), עבודה בצוותים הטרוגניים, ורצף פדגוגי הנשען על עקרונות OECD ILE.",
      spaces: {
        plenaryArea: { size: 85, desc: "ארנת התכנסות מודולרית לשיח, הרצאות TED עירוניות ומפגשי פתיחה", included: true },
        investigationLab: { size: 75, desc: "מעבדת חקר מדעי, ביו-טק וחיישני סביבה", included: true },
        makerspace: { size: 95, desc: "מתחם ייצור: מדפסות 3D, חיתוך לייזר, רובוטיקה, כלי עבודה בטוחים", included: true },
        quietReflection: { size: 40, desc: "מרחב שקט לעיון, תכנות מעמיק, כתיבה וחשיבה עצמאית", included: true },
        showcasePitch: { size: 55, desc: "מתחם תצוגת תוצרים, במה פתוחה וירידי הצגת מיזמים לקהילה", included: true },
        wellbeingSocial: { size: 45, desc: "לאונג' בלתי פורמלי עם קפיטריה בריאה, מרחב שהייה ומפגש חברתי", included: true },
        storageLogistics: { size: 35, desc: "חדר אחסנה בטוח לציוד יקר, שרתים ותשתיות שירות מונגשות", included: true }
      },
      oecdPrinciplesApplied: [
        "הלומדים במרכז (Learners at the centre)",
        "הטבע החברתי של הלמידה (Social nature of learning)",
        "רגשות ומניעים הם חלק בלתי נפרד מהלמידה (Emotions & motivation integral)",
        "הכרה בהבדלים אינדיבידואליים (Recognising individual differences)",
        "חיבורים בין-תחומיים וקשר לקהילה (Building horizontal connections)"
      ]
    },

    stage7: {
      capex: {
        renovationCostPerSqMeter: 2400, // הערכת תכנון: 2,400 ₪ למ"ר (שטח כולל 430 מ"ר -> 1,032,000 ₪)
        flexibleFurniture: 290000,
        techAndMakerEquipment: 460000,
        networkAndAvInfrastructure: 165000,
        contingencyPercent: 10 // 194,700 ₪
      },
      opex: {
        managerCost: 310000, // הערכת עלות מעביד לתכנון
        instructorPositions: 3.5,
        instructorCostPerPosition: 140000, // הערכת עלות מעביד למשרת הדרכה: 490,000 ₪
        adminAndTechSupport: 135000,
        maintenanceAndUtilities: 140000,
        insuranceAndSecurity: 50000,
        consumableMaterials: 95000,
        softwareLicenses: 65000,
        scholarshipAndTransportFund: 130000,
        marketingAndCommunityEvents: 45000
      },
      fundingSources: {
        municipalBudget: 680000, // 46.6% מעלות התפעול
        moeGefenAndGrants: 450000, // 30.8%
        philanthropyAndIndustry: 230000, // 15.8%
        subsidizedParentFees: 100000 // 6.8% (גבייה מדורגת)
      },
      fundingRiskAssessment: "סיכון בינוני: הרשות מספקת עוגן יציב של כ-47% מהתפעול; תלות של 16% בפילנתרופיה מחייבת גיבוי בחוזי רשות לשלוש שנים; קרן המלגות מגינה על תלמידי שכונת הרכבת."
    },

    stage8: {
      milestones: [
        { phase: "שלב א'", name: "גיבוש ועדת היגוי ואישור פרוגרמה רשותית", duration: "חודשים 1-2", owner: "מנהל/ת אגף חינוך", dep: "הנהלת העירייה", checkRequired: true },
        { phase: "שלב א'", name: "הקצאת נכס פיזי ובדיקת מורשה נגישות ויועץ בטיחות", duration: "חודש 2", owner: "מחלקת נכסים והנדסה", dep: "בדיקת מהנדס עיר", checkRequired: true },
        { phase: "שלב ב'", name: "מכרז שיפוץ והתאמות פנים", duration: "חודשים 3-5", owner: "גזברות ומנהל הנדסה", dep: "תקציב תב\"ר מאושר", checkRequired: false },
        { phase: "שלב ב'", name: "רכש ציוד טכנולוגי, ריהוט מודולרי ותקשוב", duration: "חודשים 5-6", owner: "מנהל/ת רכש ומחשוב", dep: "קבלת מבנה", checkRequired: false },
        { phase: "שלב ג'", name: "גיוס מנהל/ת מרכז והכשרת צוות מדריכים", duration: "חודשים 6-7", owner: "משאבי אנוש ואגף חינוך", dep: "אישור תקן משרה", checkRequired: true },
        { phase: "שלב ג'", name: "קול קורא פתוח להרשמה ותיקי עבודות בבתי הספר", duration: "חודש 7", owner: "צוות המרכז והנהלות בתי\"ס", dep: "הגדרת קריטריונים", checkRequired: false },
        { phase: "שלב ד'", name: "הרצת פיילוט מצומצם (150 תלמידים)", duration: "חודשים 8-9", owner: "צוות המרכז", dep: "קבלת אישורי בטיחות ונגישות", checkRequired: true },
        { phase: "שלב ד'", name: "פתיחה רשמית והרחבה לכלל השכונות", duration: "חודש 10 ואילך", owner: "הנהלת המרכז", dep: "הפקת לקחי פיילוט", checkRequired: false }
      ],
      statutoryApprovals: [
        { item: "בדיקת בטיחות מוסדות חינוך (יועץ בטיחות מוסמך)", status: "טעון בדיקה ואישור לפני כניסת תלמידים", authority: "יועץ בטיחות מוסמך / קב\"ט מוסדות חינוך ברשות" },
        { item: "חוות דעת נגישות מתו\"ס (מבנים, תשתיות וסביבה)", status: "טעון בדיקה לפי חוק שוויון זכויות לאנשים עם מוגבלות", authority: "מורשה נגישות מתו\"ס" },
        { item: "דרישות והנחיות בטיחות אש", status: "טעון בדיקה מול שירותי כבאות והצלה (לפי סיווג המבנה והתפוסה)", authority: "רשות כבאות והצלה" },
        { item: "בדיקת ייעוד הנכס והיתר שימוש", status: "טעון בירור מול אגף הנדסה בהתאם לייעוד הנכס הקיים", authority: "אגף הנדסה / הוועדה המקומית לתכנון ובנייה" },
        { item: "העסקת עובדי הוראה והדרכה (אישור משטרה)", status: "טעון בדיקה לפי החוק למניעת העסקת עברייני מין", authority: "משטרת ישראל / מחלקת משאבי אנוש" }
      ],
      processIndicators: "שיעור התלמידים מכל שכונה (חובת ייצוג של לפחות 20% משכונת הרכבת); שיעור התמדה שנתי מעל 85%; מדד שביעות רצון הורים ומורים מעל 80%.",
      outcomeIndicators: "מספר פרויקטי חקר ומיזמים יישוביים שהושלמו (יעד: 30 מיזמים בשנה א'); שיעור בוגרי המרכז הממשיכים למגמות מדעיות-טכנולוגיות בתיכון; שיפור בפתרון בעיות מורכבות (מדידה מעצבת).",
      evaluationMethodology: "הערכה מעצבת מלווה (מחקר פעולה) בהובלת מוסד אקדמי שותף, עם סקרי עמדות פעמיים בשנה, פורטפוליו תוצרים וקבוצות מיקוד של תלמידים והורים."
    }
  };
}
