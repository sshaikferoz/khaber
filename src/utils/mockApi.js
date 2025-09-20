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
    "Provide Operator, heavy equipment; with Saudi Aramco certification; non-driver; Third Country National; 48 hour work week",
    "Supply Technical Specialist, mechanical systems; certified professional; with 5+ years experience; rotation schedule",
    "Deliver Maintenance Services, industrial equipment; preventive and corrective; 24/7 availability; certified technicians",
    "Furnish Engineering Support, process optimization; senior level expertise; project-based engagement; remote capabilities",
    "Provide Safety Coordinator, industrial operations; HSE certified; bilingual requirements; permanent assignment",
  ];

  return templates.slice(0, count).map((template, index) => ({
    sm_no: `21323${Math.floor(Math.random() * 100) + index}`,
    text: template,
    score: `${Math.floor(Math.random() * 30) + 70}%`,
    confidence: Math.random() > 0.5 ? "High" : "Medium",
  }));
};

// Enhanced Mock API with carousel data
export const mockAPICall = async (endpoint, data, delay = 2000) => {
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
        existing_services: generateMultipleExistingServices(5),
        new: "REPAIR EQUIPMENT MECHANICAL, Type Mechanical Seal, Intended Application Is Repair And Maintenance Of Industrial Equipment, Method Or Procedure On-site Repair, Reverse Engineering, Manufacturing, Rate Type For Remuneration Will Be Time And Materials, Material Will Be Provided By Proponent, Mssd, Contractor, Tools Will Be Provided By Mssd, Contractor, Transportation Will Be Arranged By Contractor, Operating Location Or Area Or Region Saudi Arabia (dhahran, Jazan, Jeddah, Juaymah, Riyadh, Shedgum, Yanbu), Materials Which Are Included Are Spare Parts, Repair Materials, Manpower Will Be Provided By Mssd, Contractor, Applicable Standard Oem Maintenance Manual, Mssd's Technical Repairs Procedures, Internati, Additional Information Equipment Covered: Motors, Gearboxes, Pumps, Gas Compressors, Gas Turb, Scope Will Be Repair And Overhaul Of Mechanical Seals, Additional Activity Includes Repair Plan Preparation, Disassembly, Inspection, Material Requirement.",
        status: "success",
        score: "85%",
      };

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

// Generic API call function
export const apiCall = async (endpoint, data = {}, method = "POST") => {
  try {
    const response = await fetch(`${CLOUDERA_KHABER_CHAT_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Add auth headers if required, e.g.:
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
