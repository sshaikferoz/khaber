// Application constants and configurations

// Storage keys
export const STORAGE_KEYS = {
  CHAT_THREADS: "khaber_chat_threads",
  CURRENT_CHAT: "khaber_current_chat",
  VARIANTS: "khaber_variants",
};

// Chain of thought steps configuration
export const CHAIN_STEPS = [
  {
    id: "categories",
    title: "Predicting Service Categories",
    description: "Analyzing query to identify relevant service categories...",
    endpoint: "predict-service-categories",
  },
  {
    id: "types",
    title: "Predicting Service Types",
    description: "Determining specific service types based on categories...",
    endpoint: "predict-service-types",
  },
  {
    id: "classes",
    title: "Predicting Service Classes",
    description:
      "Matching detailed service classes and generating structure...",
    endpoint: "predict-service-class",
  },
  {
    id: "text",
    title: "Generating Service Line Items",
    description: "Creating standardized and enhanced service descriptions...",
    endpoint: "generate-text",
  },
];

// Knowledge modes
export const KNOWLEDGE_MODES = {
  ARAMCO: "aramco",
  GENERAL: "general",
};

// Tab configurations
export const TABS = {
  PREDICTIONS: "predictions",
  REVIEW: "review",
};

// API delays (for mock API)
export const API_DELAYS = {
  DEFAULT: 2000,
  FAST: 1000,
  SLOW: 3000,
};

// File processing
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: [".pdf"],
};

// UI configurations
export const UI_CONFIG = {
  MAX_PIPELINE_HISTORY: 10,
  STREAMING_DELAY: 500,
  ANIMATION_DELAYS: {
    FADE_IN: 500,
    SLIDE_DOWN: 300,
    SLIDE_UP: 600,
  },
};

// Default service templates
export const SERVICE_TEMPLATES = [
  "Provide Operator, heavy equipment; with Saudi Aramco certification; non-driver; Third Country National; 48 hour work week",
  "Supply Technical Specialist, mechanical systems; certified professional; with 5+ years experience; rotation schedule",
  "Deliver Maintenance Services, industrial equipment; preventive and corrective; 24/7 availability; certified technicians",
  "Furnish Engineering Support, process optimization; senior level expertise; project-based engagement; remote capabilities",
  "Provide Safety Coordinator, industrial operations; HSE certified; bilingual requirements; permanent assignment",
];

// Color schemes
export const COLORS = {
  PRIMARY: "#0070f2",
  PRIMARY_HOVER: "#005bb5",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: "640px",
  MD: "768px",
  LG: "1024px",
  XL: "1280px",
  "2XL": "1536px",
};

export const CLOUDERA_KHABER_CHAT_URL =
  "https://search-middleware-hari-agent-aramco-mcc.apps.ibmdev.aramco.com";
// export const CLOUDERA_KHABER_CHAT_URL = ""
// // "https://khaber.cml.apps.cdp-ds-test.aramco.com";
// // https://search-middleware-hari-agent-aramco-mcc.apps.ibmdev.aramco.com/generate-text

export const USE_MOCK_API = true; // Toggle between mock API and real API
