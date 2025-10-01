import { CLOUDERA_KHABER_CHAT_URL } from "./constants";

// Mock API utilities and functions
export const removeDuplicateServiceClasses = (response, dedupeBy = "Class") => {
  if (!response || !response.llm_class || !Array.isArray(response.llm_class)) {
    return response;
  }

  const uniqueItems = [];
  const seenKeys = new Set();

  response.llm_class.forEach((item) => {
    let key;

    switch (dedupeBy) {
      case "Class":
        key = item.Class;
        break;
      case "composite":
        key = `${item.Class}_${item.Category}`;
        break;
      case "full":
        key = JSON.stringify({
          Category: item.Category,
          Class: item.Class,
          Group: item.Group,
          Kltxt: item.Kltxt,
          Type: item.Type,
        });
        break;
      default:
        key = item[dedupeBy] || item.Class;
    }

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueItems.push(item);
    }
  });

  return {
    ...response,
    llm_class: uniqueItems,
  };
};

const generateMultipleExistingServices = (count = 5) => {
  const templates = [
    "CLEAN TANK, Type Cylindrical, Sphere, Dome Roof, Cone Roof, Vertical Or Horizontal, Intended Application Is Piping Within Diked Area, Method Or Procedure Grit Blast, Shape All Types Of Tank (cylindrical, Sphere, Dome Roof, Cone Roof, Etc Vertical Or Horizontal), With A Finish Of Sa-3, Surface Uncoated, Rate Type For Remuneration Will Be Per Square Meter, Material Will Be Provided By Saudi Aramco, Applicable Standard Aes-h-001, Aes-h-100 And/or Aes-h-101, Additional Activity Includes Clean External Or Internal, Remove Rust, Dust, Product, Scale, Etc, Including Disposal Of Grit And All Refuse",
    "CLEAN TANK, Type Shell, Roof And Appurtenances (cylindrical, Sphere, Dome Roof, Cone Roof), Intended Application Is Shell, Roof And Appurtenances (cylindrical, Sphere, Dome Roof, Cone Roof, Etc), Method Or Procedure Grit Blast, With A Finish Of Sa-3, Surface Coated, Method Used To Mount Is Vertical Or Horizontal, Rate Type For Remuneration Will Be Per Square Meter, Material Will Be Provided By Contractor, Tools Will Be Provided By Saudi Aramco, Materials Which Are Included Are Grit, Applicable Standard Aes-h- 001, Aes-h-100 And/or Aes-h-101, Additional Information Saudi Aramco Will Provide Scaffolding (height Over 12 Meter), Additional Activity Includes Dispose",
    "CLEAN TANK, Type Tank, Piping And Structural Steel Cleaning, With A Capacity Of 10000 Bbl, Shape Spheroid, Type Of Medium Used Solvent And Isobutane Storage, Rate Type For Remuneration Will Be Each, Material Will Be Provided By Contractor, Tools Will Be Provided By Contractor",
    "CLEAN TANK, Type Interior, Shell, Intended Application Is Shell Interior, Method Or Procedure Garnet Blast, With A Finish Of Sa-2, Surface Coated, Rate Type For Remuneration Will Be Per Square Meter, Material Will Be Provided By Saudi Aramco, Additional Activity Includes Dispose",
    "CLEAN TANK, Type Shell (cylindrical, Sphere, Dome Roof, Cone Roof, Etc), Method Or Procedure Grit Blast, With A Finish Of Sa-3, Surface Coated, Method Used To Mount Is Vertical Or Horizontal, Rate Type For Remuneration Will Be Per Square Meter, Material Will Be Provided By Saudi Aramco, Materials Which Are Included Are Grit, Applicable Standard Aes-h-001, Aes-h-100 And/or Aes-h-101, Additional Activity Includes Dispose",
  ];

  const serviceCategories = ["3POM", "2ENG", "5ITM"];
  const serviceClasses = ["CLN:TNK", "RPR:EQP", "MNT:SYS"];
  const serviceGroups = ["966000", "345000", "810000"];
  const serviceTypes = ["N02", "M15", "S08"];

  return templates.slice(0, count).map((template, index) => ({
    metadata: {
      created_at: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      service_cat: serviceCategories[index % serviceCategories.length],
      service_class: serviceClasses[index % serviceClasses.length],
      service_group: serviceGroups[index % serviceGroups.length],
      service_type: serviceTypes[index % serviceTypes.length],
      source: `00000000000${
        4000000 + Math.floor(Math.random() * 100000) + index * 1000
      }`,
    },
    rank: index + 1,
    relevance: `${Math.floor(Math.random() * 20) + 80}.${Math.floor(
      Math.random() * 100
    )
      .toString()
      .padStart(2, "0")}%`,
    service_text: template,
  }));
};

// Mock Service Master Creation Response Generator
const generateServiceMasterResponse = (payload) => {
  const serviceMasterId = `SM${String(Date.now()).slice(-8)}${Math.floor(
    Math.random() * 100
  )
    .toString()
    .padStart(2, "0")}`;

  return {
    service_master_id: serviceMasterId,
    status: "created",
    created_at: new Date().toISOString(),
    service_text: payload.new,
    metadata: {
      category: "3POM", // Plant Operations & Maintenance
      class: "SERVICE_MASTER",
      group: "900000", // General Services
      type: "NEW",
      created_by: "KHABER_AI",
      validation_status: "pending",
    },
    additional_info:
      "Service Master created successfully via KHABER AI pipeline",
    workflow_id: `WF-${Date.now()}`,
    approval_required: true,
    estimated_approval_time: "2-3 business days",
  };
};

// Enhanced Mock API with carousel data and service master creation
export const mockAPICall = async (endpoint, data, delay = 2000) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay));

  switch (endpoint) {
    case "predict-service-categories":
      return {
        llm_cat: [
          "3 - Plant Operations & Maintenance",
          "5 - Information Technology",
          "2 - Engineering & Construction",
        ],
        status: "success",
      };

    case "predict-service-types":
      return {
        llm_cat: [
          "3 - Plant Operations & Maintenance",
          "5 - Information Technology",
          "2 - Engineering & Construction",
        ],
        llm_types: {
          service_types: [
            {
              classes: [
                "REPAIR:EQUIPMENT:ROTATING",
                "MAINTAIN:EQUIPMENT:STATIC",
                "OVERHAUL:TURBINE",
              ],
              reason:
                "The SOW specifies extensive maintenance, repair, and overhaul services for various industrial equipment.",
              service_type: "EQUIPMENT MAINTENANCE SERVICES",
            },
            {
              classes: [
                "MANAGE:FACILITY:SECURITY",
                "TRACK:INVENTORY",
                "MONITOR:ENERGY",
              ],
              reason:
                "The SOW outlines the need for comprehensive facility management.",
              service_type: "FACILITY SERVICES",
            },
            {
              classes: [
                "DEVELOP:SOFTWARE:DIGITAL",
                "IMPLEMENT:SOLUTION",
                "INTEGRATE:SYSTEM",
              ],
              reason:
                "The SOW emphasizes the implementation of digital solutions.",
              service_type: "SOFTWARE SOLUTION SERVICES",
            },
          ],
        },
        status: "success",
      };

    case "predict-service-class":
      return {
        llm_class: [
          {
            Category: "Information Technology",
            Class: "PRVD:SRV:CLOUD",
            Group: "550 - Software Services",
            Kltxt: "PROVIDE:SERVICES:CLOUDBASED",
            Type: "SOFTWARE SOLUTION SERVICES",
          },
          {
            Category: "Plant Ops & Maintenance",
            Class: "REPR:EQP:MECH",
            Group: "345 - Mechanical Maintenance",
            Kltxt: "REPAIR:EQUIPMENT:MECHANICAL",
            Type: "EQUIPMENT MAINTENANCE SERVICES",
          },
          {
            Category: "Admin. & General Services",
            Class: "MAINT:FCIL:EQP",
            Group: "810 - Facility Management",
            Kltxt: "MAINTAIN:FACILITY:EQUIPMENT",
            Type: "FACILITY SERVICES",
          },
        ],
        status: "success",
      };

    case "generate-text":
      return {
        create_text: {},
        existing: generateMultipleExistingServices(5),
        new: "MAINTAIN TANK, Type Industrial Storage Tank, Intended Application Is Maintenance And Inspection Of Large Industrial Storage Tanks, Method Or Procedure Scheduled Maintenance, Preventive Care, Structural Inspection, Rate Type For Remuneration Will Be Per Square Meter, Material Will Be Provided By Saudi Aramco, Tools Will Be Provided By Contractor, Transportation Will Be Arranged By Contractor, Operating Location Or Area Or Region Saudi Arabia (Dhahran, Ras Tanura, Jubail, Yanbu), Materials Which Are Included Are Maintenance Supplies, Inspection Equipment, Safety Gear, Manpower Will Be Provided By Contractor, Applicable Standard API 650, API 653, ASME Standards, Additional Information Tank Types Include: Crude Oil, Refined Products, Chemical Storage, Scope Will Be Complete Tank Maintenance Program, Additional Activity Includes Condition Assessment, Cleaning, Coating Inspection, Leak Detection",
        status: "success",
      };

    case "create_service_master":
      return generateServiceMasterResponse(data);

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

// Enhanced Generic API call function with proper error handling
export const apiCall = async (endpoint, data = {}, method = "POST") => {
  try {
    console.log(`Making API call to: ${endpoint}`, { data, method });

    // For development/testing, use mock API
    if (process.env.NODE_ENV === "development" || !CLOUDERA_KHABER_CHAT_URL) {
      console.log("Using mock API for development");
      return await mockAPICall(endpoint, data, 1500); // Faster response in dev
    }

    // Production API call
    const response = await fetch(`${CLOUDERA_KHABER_CHAT_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Add auth headers if required, e.g.:
        // Authorization: `Bearer ${token}`,
        // "X-API-Key": process.env.REACT_APP_API_KEY,
      },
      body: method !== "GET" ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status} ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use the text as error message
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(`API call to ${endpoint} successful:`, result);
    return result;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);

    // Enhance error with more context
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        `Network error: Unable to connect to ${endpoint}. Please check your internet connection.`
      );
    }

    if (error.message.includes("timeout")) {
      throw new Error(
        `Request timeout: The ${endpoint} request took too long to complete. Please try again.`
      );
    }

    // Re-throw the error with original message for other cases
    throw error;
  }
};

// Utility function to batch process service master creation
export const createServiceMastersBatch = async (items, batchSize = 3) => {
  const results = [];
  const batches = [];

  // Split items into batches to avoid overwhelming the API
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  console.log(
    `Processing ${items.length} items in ${batches.length} batches of ${batchSize}`
  );

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchPromises = batch.map(async (item, itemIndex) => {
      try {
        const payload = {
          create_text: item.create_text || {},
          new: item.new || item.serviceText,
        };

        const response = await apiCall("create_service_master", payload);

        return {
          ...item,
          status: "success",
          response: response,
          serviceMasterId: response.service_master_id || response.id,
        };
      } catch (error) {
        console.error(
          `Batch ${batchIndex + 1}, Item ${itemIndex + 1} failed:`,
          error
        );
        return {
          ...item,
          status: "error",
          error: error.message,
        };
      }
    });

    // Wait for current batch to complete
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches to avoid rate limiting
    if (batchIndex < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
};

// Export constants for use in components
export const API_ENDPOINTS = {
  PREDICT_SERVICE_CATEGORIES: "predict-service-categories",
  PREDICT_SERVICE_TYPES: "predict-service-types",
  PREDICT_SERVICE_CLASS: "predict-service-class",
  GENERATE_TEXT: "generate-text",
  CREATE_SERVICE_MASTER: "create_service_master",
};

export const SERVICE_MASTER_STATUS = {
  PENDING: "pending",
  CREATED: "created",
  APPROVED: "approved",
  REJECTED: "rejected",
  ERROR: "error",
};
