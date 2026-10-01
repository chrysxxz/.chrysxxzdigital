document.addEventListener("DOMContentLoaded", () => {
  const lazyScriptPromises = new Map();

  function loadLocalScript(source) {
    if (lazyScriptPromises.has(source)) {
      return lazyScriptPromises.get(source);
    }

    const scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source;
      script.onload = resolve;
      script.onerror = () => {
        lazyScriptPromises.delete(source);
        script.remove();
        reject(new Error(`Não foi possível carregar ${source}.`));
      };
      document.head.appendChild(script);
    });

    lazyScriptPromises.set(source, scriptPromise);
    return scriptPromise;
  }

  async function loadPdfLibraries() {
    if (!window.jspdf?.jsPDF) {
      await loadLocalScript("libs/jspdf.umd.min.js");
    }
    await loadLocalScript("libs/jspdf.plugin.autotable.min.js");
  }

  const menuItems = document.querySelectorAll(".menu-item");
  const sections = document.querySelectorAll(".page-section");
  const sectionTitle = document.getElementById("sectionTitle");

  const labels = {
    dashboard: "Dashboard",
    empresas: "Empresas",
    pipeline: "Pipeline",
    followups: "Follow-ups",
    orcamentos: "Orçamentos",
    configuracoes: "Configurações"
  };

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.dataset.target;

      menuItems.forEach((button) => {
        button.classList.toggle("active", button === item);
      });

      sections.forEach((section) => {
        section.classList.toggle("active", section.id === target);
      });

      if (target === "dashboard") {
        updateDashboardCounters();
        renderPriorityDashboard();
      } else if (target === "empresas") {
        renderTable();
      } else if (target === "orcamentos") {
        initializeBudgetModule();
      }

      if (sectionTitle && labels[target]) {
        sectionTitle.textContent = labels[target];
      }
    });
  });

  const STORAGE_KEY = "chrysxxz.crm.empresas";
  const PROSPECTS_STORAGE_KEY = "chrysxxz.crm.prospeccoes";
  const IMPORTED_COMPANY_HISTORY_MARKER = "Empresa importada via CSV/Excel.";
  const statusOptions = [
    "Não contatada",
    "Contato realizado",
    "Respondeu",
    "Interesse demonstrado",
    "Proposta enviada",
    "Venda",
    "Cliente",
    "Sem interesse",
    "Sem resposta",
    "Contato inválido"
  ];

  const empresaTableBody = document.getElementById("empresaTableBody");
  const bulkCompanyActions = document.getElementById("bulkCompanyActions");
  const bulkSelectionCount = document.getElementById("bulkSelectionCount");
  const bulkDeleteButton = document.getElementById("bulkDeleteButton");
  const selectAllCompaniesCheckbox = document.getElementById("selectAllCompaniesCheckbox");
  const empresaCount = document.getElementById("empresasCount");
  const bulkDeleteCompanyModal = document.getElementById("bulkDeleteCompanyModal");
  const bulkDeleteCompanyCount = document.getElementById("bulkDeleteCompanyCount");
  const confirmBulkDeleteCompaniesButton = document.getElementById("confirmBulkDeleteCompaniesButton");
  const empresaDetails = document.getElementById("empresaDetails");
  const searchInput = document.getElementById("empresaBusca");
  const statusFiltro = document.getElementById("statusFiltro");
  const segmentoFiltro = document.getElementById("segmentoFiltro");
  const estadoFiltro = document.getElementById("estadoFiltro");
  const modal = document.getElementById("empresaModal");
  const modalTitle = document.getElementById("modalTitle");
  const empresaForm = document.getElementById("empresaForm");
  const btnAdicionarEmpresa = document.getElementById("btnAdicionarEmpresa");
  const deleteCompanyModal = document.getElementById("deleteCompanyModal");
  const confirmDeleteCompanyButton = document.getElementById("confirmDeleteCompanyButton");

  const btnImportarEmpresas = document.getElementById("btnImportarEmpresas");
  const importModal = document.getElementById("importModal");
  const importConfirmModal = document.getElementById("importConfirmModal");
  const importSuccessModal = document.getElementById("importSuccessModal");
  const importFileInput = document.getElementById("importFileInput");
  const confirmImportButton = document.getElementById("confirmImportButton");
  const confirmImportActionButton = document.getElementById("confirmImportActionButton");
  const goToCompaniesButton = document.getElementById("goToCompaniesButton");
  const importPreviewContainer = document.getElementById("importPreviewContainer");
  const importFeedback = document.getElementById("importFeedback");
  const importConfirmationCount = document.getElementById("importConfirmationCount");
  const importSuccessImportedText = document.getElementById("importSuccessImportedText");
  const importSuccessIgnoredText = document.getElementById("importSuccessIgnoredText");
  const confettiLayer = document.getElementById("confettiLayer");
  const ORCAMENTOS_STORAGE_KEY = "chrysxxz.crm.orcamentos";
  const ORCAMENTOS_CATALOG_KEY = "chrysxxz.crm.catalogoServicos";
  const ORCAMENTOS_CONDICOES_KEY = "chrysxxz.crm.modelosCondicoes";
  const ORCAMENTOS_OBSERVACOES_KEY = "chrysxxz.crm.modelosObservacoes";
  const btnNovoOrcamento = document.getElementById("btnNovoOrcamento");
  const orcamentoBusca = document.getElementById("orcamentoBusca");
  const orcamentoStatusFiltro = document.getElementById("orcamentoStatusFiltro");
  const orcamentosTableBody = document.getElementById("orcamentosTableBody");
  const orcamentoFormModal = document.getElementById("orcamentoFormModal");
  const orcamentoForm = document.getElementById("orcamentoForm");
  const orcamentoEmpresaSelect = document.getElementById("orcamentoEmpresaSelect");
  const orcamentoClienteSummary = document.getElementById("orcamentoClienteSummary");
  const orcamentoNumero = document.getElementById("orcamentoNumero");
  const orcamentoData = document.getElementById("orcamentoData");
  const orcamentoValidade = document.getElementById("orcamentoValidade");
  const orcamentoCatalogoSelect = document.getElementById("orcamentoCatalogoSelect");
  const orcamentoCondicaoModeloSelect = document.getElementById("orcamentoCondicaoModeloSelect");
  const orcamentoObservacaoModeloSelect = document.getElementById("orcamentoObservacaoModeloSelect");
  const btnAdicionarItemOrcamento = document.getElementById("btnAdicionarItemOrcamento");
  const orcamentoItensContainer = document.getElementById("orcamentoItensContainer");
  const orcamentoSubtotalValue = document.getElementById("orcamentoSubtotalValue");
  const orcamentoDescontoValue = document.getElementById("orcamentoDescontoValue");
  const orcamentoTotalValue = document.getElementById("orcamentoTotalValue");
  const orcamentoSuccessModal = document.getElementById("orcamentoSuccessModal");
  const orcamentoSuccessNumber = document.getElementById("orcamentoSuccessNumber");
  const btnVerOrcamento = document.getElementById("btnVerOrcamento");
  const orcamentoDeleteModal = document.getElementById("orcamentoDeleteModal");
  const orcamentoDeleteName = document.getElementById("orcamentoDeleteName");
  const confirmDeleteBudgetButton = document.getElementById("confirmDeleteBudgetButton");
  const orcamentoDetailModal = document.getElementById("orcamentoDetailModal");
  const orcamentoDetailContent = document.getElementById("orcamentoDetailContent");
  const detailBudgetEditButton = document.getElementById("detailBudgetEditButton");
  const detailBudgetDuplicateButton = document.getElementById("detailBudgetDuplicateButton");
  const detailBudgetExportButton = document.getElementById("detailBudgetExportButton");
  const orcamentosTotalCount = document.getElementById("orcamentosTotalCount");
  const orcamentosEnviadosCount = document.getElementById("orcamentosEnviadosCount");
  const orcamentosNegotiationCount = document.getElementById("orcamentosNegotiationCount");
  const orcamentosApprovedCount = document.getElementById("orcamentosApprovedCount");
  const orcamentosApprovedValue = document.getElementById("orcamentosApprovedValue");

  const dashboardStats = {
    totalCompanies: document.querySelector(".stat-card:nth-child(1) .value"),
    newRecords: document.querySelector("[data-dashboard-stat='newRecords']"),
    contacts: document.querySelector(".stat-card:nth-child(3) .value"),
    opportunities: document.querySelector(".stat-card:nth-child(4) .value"),
    conversion: document.querySelector(".stat-card:nth-child(5) .value"),
    productivity: document.querySelector(".stat-card:nth-child(6) .value")
  };

  const ACTIVITIES_STORAGE_KEY = "chrysxxz.crm.atividades";
  const CRM_DATA_UPDATED_EVENT = "crm:data-updated";
  const WORKED_LEAD_STATUSES = new Set([
    "Contato realizado",
    "Respondeu",
    "Interesse demonstrado",
    "Proposta enviada",
    "Venda",
    "Cliente"
  ]);
  const SALE_STATUSES = new Set(["Venda", "Cliente"]);

  function getStorageArray(key, fallback = []) {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function persistStorageArray(key, items) {
    localStorage.setItem(key, JSON.stringify(Array.isArray(items) ? items : []));
  }

  function normalizeActivityRecord(activity) {
    if (!activity || typeof activity !== "object") {
      return null;
    }

    const timestampValue = normalizeText(activity.timestamp || activity.data || new Date().toISOString());
    const safeTimestamp = timestampValue ? new Date(timestampValue).toISOString() : new Date().toISOString();

    return {
      id: normalizeText(activity.id) || (crypto.randomUUID ? crypto.randomUUID() : `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      type: normalizeText(activity.type || "activity"),
      description: normalizeText(activity.description || "Atividade registrada no CRM."),
      entityType: normalizeText(activity.entityType || activity.entidade || ""),
      entityId: normalizeText(activity.entityId || activity.entidadeId || ""),
      timestamp: safeTimestamp
    };
  }

  function getActivitiesFromStorage() {
    return getStorageArray(ACTIVITIES_STORAGE_KEY, [])
      .map((item) => normalizeActivityRecord(item))
      .filter(Boolean)
      .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp));
  }

  function persistActivities(activities) {
    persistStorageArray(ACTIVITIES_STORAGE_KEY, activities.map((activity) => normalizeActivityRecord(activity)).filter(Boolean));
  }

  function addActivity({ type, description, entityType = "", entityId = "" } = {}) {
    const trimmedType = normalizeText(type);
    const trimmedDescription = normalizeText(description);
    if (!trimmedType || !trimmedDescription) {
      return null;
    }

    const activity = normalizeActivityRecord({
      id: crypto.randomUUID ? crypto.randomUUID() : `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: trimmedType,
      description: trimmedDescription,
      entityType: normalizeText(entityType),
      entityId: normalizeText(entityId),
      timestamp: new Date().toISOString()
    });

    if (!activity) {
      return null;
    }

    const activities = getActivitiesFromStorage();
    activities.unshift(activity);
    persistActivities(activities.slice(0, 200));
    return activity;
  }

  function getCRMData() {
    return {
      companies,
      prospects,
      activities: getActivitiesFromStorage()
    };
  }

  function notifyCRMDataUpdated(reason = "crm-data-updated") {
    window.dispatchEvent(new CustomEvent(CRM_DATA_UPDATED_EVENT, { detail: { reason } }));
  }

  function slugify(value) {
    return String(value || "").toLowerCase().trim();
  }

  function toDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function buildDuplicateKey(company) {
    const cnpj = toDigits(company.cnpj);
    if (cnpj) {
      return `cnpj:${cnpj}`;
    }
    const nome = slugify(company.nomeEmpresa);
    const telefone = toDigits(company.telefone || company.whatsapp);
    return `lead:${nome}|${telefone}`;
  }

  function normalizeText(value) {
    if (value === null || value === undefined) return "";
    const text = String(value).trim();
    if (!text || text.toLowerCase() === "undefined" || text.toLowerCase() === "null") return "";
    return text.replace(/\s+/g, " ").trim();
  }

  function splitCityState(cityValue, stateValue) {
    const rawCity = normalizeText(cityValue || "");
    const rawState = normalizeText(stateValue || "").toUpperCase();
    let city = rawCity;
    let state = rawState;

    const cityStateMatch = rawCity.match(/^(.*?)[\s,\-/]+([A-Z]{2})$/i);
    if (cityStateMatch) {
      const [, cityPart, statePart] = cityStateMatch;
      const normalizedState = normalizeText(statePart).toUpperCase();
      if (/^[A-Z]{2}$/.test(normalizedState)) {
        city = normalizeText(cityPart);
        state = normalizedState;
      }
    }

    if (!state && rawCity.includes("/")) {
      const [cityPart, statePart] = rawCity.split("/");
      const normalizedState = normalizeText(statePart).toUpperCase();
      if (/^[A-Z]{2}$/.test(normalizedState)) {
        city = normalizeText(cityPart);
        state = normalizedState;
      }
    }

    if (!state && rawCity.includes("-")) {
      const dashParts = rawCity.split("-");
      const lastPart = dashParts[dashParts.length - 1];
      const normalizedState = normalizeText(lastPart).toUpperCase();
      if (/^[A-Z]{2}$/.test(normalizedState)) {
        city = normalizeText(dashParts.slice(0, -1).join("-").trim());
        state = normalizedState;
      }
    }

    return {
      cidade: city,
      estado: state
    };
  }

  function normalizeCompanyRecord(company) {
    if (!company || typeof company !== "object") return null;

    const { cidade, estado } = splitCityState(company.cidade, company.estado);

    return {
      ...company,
      nomeEmpresa: normalizeText(company.nomeEmpresa || company.empresa || company["Empresa"] || "Empresa sem nome"),
      nomeFantasia: normalizeText(company.nomeFantasia || company["Nome fantasia"] || company.empresa || ""),
      segmento: normalizeText(company.segmento || company["Segmento"] || ""),
      cidade,
      estado: normalizeText(estado || company.estado || "").toUpperCase(),
      telefone: normalizeText(company.telefone || company["Telefone"] || ""),
      whatsapp: normalizeText(company.whatsapp || company["WhatsApp"] || ""),
      instagram: normalizeText(company.instagram || company["Instagram"] || ""),
      site: normalizeText(company.site || company["Site"] || ""),
      endereco: normalizeText(company.endereco || company["Endereço"] || ""),
      origemEmpresa: normalizeText(company.origemEmpresa || company["Origem"] || company.origem || "Importação"),
      observacoes: normalizeText(company.observacoes || company["Observações"] || company.observacao || ""),
      status: normalizeStatusValue(company.status || "Não contatada"),
      etapaPipeline: normalizeText(company.etapaPipeline || company.etapa || "Descoberta"),
      prioridade: isPriorityValue(company.prioridade ?? company.prioritaria ?? company.prioridadeAtivada ?? false)
    };
  }

  function formatHistoricDate(dateValue) {
    const rawValue = normalizeText(dateValue);
    if (!rawValue) return "";

    const parsedDate = new Date(`${rawValue}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return rawValue;
    }

    return parsedDate.toLocaleDateString("pt-BR");
  }

  function buildHistoricEntry(company) {
    const contactDate = normalizeText(company.ultimoContato || company.primeiroContato || "");
    const canal = normalizeText(company.canalUtilizado || "") || "Canal não informado";
    const status = normalizeStatusValue(company.status || "Não contatada");
    const observation = normalizeText(company.observacoes || "");
    const nextFollowUp = normalizeText(company.proximoFollowUp || "");
    const statusText = status && status !== "Não contatada" ? `${status}.` : "Contato realizado.";
    const description = observation ? `${statusText} ${observation}` : statusText;
    const nextFollowUpText = nextFollowUp ? `Próximo follow-up: ${formatHistoricDate(nextFollowUp)}.` : "";

    return [
      `${contactDate ? `${formatHistoricDate(contactDate)} | ${canal}` : canal}`,
      description,
      nextFollowUpText
    ].filter(Boolean).join("\n");
  }

  function normalizeHistoricText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function appendHistoricEntry(existingHistory, company) {
    const entry = buildHistoricEntry(company);
    if (!entry) return existingHistory || "";

    const safeHistory = String(existingHistory || "").trim();
    if (!safeHistory) {
      return entry;
    }

    const entrySignature = normalizeHistoricText(entry);
    const historySignature = normalizeHistoricText(safeHistory);
    if (historySignature.includes(entrySignature)) {
      return safeHistory;
    }

    return `${safeHistory}\n\n${entry}`.trim();
  }

  function toDateIso(value) {
    const text = normalizeText(value);
    if (!text) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text;
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
      const [day, month, year] = text.split("/");
      return `${year}-${month}-${day}`;
    }
    return text;
  }

  function getLastHistoricInteractionSnapshot(historyText) {
    const blocks = String(historyText || "").split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
    if (!blocks.length) {
      return null;
    }

    const lastBlock = blocks[blocks.length - 1];
    const lines = lastBlock.split(/\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) {
      return null;
    }

    const headerMatch = lines[0].match(/^(\d{2}\/\d{2}\/\d{4})\s*\|\s*(.+)$/);
    if (!headerMatch) {
      return null;
    }

    const [, headerDate, canalUtilizado] = headerMatch;
    const detailLine = lines[1] || "";
    const nextLine = lines[2] || "";
    const statusMatch = detailLine.match(/^([A-Za-zÀ-ÿ\s]+)\.(?:\s+(.*))?$/);
    const status = statusMatch ? normalizeStatusValue(statusMatch[1].trim()) : "Não contatada";
    const observationMatch = detailLine.match(/^([A-Za-zÀ-ÿ\s]+)\.(?:\s+(.*))?$/);
    const observacoes = observationMatch && observationMatch[2] ? normalizeText(observationMatch[2]) : "";
    const nextFollowMatch = nextLine.match(/Pr[oó]ximo follow-up:\s*(\d{2}\/\d{2}\/\d{4})/i);

    return {
      ultimoContato: toDateIso(headerDate),
      canalUtilizado: normalizeText(canalUtilizado),
      status,
      observacoes,
      proximoFollowUp: nextFollowMatch ? toDateIso(nextFollowMatch[1]) : ""
    };
  }

  function buildInteractionSnapshot(company) {
    return {
      ultimoContato: toDateIso(company?.ultimoContato || company?.primeiroContato || ""),
      canalUtilizado: normalizeText(company?.canalUtilizado || ""),
      observacoes: normalizeText(company?.observacoes || "")
    };
  }

  function hasMeaningfulContactData(company) {
    if (!company || typeof company !== "object") return false;
    return Boolean(
      normalizeText(company.ultimoContato || company.primeiroContato || "") ||
      normalizeText(company.canalUtilizado || "") ||
      normalizeText(company.observacoes || "") ||
      normalizeText(company.proximoFollowUp || "")
    );
  }

  function hasNewContactInteraction(previousCompany, nextCompany) {
    if (!previousCompany) {
      return hasMeaningfulContactData(nextCompany);
    }

    const currentSnapshot = buildInteractionSnapshot(nextCompany);
    const lastSnapshot = getLastHistoricInteractionSnapshot(previousCompany.historico || "");

    if (!lastSnapshot) {
      return Boolean(currentSnapshot.ultimoContato || currentSnapshot.canalUtilizado || currentSnapshot.observacoes);
    }

    const currentContactDate = normalizeText(currentSnapshot.ultimoContato || "");
    const lastContactDate = normalizeText(lastSnapshot.ultimoContato || "");

    if (!currentContactDate) {
      return false;
    }

    const currentSummary = {
      ultimoContato: currentContactDate,
      canalUtilizado: normalizeText(currentSnapshot.canalUtilizado || ""),
      observacoes: normalizeText(currentSnapshot.observacoes || "")
    };
    const lastSummary = {
      ultimoContato: lastContactDate,
      canalUtilizado: normalizeText(lastSnapshot.canalUtilizado || ""),
      observacoes: normalizeText(lastSnapshot.observacoes || "")
    };

    return JSON.stringify(currentSummary) !== JSON.stringify(lastSummary);
  }

  function isFollowUpOverdue(company) {
    const followUpDate = normalizeText(company?.proximoFollowUp || "");
    if (!followUpDate) {
      return false;
    }

    const parsedDate = new Date(`${followUpDate}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsedDate < today;
  }

  function normalizeProspectRecord(prospect) {
    if (!prospect || typeof prospect !== "object") return null;

    const { cidade, estado } = splitCityState(prospect.cidade, prospect.estado);

    return {
      ...prospect,
      empresaId: prospect.empresaId || prospect.empresa_id || prospect.companyId || "",
      empresaNome: normalizeText(prospect.empresaNome || prospect.nomeEmpresa || prospect.empresa || "Empresa sem nome"),
      nomeFantasia: normalizeText(prospect.nomeFantasia || prospect.empresaFantasia || prospect.nomeEmpresa || ""),
      segmento: normalizeText(prospect.segmento || ""),
      cidade,
      estado: normalizeText(estado || prospect.estado || "").toUpperCase(),
      status: normalizeStatusValue(prospect.status || "Não contatada"),
      etapa: normalizeText(prospect.etapa || "Descoberta"),
      telefone: normalizeText(prospect.telefone || ""),
      whatsapp: normalizeText(prospect.whatsapp || ""),
      instagram: normalizeText(prospect.instagram || ""),
      site: normalizeText(prospect.site || ""),
      email: normalizeText(prospect.email || ""),
      observacoes: normalizeText(prospect.observacoes || ""),
      cnpj: normalizeText(prospect.cnpj || "")
    };
  }

  function normalizeStoredCompanies(items) {
    if (!Array.isArray(items)) return [];
    return items.map((company) => normalizeCompanyRecord(company)).filter(Boolean);
  }

  function normalizeStoredProspects(items) {
    if (!Array.isArray(items)) return [];
    return items.map((prospect) => normalizeProspectRecord(prospect)).filter(Boolean);
  }

  function isPriorityValue(value) {
    if (typeof value === "boolean") return value;
    const normalized = normalizeText(value).toLowerCase();
    if (!normalized) return false;
    return ["true", "yes", "sim", "1", "ativada", "ativa", "prioridade ativada", "prioridade"].includes(normalized);
  }

  function isCompanyPriority(company) {
    if (!company || typeof company !== "object") return false;
    return Boolean(isPriorityValue(company.prioridade ?? company.prioritaria ?? company.prioridadeAtivada ?? false));
  }

  function sortByEmpresaName(items) {
    if (!Array.isArray(items)) return [];

    const indexed = items.map((item, index) => ({ item, index }));
    indexed.sort((left, right) => {
      const leftPriority = isCompanyPriority(left.item) ? 1 : 0;
      const rightPriority = isCompanyPriority(right.item) ? 1 : 0;

      if (leftPriority !== rightPriority) {
        return rightPriority - leftPriority;
      }

      return left.index - right.index;
    });

    return indexed.map(({ item }) => item);
  }

  function getCompaniesFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return normalizeStoredCompanies(parsed);
    } catch (error) {
      return [];
    }
  }

  function getProspectsFromStorage() {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return normalizeStoredProspects(parsed);
    } catch (error) {
      return [];
    }
  }

  let companies = sortByEmpresaName(getCompaniesFromStorage());
  let prospects = sortByEmpresaName(getProspectsFromStorage());
  let selectedCompanyId = companies[0]?.id || null;
  let selectedCompanyIds = new Set();
  let currentCompanyFoundCount = 0;
  let budgets = [];
  let budgetModuleInitialized = false;
  let lastBudgetIdCreated = null;

  function formatCurrency(value) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) {
      return "R$ 0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(numericValue);
  }

  function formatMoneyInputValue(value) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) {
      return "R$ 0,00";
    }
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
    return `R$ ${formatted}`;
  }

  function formatMoneyInputDigits(value) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) {
      return "0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  }

  function formatPercentInputValue(value) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) {
      return "0%";
    }
    return `${numericValue}%`;
  }

  function parseMoneyInputValue(value) {
    const sanitized = String(value ?? "").replace(/[^0-9,.-]/g, "");
    if (!sanitized) {
      return 0;
    }

    const normalized = sanitized.replace(/\./g, "").replace(",", ".");
    const numericValue = Number(normalized);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  function uniqueText(value) {
    const text = normalizeText(value);
    if (!text) return "";
    const parts = text.split(/\s+/);
    const seen = new Set();
    return parts.filter((part) => {
      if (seen.has(part)) return false;
      seen.add(part);
      return true;
    }).join(" ");
  }

  async function loadLogoImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Logo do CX Digital não foi encontrado."));
      img.src = "cx-digital-logo.png";
    });
  }

  function parseBudgetDateTimeValue(value) {
    if (!value) return null;

    const raw = String(value).trim();
    if (!raw) return null;

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const dateOnly = new Date(`${raw}T00:00:00`);
      return Number.isNaN(dateOnly.getTime()) ? null : dateOnly;
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
      const localDateTime = new Date(raw);
      return Number.isNaN(localDateTime.getTime()) ? null : localDateTime;
    }

    const directDate = new Date(raw);
    return Number.isNaN(directDate.getTime()) ? null : directDate;
  }

  function formatBudgetLocalDateTimeForInput(dateValue = new Date()) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    const hours = String(dateValue.getHours()).padStart(2, "0");
    const minutes = String(dateValue.getMinutes()).padStart(2, "0");
    const seconds = String(dateValue.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  function formatBudgetLocalDateForInput(dateValue = new Date()) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function splitBudgetValidityValue(value) {
    if (!value) {
      return { date: "", time: "" };
    }

    const raw = String(value).trim();
    if (!raw) {
      return { date: "", time: "" };
    }

    const match = raw.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2})(?::\d{2})?)?$/);
    if (!match) {
      return { date: "", time: "" };
    }

    return {
      date: match[1] || "",
      time: match[2] || ""
    };
  }

  function normalizeBudgetDateTimeInput(value) {
    if (!value) return "";

    const raw = String(value).trim();
    if (!raw) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return `${raw}T00:00:00`;
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
      const [datePart, timePart] = raw.split("T");
      const time = String(timePart || "00:00").padEnd(5, "0");
      return `${datePart}T${time}:00`;
    }

    return "";
  }

  function formatPdfDateTime(value, includeTime = true, includeSeconds = false) {
    const dateValue = parseBudgetDateTimeValue(value);
    if (!dateValue) {
      return "";
    }

    const hasExplicitTime = value instanceof Date || (typeof value === "string" && /T\d{2}:\d{2}/.test(value));
    if (!includeTime || !hasExplicitTime) {
      const day = String(dateValue.getDate()).padStart(2, "0");
      const month = String(dateValue.getMonth() + 1).padStart(2, "0");
      const year = dateValue.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const day = String(dateValue.getDate()).padStart(2, "0");
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const year = dateValue.getFullYear();
    const hours = String(dateValue.getHours()).padStart(2, "0");
    const minutes = String(dateValue.getMinutes()).padStart(2, "0");
    const seconds = String(dateValue.getSeconds()).padStart(2, "0");
    const timeText = includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
    return `${day}/${month}/${year} às ${timeText}`;
  }

  function formatBudgetDiscountForPdf(discountValue, discountType) {
    const normalizedType = normalizeDiscountType(discountType);
    const numericValue = Number(discountValue || 0);

    if (normalizedType === "percentual") {
      return `${numericValue}%`;
    }

    return formatCurrency(numericValue);
  }

  function isPdfClientFieldInvalid(value) {
    const text = normalizeText(value);
    if (!text) {
      return true;
    }

    const lower = text.toLowerCase();
    const invalidPatterns = [
      "não localizado",
      "nao localizado",
      "não encontrado",
      "nao encontrado",
      "não identificado",
      "nao identificado",
      "não informado",
      "nao informado",
      "não confirmado",
      "nao confirmado",
      "não disponível",
      "nao disponível",
      "não disponivel",
      "nao disponivel",
      "não encontrado nesta rodada",
      "nao encontrado nesta rodada",
      "placeholder",
      "pesquisa",
      "não localizado nesta rodada",
      "nao localizado nesta rodada"
    ];

    return invalidPatterns.some((pattern) => lower.includes(pattern)) || lower.includes("não encontrado") || lower.includes("nao encontrado");
  }

  function getClientDetailsLines(company) {
    if (!company || typeof company !== "object") {
      return [];
    }

    const lines = [];
    const razaoSocial = normalizeText(company.nomeEmpresa || company.empresa || company["Empresa"] || "");
    const nomeFantasia = normalizeText(company.nomeFantasia || company["Nome fantasia"] || "");
    const cnpj = normalizeText(company.cnpj || company["CNPJ"] || "");
    const telefone = normalizeText(company.telefone || company["Telefone"] || "");
    const whatsapp = normalizeText(company.whatsapp || company["WhatsApp"] || "");
    const email = normalizeText(company.email || company["E-mail"] || company.emailEmpresa || "");
    const site = normalizeText(company.site || company["Site"] || "");
    const instagram = normalizeText(company.instagram || company["Instagram"] || "");
    const endereco = normalizeText(company.endereco || company["Endereço"] || "");
    const cidade = normalizeText(company.cidade || "");
    const estado = normalizeText(company.estado || "").toUpperCase();
    const segmento = normalizeText(company.segmento || company["Segmento"] || "");

    const validRazaoSocial = isPdfClientFieldInvalid(razaoSocial) ? "" : razaoSocial;
    const validNomeFantasia = isPdfClientFieldInvalid(nomeFantasia) || nomeFantasia === razaoSocial ? "" : nomeFantasia;
    const validCnpj = isPdfClientFieldInvalid(cnpj) ? "" : cnpj;
    const validTelefone = isPdfClientFieldInvalid(telefone) ? "" : telefone;
    const validWhatsapp = isPdfClientFieldInvalid(whatsapp) ? "" : whatsapp;
    const validEmail = isPdfClientFieldInvalid(email) ? "" : email;
    const validSite = isPdfClientFieldInvalid(site) ? "" : site;
    const validInstagram = isPdfClientFieldInvalid(instagram) ? "" : instagram;
    const validEndereco = isPdfClientFieldInvalid(endereco) ? "" : endereco;
    const validCidade = isPdfClientFieldInvalid(cidade) ? "" : cidade;
    const validEstado = isPdfClientFieldInvalid(estado) ? "" : estado;
    const validSegmento = isPdfClientFieldInvalid(segmento) ? "" : segmento;

    if (validRazaoSocial) {
      lines.push({ label: "RAZÃO SOCIAL", value: validRazaoSocial });
    }
    if (validNomeFantasia) {
      lines.push({ label: "NOME FANTASIA", value: validNomeFantasia });
    }
    if (validCnpj) {
      lines.push({ label: "CNPJ", value: validCnpj });
    }

    const telefoneLinha = [validTelefone, validWhatsapp].filter(Boolean).join(" / ");
    if (telefoneLinha) {
      lines.push({ label: "TELEFONE / WHATSAPP", value: telefoneLinha });
    }
    if (validEmail) {
      lines.push({ label: "E-MAIL", value: validEmail });
    }

    const siteInstagram = [validSite, validInstagram].filter(Boolean).join(" / ");
    if (siteInstagram) {
      lines.push({ label: "SITE / INSTAGRAM", value: siteInstagram });
    }
    if (validEndereco) {
      lines.push({ label: "ENDEREÇO", value: validEndereco });
    }

    const cidadeEstado = [validCidade, validEstado].filter(Boolean).join(" / ");
    if (cidadeEstado) {
      lines.push({ label: "CIDADE / UF", value: cidadeEstado });
    }
    if (validSegmento) {
      lines.push({ label: "SEGMENTO", value: validSegmento });
    }

    return lines;
  }

  function getBudgetPdfData(budget) {
    const company = getCompanyById(budget.empresaId) || { nomeEmpresa: budget.empresaNome || "Empresa não informada" };
    const items = Array.isArray(budget.itens) ? budget.itens : [];
    const totals = calculateBudgetTotals(items);
    const subtotal = Number(budget.subtotal ?? totals.subtotal);
    const descontoTotal = Number(budget.desconto ?? totals.desconto);
    const total = Number(budget.total ?? totals.total);
    const emittedAt = new Date();
    const validityText = budget.validade ? formatPdfDateTime(budget.validade, true, true) : "";

    return {
      company,
      items,
      subtotal,
      descontoTotal,
      total,
      numero: budget.numero || generateBudgetNumber(),
      clienteNome: company.nomeEmpresa || budget.empresaNome || "Empresa não informada",
      servicoPrincipal: normalizeText(
        (items[0] && (items[0].nome || items[0].descricao)) || company.servicoInteresse || "Serviço do orçamento"
      ),
      introText: normalizeText(budget.mensagem || budget.introducao || budget.descricao || budget.apresentacao || ""),
      conditionsText: normalizeText(budget.condicoes || ""),
      observationsText: normalizeText(budget.observacoes || ""),
      dataText: budget.data ? formatPdfDateTime(budget.data, false) || "-" : "-",
      emittedAtText: formatPdfDateTime(emittedAt, true, true),
      validadeText: validityText,
      clientDetails: getClientDetailsLines(company)
    };
  }

  async function generateBudgetPdfDocument(budget) {
    await loadPdfLibraries();
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("Biblioteca jsPDF não foi carregada.");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 42;
    const greenDark = [0, 77, 64];
    const greenPetr = [0, 105, 92];
    const turquoise = [0, 168, 150];
    const softBg = [231, 236, 235];
    const cardBg = [243, 247, 245];
    const textPrimary = [38, 50, 56];
    const textMuted = [88, 107, 118];
    const logo = await loadLogoImage();

    doc.setFillColor(softBg[0], softBg[1], softBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFillColor(0, 77, 64);
    doc.rect(0, 0, pageWidth, 56, "F");
    doc.setDrawColor(0, 168, 150);
    doc.setLineWidth(1.2);
    doc.line(marginX + 180, 18, marginX + 236, 18);
    doc.line(pageWidth - marginX - 110, 18, pageWidth - marginX - 74, 18);
    doc.addImage(logo, "PNG", marginX, 14, 24, 24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CX DIGITAL", marginX + 36, 31);
    doc.setFontSize(12);
    doc.text(String(budget.numero || generateBudgetNumber()), pageWidth - marginX - 10, 31, { align: "right" });

    let y = 90;
    const budgetData = getBudgetPdfData(budget);
    const tableBody = budgetData.items.map((item) => {
      const total = (Number(item.quantidade || 1) * Number(item.valorUnitario || 0)) - Number(item.desconto || 0);
      return [
        normalizeText(item.nome || "Serviço"),
        String(item.quantidade || 1),
        formatCurrency(item.valorUnitario || 0),
        formatBudgetDiscountForPdf(item.desconto || 0, item.descontoTipo),
        formatCurrency(total)
      ];
    });

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Data de emissão: ${budgetData.emittedAtText}`, marginX, y);
    if (budgetData.validadeText) {
      doc.text(`Validade: ${budgetData.validadeText}`, pageWidth - marginX, y, { align: "right" });
    }
    y += 24;

    doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("PROPOSTA COMERCIAL", marginX, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("Uma solução pensada para o seu negócio.", marginX, y);
    y += 24;

    const clientDetailsText = [];
    budgetData.clientDetails.forEach((detail) => {
      const detailText = `${detail.label}: ${detail.value}`;
      clientDetailsText.push(...doc.splitTextToSize(detailText, pageWidth - (marginX * 2) - 48));
    });

    const clientCardHeight = 60 + Math.max(clientDetailsText.length * 10, 0);
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(marginX, y, pageWidth - (marginX * 2), clientCardHeight, 6, 6, "F");
    doc.setDrawColor(200, 210, 206);
    doc.setLineWidth(0.5);
    doc.roundedRect(marginX, y, pageWidth - (marginX * 2), clientCardHeight, 6, 6, "S");
    doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PROPOSTA PARA", marginX + 18, y + 18);
    doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const clientNameLines = doc.splitTextToSize(budgetData.clienteNome, pageWidth - (marginX * 2) - 36);
    doc.text(clientNameLines[0], marginX + 18, y + 38);

    let clientDetailY = y + 56;
    doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    clientDetailsText.forEach((line) => {
      doc.text(line, marginX + 18, clientDetailY);
      clientDetailY += 10;
    });
    y += clientCardHeight + 18;

    if (budgetData.introText) {
      const introLines = doc.splitTextToSize(budgetData.introText, pageWidth - (marginX * 2) - 20);
      const introHeight = Math.min(introLines.length, 4) * 12 + 28;
      doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
      doc.roundedRect(marginX, y, pageWidth - (marginX * 2), introHeight, 6, 6, "F");
      doc.setDrawColor(200, 210, 206);
      doc.setLineWidth(0.5);
      doc.roundedRect(marginX, y, pageWidth - (marginX * 2), introHeight, 6, 6, "S");
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Mensagem", marginX + 18, y + 18);
      doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(introLines.slice(0, 4), marginX + 18, y + 34);
      y += introHeight + 18;
    }

    const tableY = y;
    const tableWidth = pageWidth - (marginX * 2);
    doc.autoTable({
      startY: tableY,
      margin: { left: marginX, right: marginX },
      tableWidth,
      head: [["Serviço", "Quantidade", "Valor Unitário", "Desconto", "Total"]],
      body: tableBody,
      styles: {
        font: "helvetica",
        fontSize: 8,
        textColor: textPrimary,
        cellPadding: 5,
        lineColor: [220, 225, 223],
        lineWidth: 0.4,
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: greenDark,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        valign: "middle"
      },
      columnStyles: {
        0: { cellWidth: 160, halign: "left" },
        1: { cellWidth: 58, halign: "center" },
        2: { cellWidth: 68, halign: "right" },
        3: { cellWidth: 62, halign: "right" },
        4: { cellWidth: 76, halign: "right" }
      },
      alternateRowStyles: { fillColor: [248, 250, 249] },
      theme: "grid",
      didDrawPage: (data) => {
        if (data.pageCount > 1 && data.cursor.y > 0) {
          return;
        }
      }
    });

    const tabelaFinalY = doc.lastAutoTable.finalY;
    const footerY = pageHeight - 54;
    const summaryWidth = 190;
    const summaryX = pageWidth - marginX - summaryWidth;
    const summaryHeight = 96;
    const contentGap = 18;
    let contentY = tabelaFinalY + 18;

    const ensurePageSpace = (requiredHeight) => {
      if (contentY + requiredHeight > footerY - 16) {
        doc.addPage();
        doc.setFillColor(softBg[0], softBg[1], softBg[2]);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        contentY = 60;
      }
    };

    ensurePageSpace(summaryHeight + 12);
    const summaryY = contentY;
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(summaryX, summaryY, summaryWidth, summaryHeight, 6, 6, "F");
    doc.setDrawColor(200, 210, 206);
    doc.setLineWidth(0.5);
    doc.roundedRect(summaryX, summaryY, summaryWidth, summaryHeight, 6, 6, "S");

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Subtotal", summaryX + 16, summaryY + 28);
    doc.text(formatCurrency(budgetData.subtotal), summaryX + summaryWidth - 12, summaryY + 28, { align: "right" });
    doc.text("Desconto", summaryX + 16, summaryY + 48);
    doc.text(formatCurrency(budgetData.descontoTotal), summaryX + summaryWidth - 12, summaryY + 48, { align: "right" });

    doc.setFillColor(greenDark[0], greenDark[1], greenDark[2]);
    doc.roundedRect(summaryX, summaryY + 60, summaryWidth, 32, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("TOTAL", summaryX + 16, summaryY + 79);
    doc.setFontSize(15);
    doc.text(formatCurrency(budgetData.total), summaryX + summaryWidth - 12, summaryY + 79, { align: "right" });

    contentY = summaryY + summaryHeight + contentGap;

    if (budgetData.conditionsText) {
      const conditionsLines = doc.splitTextToSize(uniqueText(budgetData.conditionsText), pageWidth - (marginX * 2) - 20);
      const conditionsHeight = 26 + Math.min(conditionsLines.length, 4) * 12;
      ensurePageSpace(conditionsHeight + 12);
      const conditionsY = contentY;
      doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
      doc.roundedRect(marginX, conditionsY, pageWidth - (marginX * 2), conditionsHeight, 6, 6, "F");
      doc.setDrawColor(200, 210, 206);
      doc.setLineWidth(0.5);
      doc.roundedRect(marginX, conditionsY, pageWidth - (marginX * 2), conditionsHeight, 6, 6, "S");
      doc.setDrawColor(turquoise[0], turquoise[1], turquoise[2]);
      doc.setLineWidth(1.2);
      doc.line(marginX + 16, conditionsY + 10, marginX + 16, conditionsY + conditionsHeight - 10);
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Condições", marginX + 26, conditionsY + 18);
      doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(conditionsLines.slice(0, 4), marginX + 26, conditionsY + 34);
      contentY = conditionsY + conditionsHeight + contentGap;
    }

    if (budgetData.observationsText) {
      const observationLines = doc.splitTextToSize(uniqueText(budgetData.observationsText), pageWidth - (marginX * 2) - 20);
      const observationHeight = 26 + Math.min(observationLines.length, 4) * 12;
      ensurePageSpace(observationHeight + 12);
      const observationsY = contentY;
      doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
      doc.roundedRect(marginX, observationsY, pageWidth - (marginX * 2), observationHeight, 6, 6, "F");
      doc.setDrawColor(200, 210, 206);
      doc.setLineWidth(0.5);
      doc.roundedRect(marginX, observationsY, pageWidth - (marginX * 2), observationHeight, 6, 6, "S");
      doc.setDrawColor(turquoise[0], turquoise[1], turquoise[2]);
      doc.setLineWidth(1.2);
      doc.line(marginX + 16, observationsY + 10, marginX + 16, observationsY + observationHeight - 10);
      doc.setTextColor(greenDark[0], greenDark[1], greenDark[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Observações", marginX + 26, observationsY + 18);
      doc.setTextColor(textPrimary[0], textPrimary[1], textPrimary[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(observationLines.slice(0, 4), marginX + 26, observationsY + 34);
      contentY = observationsY + observationHeight + 18;
    }

    doc.setFillColor(0, 77, 64);
    doc.rect(0, footerY, pageWidth, 54, "F");
    doc.setDrawColor(0, 168, 150);
    doc.setLineWidth(0.8);
    doc.line(marginX, footerY + 7, pageWidth - marginX, footerY + 7);
    doc.setFillColor(0, 168, 150);
    doc.roundedRect(marginX + 8, footerY + 42, 34, 2, 1, 1, "F");
    doc.roundedRect(pageWidth - marginX - 42, footerY + 42, 34, 2, 1, 1, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CX DIGITAL", marginX, footerY + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const footerLeftY = footerY + 32;
    doc.text("Consultoria Digital para Pequenos Negócios", marginX, footerLeftY);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("chrysxxzdigital.contato@gmail.com", pageWidth / 2, footerY + 24, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("WhatsApp: (41) 99620-6845", pageWidth - marginX - 8, footerY + 24, { align: "right" });

    const finalContentHeight = contentY + 18;
    const remainingSpace = pageHeight - footerY - 54;
    const safeGap = Math.max(10, Math.min(18, remainingSpace - 12));
    if (finalContentHeight + safeGap > footerY) {
      const adjustedGap = Math.max(8, footerY - finalContentHeight - 8);
      if (adjustedGap > 0 && adjustedGap < 20) {
        // manter o rodapé conectado sem mexer na estrutura do conteúdo principal
      }
    }

    return doc.output("blob");
  }

  async function exportBudgetPdf(budgetId) {
    if (!budgetModuleInitialized) initializeBudgetModule();

    const budget = budgets.find((item) => item.id === budgetId);
    if (!budget) return;

    const company = getCompanyById(budget.empresaId) || { nomeEmpresa: budget.empresaNome || "Empresa não informada" };
    const safeName = String(company.nomeEmpresa || "empresa")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const fileName = `${budget.numero || "ORC-0000"}-${safeName || "empresa"}.pdf`;
    try {
      const pdfBlob = await generateBudgetPdfDocument(budget);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Erro ao exportar orçamento em PDF:", error);
      window.alert("Não foi possível gerar o PDF do orçamento. Verifique a disponibilidade da biblioteca jsPDF.");
    }
  }

  function parseCurrencyValue(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    const sanitized = String(value ?? "")
      .replace(/[^0-9,.-]/g, "")
      .replace(".", "")
      .replace(",", ".");

    const numericValue = Number(sanitized);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  function normalizeDiscountType(value) {
    return value === "percentual" ? "percentual" : "valor";
  }

  function getItemDiscountAmount(item) {
    const quantity = Number(item.quantidade || 0);
    const unitValue = Number(item.valorUnitario || 0);
    const subtotal = quantity * unitValue;
    const discountValue = Number(item.desconto || 0);
    const discountType = normalizeDiscountType(item.descontoTipo);

    if (discountType === "percentual") {
      return subtotal * (discountValue / 100);
    }

    return discountValue;
  }

  function getBudgetsFromStorage() {
    const stored = localStorage.getItem(ORCAMENTOS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((budget) => ({
        ...budget,
        itens: Array.isArray(budget.itens) ? budget.itens.map((item) => ({
          ...item,
          quantidade: Number(item.quantidade || 1),
          valorUnitario: parseCurrencyValue(item.valorUnitario),
          desconto: parseCurrencyValue(item.desconto),
          descontoTipo: item.descontoTipo === "percentual" ? "percentual" : "valor"
        })) : [],
        subtotal: parseCurrencyValue(budget.subtotal),
        desconto: parseCurrencyValue(budget.desconto),
        total: parseCurrencyValue(budget.total)
      }));
    } catch (error) {
      return [];
    }
  }

  function saveBudgets() {
    localStorage.setItem(ORCAMENTOS_STORAGE_KEY, JSON.stringify(budgets));
  }

  function generateBudgetNumber() {
    if (!budgetModuleInitialized) initializeBudgetModule();

    let highestSequence = 16;
    budgets.forEach((budget) => {
      const match = String(budget.numero || "").match(/(\d+)/g);
      const value = match ? Number(match[match.length - 1]) : 0;
      if (value > highestSequence) {
        highestSequence = value;
      }
    });

    const nextSequence = Math.max(highestSequence + 1, 17);
    return `ORC-${String(nextSequence).padStart(4, "0")}`;
  }

  window.generateBudgetPdfDocument = generateBudgetPdfDocument;
  window.generateBudgetNumber = generateBudgetNumber;
  window.exportBudgetPdf = exportBudgetPdf;

  function getCompanyById(id) {
    return companies.find((company) => company.id === id) || null;
  }

  function getBudgetStatusClass(status) {
    const statusMap = {
      Rascunho: "Não contatada",
      Enviado: "Proposta enviada",
      "Em negociação": "Contato realizado",
      Aprovado: "Cliente",
      Recusado: "Sem interesse",
      Expirado: "Sem resposta"
    };

    return statusMap[status] || "Não contatada";
  }

  function createBudgetEntityId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getStoredBudgetArray(key) {
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function ensureBudgetCatalogDefaults() {
    const existing = getStoredBudgetArray(ORCAMENTOS_CATALOG_KEY);
    if (existing.length > 0) {
      return;
    }

    const defaults = [
      { id: createBudgetEntityId("svc"), nome: "Site institucional", descricao: "Presença digital com página institucional e estrutura básica.", valorPadrao: 0, prazoPadrao: "7 dias", categoria: "Website", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Landing page", descricao: "Página de conversão com proposta clara e foco em geração de leads.", valorPadrao: 0, prazoPadrao: "3 dias", categoria: "Marketing", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Catálogo online", descricao: "Estrutura para apresentação de produtos e categorias.", valorPadrao: 0, prazoPadrao: "10 dias", categoria: "E-commerce", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Dashboard", descricao: "Painel com métricas e indicadores operacionais.", valorPadrao: 0, prazoPadrao: "5 dias", categoria: "Sistema", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Planilha personalizada", descricao: "Modelo automatizado para controle e relatórios.", valorPadrao: 0, prazoPadrao: "2 dias", categoria: "Automação", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Manutenção", descricao: "Ajustes, atualizações e suporte contínuo.", valorPadrao: 0, prazoPadrao: "Mensal", categoria: "Suporte", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Hospedagem", descricao: "Hospedagem do projeto e infraestrutura básica.", valorPadrao: 0, prazoPadrao: "Mensal", categoria: "Infraestrutura", ativo: true },
      { id: createBudgetEntityId("svc"), nome: "Domínio", descricao: "Registro e manutenção do domínio.", valorPadrao: 0, prazoPadrao: "Anual", categoria: "Infraestrutura", ativo: true }
    ];

    localStorage.setItem(ORCAMENTOS_CATALOG_KEY, JSON.stringify(defaults));
  }

  function ensureBudgetConditionDefaults() {
    const existing = getStoredBudgetArray(ORCAMENTOS_CONDICOES_KEY);
    if (existing.length > 0) {
      return;
    }

    const defaults = [
      { id: createBudgetEntityId("cond"), nome: "Pagamento à vista", texto: "Pagamento à vista mediante aprovação do orçamento." },
      { id: createBudgetEntityId("cond"), nome: "50% na aprovação + 50% na entrega", texto: "50% na aprovação do projeto e 50% na entrega final." },
      { id: createBudgetEntityId("cond"), nome: "Pagamento integral na aprovação", texto: "Pagamento integral na aprovação do projeto." },
      { id: createBudgetEntityId("cond"), nome: "Pagamento parcelado", texto: "Pagamento parcelado conforme cronograma acordado." },
      { id: createBudgetEntityId("cond"), nome: "Projeto com manutenção mensal", texto: "Projeto com manutenção mensal e suporte contínuo." }
    ];

    localStorage.setItem(ORCAMENTOS_CONDICOES_KEY, JSON.stringify(defaults));
  }

  function ensureBudgetObservationDefaults() {
    const existing = getStoredBudgetArray(ORCAMENTOS_OBSERVACOES_KEY);
    if (existing.length > 0) {
      return;
    }

    const defaults = [
      { id: createBudgetEntityId("obs"), nome: "Observação padrão", texto: "Orçamento válido por 10 dias úteis. Qualquer alteração após aprovação deve ser negociada separadamente." },
      { id: createBudgetEntityId("obs"), nome: "Entrega e suporte", texto: "Entrega conforme cronograma acordado. Suporte e ajustes pós-entrega seguem as regras do plano contratado." }
    ];

    localStorage.setItem(ORCAMENTOS_OBSERVACOES_KEY, JSON.stringify(defaults));
  }

  function getBudgetServiceCatalog() {
    return getStoredBudgetArray(ORCAMENTOS_CATALOG_KEY).map((service) => ({
      id: service.id || createBudgetEntityId("svc"),
      nome: String(service.nome || "").trim(),
      descricao: String(service.descricao || "").trim(),
      valorPadrao: parseCurrencyValue(service.valorPadrao || 0),
      prazoPadrao: String(service.prazoPadrao || "").trim(),
      categoria: String(service.categoria || "").trim(),
      ativo: service.ativo !== false
    }));
  }

  function getBudgetConditionModels() {
    return getStoredBudgetArray(ORCAMENTOS_CONDICOES_KEY).map((model) => ({
      id: model.id || createBudgetEntityId("cond"),
      nome: String(model.nome || "Modelo de condição").trim(),
      texto: String(model.texto || "").trim()
    }));
  }

  function getBudgetObservationModels() {
    return getStoredBudgetArray(ORCAMENTOS_OBSERVACOES_KEY).map((model) => ({
      id: model.id || createBudgetEntityId("obs"),
      nome: String(model.nome || "Modelo de observação").trim(),
      texto: String(model.texto || "").trim()
    }));
  }

  function renderBudgetCatalogOptions() {
    if (!orcamentoCatalogoSelect) return;

    const catalog = getBudgetServiceCatalog();
    const options = ['<option value="">Selecionar serviço</option>', '<option value="custom">+ Serviço personalizado</option>'];
    catalog.filter((service) => service.ativo && service.nome).forEach((service) => {
      options.push(`<option value="${service.id}">${service.nome}</option>`);
    });
    orcamentoCatalogoSelect.innerHTML = options.join("");
  }

  function renderBudgetConditionModelsOptions() {
    if (!orcamentoCondicaoModeloSelect) return;

    const models = getBudgetConditionModels();
    const options = ['<option value="">Selecionar condição comercial</option>'];
    models.forEach((model) => {
      options.push(`<option value="${model.id}">${model.nome || "Condição"}</option>`);
    });
    orcamentoCondicaoModeloSelect.innerHTML = options.join("");
  }

  function renderBudgetObservationModelsOptions() {
    if (!orcamentoObservacaoModeloSelect) return;

    const models = getBudgetObservationModels();
    const options = ['<option value="">Inserir modelo de observação</option>'];
    models.forEach((model) => {
      options.push(`<option value="${model.id}">${model.nome || "Observação"}</option>`);
    });
    orcamentoObservacaoModeloSelect.innerHTML = options.join("");
  }

  function applyCatalogServiceToForm(serviceId) {
    if (!orcamentoItensContainer) return;

    if (!serviceId) return;
    if (serviceId === "custom") {
      addBudgetItem();
      if (orcamentoCatalogoSelect) {
        orcamentoCatalogoSelect.value = "";
      }
      return;
    }

    const catalog = getBudgetServiceCatalog();
    const service = catalog.find((item) => item.id === serviceId);
    if (!service) {
      if (orcamentoCatalogoSelect) {
        orcamentoCatalogoSelect.value = "";
      }
      return;
    }

    const row = addBudgetItem({
      nome: service.nome || "",
      descricao: service.descricao || "",
      quantidade: 1,
      valorUnitario: Number(service.valorPadrao || 0),
      desconto: 0
    });

    if (row) {
      const nomeInput = row.querySelector('[data-role="item-nome"]');
      if (nomeInput) nomeInput.focus();
    }

    if (orcamentoCatalogoSelect) {
      orcamentoCatalogoSelect.value = "";
    }
  }

  function applyConditionModelToForm(modelId) {
    if (!modelId || !document.getElementById("orcamentoCondicoes")) return;
    const model = getBudgetConditionModels().find((item) => item.id === modelId);
    if (!model) return;

    const field = document.getElementById("orcamentoCondicoes");
    const text = model.texto || "";
    field.value = field.value && field.value.includes(text) ? field.value : text;
    if (orcamentoCondicaoModeloSelect) {
      orcamentoCondicaoModeloSelect.value = "";
    }
  }

  function applyObservationModelToForm(modelId) {
    if (!modelId || !document.getElementById("orcamentoObservacoes")) return;
    const model = getBudgetObservationModels().find((item) => item.id === modelId);
    if (!model) return;

    const field = document.getElementById("orcamentoObservacoes");
    const currentValue = (field.value || "").trim();
    const modelText = model.texto || "";
    const mergedValue = currentValue && currentValue.includes(modelText)
      ? currentValue
      : currentValue
        ? `${currentValue}\n\n${modelText}`.trim()
        : modelText;
    field.value = mergedValue;
    if (orcamentoObservacaoModeloSelect) {
      orcamentoObservacaoModeloSelect.value = "";
    }
  }

  function calculateBudgetTotals(items) {
    const safeItems = Array.isArray(items) ? items : [];
    const subtotal = safeItems.reduce((total, item) => {
      const quantity = Number(item.quantidade || 0);
      const unitPrice = parseCurrencyValue(item.valorUnitario || 0);
      return total + (quantity * unitPrice);
    }, 0);

    const discount = safeItems.reduce((total, item) => total + getItemDiscountAmount(item), 0);
    const total = Math.max(subtotal - discount, 0);

    return { subtotal, desconto: discount, total };
  }

  function buildBudgetItemTemplate(item = {}) {
    return {
      nome: item.nome || "",
      descricao: item.descricao || "",
      quantidade: Number(item.quantidade || 1),
      valorUnitario: parseCurrencyValue(item.valorUnitario || 0),
      desconto: parseCurrencyValue(item.desconto || 0),
      descontoTipo: normalizeDiscountType(item.descontoTipo)
    };
  }

  function createBudgetItemRow(item = {}) {
    const row = document.createElement("div");
    row.className = "orcamento-item-row";
    const itemName = String(item.nome || "").replace(/"/g, "&quot;");
    const itemDescription = String(item.descricao || "").replace(/"/g, "&quot;");
    const itemValue = Number(item.valorUnitario || 0);
    const itemDiscount = Number(item.desconto || 0);
    const itemDiscountType = normalizeDiscountType(item.descontoTipo);

    row.innerHTML = `
      <div class="orcamento-item-field">
        <label>Serviço</label>
        <input type="text" data-role="item-nome" value="${itemName}" placeholder="Serviço" />
      </div>
      <div class="orcamento-item-field item-wide">
        <label>Descrição</label>
        <input type="text" data-role="item-descricao" value="${itemDescription}" placeholder="Detalhes do serviço" />
      </div>
      <div class="orcamento-item-field compact-field">
        <label>Qtd.</label>
        <input type="number" min="1" step="1" data-role="item-quantidade" value="${Number(item.quantidade || 1)}" />
      </div>
      <div class="orcamento-item-field compact-field">
        <label>Valor</label>
        <div class="money-input-wrap">
          <span class="money-prefix">R$</span>
          <input type="text" inputmode="decimal" data-role="item-valor" value="${formatMoneyInputDigits(itemValue)}" placeholder="0,00" />
        </div>
      </div>
      <div class="orcamento-item-field compact-field discount-field">
        <label>Desconto</label>
        <div class="discount-input-wrap">
          <select class="discount-type-select" data-role="item-desconto-tipo">
            <option value="valor" ${itemDiscountType === "valor" ? "selected" : ""}>R$</option>
            <option value="percentual" ${itemDiscountType === "percentual" ? "selected" : ""}>%</option>
          </select>
          <input type="text" inputmode="decimal" data-role="item-desconto" value="${itemDiscountType === "percentual" ? formatPercentInputValue(itemDiscount) : formatMoneyInputValue(itemDiscount)}" placeholder="R$ 0,00" />
        </div>
      </div>
      <div class="orcamento-item-actions">
        <label>AÇÕES</label>
        <button type="button" class="chip danger-btn-remove" data-remove-budget-item="true">Remover</button>
      </div>
    `;

    const valueInput = row.querySelector('[data-role="item-valor"]');
    const discountTypeInput = row.querySelector('[data-role="item-desconto-tipo"]');
    const discountInput = row.querySelector('[data-role="item-desconto"]');

    const syncDiscountInputDisplay = () => {
      const type = discountTypeInput.value;
      const rawValue = Number(discountInput.dataset.rawValue || 0);
      if (type === "percentual") {
        discountInput.value = formatPercentInputValue(rawValue);
      } else {
        discountInput.value = formatMoneyInputValue(rawValue);
      }
    };

    if (valueInput) {
      valueInput.dataset.rawValue = String(Number(itemValue || 0));
      valueInput.addEventListener("focus", () => {
        if (valueInput.value === "0,00") {
          valueInput.value = "";
        }
      });

      valueInput.addEventListener("input", () => {
        const numericValue = parseMoneyInputValue(valueInput.value);
        valueInput.dataset.rawValue = String(numericValue);
        valueInput.value = formatMoneyInputDigits(numericValue);
        calculateBudgetTotalsFromForm();
      });
    }

    if (discountTypeInput && discountInput) {
      discountInput.dataset.rawValue = String(Number(itemDiscount || 0));
      discountTypeInput.addEventListener("change", () => {
        const currentValue = Number(discountInput.dataset.rawValue || 0);
        if (discountTypeInput.value === "percentual") {
          discountInput.value = formatPercentInputValue(currentValue);
        } else {
          discountInput.value = formatMoneyInputValue(currentValue);
        }
        calculateBudgetTotalsFromForm();
      });

      discountInput.addEventListener("focus", () => {
        const currentValue = discountTypeInput.value === "percentual" ? "0%" : "R$ 0,00";
        if (discountInput.value === currentValue) {
          discountInput.value = "";
        }
      });

      discountInput.addEventListener("input", () => {
        const rawValue = parseMoneyInputValue(discountInput.value);
        discountInput.dataset.rawValue = String(rawValue);
        if (discountTypeInput.value === "percentual") {
          discountInput.value = formatPercentInputValue(rawValue);
        } else {
          discountInput.value = formatMoneyInputValue(rawValue);
        }
        calculateBudgetTotalsFromForm();
      });

      syncDiscountInputDisplay();
    }

    const removeButton = row.querySelector("[data-remove-budget-item]");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        row.remove();
        calculateBudgetTotalsFromForm();
      });
    }

    row.querySelectorAll("input[data-role]").forEach((input) => {
      if (input.dataset.role !== "item-valor" && input.dataset.role !== "item-desconto") {
        input.addEventListener("input", calculateBudgetTotalsFromForm);
      }
    });

    return row;
  }

  function calculateBudgetTotalsFromForm() {
    if (!orcamentoItensContainer) return { subtotal: 0, desconto: 0, total: 0 };

    const items = Array.from(orcamentoItensContainer.querySelectorAll(".orcamento-item-row")).map((row) => ({
      nome: row.querySelector('[data-role="item-nome"]').value || "",
      descricao: row.querySelector('[data-role="item-descricao"]').value || "",
      quantidade: Number(row.querySelector('[data-role="item-quantidade"]').value || 1),
      valorUnitario: parseCurrencyValue(row.querySelector('[data-role="item-valor"]').value),
      desconto: Number(row.querySelector('[data-role="item-desconto"]').dataset.rawValue || parseMoneyInputValue(row.querySelector('[data-role="item-desconto"]').value)),
      descontoTipo: normalizeDiscountType(row.querySelector('[data-role="item-desconto-tipo"]').value)
    }));

    const totals = calculateBudgetTotals(items);
    if (orcamentoSubtotalValue) {
      orcamentoSubtotalValue.textContent = formatCurrency(totals.subtotal);
    }
    if (orcamentoDescontoValue) {
      orcamentoDescontoValue.textContent = formatCurrency(totals.desconto);
    }
    if (orcamentoTotalValue) {
      orcamentoTotalValue.textContent = formatCurrency(totals.total);
    }

    return totals;
  }

  function renderBudgetCustomerSummary(companyId) {
    if (!orcamentoClienteSummary) return;
    const company = getCompanyById(companyId);

    if (!company) {
      orcamentoClienteSummary.innerHTML = "<span>Selecione uma empresa para visualizar os dados do cliente.</span>";
      return;
    }

    orcamentoClienteSummary.innerHTML = `
      <strong>${company.nomeEmpresa}</strong>
      <span>${company.segmento || "Segmento não informado"} • ${company.cidade || "-"} / ${company.estado || "-"}</span>
      <small>${company.telefone || company.whatsapp || "Contato não informado"}</small>
    `;
  }

  function renderBudgetCompanyOptions(selectedId = "") {
    if (!orcamentoEmpresaSelect) return;

    const options = [
      '<option value="">Selecione uma empresa</option>',
      ...companies.map((company) => `<option value="${company.id}" ${company.id === selectedId ? "selected" : ""}>${company.nomeEmpresa}</option>`)
    ];

    orcamentoEmpresaSelect.innerHTML = options.join("");
    if (!companies.length) {
      orcamentoEmpresaSelect.disabled = true;
    } else {
      orcamentoEmpresaSelect.disabled = false;
    }

    if (selectedId && companies.some((company) => company.id === selectedId)) {
      renderBudgetCustomerSummary(selectedId);
    } else {
      renderBudgetCustomerSummary("");
    }
  }

  function openBudgetForm(mode = "create", id = null) {
    if (!orcamentoFormModal || !orcamentoForm) return;

    budgets = getBudgetsFromStorage();
    renderBudgetCompanyOptions();
    renderBudgetCatalogOptions();
    renderBudgetConditionModelsOptions();
    renderBudgetObservationModelsOptions();

    orcamentoFormModal.classList.remove("hidden");
    orcamentoFormModal.setAttribute("aria-hidden", "false");
    orcamentoForm.reset();

    if (mode === "edit" && id) {
      const budget = budgets.find((item) => item.id === id);
      if (!budget) return;

      const companyId = budget.empresaId || "";
      renderBudgetCompanyOptions(companyId);

      const validityParts = splitBudgetValidityValue(budget.validade);
      document.getElementById("orcamentoFormTitle").textContent = "Editar orçamento";
      orcamentoForm.dataset.mode = "edit";
      orcamentoForm.dataset.id = budget.id;
      orcamentoNumero.value = budget.numero || generateBudgetNumber();
      orcamentoData.value = normalizeBudgetDateTimeInput(budget.data) ? normalizeBudgetDateTimeInput(budget.data).slice(0, 10) : formatBudgetLocalDateForInput(new Date());
      orcamentoValidade.value = validityParts.date || "";
      document.getElementById("orcamentoValidadeHora").value = validityParts.time || "";
      document.getElementById("orcamentoStatus").value = budget.status || "Rascunho";
      document.getElementById("orcamentoCondicoes").value = budget.condicoes || "";
      document.getElementById("orcamentoObservacoes").value = budget.observacoes || "";
      orcamentoEmpresaSelect.value = companyId;
      renderBudgetCustomerSummary(companyId);

      orcamentoItensContainer.innerHTML = "";
      const items = Array.isArray(budget.itens) && budget.itens.length ? budget.itens : [buildBudgetItemTemplate()];
      items.forEach((item) => {
        orcamentoItensContainer.appendChild(createBudgetItemRow(item));
      });
      calculateBudgetTotalsFromForm();
      return;
    }

    document.getElementById("orcamentoFormTitle").textContent = "Novo orçamento";
    orcamentoForm.dataset.mode = "create";
    orcamentoForm.dataset.id = "";
    orcamentoNumero.value = generateBudgetNumber();
    orcamentoData.value = formatBudgetLocalDateForInput(new Date());
    orcamentoValidade.value = "";
    document.getElementById("orcamentoValidadeHora").value = "";
    document.getElementById("orcamentoStatus").value = "Rascunho";
    document.getElementById("orcamentoCondicoes").value = "";
    document.getElementById("orcamentoObservacoes").value = "";

    orcamentoItensContainer.innerHTML = "";
    orcamentoItensContainer.appendChild(createBudgetItemRow({ nome: "", quantidade: 1, valorUnitario: 0, desconto: 0 }));
    calculateBudgetTotalsFromForm();
  }

  function closeBudgetForm() {
    if (!orcamentoFormModal) return;
    orcamentoFormModal.classList.add("hidden");
    orcamentoFormModal.setAttribute("aria-hidden", "true");
    orcamentoForm.reset();
    orcamentoForm.dataset.mode = "create";
    orcamentoForm.dataset.id = "";
    if (orcamentoItensContainer) {
      orcamentoItensContainer.innerHTML = "";
    }
    if (orcamentoClienteSummary) {
      orcamentoClienteSummary.innerHTML = "<span>Selecione uma empresa para visualizar os dados do cliente.</span>";
    }
  }

  function closeBudgetSuccessModal() {
    if (!orcamentoSuccessModal) return;
    orcamentoSuccessModal.classList.add("hidden");
    orcamentoSuccessModal.setAttribute("aria-hidden", "true");
  }

  function closeBudgetDeleteModal() {
    if (!orcamentoDeleteModal) return;
    orcamentoDeleteModal.classList.add("hidden");
    orcamentoDeleteModal.setAttribute("aria-hidden", "true");
    orcamentoDeleteModal.removeAttribute("data-pending-id");
  }

  function closeBudgetDetailModal() {
    if (!orcamentoDetailModal) return;
    orcamentoDetailModal.classList.add("hidden");
    orcamentoDetailModal.setAttribute("aria-hidden", "true");
  }

  function renderBudgetSummary() {
    const total = budgets.length;
    const enviados = budgets.filter((budget) => budget.status === "Enviado").length;
    const negociacao = budgets.filter((budget) => budget.status === "Em negociação").length;
    const aprovados = budgets.filter((budget) => budget.status === "Aprovado").length;
    const approvedValue = budgets
      .filter((budget) => budget.status === "Aprovado")
      .reduce((sum, budget) => sum + parseCurrencyValue(budget.total || 0), 0);

    if (orcamentosTotalCount) orcamentosTotalCount.textContent = String(total);
    if (orcamentosEnviadosCount) orcamentosEnviadosCount.textContent = String(enviados);
    if (orcamentosNegotiationCount) orcamentosNegotiationCount.textContent = String(negociacao);
    if (orcamentosApprovedCount) orcamentosApprovedCount.textContent = String(aprovados);
    if (orcamentosApprovedValue) orcamentosApprovedValue.textContent = formatCurrency(approvedValue);
  }

  function renderBudgetList() {
    if (!orcamentosTableBody) return;

    let filteredBudgets = [...budgets];
    const searchTerm = (orcamentoBusca?.value || "").trim().toLowerCase();
    const statusTerm = orcamentoStatusFiltro?.value || "";

    if (searchTerm) {
      filteredBudgets = filteredBudgets.filter((budget) => {
        const company = getCompanyById(budget.empresaId);
        const haystack = [
          budget.numero,
          company?.nomeEmpresa || budget.empresaNome || "",
          budget.status,
          budget.condicoes,
          budget.observacoes
        ].join(" ").toLowerCase();
        return haystack.includes(searchTerm);
      });
    }

    if (statusTerm) {
      filteredBudgets = filteredBudgets.filter((budget) => budget.status === statusTerm);
    }

    filteredBudgets.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));

    orcamentosTableBody.innerHTML = "";
    if (!filteredBudgets.length) {
      orcamentosTableBody.innerHTML = '<tr><td colspan="8" class="empty-table-state">Nenhum orçamento encontrado.</td></tr>';
      renderBudgetSummary();
      return;
    }

    filteredBudgets.forEach((budget) => {
      const company = getCompanyById(budget.empresaId);
      const serviceSummary = Array.isArray(budget.itens) && budget.itens.length
        ? budget.itens.map((item) => item.nome || "Serviço").slice(0, 2).join(", ")
        : "Serviço não definido";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${budget.numero || "ORC-0000"}</td>
        <td>
          <div class="company-name">
            <strong>${company?.nomeEmpresa || budget.empresaNome || "Empresa não informada"}</strong>
            <span>${company?.segmento || "Sem segmento"}</span>
          </div>
        </td>
        <td>${serviceSummary}</td>
        <td>${formatCurrency(budget.total || 0)}</td>
        <td>${budget.data ? formatPdfDateTime(budget.data, false) || "-" : "-"}</td>
        <td>${budget.validade ? formatPdfDateTime(budget.validade, false) || "-" : "-"}</td>
        <td><span class="status-pill" data-status="${getBudgetStatusClass(budget.status || "Rascunho")}">${budget.status || "Rascunho"}</span></td>
        <td>
          <div class="action-buttons">
            <button type="button" class="action-btn editar" data-budget-action="view" data-budget-id="${budget.id}">Visualizar</button>
            <button type="button" class="action-btn editar" data-budget-action="edit" data-budget-id="${budget.id}">Editar</button>
            <button type="button" class="action-btn delete" data-budget-action="delete" data-budget-id="${budget.id}">Excluir</button>
          </div>
        </td>
      `;
      orcamentosTableBody.appendChild(row);
    });

    renderBudgetSummary();
  }

  function syncBudgetToStorage() {
    budgets = getBudgetsFromStorage();
    renderBudgetList();
  }

  function openBudgetDeleteModal(id) {
    const budget = budgets.find((item) => item.id === id);
    if (!budget || !orcamentoDeleteModal) return;

    orcamentoDeleteModal.dataset.pendingId = id;
    orcamentoDeleteName.textContent = budget.numero || "Orçamento";
    orcamentoDeleteModal.classList.remove("hidden");
    orcamentoDeleteModal.setAttribute("aria-hidden", "false");
  }

  function confirmBudgetDelete() {
    const id = orcamentoDeleteModal?.dataset.pendingId;
    if (!id) return;

    budgets = budgets.filter((budget) => budget.id !== id);
    saveBudgets();
    closeBudgetDeleteModal();
    renderBudgetList();
  }

  function openBudgetDetail(id) {
    const budget = budgets.find((item) => item.id === id);
    if (!budget || !orcamentoDetailModal || !orcamentoDetailContent) return;

    const company = getCompanyById(budget.empresaId);
    const itemsMarkup = Array.isArray(budget.itens) && budget.itens.length
      ? budget.itens.map((item) => `
          <div class="orcamento-detail-item">
            <div>
              <strong>${item.nome || "Serviço"}</strong>
              <small>${item.descricao || "Sem descrição"}</small>
            </div>
            <span>${item.quantidade || 1} x ${formatCurrency(item.valorUnitario || 0)}</span>
          </div>
        `).join("")
      : '<div class="orcamento-detail-empty">Nenhum item cadastrado.</div>';

    orcamentoDetailContent.innerHTML = `
      <div class="orcamento-detail-header">
        <div>
          <span class="topbar-kicker">Orçamento</span>
          <h4>${budget.numero || "ORC-0000"}</h4>
        </div>
        <span class="status-pill" data-status="${getBudgetStatusClass(budget.status || "Rascunho")}">${budget.status || "Rascunho"}</span>
      </div>

      <div class="detail-grid">
        <div class="detail-item"><span>Empresa</span><strong>${company?.nomeEmpresa || budget.empresaNome || "Empresa não informada"}</strong></div>
        <div class="detail-item"><span>Data</span><strong>${budget.data ? formatPdfDateTime(budget.data, false) || "-" : "-"}</strong></div>
        <div class="detail-item"><span>Validade</span><strong>${budget.validade ? formatPdfDateTime(budget.validade, true) || formatPdfDateTime(budget.validade, false) || "-" : "-"}</strong></div>
        <div class="detail-item"><span>Total</span><strong>${formatCurrency(budget.total || 0)}</strong></div>
      </div>

      <div class="detail-notes">
        <h4>Itens</h4>
        <div class="orcamento-detail-items">${itemsMarkup}</div>
      </div>

      ${budget.condicoes ? `
        <div class="detail-notes">
          <h4>Condições comerciais</h4>
          <p>${budget.condicoes}</p>
        </div>
      ` : ""}

      ${budget.observacoes ? `
        <div class="detail-notes">
          <h4>Observações</h4>
          <p>${budget.observacoes}</p>
        </div>
      ` : ""}
    `;

    detailBudgetEditButton.dataset.id = budget.id;
    detailBudgetDuplicateButton.dataset.id = budget.id;
    detailBudgetExportButton.dataset.id = budget.id;

    orcamentoDetailModal.classList.remove("hidden");
    orcamentoDetailModal.setAttribute("aria-hidden", "false");
  }

  function submitBudgetForm(event) {
    event.preventDefault();
    if (!orcamentoForm) return;

    const formMode = orcamentoForm.dataset.mode || "create";
    const formId = orcamentoForm.dataset.id || null;
    const empresaId = orcamentoEmpresaSelect?.value || "";
    const company = getCompanyById(empresaId);
    const itemRows = Array.from(orcamentoItensContainer.querySelectorAll(".orcamento-item-row"));
    const parsedItems = itemRows.map((row) => ({
      nome: row.querySelector('[data-role="item-nome"]').value.trim() || "",
      descricao: row.querySelector('[data-role="item-descricao"]').value.trim(),
      quantidade: Number(row.querySelector('[data-role="item-quantidade"]').value || 1),
      valorUnitario: parseCurrencyValue(row.querySelector('[data-role="item-valor"]').value),
      desconto: Number(row.querySelector('[data-role="item-desconto"]').dataset.rawValue || parseMoneyInputValue(row.querySelector('[data-role="item-desconto"]').value)),
      descontoTipo: normalizeDiscountType(row.querySelector('[data-role="item-desconto-tipo"]').value)
    })).filter((item) => item.nome || item.descricao || item.quantidade > 0).map((item) => ({
      ...item,
      nome: item.nome || (item.descricao ? "Item personalizado" : "Item do orçamento")
    }));

    if (!empresaId || !parsedItems.length) {
      return;
    }

    const totals = calculateBudgetTotals(parsedItems);
    const validadeDate = document.getElementById("orcamentoValidade")?.value || "";
    const validadeHora = document.getElementById("orcamentoValidadeHora")?.value || "";
    const budgetPayload = {
      id: formId || (crypto.randomUUID ? crypto.randomUUID() : `orcamento-${Date.now()}`),
      numero: orcamentoNumero.value || generateBudgetNumber(),
      empresaId,
      empresaNome: company?.nomeEmpresa || "Empresa não informada",
      data: normalizeBudgetDateTimeInput(orcamentoData.value) ? normalizeBudgetDateTimeInput(orcamentoData.value).slice(0, 10) : formatBudgetLocalDateForInput(new Date()),
      validade: validadeDate && validadeHora ? `${validadeDate}T${validadeHora}:00` : "",
      status: document.getElementById("orcamentoStatus").value || "Rascunho",
      condicoes: document.getElementById("orcamentoCondicoes").value.trim(),
      observacoes: document.getElementById("orcamentoObservacoes").value.trim(),
      itens: parsedItems,
      subtotal: totals.subtotal,
      desconto: totals.desconto,
      total: totals.total,
      atualizadoEm: formatBudgetLocalDateTimeForInput(new Date())
    };

    if (formMode === "edit") {
      budgets = budgets.map((budget) => (budget.id === budgetPayload.id ? budgetPayload : budget));
    } else {
      budgets.unshift(budgetPayload);
    }

    saveBudgets();
    renderBudgetList();
    closeBudgetForm();

    lastBudgetIdCreated = budgetPayload.id;
    if (orcamentoSuccessNumber) {
      orcamentoSuccessNumber.textContent = `${budgetPayload.numero}`;
    }

    if (orcamentoSuccessModal) {
      orcamentoSuccessModal.classList.remove("hidden");
      orcamentoSuccessModal.setAttribute("aria-hidden", "false");
    }
  }

  function duplicateBudget(id) {
    const original = budgets.find((budget) => budget.id === id);
    if (!original) return;

    const duplicated = {
      ...original,
      id: crypto.randomUUID ? crypto.randomUUID() : `orcamento-${Date.now()}`,
      numero: generateBudgetNumber(),
      status: "Rascunho",
      data: formatBudgetLocalDateTimeForInput(new Date()),
      criadoEm: formatBudgetLocalDateTimeForInput(new Date()),
      atualizadoEm: formatBudgetLocalDateTimeForInput(new Date())
    };

    budgets.unshift(duplicated);
    saveBudgets();
    renderBudgetList();
    openBudgetDetail(duplicated.id);
  }

  function openNewBudgetForm() {
    openBudgetForm("create");
  }

  function handleBudgetRowAction(event) {
    const button = event.target.closest("button[data-budget-action]");
    if (!button) return;

    const { budgetAction, budgetId } = button.dataset;
    if (!budgetId) return;

    if (budgetAction === "view") {
      openBudgetDetail(budgetId);
      return;
    }

    if (budgetAction === "edit") {
      openBudgetForm("edit", budgetId);
      return;
    }

    if (budgetAction === "delete") {
      openBudgetDeleteModal(budgetId);
    }
  }

  function addBudgetItem(item = {}) {
    if (!orcamentoItensContainer) return null;
    const row = createBudgetItemRow({
      nome: item.nome || "",
      descricao: item.descricao || "",
      quantidade: Number(item.quantidade || 1),
      valorUnitario: item.valorUnitario ?? 0,
      desconto: item.desconto ?? 0
    });
    orcamentoItensContainer.appendChild(row);
    calculateBudgetTotalsFromForm();
    return row;
  }

  function initializeBudgetModule() {
    if (budgetModuleInitialized) return;
    budgetModuleInitialized = true;

    ensureBudgetCatalogDefaults();
    ensureBudgetConditionDefaults();
    ensureBudgetObservationDefaults();

    budgets = getBudgetsFromStorage();
    renderBudgetList();
    renderBudgetCompanyOptions();
    renderBudgetCatalogOptions();
    renderBudgetConditionModelsOptions();
    renderBudgetObservationModelsOptions();

    if (btnNovoOrcamento) {
      btnNovoOrcamento.addEventListener("click", openNewBudgetForm);
    }

    if (btnAdicionarItemOrcamento) {
      btnAdicionarItemOrcamento.addEventListener("click", addBudgetItem);
    }

    if (orcamentoEmpresaSelect) {
      orcamentoEmpresaSelect.addEventListener("change", (event) => {
        renderBudgetCustomerSummary(event.target.value);
      });
    }

    if (orcamentoCatalogoSelect) {
      orcamentoCatalogoSelect.addEventListener("change", (event) => {
        applyCatalogServiceToForm(event.target.value);
      });
    }

    if (orcamentoCondicaoModeloSelect) {
      orcamentoCondicaoModeloSelect.addEventListener("change", (event) => {
        applyConditionModelToForm(event.target.value);
      });
    }

    if (orcamentoObservacaoModeloSelect) {
      orcamentoObservacaoModeloSelect.addEventListener("change", (event) => {
        applyObservationModelToForm(event.target.value);
      });
    }

    if (orcamentoForm) {
      orcamentoForm.addEventListener("submit", submitBudgetForm);
    }

    if (orcamentoBusca) {
      orcamentoBusca.addEventListener("input", renderBudgetList);
    }

    if (orcamentoStatusFiltro) {
      orcamentoStatusFiltro.addEventListener("change", renderBudgetList);
    }

    if (orcamentosTableBody) {
      orcamentosTableBody.addEventListener("click", handleBudgetRowAction);
    }

    if (confirmDeleteBudgetButton) {
      confirmDeleteBudgetButton.addEventListener("click", confirmBudgetDelete);
    }

    if (btnVerOrcamento) {
      btnVerOrcamento.addEventListener("click", () => {
        closeBudgetSuccessModal();
        if (lastBudgetIdCreated) {
          openBudgetDetail(lastBudgetIdCreated);
        }
      });
    }

    if (detailBudgetEditButton) {
      detailBudgetEditButton.addEventListener("click", () => {
        const id = detailBudgetEditButton.dataset.id;
        closeBudgetDetailModal();
        if (id) {
          openBudgetForm("edit", id);
        }
      });
    }

    if (detailBudgetDuplicateButton) {
      detailBudgetDuplicateButton.addEventListener("click", () => {
        const id = detailBudgetDuplicateButton.dataset.id;
        closeBudgetDetailModal();
        if (id) {
          duplicateBudget(id);
        }
      });
    }

    if (detailBudgetExportButton) {
      detailBudgetExportButton.addEventListener("click", () => {
        const id = detailBudgetExportButton.dataset.id;
        if (id) {
          exportBudgetPdf(id);
        }
      });
    }

    document.querySelectorAll("[data-close-orcamento-form-modal]").forEach((button) => {
      button.addEventListener("click", closeBudgetForm);
    });

    document.querySelectorAll("[data-close-orcamento-success-modal]").forEach((button) => {
      button.addEventListener("click", closeBudgetSuccessModal);
    });

    document.querySelectorAll("[data-close-orcamento-delete-modal]").forEach((button) => {
      button.addEventListener("click", closeBudgetDeleteModal);
    });

    document.querySelectorAll("[data-close-orcamento-detail-modal]").forEach((button) => {
      button.addEventListener("click", closeBudgetDetailModal);
    });
  }

  function saveCompanies() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }

  function saveProspects() {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
  }

  function normalizeStatusValue(value) {
    const normalized = normalizeText(value);
    const validStatuses = new Set(statusOptions);
    return validStatuses.has(normalized) ? normalized : "Não contatada";
  }

  function getWorkedLeads() {
    return [...companies, ...prospects].filter((record) =>
      WORKED_LEAD_STATUSES.has(normalizeStatusValue(record?.status || "Não contatada")) ||
      getPipelineStage(record) !== "Descoberta"
    );
  }

  function getSalesRecords(records = [...companies, ...prospects]) {
    return records.filter((record) => SALE_STATUSES.has(normalizeStatusValue(record?.status || "Não contatada")));
  }

  function getRecordedContactCount(records, activities) {
    const activityCounts = new Map();
    let unlinkedActivityCount = 0;

    activities.filter((activity) => activity.type === "contact_realized").forEach((activity) => {
      if (!activity.entityId) {
        unlinkedActivityCount += 1;
        return;
      }
      activityCounts.set(activity.entityId, (activityCounts.get(activity.entityId) || 0) + 1);
    });

    let recordedCount = unlinkedActivityCount;
    records.forEach((record, index) => {
      const entityId = record.id || `record-${index}`;
      const historyCount = String(record.historico || "")
        .split(/\n\s*\n/)
        .filter((entry) => /^\d{2}\/\d{2}\/\d{4}\s*\|/.test(entry.trim().split("\n")[0] || ""))
        .length;
      const hasContactDate = Boolean(record.ultimoContato || record.primeiroContato);
      const entityActivityCount = activityCounts.get(entityId) || 0;

      recordedCount += Math.max(historyCount, hasContactDate ? 1 : 0, entityActivityCount);
      activityCounts.delete(entityId);
    });

    activityCounts.forEach((count) => {
      recordedCount += count;
    });
    return recordedCount;
  }

  function calculateConversionRate(sales = getSalesRecords()) {
    const workedLeads = getWorkedLeads();

    if (!workedLeads.length) {
      return { value: null, label: "Sem dados", numerator: sales.length, denominator: workedLeads.length };
    }

    const conversion = (sales.length / workedLeads.length) * 100;
    const percentage = Math.round(conversion);
    return { value: percentage, label: `${percentage}%`, numerator: sales.length, denominator: workedLeads.length };
  }

  function getPipelineStage(record) {
    const stage = normalizeText(record?.etapaPipeline || record?.etapa || "Descoberta");
    const stageAliases = {
      Descoberta: "Descoberta",
      Novos: "Descoberta",
      Contato: "Contato",
      Qualificado: "Contato",
      Proposta: "Proposta",
      Negociação: "Negociação",
      Fechamento: "Fechamento",
      Fechado: "Fechamento"
    };
    if (stageAliases[stage]) return stageAliases[stage];

    const status = normalizeStatusValue(record?.status || "Não contatada");
    if (SALE_STATUSES.has(status)) return "Fechamento";
    if (status === "Proposta enviada") return "Proposta";
    if (WORKED_LEAD_STATUSES.has(status)) return "Contato";
    return "Descoberta";
  }

  function getPipelineCounts(records = [...companies, ...prospects]) {
    const stages = ["Descoberta", "Contato", "Proposta", "Negociação", "Fechamento"];
    return Object.fromEntries(stages.map((stage) => [
      stage,
      records.filter((record) => getPipelineStage(record) === stage).length
    ]));
  }

  function getDashboardPipelineCounts(records = [...companies, ...prospects]) {
    const counts = { Novos: 0, Contato: 0, Qualificado: 0, Proposta: 0, Negociação: 0, Fechado: 0 };

    records.forEach((record) => {
      const status = normalizeStatusValue(record?.status || "Não contatada");
      const stage = getPipelineStage(record);
      let dashboardStage = "Novos";

      if (SALE_STATUSES.has(status) || stage === "Fechamento") dashboardStage = "Fechado";
      else if (stage === "Negociação") dashboardStage = "Negociação";
      else if (stage === "Proposta") dashboardStage = "Proposta";
      else if (["Respondeu", "Interesse demonstrado"].includes(status)) dashboardStage = "Qualificado";
      else if (stage === "Contato") dashboardStage = "Contato";

      counts[dashboardStage] += 1;
    });

    return counts;
  }

  function calculateProductivity(activities = getActivitiesFromStorage()) {
    const completedActivityCount = activities.filter((activity) => [
      "company_created",
      "company_updated",
      "prospect_created",
      "prospect_updated",
      "contact_realized",
      "followup_created",
      "followup_completed",
      "proposal_created",
      "sale_created",
      "sale_updated",
      "stage_changed",
      "task_completed"
    ].includes(activity.type)).length;

    if (!completedActivityCount) {
      return { value: null, label: "Sem dados", completed: 0, planned: 0 };
    }

    return {
      value: null,
      label: "Sem dados",
      completed: completedActivityCount,
      planned: 0
    };
  }

  function getFollowUpRecords() {
    return [...companies, ...prospects]
      .filter((record) => normalizeText(record?.proximoFollowUp || ""))
      .map((record) => ({
        record,
        dueDate: new Date(`${toDateIso(record.proximoFollowUp)}T00:00:00`)
      }))
      .filter(({ dueDate }) => !Number.isNaN(dueDate.getTime()))
      .sort((left, right) => left.dueDate - right.dueDate);
  }

  function getFollowUpBuckets(followUps = getFollowUpRecords()) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buckets = {
      today: 0,
      overdue: 0,
      future: 0,
      total: 0
    };

    followUps.forEach(({ dueDate }) => {
      buckets.total += 1;
      const normalizedDate = new Date(dueDate);
      normalizedDate.setHours(0, 0, 0, 0);

      if (normalizedDate.getTime() < today.getTime()) {
        buckets.overdue += 1;
      } else if (normalizedDate.getTime() > today.getTime()) {
        buckets.future += 1;
      } else {
        buckets.today += 1;
      }
    });

    return buckets;
  }

  function renderDashboardFollowUps(followUps, buckets) {
    const totalCount = document.getElementById("followupTotalCount");
    const ringCount = document.getElementById("followupRingCount");
    const todayCount = document.getElementById("followupTodayCount");
    const overdueCount = document.getElementById("followupOverdueCount");
    const futureCount = document.getElementById("followupFutureCount");
    const followupRing = document.querySelector(".followup-ring");
    const dashboardList = document.getElementById("dashboardUpcomingFollowups");
    const followupsList = document.getElementById("followupsList");

    if (totalCount) totalCount.textContent = String(buckets.total);
    if (ringCount) ringCount.textContent = String(buckets.total);
    if (todayCount) todayCount.textContent = String(buckets.today);
    if (overdueCount) overdueCount.textContent = String(buckets.overdue);
    if (futureCount) futureCount.textContent = String(buckets.future);
    if (followupRing) {
      const progress = buckets.total ? Math.round((buckets.today / buckets.total) * 100) : 0;
      followupRing.style.setProperty("--followup-progress", `${progress}%`);
    }

    const recordsToRender = followUps.slice(0, 6);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dashboardListMarkup = recordsToRender.map(({ record, dueDate }) => {
      const date = new Date(dueDate);
      date.setHours(0, 0, 0, 0);
      const state = date < today ? "Atrasado" : date.getTime() === today.getTime() ? "Hoje" : "Agendado";
      const name = record.nomeEmpresa || record.empresaNome || "Empresa sem nome";
      const description = record.observacoes || record.interesse || "Follow-up";
      const formattedDate = dueDate.toLocaleDateString("pt-BR");
      return `<li><div class="time-block">${formattedDate}</div><div class="task-meta"><strong>${name}</strong><span>${description}</span></div><span class="priority-tag">${state}</span></li>`;
    }).join("");
    const followupsPageMarkup = recordsToRender.map(({ record, dueDate }) => {
      const date = new Date(dueDate);
      date.setHours(0, 0, 0, 0);
      const state = date < today ? "Atrasado" : date.getTime() === today.getTime() ? "Hoje" : "Agendado";
      const name = record.nomeEmpresa || record.empresaNome || "Empresa sem nome";
      const description = record.observacoes || record.interesse || "Follow-up";
      return `<li><strong>${dueDate.toLocaleDateString("pt-BR")} · ${name}</strong><small>${description} · ${state}</small></li>`;
    }).join("");

    const emptyMarkup = '<li class="empty-followup-state">Nenhum follow-up cadastrado.</li>';
    if (dashboardList) dashboardList.innerHTML = dashboardListMarkup || emptyMarkup;
    if (followupsList) followupsList.innerHTML = followupsPageMarkup || emptyMarkup;
  }

  function renderRecentActivities(activities = getActivitiesFromStorage()) {
    const container = document.querySelector(".activity-list");
    const badge = document.getElementById("recentActivityCount");
    if (!container) return;

    const realActivityTypes = new Set([
      "company_created",
      "company_updated",
      "company_deleted",
      "prospect_created",
      "prospect_updated",
      "prospect_deleted",
      "contact_realized",
      "followup_created",
      "followup_completed",
      "proposal_created",
      "sale_created",
      "sale_updated",
      "stage_changed",
      "task_completed"
    ]);
    activities = activities.filter((activity) => realActivityTypes.has(activity.type)).slice(0, 10);
    if (!activities.length) {
      container.innerHTML = `
        <li>
          <span class="dot teal"></span>
          <div>
            <strong>Nenhuma atividade recente</strong>
            <small>As atividades registradas aparecerão aqui.</small>
          </div>
        </li>
      `;
      if (badge) badge.textContent = "0";
      return;
    }

    container.innerHTML = activities.map((activity) => {
      const time = new Date(activity.timestamp).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return `
        <li>
          <span class="dot teal"></span>
          <div>
            <strong>${activity.description}</strong>
            <small>${time}</small>
          </div>
        </li>
      `;
    }).join("");

    if (badge) badge.textContent = String(activities.length);
  }

  function updateDashboardCounters() {
    if (!dashboardStats.totalCompanies) return;

    const { companies: liveCompanies, prospects: liveProspects, activities } = getCRMData();
    const liveRecords = [...liveCompanies, ...liveProspects];
    const totalCompanies = liveCompanies.length;
    const newRecords = liveRecords.length;
    const contacts = getRecordedContactCount(liveRecords, activities);
    const salesRecords = getSalesRecords(liveRecords);
    const conversion = calculateConversionRate(salesRecords);
    const productivity = calculateProductivity(activities);
    const followUps = getFollowUpRecords();
    const followUpBuckets = getFollowUpBuckets(followUps);
    const followUpTotal = followUpBuckets.total;

    dashboardStats.totalCompanies.textContent = totalCompanies;
    dashboardStats.newRecords.textContent = newRecords;
    dashboardStats.contacts.textContent = contacts;
    dashboardStats.opportunities.textContent = salesRecords.length;
    dashboardStats.conversion.textContent = conversion.value === null ? "Sem dados" : `${conversion.value}%`;
    dashboardStats.productivity.textContent = productivity.value === null ? "Sem dados" : `${productivity.value}%`;

    const pipelineCounts = getPipelineCounts(liveRecords);
    const pipelineStageElements = [...document.querySelectorAll("[data-pipeline-stage]")];
    const highestStageCount = Math.max(0, ...Object.values(pipelineCounts));
    pipelineStageElements.forEach((element) => {
      element.textContent = String(pipelineCounts[element.dataset.pipelineStage] || 0);
      const isCurrentStage = highestStageCount > 0 && pipelineCounts[element.dataset.pipelineStage] === highestStageCount;
      element.closest(".pipeline-stage, .step")?.classList.toggle("active", isCurrentStage);
    });
    const dashboardPipelineCounts = getDashboardPipelineCounts(liveRecords);
    const highestDashboardStageCount = Math.max(0, ...Object.values(dashboardPipelineCounts));
    document.querySelectorAll("[data-pipeline-display-stage]").forEach((element) => {
      const count = dashboardPipelineCounts[element.dataset.pipelineDisplayStage] || 0;
      element.textContent = String(count);
      element.closest(".pipeline-stage")?.classList.toggle("active", highestDashboardStageCount > 0 && count === highestDashboardStageCount);
    });
    renderDashboardFollowUps(followUps, followUpBuckets);
    renderRecentActivities(activities);
  }

  function triggerDashboardRefresh(reason = "crm-data-updated") {
    const activeSection = document.querySelector(".page-section.active")?.id;
    const companyChanged = reason.startsWith("company") || reason === "companies-imported";

    updateDashboardCounters();
    if (activeSection === "dashboard") {
      if (companyChanged) renderPriorityDashboard();
      return;
    }

    if (activeSection === "empresas" && companyChanged) {
      renderTable();
      return;
    }
  }

  function updateCompanyImportIndicators(foundCount = currentCompanyFoundCount) {
    currentCompanyFoundCount = foundCount;
    const foundCountElement = document.getElementById("empresasEncontradasCount");
    const importedCountElement = document.getElementById("empresasImportadasCount");

    if (foundCountElement) {
      foundCountElement.textContent = String(currentCompanyFoundCount);
    }

    if (importedCountElement) {
      const importedCount = companies.filter((company) =>
        String(company.historico || "").includes(IMPORTED_COMPANY_HISTORY_MARKER)
      ).length;
      importedCountElement.textContent = String(importedCount);
    }
  }

  function getFilteredCompanies() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const statusTerm = statusFiltro.value;
    const segmentoTerm = segmentoFiltro.value;
    const estadoTerm = estadoFiltro.value;

    return companies.filter((company) => {
      const haystack = [
        company.nomeEmpresa,
        company.nomeFantasia,
        company.cnpj,
        company.telefone,
        company.cidade,
        company.estado
      ].join(" ").toLowerCase();

      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesStatus = !statusTerm || company.status === statusTerm;
      const matchesSegmento = !segmentoTerm || company.segmento === segmentoTerm;
      const matchesEstado = !estadoTerm || company.estado === estadoTerm;

      return matchesSearch && matchesStatus && matchesSegmento && matchesEstado;
    });
  }

  function getVisibleCompanyIds() {
    return Array.from(empresaTableBody.querySelectorAll("tr[data-id]"), (row) => row.dataset.id);
  }

  function updateBulkSelectionState() {
    const visibleIds = getVisibleCompanyIds();
    const selectedCount = selectedCompanyIds.size;

    empresaTableBody.querySelectorAll(".company-row-checkbox").forEach((checkbox) => {
      const isSelected = selectedCompanyIds.has(checkbox.dataset.companyId);
      if (checkbox.checked !== isSelected) checkbox.checked = isSelected;
    });

    if (bulkCompanyActions) {
      bulkCompanyActions.classList.toggle("hidden", selectedCount === 0);
    }

    if (bulkSelectionCount) {
      const label = selectedCount === 1 ? "selecionada" : "selecionadas";
      bulkSelectionCount.textContent = `${selectedCount} ${label}`;
    }

    if (selectAllCompaniesCheckbox) {
      if (!visibleIds.length) {
        selectAllCompaniesCheckbox.checked = false;
        selectAllCompaniesCheckbox.indeterminate = false;
        return;
      }

      let selectedVisibleCount = 0;
      visibleIds.forEach((id) => {
        if (selectedCompanyIds.has(id)) selectedVisibleCount += 1;
      });
      selectAllCompaniesCheckbox.checked = selectedVisibleCount === visibleIds.length;
      selectAllCompaniesCheckbox.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;
    }
  }

  function renderPriorityDashboard() {
    const container = document.getElementById("dashboardPriorityList");
    const countBadge = document.getElementById("priorityCompanyCount");
    if (!container || !countBadge) return;

    const priorityCompanies = companies.filter((company) => isCompanyPriority(company));
    countBadge.textContent = String(priorityCompanies.length);

    if (!priorityCompanies.length) {
      container.innerHTML = '<p class="empty-priority-state">Nenhuma empresa prioritária no momento.</p>';
      return;
    }

    container.innerHTML = "";

    priorityCompanies.forEach((company) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "priority-item";
      item.setAttribute("data-company-id", company.id);
      item.innerHTML = `
        <span class="priority-item-name">⭐ ${company.nomeEmpresa}</span>
        <span class="priority-item-meta">${company.status || "Sem status"}</span>
      `;
      item.addEventListener("click", () => {
        const empresasButton = document.querySelector('.menu-item[data-target="empresas"]');
        if (empresasButton) {
          empresasButton.click();
        }
        openModal("edit", company);
      });
      container.appendChild(item);
    });
  }

  function renderTable() {
    const filteredCompanies = sortByEmpresaName(getFilteredCompanies());
    updateCompanyImportIndicators(filteredCompanies.length);
    empresaTableBody.innerHTML = "";

    if (!filteredCompanies.length) {
      empresaTableBody.innerHTML = '<tr><td colspan="7" class="empty-table-state">Nenhuma empresa encontrada.</td></tr>';
      empresaCount.textContent = companies.length;
      updateBulkSelectionState();
      return;
    }

    empresaCount.textContent = companies.length;

    const rowsFragment = document.createDocumentFragment();
    filteredCompanies.forEach((company) => {
      const row = document.createElement("tr");
      row.dataset.id = company.id;
      row.classList.toggle("selected", selectedCompanyId === company.id);

      row.innerHTML = `
        <td class="checkbox-cell">
          <input type="checkbox" class="company-row-checkbox" data-company-id="${company.id}" ${selectedCompanyIds.has(company.id) ? "checked" : ""} aria-label="Selecionar empresa ${company.nomeEmpresa}" />
        </td>
        <td>
          <div class="company-name">
            <div class="company-title-row">
              <strong>${company.nomeEmpresa}</strong>
              ${company.prioridade ? '<span class="priority-star" aria-label="Empresa prioritária">⭐</span>' : ""}
            </div>
            <span>${company.nomeFantasia || "Sem nome fantasia"}</span>
          </div>
        </td>
        <td>${company.segmento}</td>
        <td>${company.cidade || "-"} / ${company.estado || "-"}</td>
        <td><span class="status-pill" data-status="${company.status}">${company.status}</span></td>
        <td>${company.responsavel || "-"}</td>
        <td>
          <div class="action-buttons">
            <button type="button" class="action-btn editar" data-action="edit" data-id="${company.id}">Editar</button>
            <button type="button" class="action-btn delete" data-action="delete" data-id="${company.id}">Excluir</button>
          </div>
        </td>
      `;

      rowsFragment.appendChild(row);
    });
    empresaTableBody.appendChild(rowsFragment);

    const selectedVisible = filteredCompanies.some((company) => company.id === selectedCompanyId);
    if (!selectedVisible && filteredCompanies[0]) {
      selectedCompanyId = filteredCompanies[0].id;
    }

    if (!selectedCompanyId && filteredCompanies[0]) {
      selectedCompanyId = filteredCompanies[0].id;
    }

    const selectedRow = Array.from(empresaTableBody.querySelectorAll("tr[data-id]"))
      .find((row) => row.dataset.id === selectedCompanyId);
    selectedRow?.classList.add("selected");

    updateBulkSelectionState();
    renderDetails();
  }

  function renderDetails() {
    const company = companies.find((item) => item.id === selectedCompanyId);

    if (!company) {
      empresaDetails.innerHTML = `
        <div class="details-empty">
          <strong>Selecione uma empresa</strong>
          <p>Veja os dados completos, histórico de contatos e detalhes do relacionamento.</p>
        </div>
      `;
      return;
    }

    empresaDetails.innerHTML = `
      <div class="company-detail-card">
        <div class="detail-header">
          <div class="company-title-row">
            <h3>${company.nomeEmpresa}</h3>
            ${company.prioridade ? '<span class="priority-star" aria-label="Empresa prioritária">⭐</span>' : ""}
          </div>
          <span class="status-pill" data-status="${company.status}">${company.status}</span>
        </div>

        <div class="detail-grid">
          <div class="detail-item"><span>Nome fantasia</span><strong>${company.nomeFantasia || "-"}</strong></div>
          <div class="detail-item"><span>CNPJ</span><strong>${company.cnpj || "-"}</strong></div>
          <div class="detail-item"><span>Segmento</span><strong>${company.segmento || "-"}</strong></div>
          <div class="detail-item"><span>Local</span><strong>${company.cidade || "-"} / ${company.estado || "-"}</strong></div>
          <div class="detail-item"><span>Telefone</span><strong>${company.telefone || "-"}</strong></div>
          <div class="detail-item"><span>WhatsApp</span><strong>${company.whatsapp || "-"}</strong></div>
          <div class="detail-item"><span>E-mail</span><strong>${company.email || "-"}</strong></div>
          <div class="detail-item"><span>Instagram</span><strong>${company.instagram || "-"}</strong></div>
          <div class="detail-item"><span>Site</span><strong>${company.site || "-"}</strong></div>
          <div class="detail-item"><span>Responsável</span><strong>${company.responsavel || "-"}</strong></div>
          <div class="detail-item"><span>Primeiro contato</span><strong>${company.primeiroContato || "-"}</strong></div>
          <div class="detail-item"><span>Último contato</span><strong>${company.ultimoContato || "-"}</strong></div>
          <div class="detail-item"><span>Próximo follow-up</span><strong>${company.proximoFollowUp || "-"}</strong></div>
          <div class="detail-item"><span>Canal</span><strong>${company.canalUtilizado || "-"}</strong></div>
          <div class="detail-item"><span>Prospeção</span><strong>${company.responsavelProspeccao || "-"}</strong></div>
          <div class="detail-item"><span>Origem</span><strong>${company.origemEmpresa || "-"}</strong></div>
          <div class="detail-item"><span>Interesse</span><strong>${company.interesse || "-"}</strong></div>
          <div class="detail-item"><span>Serviço</span><strong>${company.servicoInteresse || "-"}</strong></div>
          <div class="detail-item"><span>Valor estimado</span><strong>${company.valorEstimado || "-"}</strong></div>
          <div class="detail-item"><span>Valor da proposta</span><strong>${company.valorProposta || "-"}</strong></div>
          <div class="detail-item"><span>Etapa do pipeline</span><strong>${company.etapaPipeline || "-"}</strong></div>
        </div>

        <div class="detail-notes">
          <h4>Observações</h4>
          <p>${company.observacoes || "Nenhuma observação registrada."}</p>
        </div>

        <div class="detail-notes">
          <h4>Histórico dos contatos</h4>
          <p>${company.historico || "Sem histórico registrado."}</p>
        </div>
      </div>
    `;
  }

  function selectCompany(id) {
    selectedCompanyId = id;
    empresaTableBody.querySelector("tr.selected")?.classList.remove("selected");
    const selectedRow = Array.from(empresaTableBody.querySelectorAll("tr[data-id]"))
      .find((row) => row.dataset.id === id);
    selectedRow?.classList.add("selected");
    renderDetails();
  }

  function openModal(mode = "create", company = null) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    empresaForm.reset();

    const fieldMap = {
      nomeEmpresa: "empresaNome",
      nomeFantasia: "empresaFantasia",
      cnpj: "empresaCnpj",
      segmento: "empresaSegmento",
      cidade: "empresaCidade",
      estado: "empresaEstado",
      telefone: "empresaTelefone",
      whatsapp: "empresaWhatsapp",
      email: "empresaEmail",
      instagram: "empresaInstagram",
      site: "empresaSite",
      responsavel: "empresaResponsavel",
      status: "empresaStatus",
      prioridade: "empresaPrioridade",
      primeiroContato: "empresaPrimeiroContato",
      ultimoContato: "empresaUltimoContato",
      proximoFollowUp: "empresaProximoFollow",
      canalUtilizado: "empresaCanal",
      responsavelProspeccao: "empresaResponsavelProspecao",
      origemEmpresa: "empresaOrigem",
      interesse: "empresaInteresse",
      servicoInteresse: "empresaServico",
      valorEstimado: "empresaValorEstimado",
      valorProposta: "empresaValorProposta",
      etapaPipeline: "empresaEtapa",
      observacoes: "empresaObservacoes",
      historico: "empresaHistorico"
    };

    if (mode === "edit" && company) {
      modalTitle.textContent = "Editar empresa";
      empresaForm.dataset.mode = "edit";
      empresaForm.dataset.id = company.id;
      Object.entries(company).forEach(([key, value]) => {
        const fieldId = fieldMap[key];
        const field = fieldId ? document.getElementById(fieldId) : null;
        if (!field) return;

        if (key === "prioridade") {
          field.value = isCompanyPriority(company) ? "ativada" : "desativada";
          return;
        }

        if (["status", "segmento", "estado", "etapaPipeline"].includes(key)) {
          field.value = value || field.options[0].value;
        } else {
          field.value = value || "";
        }
      });
    } else {
      modalTitle.textContent = "Empresa";
      empresaForm.dataset.mode = "create";
      empresaForm.dataset.id = "";
      document.getElementById("empresaStatus").value = statusOptions[0];
      document.getElementById("empresaSegmento").value = "Agência";
      document.getElementById("empresaEstado").value = "SP";
      document.getElementById("empresaEtapa").value = "Descoberta";
      document.getElementById("empresaPrioridade").value = "desativada";
    }
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    empresaForm.reset();
    empresaForm.dataset.mode = "create";
    empresaForm.dataset.id = "";
  }

  function openImportModal() {
    if (!importModal) return;
    importModal.classList.remove("hidden");
    importModal.setAttribute("aria-hidden", "false");
  }

  function closeImportModal() {
    if (!importModal) return;
    importModal.classList.add("hidden");
    importModal.setAttribute("aria-hidden", "true");
    if (importFileInput) importFileInput.value = "";
    if (confirmImportButton) confirmImportButton.disabled = true;
    renderImportPreview([]);
    setImportFeedback("");
  }

  function closeImportConfirmationModal() {
    if (!importConfirmModal) return;
    importConfirmModal.classList.add("hidden");
    importConfirmModal.setAttribute("aria-hidden", "true");
    if (confirmImportButton) {
      confirmImportButton.dataset.pendingRows = "";
    }
  }

  function closeImportSuccessModal() {
    if (!importSuccessModal) return;
    importSuccessModal.classList.add("hidden");
    importSuccessModal.setAttribute("aria-hidden", "true");
    if (confettiLayer) {
      confettiLayer.innerHTML = "";
    }
  }

  function setImportFeedback(message = "") {
    if (!importFeedback) return;
    if (!message) {
      importFeedback.textContent = "";
      importFeedback.classList.add("hidden");
      return;
    }
    importFeedback.textContent = message;
    importFeedback.classList.remove("hidden");
  }

  function openImportConfirmationModal() {
    const pendingRows = confirmImportButton?.dataset.pendingRows ? JSON.parse(confirmImportButton.dataset.pendingRows) : [];
    const summary = evaluateImportedRows(pendingRows);

    if (!pendingRows.length || !summary.added.length && !summary.ignored.length) {
      setImportFeedback("Nenhuma empresa para importar.");
      return;
    }

    if (importModal) {
      importModal.classList.add("hidden");
      importModal.setAttribute("aria-hidden", "true");
    }

    if (!importConfirmModal) return;
    const importCount = summary.added.length;
    importConfirmationCount.textContent = `Serão importadas ${importCount} empresa(s).`;
    importConfirmModal.classList.remove("hidden");
    importConfirmModal.setAttribute("aria-hidden", "false");
  }

  function launchConfetti() {
    if (!confettiLayer || document.documentElement.classList.contains("performance-diagnostics")) return;

    confettiLayer.innerHTML = "";

    const colors = ["#3ed8cf", "#7de7df", "#d4f9f7", "#f0c36a", "#ffffff"];
    const pieces = 42;

    for (let index = 0; index < pieces; index += 1) {
      const piece = document.createElement("span");
      const size = (Math.random() * 10 + 6).toFixed(2);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = (Math.random() * 2.4 + 2.2).toFixed(2);
      const drift = `${(Math.random() * 220 - 110).toFixed(2)}px`;
      const rotation = `${(Math.random() * 360).toFixed(2)}deg`;

      piece.className = "confetti-piece";
      piece.style.setProperty("--size", `${size}px`);
      piece.style.setProperty("--confetti-color", color);
      piece.style.setProperty("--duration", `${duration}s`);
      piece.style.setProperty("--drift", drift);
      piece.style.setProperty("--rotation", rotation);
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${(Math.random() * 0.4).toFixed(2)}s`;
      confettiLayer.appendChild(piece);
    }

    window.setTimeout(() => {
      if (confettiLayer) {
        confettiLayer.innerHTML = "";
      }
    }, 4300);
  }

  function normalizeImportValue(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function buildImportDuplicateKey(company) {
    const candidates = [
      company.nomeEmpresa,
      company.nomeFantasia,
      company.telefone,
      company.whatsapp,
      company.site,
      company.instagram,
      company.cidade,
      company.estado
    ].filter(Boolean).map((value) => normalizeImportValue(value));

    return candidates.join("|");
  }

  function parseCsvLine(line) {
    const fields = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        fields.push(current);
        current = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        continue;
      } else {
        current += char;
      }
    }

    fields.push(current);
    return fields.map((item) => item.trim());
  }

  function parseCsvText(text) {
    const rows = [];
    const lines = text.replace(/\r\n/g, "\n").split("\n");

    lines.forEach((line) => {
      if (line.trim()) {
        rows.push(parseCsvLine(line));
      }
    });

    return rows.filter((row) => row.some((cell) => String(cell).trim() !== ""));
  }

  function getImportHeaders(rows) {
    const normalizedHeaders = Array.isArray(rows[0]) ? rows[0].map((header) => normalizeImportValue(header)) : [];
    return normalizedHeaders;
  }

  function normalizeImportedContactField(value) {
    const normalized = normalizeText(value || "");
    if (!normalized) return "";
    return normalized.replace(/\s+/g, " ").trim();
  }

  function pickImportedContactValue(row, contactFields) {
    const values = contactFields
      .map((field) => normalizeImportedContactField(row[field]))
      .filter(Boolean);

    return values[0] || "";
  }

  function mapImportedRow(row, headers) {
    const mapping = {
      nomeEmpresa: ["empresa", "nome da empresa", "razao social", "razão social", "nome"],
      nomeFantasia: ["nome fantasia", "nome_fantasia", "fantasia", "nome fantasia comercial"],
      segmento: ["segmento", "categoria", "ramo", "atividade"],
      cidade: ["cidade", "municipio", "município"],
      estado: ["estado", "uf", "sigla estado"],
      telefone1: ["telefone 1", "telefone1", "tel 1", "tel1", "telefone", "tel", "fone"],
      telefone2: ["telefone 2", "telefone2", "tel 2", "tel2"],
      whatsapp1: ["whatsapp 1", "whatsapp1", "celular 1", "celular1", "whatsapp", "celular", "telefone celular"],
      whatsapp2: ["whatsapp 2", "whatsapp2", "celular 2", "celular2"],
      instagram: ["instagram", "perfil instagram", "@instagram"],
      site: ["site", "website", "url", "link"],
      email: ["e-mail", "email", "e mail"],
      endereco: ["endereco", "endereço", "logradouro", "rua", "endereco comercial"],
      origemEmpresa: ["origem", "origem empresa", "como conheceu", "fonte"],
      observacoes: ["observacoes", "observações", "observacao", "comentarios", "comentários", "notas"]
    };

    const normalizedRow = {};
    headers.forEach((header, index) => {
      const value = row[index] ?? "";
      const headerKey = Object.keys(mapping).find((fieldKey) =>
        mapping[fieldKey].some((alias) => normalizeImportValue(alias) === header)
      );

      if (headerKey) {
        normalizedRow[headerKey] = value;
      }
    });

    const whatsapp = pickImportedContactValue(normalizedRow, ["whatsapp1", "whatsapp2"]) || pickImportedContactValue(normalizedRow, ["whatsapp"]);
    const telefone = pickImportedContactValue(normalizedRow, ["telefone1", "telefone2"]) || pickImportedContactValue(normalizedRow, ["telefone"]);

    if (whatsapp) {
      normalizedRow.whatsapp = whatsapp;
    }
    if (telefone) {
      normalizedRow.telefone = telefone;
    }

    return normalizedRow;
  }

  function renderImportPreview(rows) {
    if (!importPreviewContainer) return;

    if (!rows.length) {
      importPreviewContainer.classList.add("empty");
      importPreviewContainer.innerHTML = "<p>Nenhuma empresa carregada ainda.</p>";
      return;
    }

    importPreviewContainer.classList.remove("empty");
    const previewRows = rows.slice(0, 8);
    const headers = ["Empresa", "Nome fantasia", "Segmento", "Cidade", "Estado", "Telefone", "WhatsApp", "Instagram", "Site", "Endereço", "Origem", "Observações"];
    const table = document.createElement("table");
    table.className = "import-preview-table";
    table.innerHTML = `
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${previewRows.map((row) => `
          <tr>
            ${headers.map((header) => `<td>${row[header] || "-"}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    `;

    importPreviewContainer.innerHTML = "";
    importPreviewContainer.appendChild(table);
  }

  function parseImportedFile(file) {
    return new Promise((resolve, reject) => {
      const fileName = (file && file.name) ? file.name.toLowerCase() : "";
      const reader = new FileReader();

      const processRows = (rows) => {
        if (!rows || !rows.length) {
          resolve([]);
          return;
        }

        const headers = getImportHeaders(rows);
        const mappedRows = rows.slice(1).map((row) => mapImportedRow(row, headers)).filter((row) => Object.values(row).some((value) => String(value ?? "").trim() !== ""));
        resolve(mappedRows);
      };

      const onError = () => reject(new Error("Não foi possível ler o arquivo selecionado."));

      reader.onerror = onError;

      if (fileName.endsWith(".csv")) {
        reader.onload = (event) => {
          try {
            const text = String(event.target.result || "");
            processRows(parseCsvText(text));
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
        return;
      }

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array", cellDates: true });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false, defval: "" });
            processRows(rows);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
        return;
      }

      reject(new Error("Formato de arquivo não suportado."));
    });
  }

  function evaluateImportedRows(rows) {
    const added = [];
    const ignored = [];

    rows.forEach((row) => {
      const whatsappPriority = [row.whatsapp1, row.whatsapp2, row.whatsapp, row["WhatsApp 1"], row["WhatsApp 2"], row["WhatsApp"]].map(normalizeImportedContactField).filter(Boolean);
      const telefonePriority = [row.telefone1, row.telefone2, row.telefone, row["Telefone 1"], row["Telefone 2"], row["Telefone"]].map(normalizeImportedContactField).filter(Boolean);

      const normalizedRow = normalizeCompanyRecord({
        nomeEmpresa: row.nomeEmpresa || row.nomeFantasia || "",
        nomeFantasia: row.nomeFantasia || row.nomeEmpresa || "",
        segmento: row.segmento || row.Segmento || "",
        cidade: row.cidade || row.Cidade || "",
        estado: row.estado || row.Estado || "",
        telefone: telefonePriority[0] || row.telefone || row.Telefone || "",
        whatsapp: whatsappPriority[0] || row.whatsapp || row.WhatsApp || "",
        email: row.email || row["E-mail"] || row["E-mail"] || "",
        instagram: row.instagram || row.Instagram || "",
        site: row.site || row.Site || "",
        endereco: row.endereco || row.Endereco || row["Endereço"] || "",
        origemEmpresa: row.origemEmpresa || row.Origem || "Importação",
        observacoes: row.observacoes || row.Observacoes || row["Observações"] || "",
        status: "Não contatada",
        etapaPipeline: "Descoberta"
      });

      const company = {
        id: crypto.randomUUID ? crypto.randomUUID() : `empresa-import-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        nomeEmpresa: normalizedRow.nomeEmpresa || "Empresa sem nome",
        nomeFantasia: normalizedRow.nomeFantasia || normalizedRow.nomeEmpresa || "",
        segmento: normalizedRow.segmento || "",
        cidade: normalizedRow.cidade || "",
        estado: normalizedRow.estado || "",
        telefone: normalizedRow.telefone || "",
        whatsapp: normalizedRow.whatsapp || "",
        instagram: normalizedRow.instagram || "",
        site: normalizedRow.site || "",
        email: normalizedRow.email || "",
        endereco: normalizedRow.endereco || "",
        origemEmpresa: normalizedRow.origemEmpresa || "Importação",
        observacoes: normalizedRow.observacoes || "",
        status: "Não contatada",
        primeiroContato: "",
        ultimoContato: "",
        proximoFollowUp: "",
        responsavel: "",
        canalUtilizado: "",
        responsavelProspeccao: "",
        interesse: "",
        servicoInteresse: "",
        valorEstimado: "",
        valorProposta: "",
        etapaPipeline: "Descoberta",
        historico: "Empresa importada via CSV/Excel.",
        cnpj: "",
        dataAdicionada: new Date().toISOString().slice(0, 10)
      };

      const candidateKey = buildImportDuplicateKey(company);
      const alreadyExists = companies.some((existingCompany) => {
        const existingKey = buildImportDuplicateKey(existingCompany);
        if (!existingKey || !candidateKey) return false;
        return existingKey === candidateKey || (
          normalizeImportValue(existingCompany.nomeEmpresa) === normalizeImportValue(company.nomeEmpresa) &&
          normalizeImportValue(existingCompany.cidade) === normalizeImportValue(company.cidade) &&
          normalizeImportValue(existingCompany.estado) === normalizeImportValue(company.estado)
        );
      });

      if (!alreadyExists) {
        added.push(company);
      } else {
        ignored.push(company);
      }
    });

    return { added, ignored };
  }

  function addImportedCompanies(rows) {
    const { added, ignored } = evaluateImportedRows(rows);

    added.forEach((company) => {
      companies.unshift(company);
    });

    saveCompanies();

    return { added, ignored };
  }

  async function handleImportSelection(event) {
    const [file] = event.target.files || [];
    if (!file) {
      renderImportPreview([]);
      updateCompanyImportIndicators(0);
      if (confirmImportButton) confirmImportButton.disabled = true;
      return;
    }

    try {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        await loadLocalScript("xlsx.full.min.js");
      }
      const rows = await parseImportedFile(file);
      const mappedRows = rows.map((row) => ({
        Empresa: row.nomeEmpresa || "",
        "Nome fantasia": row.nomeFantasia || "",
        Segmento: row.segmento || "",
        Cidade: row.cidade || "",
        Estado: row.estado || "",
        "Telefone 1": row.telefone1 || row.telefone || "",
        "Telefone 2": row.telefone2 || "",
        "WhatsApp 1": row.whatsapp1 || row.whatsapp || "",
        "WhatsApp 2": row.whatsapp2 || "",
        Instagram: row.instagram || "",
        Site: row.site || "",
        "E-mail": row.email || "",
        Endereço: row.endereco || "",
        Origem: row.origemEmpresa || "",
        Observações: row.observacoes || ""
      }));

      renderImportPreview(mappedRows);
        updateCompanyImportIndicators(mappedRows.length);
      if (confirmImportButton) {
        confirmImportButton.disabled = mappedRows.length === 0;
      }
      confirmImportButton.dataset.pendingRows = JSON.stringify(rows);
      const summary = evaluateImportedRows(rows);
      if (!rows.length || (!summary.added.length && !summary.ignored.length)) {
        setImportFeedback("Nenhuma empresa para importar.");
        return;
      }
      openImportConfirmationModal();
    } catch (error) {
      renderImportPreview([]);
      updateCompanyImportIndicators(0);
      if (confirmImportButton) confirmImportButton.disabled = true;
      setImportFeedback(error.message || "Não foi possível importar o arquivo.");
    }
  }

  function confirmImport() {
    const pendingRows = confirmImportButton?.dataset.pendingRows ? JSON.parse(confirmImportButton.dataset.pendingRows) : [];
    if (!pendingRows.length) {
      setImportFeedback("Nenhuma empresa para importar.");
      closeImportConfirmationModal();
      return;
    }

    const { added, ignored } = addImportedCompanies(pendingRows);
    if (!added.length && !ignored.length) {
      setImportFeedback("Nenhuma empresa para importar.");
      closeImportConfirmationModal();
      return;
    }

    added.forEach((company) => {
      addActivity({
        type: "company_created",
        description: `Empresa cadastrada: ${company.nomeEmpresa || "Empresa sem nome"}`,
        entityType: "company",
        entityId: company.id
      });
    });

    notifyCRMDataUpdated("companies-imported");

    if (importSuccessImportedText) {
      importSuccessImportedText.textContent = `${added.length} empresa(s) importada(s) com sucesso.`;
    }
    if (importSuccessIgnoredText) {
      importSuccessIgnoredText.textContent = `${ignored.length} ignorada(s) por duplicidade.`;
    }

    closeImportConfirmationModal();
    closeImportModal();

    if (importSuccessModal) {
      importSuccessModal.classList.remove("hidden");
      importSuccessModal.setAttribute("aria-hidden", "false");
      launchConfetti();
    }
  }

  function submitEmpresaForm(event) {
    event.preventDefault();
    const formData = new FormData(empresaForm);
    const payload = Object.fromEntries(formData.entries());

    const normalizedPayload = normalizeCompanyRecord(payload) || payload;
    normalizedPayload.id = empresaForm.dataset.id || (crypto.randomUUID ? crypto.randomUUID() : `empresa-${Date.now()}`);
    normalizedPayload.dataAdicionada = normalizedPayload.dataAdicionada || new Date().toISOString().slice(0, 10);
    normalizedPayload.status = normalizeStatusValue(normalizedPayload.status || "Não contatada");
    normalizedPayload.prioridade = isPriorityValue(normalizedPayload.prioridade ?? payload.prioridade ?? "desativada");

    const existingCompany = companies.find((company) => company.id === normalizedPayload.id) || null;
    const companyExists = Boolean(existingCompany);
    const previousStatus = existingCompany?.status || "Não contatada";
    const previousStage = existingCompany?.etapaPipeline || "Descoberta";
    const requestedStage = normalizedPayload.etapaPipeline || previousStage;
    const previousFollowUp = existingCompany?.proximoFollowUp || "";
    const nextStatus = normalizeStatusValue(normalizedPayload.status);
    const stageChangedByUser = companyExists && requestedStage !== previousStage;
    if (!stageChangedByUser) {
      if (SALE_STATUSES.has(nextStatus)) {
        normalizedPayload.etapaPipeline = "Fechamento";
      } else if (nextStatus === "Proposta enviada") {
        normalizedPayload.etapaPipeline = "Proposta";
      } else if (WORKED_LEAD_STATUSES.has(nextStatus)) {
        normalizedPayload.etapaPipeline = "Contato";
      }
    }
    const contactInteractionAdded = (
      hasNewContactInteraction(existingCompany, normalizedPayload) &&
      Boolean(normalizedPayload.ultimoContato || normalizedPayload.primeiroContato || normalizedPayload.canalUtilizado)
    ) || (
      !WORKED_LEAD_STATUSES.has(previousStatus) && WORKED_LEAD_STATUSES.has(nextStatus)
    );

    if (companyExists) {
      normalizedPayload.primeiroContato = normalizedPayload.primeiroContato || existingCompany.primeiroContato || "";
      normalizedPayload.historico = existingCompany.historico || "";
    }

    if (companyExists && isFollowUpOverdue(existingCompany) && !hasNewContactInteraction(existingCompany, normalizedPayload)) {
      normalizedPayload.ultimoContato = "";
      normalizedPayload.observacoes = "";
    }

    if (companyExists && hasNewContactInteraction(existingCompany, normalizedPayload)) {
      const historicalEntry = buildHistoricEntry(normalizedPayload);
      if (historicalEntry) {
        normalizedPayload.historico = appendHistoricEntry(existingCompany.historico || "", normalizedPayload);
      }
    } else if (!companyExists && hasMeaningfulContactData(normalizedPayload)) {
      const historicalEntry = buildHistoricEntry(normalizedPayload);
      if (historicalEntry) {
        normalizedPayload.historico = appendHistoricEntry(normalizedPayload.historico || "", normalizedPayload);
      }
    }

    if (!companyExists) {
      companies.push(normalizedPayload);
      companies = sortByEmpresaName(companies);
      selectedCompanyId = normalizedPayload.id;
      addActivity({
        type: "company_created",
        description: `Empresa cadastrada: ${normalizedPayload.nomeEmpresa || "Empresa sem nome"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    } else {
      companies = companies.map((company) => (company.id === normalizedPayload.id ? normalizedPayload : company));
      addActivity({
        type: "company_updated",
        description: `Empresa atualizada: ${normalizedPayload.nomeEmpresa || "Empresa sem nome"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    }

    if (contactInteractionAdded) {
      addActivity({
        type: "contact_realized",
        description: `Contato realizado com ${normalizedPayload.nomeEmpresa || "empresa"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    }

    if (normalizedPayload.proximoFollowUp && normalizedPayload.proximoFollowUp !== previousFollowUp) {
      addActivity({
        type: "followup_created",
        description: `Follow-up agendado para ${normalizedPayload.nomeEmpresa || "empresa"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    }

    if (!SALE_STATUSES.has(previousStatus) && SALE_STATUSES.has(normalizedPayload.status)) {
      addActivity({
        type: "sale_created",
        description: `Venda registrada para ${normalizedPayload.nomeEmpresa || "empresa"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    } else if (SALE_STATUSES.has(previousStatus) && normalizedPayload.status !== previousStatus) {
      addActivity({
        type: "sale_updated",
        description: `Venda atualizada para ${normalizedPayload.nomeEmpresa || "empresa"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    }

    if (companyExists && normalizedPayload.etapaPipeline !== previousStage) {
      addActivity({
        type: "stage_changed",
        description: `Etapa alterada para ${normalizedPayload.etapaPipeline} em ${normalizedPayload.nomeEmpresa || "empresa"}`,
        entityType: "company",
        entityId: normalizedPayload.id
      });
    }

    companies = sortByEmpresaName(companies);
    saveCompanies();
    notifyCRMDataUpdated("company-updated");
    closeModal();
  }

  function openDeleteCompanyModal(id) {
    const company = companies.find((item) => item.id === id);
    if (!company || !deleteCompanyModal) return;

    deleteCompanyModal.dataset.pendingId = id;
    const nameElement = document.getElementById("deleteEmpresaName");
    if (nameElement) {
      nameElement.textContent = company.nomeEmpresa || "Empresa sem nome";
    }
    deleteCompanyModal.classList.remove("hidden");
    deleteCompanyModal.setAttribute("aria-hidden", "false");
  }

  function closeDeleteCompanyModal() {
    if (!deleteCompanyModal) return;
    deleteCompanyModal.classList.add("hidden");
    deleteCompanyModal.setAttribute("aria-hidden", "true");
    deleteCompanyModal.removeAttribute("data-pending-id");
  }

  function closeBulkDeleteCompanyModal() {
    if (!bulkDeleteCompanyModal) return;
    bulkDeleteCompanyModal.classList.add("hidden");
    bulkDeleteCompanyModal.setAttribute("aria-hidden", "true");
  }

  function openBulkDeleteCompanyModal() {
    if (!bulkDeleteCompanyModal || !selectedCompanyIds.size) return;
    if (bulkDeleteCompanyCount) {
      bulkDeleteCompanyCount.textContent = `Você está prestes a excluir ${selectedCompanyIds.size} empresa(s).`;
    }
    bulkDeleteCompanyModal.classList.remove("hidden");
    bulkDeleteCompanyModal.setAttribute("aria-hidden", "false");
  }

  function confirmDeleteCompany() {
    const id = deleteCompanyModal?.dataset.pendingId;
    if (!id) return;

    const company = companies.find((item) => item.id === id);
    if (!company) {
      closeDeleteCompanyModal();
      return;
    }

    companies = companies.filter((item) => item.id !== id);
    prospects = prospects.filter((lead) => !(lead.empresaId === id || (lead.empresaNome === company.nomeEmpresa && lead.cnpj === company.cnpj)));
    addActivity({
      type: "company_deleted",
      description: `Empresa removida: ${company.nomeEmpresa || "Empresa sem nome"}`,
      entityType: "company",
      entityId: id
    });
    saveCompanies();
    saveProspects();

    if (selectedCompanyId === id) {
      selectedCompanyId = companies[0]?.id || null;
    }

    closeDeleteCompanyModal();
    notifyCRMDataUpdated("company-deleted");
  }

  function confirmBulkDeleteCompanies() {
    if (!selectedCompanyIds.size) {
      closeBulkDeleteCompanyModal();
      return;
    }

    const idsToDelete = Array.from(selectedCompanyIds);
    const companiesToDelete = companies.filter((company) => idsToDelete.includes(company.id));

    companies = companies.filter((company) => !idsToDelete.includes(company.id));
    prospects = prospects.filter((lead) => {
      const belongsToDeletedCompany = idsToDelete.includes(lead.empresaId);
      const relatedByNameAndCnpj = companiesToDelete.some((company) => {
        const sameName = company.nomeEmpresa && lead.empresaNome === company.nomeEmpresa;
        const sameCnpj = company.cnpj && lead.cnpj === company.cnpj;
        return sameName || sameCnpj;
      });
      return !(belongsToDeletedCompany || relatedByNameAndCnpj);
    });

    companiesToDelete.forEach((company) => {
      addActivity({
        type: "company_deleted",
        description: `Empresa removida: ${company.nomeEmpresa || "Empresa sem nome"}`,
        entityType: "company",
        entityId: company.id
      });
    });

    selectedCompanyIds.clear();
    saveCompanies();
    saveProspects();

    if (selectedCompanyId && idsToDelete.includes(selectedCompanyId)) {
      selectedCompanyId = companies[0]?.id || null;
    }

    closeBulkDeleteCompanyModal();
  triggerDashboardRefresh("company-deleted");
  }

  function deleteCompany(id) {
    openDeleteCompanyModal(id);
  }

  function handleRowActions(event) {
    const actionTarget = event.target.closest("button");
    if (!actionTarget) return;

    const { action, id } = actionTarget.dataset;
    const company = companies.find((item) => item.id === id);

    if (!company) return;

    if (action === "edit") {
      openModal("edit", company);
    }

    if (action === "delete") {
      deleteCompany(id);
    }
  }

  if (bulkDeleteButton) {
    bulkDeleteButton.addEventListener("click", openBulkDeleteCompanyModal);
  }

  if (confirmBulkDeleteCompaniesButton) {
    confirmBulkDeleteCompaniesButton.addEventListener("click", confirmBulkDeleteCompanies);
  }

  if (selectAllCompaniesCheckbox) {
    selectAllCompaniesCheckbox.addEventListener("change", () => {
      const visibleIds = getVisibleCompanyIds();
      if (selectAllCompaniesCheckbox.checked) {
        visibleIds.forEach((id) => selectedCompanyIds.add(id));
      } else {
        visibleIds.forEach((id) => selectedCompanyIds.delete(id));
      }
      updateBulkSelectionState();
    });
  }

  document.addEventListener("change", (event) => {
    const rowCheckbox = event.target.closest(".company-row-checkbox");
    if (!rowCheckbox) return;

    const companyId = rowCheckbox.dataset.companyId;
    if (!companyId) return;

    if (rowCheckbox.checked) {
      selectedCompanyIds.add(companyId);
    } else {
      selectedCompanyIds.delete(companyId);
    }

    updateBulkSelectionState();
  });

  if (btnImportarEmpresas) {
    btnImportarEmpresas.addEventListener("click", openImportModal);
  }

  if (importFileInput) {
    importFileInput.addEventListener("change", handleImportSelection);
  }

  if (confirmImportButton) {
    confirmImportButton.addEventListener("click", openImportConfirmationModal);
  }

  if (confirmImportActionButton) {
    confirmImportActionButton.addEventListener("click", confirmImport);
  }

  if (goToCompaniesButton) {
    goToCompaniesButton.addEventListener("click", () => {
      closeImportSuccessModal();
      document.querySelector(".menu-item[data-target='empresas']")?.click();
    });
  }

  if (confirmDeleteCompanyButton) {
    confirmDeleteCompanyButton.addEventListener("click", confirmDeleteCompany);
  }

  document.querySelectorAll("[data-close-import-modal]").forEach((button) => {
    button.addEventListener("click", closeImportModal);
  });

  document.querySelectorAll("[data-close-confirm-import-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      closeImportConfirmationModal();
      closeImportModal();
    });
  });

  document.querySelectorAll("[data-close-success-import-modal]").forEach((button) => {
    button.addEventListener("click", closeImportSuccessModal);
  });

  document.querySelectorAll("[data-close-delete-modal]").forEach((button) => {
    button.addEventListener("click", closeDeleteCompanyModal);
  });

  document.querySelectorAll("[data-close-bulk-delete-modal]").forEach((button) => {
    button.addEventListener("click", closeBulkDeleteCompanyModal);
  });

  window.addEventListener(CRM_DATA_UPDATED_EVENT, (event) => {
    triggerDashboardRefresh(event.detail?.reason);
  });

  btnAdicionarEmpresa.addEventListener("click", () => openModal("create"));
  empresaForm.addEventListener("submit", submitEmpresaForm);
  empresaTableBody.addEventListener("click", handleRowActions);
  empresaTableBody.addEventListener("click", (event) => {
    if (event.target.closest("button") || event.target.closest("input[type='checkbox']")) return;
    const row = event.target.closest("tr[data-id]");
    if (row) selectCompany(row.dataset.id);
  });

  let companySearchTimeout;
  searchInput.addEventListener("input", () => {
    window.clearTimeout(companySearchTimeout);
    companySearchTimeout = window.setTimeout(renderTable, 120);
  });

  [statusFiltro, segmentoFiltro, estadoFiltro].forEach((element) => {
    element.addEventListener("change", renderTable);
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal && !modal.classList.contains("hidden")) {
        closeModal();
      }
      if (importModal && !importModal.classList.contains("hidden")) {
        closeImportModal();
      }
      if (deleteCompanyModal && !deleteCompanyModal.classList.contains("hidden")) {
        closeDeleteCompanyModal();
      }
      if (bulkDeleteCompanyModal && !bulkDeleteCompanyModal.classList.contains("hidden")) {
        closeBulkDeleteCompanyModal();
      }
    }
  });

  updateDashboardCounters();
  renderPriorityDashboard();
});
