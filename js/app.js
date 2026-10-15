/**
 * סימולטור מרכז חדשנות חינוכי יישובי
 * מנוע האפליקציה (ניהול שלבים, עדכון נתונים, אירועים ותצוגת סיכום)
 */

let appData = {};
let currentStep = 1;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  loadData();
  setupStepperNav();
  setupEventListeners();
  updateBudgetAndSpaceCalculations();
  renderExecutiveSummary();
  renderCurrentStep();
}

/**
 * טעינת נתונים מ-LocalStorage או ברירת מחדל הדגמה
 */
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.error("שגיאה בקריאת נתונים מ-LocalStorage, טוען נתוני הדגמה:", e);
      appData = getDemoAuthorityData();
    }
  } else {
    // טעינת תרחיש ההדגמה המובנה כברירת מחדל ראשונית כדי שהמשתמש יראה מערכת פעילה מיד
    appData = getDemoAuthorityData();
    saveData(false);
  }
}

function saveData(showToastMsg = true) {
  appData.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  if (showToastMsg) {
    showToast("הנתונים נשמרו בהצלחה בדפדפן המקומי", "success");
  }
}

function resetToBlank() {
  if (confirm("האם לאפס את כל הנתונים ולהתחיל תכנון רשות מאפס? כל השינויים שלא גובו ימחקו.")) {
    appData = getBlankProjectData();
    saveData(false);
    currentStep = 1;
    updateBudgetAndSpaceCalculations();
    renderExecutiveSummary();
    renderCurrentStep();
    showToast("המערכת אופסה לתבנית עבודה נקייה", "warning");
  }
}

function loadDemoData() {
  if (confirm("האם לטעון את תרחיש ההדגמה של הרשות הדמיונית 'נאות שקד'? פעולה זו תחליף את הנתונים הנוכחיים.")) {
    appData = getDemoAuthorityData();
    saveData(false);
    currentStep = 1;
    updateBudgetAndSpaceCalculations();
    renderExecutiveSummary();
    renderCurrentStep();
    showToast("נטענו נתוני ההדגמה של הרשות 'נאות שקד'", "info");
  }
}

/**
 * ניווט בסרגל השלבים
 */
function setupStepperNav() {
  const tabs = document.querySelectorAll(".step-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const step = parseInt(tab.dataset.step, 10);
      if (!isNaN(step)) {
        goToStep(step);
      } else if (tab.dataset.step === "summary") {
        goToSummary();
      }
    });
  });
}

function goToStep(step) {
  // שמירת שדות הטופס הנוכחי לפני מעבר
  captureCurrentStepInputs();
  currentStep = step;
  renderCurrentStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToSummary() {
  captureCurrentStepInputs();
  currentStep = "summary";
  renderExecutiveSummary();
  renderCurrentStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStep() {
  if (typeof currentStep === "number") {
    if (currentStep < 8) {
      goToStep(currentStep + 1);
    } else {
      goToSummary();
    }
  }
}

function prevStep() {
  if (currentStep === "summary") {
    goToStep(8);
  } else if (typeof currentStep === "number" && currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

/**
 * עדכון תצוגת השלב הנוכחי
 */
function renderCurrentStep() {
  // עדכון סרגל השלבים העליון
  document.querySelectorAll(".step-tab").forEach(tab => {
    tab.classList.remove("active");
    const stepVal = tab.dataset.step;
    if (stepVal === String(currentStep)) {
      tab.classList.add("active");
    }
  });

  // הסתרת כל הפאנלים
  document.querySelectorAll(".stage-panel").forEach(panel => {
    panel.classList.remove("active");
  });

  // הצגת הפאנל הרלוונטי
  const targetId = currentStep === "summary" ? "stageSummary" : `stage${currentStep}`;
  const targetPanel = document.getElementById(targetId);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  // עדכון באנר הדגמה
  const demoBanner = document.getElementById("demoBanner");
  if (demoBanner) {
    demoBanner.style.display = appData.isDemo ? "flex" : "none";
  }

  // סנכרון שדות הטופס מתוך appData
  populateFormFields();

  // הרצת חישובים רלוונטיים
  updateBudgetAndSpaceCalculations();
}

/**
 * סנכרון ערכים מטפסים ל-appData
 */
function captureCurrentStepInputs() {
  if (currentStep === 1) {
    appData.stage1.authorityName = getVal("s1_authorityName");
    appData.stage1.cbsCluster = getVal("s1_cbsCluster");
    appData.stage1.totalPopulation = getVal("s1_totalPopulation");
    appData.stage1.studentCount = getVal("s1_studentCount");
    appData.stage1.geographicArea = getVal("s1_geographicArea");
    appData.stage1.visionStatement = getVal("s1_visionStatement");
    appData.stage1.desiredOutcomes = getVal("s1_desiredOutcomes");
    appData.stage1.notes = getVal("s1_notes");
  } else if (currentStep === 2) {
    appData.stage2.targetPopulations = getVal("s2_targetPopulations");
    appData.stage2.identifiedNeeds = getVal("s2_identifiedNeeds");
    appData.stage2.strengths = getVal("s2_strengths");
    if (!appData.stage2.barriers) appData.stage2.barriers = {};
    appData.stage2.barriers.transportation = getVal("s2_barrier_transport");
    appData.stage2.barriers.socioeconomic = getVal("s2_barrier_socio");
    appData.stage2.barriers.languageCulture = getVal("s2_barrier_lang");
    appData.stage2.barriers.infrastructure = getVal("s2_barrier_infra");
    appData.stage2.dataSources = getVal("s2_dataSources");
    appData.stage2.updateDate = getVal("s2_updateDate");
    appData.stage2.missingDataNotes = getVal("s2_missingDataNotes");
  } else if (currentStep === 4) {
    appData.stage4.unaddressedNeeds = getVal("s4_unaddressedNeeds");
    appData.stage4.underservedPopulations = getVal("s4_underservedPopulations");
    appData.stage4.programOverlaps = getVal("s4_programOverlaps");
    appData.stage4.partnershipOpportunities = getVal("s4_partnershipOpportunities");
    appData.stage4.notes = getVal("s4_notes");
  } else if (currentStep === 5) {
    appData.stage5.activityFrequency = getVal("s5_activityFrequency");
    appData.stage5.estimatedParticipantsPerYear = parseInt(getVal("s5_estimatedParticipants"), 10) || 0;
    appData.stage5.admissionPolicy = getVal("s5_admissionPolicy");
    appData.stage5.communityOpenness = getVal("s5_communityOpenness");
    appData.stage5.modelRationale = getVal("s5_modelRationale");
  } else if (currentStep === 6) {
    appData.stage6.governanceStructure = getVal("s6_governanceStructure");
    appData.stage6.keyPartners = getVal("s6_keyPartners");
    appData.stage6.staffingRoles = getVal("s6_staffingRoles");
    appData.stage6.pedagogicalConcept = getVal("s6_pedagogicalConcept");
  } else if (currentStep === 7) {
    if (!appData.stage7.capex) appData.stage7.capex = {};
    appData.stage7.capex.renovationCostPerSqMeter = parseFloat(getVal("s7_renovationCost")) || 0;
    appData.stage7.capex.flexibleFurniture = parseFloat(getVal("s7_furnitureCost")) || 0;
    appData.stage7.capex.techAndMakerEquipment = parseFloat(getVal("s7_equipmentCost")) || 0;
    appData.stage7.capex.networkAndAvInfrastructure = parseFloat(getVal("s7_networkCost")) || 0;
    appData.stage7.capex.contingencyPercent = parseFloat(getVal("s7_contingencyPercent")) || 0;

    if (!appData.stage7.opex) appData.stage7.opex = {};
    appData.stage7.opex.managerCost = parseFloat(getVal("s7_managerCost")) || 0;
    appData.stage7.opex.instructorPositions = parseFloat(getVal("s7_instructorPositions")) || 0;
    appData.stage7.opex.instructorCostPerPosition = parseFloat(getVal("s7_instructorCostPerPos")) || 0;
    appData.stage7.opex.adminAndTechSupport = parseFloat(getVal("s7_adminTechCost")) || 0;
    appData.stage7.opex.maintenanceAndUtilities = parseFloat(getVal("s7_maintenanceCost")) || 0;
    appData.stage7.opex.insuranceAndSecurity = parseFloat(getVal("s7_insuranceCost")) || 0;
    appData.stage7.opex.consumableMaterials = parseFloat(getVal("s7_consumablesCost")) || 0;
    appData.stage7.opex.softwareLicenses = parseFloat(getVal("s7_softwareCost")) || 0;
    appData.stage7.opex.scholarshipAndTransportFund = parseFloat(getVal("s7_scholarshipCost")) || 0;
    appData.stage7.opex.marketingAndCommunityEvents = parseFloat(getVal("s7_marketingCost")) || 0;

    if (!appData.stage7.fundingSources) appData.stage7.fundingSources = {};
    appData.stage7.fundingSources.municipalBudget = parseFloat(getVal("s7_fundMunicipal")) || 0;
    appData.stage7.fundingSources.moeGefenAndGrants = parseFloat(getVal("s7_fundMoe")) || 0;
    appData.stage7.fundingSources.philanthropyAndIndustry = parseFloat(getVal("s7_fundPhilanthropy")) || 0;
    appData.stage7.fundingSources.subsidizedParentFees = parseFloat(getVal("s7_fundParentFees")) || 0;
    appData.stage7.fundingRiskAssessment = getVal("s7_fundingRiskAssessment");
  } else if (currentStep === 8) {
    appData.stage8.processIndicators = getVal("s8_processIndicators");
    appData.stage8.outcomeIndicators = getVal("s8_outcomeIndicators");
    appData.stage8.evaluationMethodology = getVal("s8_evaluationMethodology");
  }

  saveData(false);
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = (val !== undefined && val !== null) ? val : "";
}

/**
 * הזנת ערכים לשדות הטפסים
 */
function populateFormFields() {
  if (currentStep === 1) {
    setVal("s1_authorityName", appData.stage1?.authorityName);
    setVal("s1_cbsCluster", appData.stage1?.cbsCluster);
    setVal("s1_totalPopulation", appData.stage1?.totalPopulation);
    setVal("s1_studentCount", appData.stage1?.studentCount);
    setVal("s1_geographicArea", appData.stage1?.geographicArea);
    setVal("s1_visionStatement", appData.stage1?.visionStatement);
    setVal("s1_desiredOutcomes", appData.stage1?.desiredOutcomes);
    setVal("s1_notes", appData.stage1?.notes);
  } else if (currentStep === 2) {
    setVal("s2_targetPopulations", appData.stage2?.targetPopulations);
    setVal("s2_identifiedNeeds", appData.stage2?.identifiedNeeds);
    setVal("s2_strengths", appData.stage2?.strengths);
    setVal("s2_barrier_transport", appData.stage2?.barriers?.transportation);
    setVal("s2_barrier_socio", appData.stage2?.barriers?.socioeconomic);
    setVal("s2_barrier_lang", appData.stage2?.barriers?.languageCulture);
    setVal("s2_barrier_infra", appData.stage2?.barriers?.infrastructure);
    setVal("s2_dataSources", appData.stage2?.dataSources);
    setVal("s2_updateDate", appData.stage2?.updateDate);
    setVal("s2_missingDataNotes", appData.stage2?.missingDataNotes);
    renderNeighborhoodsTable();
  } else if (currentStep === 3) {
    renderProgramsTable();
  } else if (currentStep === 4) {
    setVal("s4_unaddressedNeeds", appData.stage4?.unaddressedNeeds);
    setVal("s4_underservedPopulations", appData.stage4?.underservedPopulations);
    setVal("s4_programOverlaps", appData.stage4?.programOverlaps);
    setVal("s4_partnershipOpportunities", appData.stage4?.partnershipOpportunities);
    setVal("s4_notes", appData.stage4?.notes);
  } else if (currentStep === 5) {
    renderModelCards();
    setVal("s5_activityFrequency", appData.stage5?.activityFrequency);
    setVal("s5_estimatedParticipants", appData.stage5?.estimatedParticipantsPerYear);
    setVal("s5_admissionPolicy", appData.stage5?.admissionPolicy);
    setVal("s5_communityOpenness", appData.stage5?.communityOpenness);
    setVal("s5_modelRationale", appData.stage5?.modelRationale);
  } else if (currentStep === 6) {
    setVal("s6_governanceStructure", appData.stage6?.governanceStructure);
    setVal("s6_keyPartners", appData.stage6?.keyPartners);
    setVal("s6_staffingRoles", appData.stage6?.staffingRoles);
    setVal("s6_pedagogicalConcept", appData.stage6?.pedagogicalConcept);
    renderSpacesControls();
  } else if (currentStep === 7) {
    setVal("s7_renovationCost", appData.stage7?.capex?.renovationCostPerSqMeter);
    setVal("s7_furnitureCost", appData.stage7?.capex?.flexibleFurniture);
    setVal("s7_equipmentCost", appData.stage7?.capex?.techAndMakerEquipment);
    setVal("s7_networkCost", appData.stage7?.capex?.networkAndAvInfrastructure);
    setVal("s7_contingencyPercent", appData.stage7?.capex?.contingencyPercent);

    setVal("s7_managerCost", appData.stage7?.opex?.managerCost);
    setVal("s7_instructorPositions", appData.stage7?.opex?.instructorPositions);
    setVal("s7_instructorCostPerPos", appData.stage7?.opex?.instructorCostPerPosition);
    setVal("s7_adminTechCost", appData.stage7?.opex?.adminAndTechSupport);
    setVal("s7_maintenanceCost", appData.stage7?.opex?.maintenanceAndUtilities);
    setVal("s7_insuranceCost", appData.stage7?.opex?.insuranceAndSecurity);
    setVal("s7_consumablesCost", appData.stage7?.opex?.consumableMaterials);
    setVal("s7_softwareCost", appData.stage7?.opex?.softwareLicenses);
    setVal("s7_scholarshipCost", appData.stage7?.opex?.scholarshipAndTransportFund);
    setVal("s7_marketingCost", appData.stage7?.opex?.marketingAndCommunityEvents);

    setVal("s7_fundMunicipal", appData.stage7?.fundingSources?.municipalBudget);
    setVal("s7_fundMoe", appData.stage7?.fundingSources?.moeGefenAndGrants);
    setVal("s7_fundPhilanthropy", appData.stage7?.fundingSources?.philanthropyAndIndustry);
    setVal("s7_fundParentFees", appData.stage7?.fundingSources?.subsidizedParentFees);
    setVal("s7_fundingRiskAssessment", appData.stage7?.fundingRiskAssessment);
  } else if (currentStep === 8) {
    setVal("s8_processIndicators", appData.stage8?.processIndicators);
    setVal("s8_outcomeIndicators", appData.stage8?.outcomeIndicators);
    setVal("s8_evaluationMethodology", appData.stage8?.evaluationMethodology);
    renderMilestonesRoadmap();
    renderStatutoryTable();
  }
}

/**
 * שלב 2: טבלת שכונות וצרכים
 */
function renderNeighborhoodsTable() {
  const container = document.getElementById("s2_neighborhoodsTableBody");
  if (!container) return;

  const neighborhoods = appData.stage2?.neighborhoods || [];
  if (neighborhoods.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b;">טרם הוזנו שכונות. לחץ על 'הוסף שכונה' להזנת נתונים.</td></tr>`;
    return;
  }

  container.innerHTML = neighborhoods.map((n, idx) => `
    <tr>
      <td><strong>${escapeHtml(n.name)}</strong></td>
      <td>${n.schools} בתי ספר</td>
      <td>${formatNumber(n.students)} תלמידים</td>
      <td><span class="badge badge-self">${escapeHtml(n.socioIndex)}</span></td>
      <td>${escapeHtml(n.accessBarrier)}</td>
      <td>
        <button type="button" class="btn btn-secondary btn-sm" onclick="deleteNeighborhood(${idx})" title="מחק שכונה">🗑️</button>
      </td>
    </tr>
  `).join("");
}

function addNewNeighborhoodPrompt() {
  const name = prompt("הזן שם שכונה / אזור:");
  if (!name || !name.trim()) return;
  const schools = parseInt(prompt("מספר בתי ספר בשכונה:", "4"), 10) || 0;
  const students = parseInt(prompt("מספר תלמידים משוער:", "1500"), 10) || 0;
  const socioIndex = prompt("מדד חברתי-כלכלי (לדוגמה: אשכול 4):", "אשכול 5") || "לא ידוע";
  const accessBarrier = prompt("חסם נגישות / תחבורה עיקרי:", "אין קו אוטובוס ישיר") || "לא צוין";

  if (!appData.stage2.neighborhoods) appData.stage2.neighborhoods = [];
  appData.stage2.neighborhoods.push({
    name: name.trim(),
    schools,
    students,
    socioIndex,
    accessBarrier
  });
  saveData(false);
  renderNeighborhoodsTable();
  renderExecutiveSummary();
  showToast(`השכונה '${name}' נוספה בהצלחה`, "success");
}

function deleteNeighborhood(idx) {
  if (confirm("האם למחוק שכונה זו מהמיפוי?")) {
    appData.stage2.neighborhoods.splice(idx, 1);
    saveData(false);
    renderNeighborhoodsTable();
    renderExecutiveSummary();
    showToast("השכונה הוסרה מהמיפוי", "info");
  }
}

/**
 * שלב 3: טבלת תוכניות קיימות
 */
function renderProgramsTable() {
  const container = document.getElementById("s3_programsTableBody");
  if (!container) return;

  const programs = appData.stage3?.programs || [];
  if (programs.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#64748b;">טרם מופו תוכניות קיימות. לחץ על 'הוסף תוכנית' להזנת נתונים.</td></tr>`;
    return;
  }

  container.innerHTML = programs.map((p, idx) => {
    let badgeClass = "badge-verified";
    let badgeLabel = "מאומת";
    if (p.sourceType === "self_reported") {
      badgeClass = "badge-self";
      badgeLabel = "דיווח עצמי";
    } else if (p.sourceType === "estimate") {
      badgeClass = "badge-estimate";
      badgeLabel = "הערכה/חלקי";
    }

    return `
      <tr>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td>${escapeHtml(p.operator)}</td>
        <td>${escapeHtml(p.domain)}</td>
        <td>${escapeHtml(p.targetAge)}</td>
        <td>${formatNumber(p.participants)} תלמידים</td>
        <td>${escapeHtml(p.costToFamily)}</td>
        <td>
          <span class="badge ${badgeClass}">${badgeLabel}</span>
          <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">${escapeHtml(p.statusNotes || "")}</div>
        </td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm" onclick="deleteProgram(${idx})" title="מחק תוכנית">🗑️</button>
        </td>
      </tr>
    `;
  }).join("");
}

function addNewProgramPrompt() {
  const name = prompt("שם התוכנית:");
  if (!name || !name.trim()) return;
  const operator = prompt("גוף מפעיל (משה\"ח / עמותה / אקדמיה / רשות):", "משרד החינוך") || "לא ידוע";
  const domain = prompt("תחום (STEM / סייבר / יזמות / מדעים):", "חקר ומדעים") || "כללי";
  const targetAge = prompt("שכבות גיל (לדוגמה: ז'-ט'):", "ז'-ט'") || "לא צוין";
  const participants = parseInt(prompt("מספר משתתפים משוער בשנה:", "50"), 10) || 0;
  const costToFamily = prompt("עלות למשפחה (לדוגמה: ללא עלות / 180 ₪ לחודש):", "ללא עלות") || "לא ידוע";
  const sourceType = prompt("סיווג אמינות (verified = מאומת, self_reported = דיווח עצמי, estimate = הערכה):", "verified") || "estimate";

  if (!appData.stage3.programs) appData.stage3.programs = [];
  appData.stage3.programs.push({
    id: "prog_" + Date.now(),
    name: name.trim(),
    operator,
    domain,
    targetAge,
    participants,
    costToFamily,
    sourceType,
    statusNotes: "הוזן ידנית על ידי המשתמש"
  });
  saveData(false);
  renderProgramsTable();
  showToast(`התוכנית '${name}' נוספה בהצלחה`, "success");
}

function deleteProgram(idx) {
  if (confirm("האם למחוק תוכנית זו מהמיפוי?")) {
    appData.stage3.programs.splice(idx, 1);
    saveData(false);
    renderProgramsTable();
    showToast("התוכנית הוסרה מהמיפוי", "info");
  }
}

/**
 * שלב 5: בחירת מודל
 */
function renderModelCards() {
  const cards = document.querySelectorAll(".model-select-card");
  cards.forEach(card => {
    const type = card.dataset.modelType;
    if (type === appData.stage5?.modelType) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
    card.onclick = () => {
      appData.stage5.modelType = type;
      renderModelCards();
      saveData(false);
      renderExecutiveSummary();
    };
  });
}

/**
 * שלב 6: אזורי פעילות
 */
function renderSpacesControls() {
  const container = document.getElementById("s6_spacesContainer");
  if (!container) return;

  const spaces = appData.stage6?.spaces || {};
  let html = `<div class="form-grid">`;

  for (const [key, space] of Object.entries(spaces)) {
    html += `
      <div class="form-group" style="background:#f8fafc; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px;">
        <label style="display:flex; justify-content:space-between; align-items:center;">
          <span>
            <input type="checkbox" id="space_check_${key}" ${space.included ? "checked" : ""} onchange="toggleSpace('${key}', this.checked)">
            <strong>${escapeHtml(space.desc)}</strong>
          </span>
          <span class="badge badge-estimate">תכנון מרחבי</span>
        </label>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.4rem;">
          <label style="font-size:0.8rem; color:#475569;">שטח (מ"ר):</label>
          <input type="number" class="form-control" style="max-width:90px;" value="${space.size}" min="0" max="500" 
            onchange="updateSpaceSize('${key}', this.value)" ${!space.included ? "disabled" : ""}>
        </div>
      </div>
    `;
  }
  html += `</div>`;
  container.innerHTML = html;
}

function toggleSpace(key, included) {
  if (appData.stage6?.spaces?.[key]) {
    appData.stage6.spaces[key].included = included;
    saveData(false);
    renderSpacesControls();
    updateBudgetAndSpaceCalculations();
  }
}

function updateSpaceSize(key, sizeVal) {
  if (appData.stage6?.spaces?.[key]) {
    appData.stage6.spaces[key].size = Math.max(0, parseFloat(sizeVal) || 0);
    saveData(false);
    updateBudgetAndSpaceCalculations();
  }
}

/**
 * עדכון חישובים תקציביים ושטחים
 */
function updateBudgetAndSpaceCalculations() {
  const spaceResult = calculateSpaces(appData.stage6?.spaces);
  const capexResult = calculateCapex(appData.stage7?.capex, spaceResult.totalArea);
  const opexResult = calculateOpex(appData.stage7?.opex);
  const fundResult = calculateFundingBalance(opexResult.totalOpex, appData.stage7?.fundingSources);

  // עדכון תצוגה בשלב 6
  const s6TotalAreaEl = document.getElementById("s6_totalAreaDisplay");
  if (s6TotalAreaEl) {
    s6TotalAreaEl.textContent = `${spaceResult.totalArea} מ"ר`;
  }

  // עדכון תצוגה בשלב 7 (CAPEX)
  const s7CapexTotalEl = document.getElementById("s7_capexTotalDisplay");
  if (s7CapexTotalEl) {
    s7CapexTotalEl.textContent = formatNIS(capexResult.totalCapex);
  }
  const s7CapexFormulaEl = document.getElementById("s7_capexFormulaDisplay");
  if (s7CapexFormulaEl) {
    s7CapexFormulaEl.textContent = capexResult.formula;
  }

  // עדכון תצוגה בשלב 7 (OPEX)
  const s7OpexTotalEl = document.getElementById("s7_opexTotalDisplay");
  if (s7OpexTotalEl) {
    s7OpexTotalEl.textContent = formatNIS(opexResult.totalOpex);
  }
  const s7OpexFormulaEl = document.getElementById("s7_opexFormulaDisplay");
  if (s7OpexFormulaEl) {
    s7OpexFormulaEl.textContent = opexResult.formula;
  }

  // עדכון איזון מימון
  const s7BalanceEl = document.getElementById("s7_fundingBalanceDisplay");
  if (s7BalanceEl) {
    s7BalanceEl.textContent = formatNIS(fundResult.balance);
    s7BalanceEl.style.color = fundResult.balance >= 0 ? "var(--success)" : "var(--danger)";
  }
  const s7RiskEl = document.getElementById("s7_riskAlertDisplay");
  if (s7RiskEl) {
    s7RiskEl.textContent = fundResult.riskMessage;
    let cardClass = "meta-card-verify";
    if (fundResult.riskLevel === "high") cardClass = "meta-card-missing";
    else if (fundResult.riskLevel === "low") cardClass = "meta-card-known";
    s7RiskEl.className = `meta-card ${cardClass}`;
  }

  // עדכון דוח מנהלים ברקע
  renderExecutiveSummary();
}

/**
 * שלב 8: מפת דרכים ואבני דרך
 */
function renderMilestonesRoadmap() {
  const container = document.getElementById("s8_milestonesContainer");
  if (!container) return;

  const milestones = appData.stage8?.milestones || [];
  if (milestones.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#64748b;">טרם הוגדרו אבני דרך.</div>`;
    return;
  }

  container.innerHTML = milestones.map(m => `
    <div class="roadmap-item ${m.checkRequired ? 'statutory' : ''}">
      <div class="roadmap-header">
        <span class="roadmap-title">${escapeHtml(m.name)}</span>
        <div>
          <span class="badge badge-self">${escapeHtml(m.phase)}</span>
          ${m.checkRequired ? '<span class="badge badge-verify">נקודת בדיקה מקצועית/רגולטורית</span>' : ''}
        </div>
      </div>
      <div class="roadmap-details">
        <span>⏱️ לוח זמנים: <strong>${escapeHtml(m.duration)}</strong></span>
        <span>👤 גורם אחראי: <strong>${escapeHtml(m.owner)}</strong></span>
        <span>🔗 תלות: <strong>${escapeHtml(m.dep)}</strong></span>
      </div>
    </div>
  `).join("");
}

function renderStatutoryTable() {
  const container = document.getElementById("s8_statutoryTableBody");
  if (!container) return;

  const approvals = appData.stage8?.statutoryApprovals || [];
  container.innerHTML = approvals.map(a => `
    <tr>
      <td><strong>${escapeHtml(a.item)}</strong></td>
      <td><span class="badge badge-verify">${escapeHtml(a.status)}</span></td>
      <td>${escapeHtml(a.authority)}</td>
    </tr>
  `).join("");
}

/**
 * הפקת דוח סיכום מנהלים אינטגרטיבי
 */
function renderExecutiveSummary() {
  const container = document.getElementById("executiveSummaryContent");
  if (!container) return;

  const spaceResult = calculateSpaces(appData.stage6?.spaces);
  const capexResult = calculateCapex(appData.stage7?.capex, spaceResult.totalArea);
  const opexResult = calculateOpex(appData.stage7?.opex);
  const fundResult = calculateFundingBalance(opexResult.totalOpex, appData.stage7?.fundingSources);

  container.innerHTML = `
    <div class="summary-container">
      <div class="summary-header">
        <h2>תזכיר תכנון והקמה: ${escapeHtml(appData.stage1?.authorityName || "רשות מקומית")}</h2>
        <div class="summary-meta">
          <span>📅 תאריך הפקה: <strong>${new Date().toLocaleDateString('he-IL')}</strong></span>
          <span>🏛️ אשכול למ"ס: <strong>${escapeHtml(appData.stage1?.cbsCluster || "לא ידוע")}</strong></span>
          <span>👥 אוכלוסיית תלמידים: <strong>${escapeHtml(appData.stage1?.studentCount || "לא ידוע")}</strong></span>
          <span>📊 סטטוס: <strong>${appData.isDemo ? "נתוני הדגמה (רשות דמיונית)" : "תכנון רשותי מקומי"}</strong></span>
        </div>
      </div>

      <!-- שלב 1: חזון ועקרונות -->
      <div class="summary-section">
        <h3>1. חזון המרכז ועקרונות מנחים</h3>
        <p style="font-size:1.05rem; margin-bottom:0.75rem;"><strong>הצהרת החזון:</strong> "${escapeHtml(appData.stage1?.visionStatement || "טרם נוסח")}"</p>
        <p><strong>תוצאות רצויות ויעדים:</strong> ${escapeHtml(appData.stage1?.desiredOutcomes || "טרם הוגדרו")}</p>
        <div style="margin-top:0.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${(appData.stage1?.focusDomains || []).map(d => `<span class="badge badge-self">${escapeHtml(d)}</span>`).join("")}
          ${(appData.stage1?.corePrinciples || []).map(p => `<span class="badge badge-verified">${escapeHtml(p)}</span>`).join("")}
        </div>
      </div>

      <!-- שלב 2 + 4: צרכים ופערים -->
      <div class="summary-section">
        <h3>2. צרכים מרכזיים, פערים ואי-הדרה</h3>
        <div class="status-meta-grid" style="margin-bottom:1rem;">
          <div class="meta-card meta-card-missing">
            <strong>פערים עיקריים שזוהו:</strong>
            ${escapeHtml(appData.stage4?.unaddressedNeeds || "לא הוגדרו")}
          </div>
          <div class="meta-card meta-card-verify">
            <strong>אוכלוסיות יעד ושכונות בחסר:</strong>
            ${escapeHtml(appData.stage4?.underservedPopulations || "לא הוגדרו")}
          </div>
        </div>
        <p><strong>חסמי נגישות ותחבורה:</strong> ${escapeHtml(appData.stage2?.barriers?.transportation || "לא צוין")}</p>
        <p style="font-size:0.8rem; color:#64748b; margin-top:0.3rem;">* הערה מקצועית: המערכת אינה מסיקה סיבתיות לגבי פערי השתתפות; פערים גאוגרפיים דורשים מענה מתוכנן בהסעות ובשלוחות.</p>
      </div>

      <!-- שלב 5 + 6: מודל ומרחב -->
      <div class="summary-section">
        <h3>3. מודל הפעלה ופרוגרמה מרחבית-פדגוגית</h3>
        <p><strong>מודל נבחר:</strong> <strong>${getModelNameHebrew(appData.stage5?.modelType)}</strong> | משתתפים צפויים: <strong>${formatNumber(appData.stage5?.estimatedParticipantsPerYear)} בשנה</strong></p>
        <p><strong>מדיניות איתור וקבלה:</strong> ${getAdmissionNameHebrew(appData.stage5?.admissionPolicy)} (ללא תלות בלעדית במבחן יחיד)</p>
        <p><strong>שטח כולל מתוכנן:</strong> <strong>${spaceResult.totalArea} מ"ר</strong> (חלוקה: ${spaceResult.breakdown.map(b => `${b.desc} ${b.size} מ"ר`).join(", ")})</p>
        <p><strong>ממשל רשותי:</strong> ${escapeHtml(appData.stage6?.governanceStructure || "ועדת היגוי עירונית")}</p>
      </div>

      <!-- שלב 7: תקציב ומשאבים -->
      <div class="summary-section">
        <h3>4. היתכנות תקציבית ומשאבים (הערכה לתכנון — אינה מהווה תקן רשמי וטעונה בדיקה בגזברות)</h3>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>פרק תקציבי</th>
                <th>סכום משוער</th>
                <th>נוסחת חישוב והנחות עבודה</th>
                <th>סיווג אמינות</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>עלות הקמה חד-פעמית (CAPEX)</strong></td>
                <td><strong style="color:var(--primary);">${formatNIS(capexResult.totalCapex)}</strong></td>
                <td>${capexResult.formula}</td>
                <td><span class="badge badge-estimate">הערכה לתכנון</span></td>
              </tr>
              <tr>
                <td><strong>עלות תפעול שנתית (OPEX)</strong></td>
                <td><strong style="color:var(--secondary);">${formatNIS(opexResult.totalOpex)}</strong></td>
                <td>${opexResult.formula}</td>
                <td><span class="badge badge-estimate">הערכה לתכנון</span></td>
              </tr>
              <tr>
                <td><strong>סך מקורות מימון מתוכננים</strong></td>
                <td><strong>${formatNIS(fundResult.totalFunding)}</strong></td>
                <td>רשות: ${formatNIS(fundResult.municipal)} (${fundResult.municipalPct.toFixed(1)}%) | משה"ח/גפ"ן: ${formatNIS(fundResult.moe)} | פילנתרופיה: ${formatNIS(fundResult.philanthropy)} | הורים: ${formatNIS(fundResult.parentFees)}</td>
                <td><span class="badge badge-self">הערכת מקורות</span></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>איזון תפעולי שנתי</strong></td>
                <td colspan="2"><strong style="color:${fundResult.balance >= 0 ? 'var(--success)' : 'var(--danger)'};">${formatNIS(fundResult.balance)}</strong> (${fundResult.riskMessage})</td>
                <td><span class="badge ${fundResult.balance >= 0 ? 'badge-verified' : 'badge-missing'}">${fundResult.balance >= 0 ? 'מאוזן' : 'גרעון חזוי'}</span></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- שלב 8: תוכנית הקמה -->
      <div class="summary-section">
        <h3>5. תוכנית הקמה ונקודות לבדיקה מקצועית ורגולטורית</h3>
        <div class="roadmap-timeline">
          ${(appData.stage8?.milestones || []).slice(0, 5).map(m => `
            <div class="roadmap-item ${m.checkRequired ? 'statutory' : ''}" style="padding:0.6rem 0.9rem;">
              <div class="roadmap-header">
                <strong>${escapeHtml(m.name)}</strong>
                <span style="font-size:0.8rem; color:#64748b;">${escapeHtml(m.duration)} | אחראי: ${escapeHtml(m.owner)}</span>
              </div>
            </div>
          `).join("")}
        </div>
        <p style="margin-top:0.5rem;"><strong>נקודות לבדיקה מקצועית ורגולטורית (מול הגורמים המוסמכים):</strong> בדיקת בטיחות (יועץ בטיחות/קב"ט מוסדות חינוך), חוות דעת מורשה נגישות מתו"ס, דרישות בטיחות אש (כבאות והצלה), והתאמת ייעוד הנכס (אגף הנדסה/הוועדה המקומית לתכנון ובנייה).</p>
        <p style="margin-top:0.35rem;"><strong>מדדי הערכה:</strong> ${escapeHtml(appData.stage8?.processIndicators || "ייצוג שכונות, התמדה ושביעות רצון")} | ${escapeHtml(appData.stage8?.outcomeIndicators || "מיזמים עירוניים ורצף לימודי")}</p>
      </div>

      <div style="margin-top:2rem; text-align:center; padding:1.25rem; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; font-size:0.85rem; color:#64748b;">
        מסמך זה הופק באמצעות סימולטור תכנון והקמה של מרכז חדשנות חינוכי יישובי. הנתונים מהווים מתווה עבודה ותכנון ראשוני ואינם מהווים תקן רשמי או עלות מאושרת. כל סעיף טעון בדיקה ואישור מול הגורמים המקצועיים המוסמכים, גזברות הרשות ומשרד החינוך.
      </div>
    </div>
  `;
}

function getModelNameHebrew(type) {
  switch (type) {
    case "centralized": return "מרכז פיזי אחוד (Centralized Innovation Hub)";
    case "hub_and_spoke": return "מרכז ראשי עם שלוחות בבתי ספר (Hub & Spoke)";
    case "mobile": return "מודל נייד (Mobile Maker Lab)";
    case "ecosystem_network": return "רשת אקוסיסטם שותפים מבוזרת";
    default: return type || "לא נבחר";
  }
}

function getAdmissionNameHebrew(policy) {
  switch (policy) {
    case "exams_only": return "מבחן איתור קוגניטיבי בלבד";
    case "teacher_recommendation": return "המלצת מחנכים ומורי מדעים";
    case "open_lottery": return "כניסה פתוחה / הגרלה";
    case "mixed_portfolios": return "שערי כניסה מרובים (תיק עבודות, המלצה ומוטיבציה)";
    default: return policy || "לא נבחר";
  }
}

/**
 * מאזינים לאירועים גלובליים
 */
function setupEventListeners() {
  window.printReport = function() {
    goToSummary();
    setTimeout(() => {
      window.print();
    }, 350);
  };
}

/**
 * Toast Notifications
 */
function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(15px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
