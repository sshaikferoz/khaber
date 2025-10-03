import { CLOUDERA_KHABER_CHAT_URL } from "./constants";

// Utility to remove duplicate service classes
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

// Generate multiple existing services
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
      source: `00000000000${4000000 + Math.floor(Math.random() * 100000) + index * 1000
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

// Generate mock service master response
const generateServiceMasterResponse = (payload) => {
  return {
    data: {
      d: {
        Action: "SUBMIT",
        CrDesc: "",
        CrNo: "",
        CrStatDesc: "To Be Evaluated",
        CrTypeDesc: "Service Master Mass Upload",
        Ekgrp: "",
        FileData: "",
        FwdUser: "",
        IsAdmin: "",
        NavHeader: {
          results: [
            {
              Action: "SUBMIT",
              Asnum: "B$1",
              Astyp: "",
              AstypTxt: "",
              Class: "MAINT:TNK",
              Ernam: "",
              Isic: "C331101",
              Lbnum: "",
              LbnumTxt: "",
              Longtxt: "",
              Lvorm: "",
              Matkl: "",
              MatklTxt: "",
              Meins: "M3",
              Mstde: "",
              NavDup: {
                results: [],
              },
              NavItem: {
                results: [
                  {
                    Asnum: "B$1",
                    Atbez: "TYPE",
                    Atnam: "TYPE",
                    Atwrt: payload?.attributes?.TYPE || "Storage Tank",
                    Chlpt:
                      "Enter the specific type of Tank like Storage Tank, Fuel Tank, Pressure Tank, etc.",
                    Class: "MAINT:TNK",
                    Keychr: "YES",
                    Meins: "",
                    Posnr: 1,
                    Refclass: "",
                    Reqrd: "YES",
                    Selected: false,
                  },
                  {
                    Asnum: "B$1",
                    Atbez: "APPLICATION",
                    Atnam: "APPLN",
                    Atwrt:
                      payload?.attributes?.APPLICATION ||
                      "Cleaning & Maintenance",
                    Chlpt:
                      "An indication of the intended use or purpose of performing the specified activity.",
                    Class: "MAINT:TNK",
                    Keychr: "NO",
                    Meins: "",
                    Posnr: 2,
                    Refclass: "",
                    Reqrd: "NO",
                    Selected: false,
                  },
                  {
                    Asnum: "B$1",
                    Atbez: "METHOD",
                    Atnam: "MTHD",
                    Atwrt: payload?.attributes?.METHOD || "Manual",
                    Chlpt:
                      "Explains the means or process or manner or procedure or systematic way of accomplishing a task.",
                    Class: "MAINT:TNK",
                    Keychr: "NO",
                    Meins: "",
                    Posnr: 3,
                    Refclass: "",
                    Reqrd: "NO",
                    Selected: false,
                  },
                  {
                    Asnum: "B$1",
                    Atbez: "ACTIVITY TYPE CODE",
                    Atnam: "ACTVTY_TYPE_CODE",
                    Atwrt: payload?.attributes?.ACTVTY_TYPE_CODE || "",
                    Chlpt:
                      "Indicates an Aramco specific activity code to identify the activity covered under the service.",
                    Class: "MAINT:TNK",
                    Keychr: "NO",
                    Meins: "",
                    Posnr: 4,
                    Refclass: "",
                    Reqrd: "NO",
                    Selected: false,
                  },
                  {
                    Asnum: "B$1",
                    Atbez: "MATERIAL",
                    Atnam: "MTRL",
                    Atwrt: payload?.attributes?.MATERIAL || "Steel",
                    Chlpt:
                      "The predominant material that the item is made from like Steel, Aluminum, Plastic, etc.",
                    Class: "MAINT:TNK",
                    Keychr: "NO",
                    Meins: "",
                    Posnr: 7,
                    Refclass: "",
                    Reqrd: "NO",
                    Selected: false,
                  },
                  {
                    Asnum: "B$1",
                    Atbez: "RATE TYPE",
                    Atnam: "RATE_TYPE",
                    Atwrt: payload?.attributes?.RATE_TYPE || "Fixed",
                    Chlpt:
                      "An indication of the method used for calculating the compensation or price payable for the service activity.",
                    Class: "MAINT:TNK",
                    Keychr: "YES",
                    Meins: "",
                    Posnr: 17,
                    Refclass: "",
                    Reqrd: "YES",
                    Selected: false,
                  },
                ],
              },
              NavReturn: {
                results: [
                  {
                    Asnum: "",
                    Message: `${Math.floor(
                      10000 + Math.random() * 90000
                    )}- Change Request ID created for the item - 1`,
                    Type: "S",
                  },
                ],
              },
            },
          ],
        },
        Refasnum: "",
        RejReason: "",
        SubAction: "",
        UsmdCreatedBy: "GURUNAPX",
        UsmdCreqStatus: "00",
        UsmdCreqType: "ZSMFUD1B",
        UsmdCrequest: `${Math.floor(10000 + Math.random() * 90000)}`,
        WfNotes: "",
        Workflow: "",
      },
    },
    status: "success",
  };
};

// Generate regenerated text based on attributes
const generateRegeneratedText = (attributes) => {
  const parts = [];

  if (attributes.TYPE) {
    parts.push(`MAINTAIN ${attributes.TYPE.toUpperCase()}`);
  }

  if (attributes.APPLICATION) {
    parts.push(`Intended Application Is ${attributes.APPLICATION}`);
  }

  if (attributes.METHOD) {
    parts.push(`Method Or Procedure ${attributes.METHOD}`);
  }

  if (attributes.MATERIAL) {
    parts.push(`Material ${attributes.MATERIAL}`);
  }

  if (attributes.RATE_TYPE) {
    parts.push(`Rate Type For Remuneration Will Be ${attributes.RATE_TYPE}`);
  }

  // Add some generic text
  parts.push("With All Necessary Safety Measures");
  parts.push("According To Industry Standards");

  return parts.join(", ");
};

// Enhanced Mock API with regenerate-text support
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
        ],
        status: "success",
      };

    case "generate-text":
      return {
        "attr": [
          {
            "Name": "TYPE",
            "value": "Operational Risk"
          },
          {
            "Name": "APPLICATION",
            "value": "Risk analysis for oilfield operations to improve safety and asset reliability"
          },
          {
            "Name": "METHOD",
            "value": "Hazard identification, HAZOP, FMEA, quantitative risk assessment, and root\u2011cause analysis"
          },
          {
            "Name": "ACTIVITY TYPE CODE",
            "value": ""
          },
          {
            "Name": "REFERENCE DATA",
            "value": "Well IDs, equipment tag numbers, and process flow diagrams"
          },
          {
            "Name": "DIMENSIONS",
            "value": ""
          },
          {
            "Name": "SAMPLING METHOD",
            "value": "Stratified sampling of field data and operational logs"
          },
          {
            "Name": "PRESSURE RATING",
            "value": ""
          },
          {
            "Name": "HAZARD CLASS TYPE",
            "value": ""
          },
          {
            "Name": "BRAND NAME",
            "value": ""
          },
          {
            "Name": "MODEL",
            "value": ""
          },
          {
            "Name": "REPORTING RANGE",
            "value": ""
          },
          {
            "Name": "REPORTING LIMIT",
            "value": ""
          },
          {
            "Name": "RATE TYPE",
            "value": "Time and Materials"
          },
          {
            "Name": "MATERIAL PROVIDED BY",
            "value": "Client"
          },
          {
            "Name": "TOOLS PROVIDED BY",
            "value": "Consultant"
          },
          {
            "Name": "TRANSPORTATION ARRANGEMENT",
            "value": "Client"
          },
          {
            "Name": "OPERATING AREA",
            "value": "Saudi Arabia \u2013 Jeddah and SPARK facilities"
          },
          {
            "Name": "MATERIAL INCLUDES",
            "value": "Data sets, analysis reports, risk matrices"
          },
          {
            "Name": "MATERIAL EXCLUDES",
            "value": "Physical hardware, equipment"
          },
          {
            "Name": "MANPOWER PROVIDED BY",
            "value": "Consultant"
          },
          {
            "Name": "APPLICABLE STANDARD",
            "value": "API 53, ISO 9001, ISO 14001"
          },
          {
            "Name": "ADDITIONAL INFORMATION",
            "value": "Supports digital transformation and compliance with Saudi Aramco safety policies"
          },
          {
            "Name": "SCOPE",
            "value": "Risk analysis services for oilfield operations"
          },
          {
            "Name": "ADDITIONAL ACTIVITY INCLUDES",
            "value": "Data collection, hazard identification, risk quantification, mitigation recommendations"
          },
          {
            "Name": "LEGACY SERVICE MASTER",
            "value": ""
          },
          {
            "Name": "PURCHASE ORDER",
            "value": ""
          },
          {
            "Name": "CONTRACT",
            "value": ""
          },
          {
            "Name": "RFQ",
            "value": ""
          },
          {
            "Name": "REF_MSS",
            "value": ""
          },
          {
            "Name": "PURCHASE REQ",
            "value": ""
          }
        ],
        "create_text": {
          "Action": "SUBMIT",
          "NavHeader": [
            {
              "Action": "SUBMIT",
              "Asnum": "1",
              "Astyp": "",
              "Class": "ANLZ:RISK:OLFLD",
              "Isic": "K6621",
              "Lbnum": "",
              "Longtxt": "",
              "Matkl": "",
              "Meins": "EA",
              "Mstde": "",
              "NavDup": [],
              "NavItem": [
                {
                  "Asnum": "",
                  "Atbez": "TYPE",
                  "Atnam": "TYPE",
                  "Atwrt": "Operational Risk",
                  "Chlpt": "Enter the specific type of Oilfield Risk like Operational Risk, Environmental Risk, Financial Risk, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "YES",
                  "Meins": "",
                  "Posnr": 1,
                  "Refclass": "",
                  "Reqrd": "YES",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "APPLICATION",
                  "Atnam": "APPLN",
                  "Atwrt": "Risk analysis for oilfield operations to improve safety and asset reliability",
                  "Chlpt": "An indication of the intended use or purpose of performing the specified activity.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 2,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "METHOD",
                  "Atnam": "MTHD",
                  "Atwrt": "Hazard identification, HAZOP, FMEA, quantitative risk assessment, and root\u2011cause analysis",
                  "Chlpt": "Explains the means or process or manner or procedure or systematic way of accomplishing a task.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 3,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "ACTIVITY TYPE CODE",
                  "Atnam": "ACTVTY_TYPE_CODE",
                  "Atwrt": "",
                  "Chlpt": "Indicates an Aramco specific activity code to identify the activity covered under the service.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 4,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REFERENCE DATA",
                  "Atnam": "REF_DATA",
                  "Atwrt": "Well IDs, equipment tag numbers, and process flow diagrams",
                  "Chlpt": "Indicates Aramco specific information or data to identify a reference to internal or external data or code like tag numbers or equipment code.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 5,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "DIMENSIONS",
                  "Atnam": "DMNSN",
                  "Atwrt": "",
                  "Chlpt": "The physical dimensions such as length, width, height, diameter of the item like 100mm x 200mm x 300mm, 50mm x 100mm x 150mm, 80mm x 160mm x 240mm, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 6,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "SAMPLING METHOD",
                  "Atnam": "SAMPLING_MTHD",
                  "Atwrt": "Stratified sampling of field data and operational logs",
                  "Chlpt": "Specifies the method used to draw samples for analysis like Random Sampling, Stratified Sampling, Systematic Sampling, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 7,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "PRESSURE RATING",
                  "Atnam": "PRES_RTNG",
                  "Atwrt": "",
                  "Chlpt": "The pressure at which an item is rated to operate like 150 psi, 300 psi, 600 psi, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 8,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "HAZARD CLASS TYPE",
                  "Atnam": "HZRD_CLS_TYPE",
                  "Atwrt": "",
                  "Chlpt": "The hazardous classification of where the item is rated to be used and purpose. the term \u2018hazard class\u2019 refers to the un recommended system of nine classes (1 to 9) for identifying dangerous goods and subdivisions like Flammable, Toxic, Corrosive, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 9,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "BRAND NAME",
                  "Atnam": "BRND_NAME",
                  "Atwrt": "",
                  "Chlpt": "A word, name, symbol, etc., especially one legally registered as a trademark, used by a manufacturer or merchant to identify its products distinctively from others of the same type and usually prominently displayed on its goods, in advertising, etc like A",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 10,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MODEL",
                  "Atnam": "MODEL",
                  "Atwrt": "",
                  "Chlpt": "A unique\u00a0number\u00a0given to each product like Model A, Model B, Model C, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 11,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REPORTING RANGE",
                  "Atnam": "REPORTING_RNGE",
                  "Atwrt": "",
                  "Chlpt": "Specifies the minimum and maximum or smallest and largest concentration (or amount) of analyte, that can be reported by a laboratory like 0-1000 ppm, 0-500 mg/m\u00b3, 0-10 mA, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 12,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REPORTING LIMIT",
                  "Atnam": "REPORTING_LMT",
                  "Atwrt": "",
                  "Chlpt": "Specifies the smallest concentration (or amount) of analyte, that can be reported by a laboratory like 1 ppm, 0.5 mg/m\u00b3, 10 \u00b5g/L, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 13,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "RATE TYPE",
                  "Atnam": "RATE_TYPE",
                  "Atwrt": "Time and Materials",
                  "Chlpt": "An indication of the method used for calculating the compensation or price payable for the service activity.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "YES",
                  "Meins": "",
                  "Posnr": 14,
                  "Refclass": "",
                  "Reqrd": "YES",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MATERIAL PROVIDED BY",
                  "Atnam": "MTRL_PRVD",
                  "Atwrt": "Client",
                  "Chlpt": "The entity responsible to supply the required materials for the task to be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 15,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "TOOLS PROVIDED BY",
                  "Atnam": "TOOL_PRVIDE",
                  "Atwrt": "Consultant",
                  "Chlpt": "The entity responsible to provide the tools for the task to be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 16,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "TRANSPORTATION ARRANGEMENT",
                  "Atnam": "TRANS_ARR",
                  "Atwrt": "Client",
                  "Chlpt": "The entity responsible to supply the transportation for labors and goods. e.g. client, contractor, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 17,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "OPERATING AREA",
                  "Atnam": "OPRTNG_AREA",
                  "Atwrt": "Saudi Arabia \u2013 Jeddah and SPARK facilities",
                  "Chlpt": "The geographical or spatial and physically identifiable area or zone or country or location where the activity will be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 18,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MATERIAL INCLUDES",
                  "Atnam": "MTRL_INCL",
                  "Atwrt": "Data sets, analysis reports, risk matrices",
                  "Chlpt": "Indicates the list of materials which are included.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 19,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MATERIAL EXCLUDES",
                  "Atnam": "MTRL_EXCL",
                  "Atwrt": "Physical hardware, equipment",
                  "Chlpt": "Indicates the list of materials which are excluded.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 20,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MANPOWER PROVIDED BY",
                  "Atnam": "MANPWR_PRVIDE",
                  "Atwrt": "Consultant",
                  "Chlpt": "The entity responsible to provide the personnel for the task to be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 21,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "APPLICABLE STANDARD",
                  "Atnam": "APPL_STD",
                  "Atwrt": "API 53, ISO 9001, ISO 14001",
                  "Chlpt": "A technical standard is an established norm or requirement which is widely agreed upon or imposed by a governing body. it is usually a formal document that establishes uniform engineering or technical criteria, methods, processes and best practices like I",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 22,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "ADDITIONAL INFORMATION",
                  "Atnam": "ADD_INFO",
                  "Atwrt": "Supports digital transformation and compliance with Saudi Aramco safety policies",
                  "Chlpt": "Any information which is relevant for conducting an activity which also have an impact on the result expected.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 23,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "SCOPE",
                  "Atnam": "SCOPE",
                  "Atwrt": "Risk analysis services for oilfield operations",
                  "Chlpt": "Indicates the activities covered under service line item represented by SAP service activity number.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 24,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "ADDITIONAL ACTIVITY INCLUDES",
                  "Atnam": "ADD_ACTVTY",
                  "Atwrt": "Data collection, hazard identification, risk quantification, mitigation recommendations",
                  "Chlpt": "Specifies list of activites or taks which are to be carried out to complete the intended service or work.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 25,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "LEGACY SERVICE MASTER",
                  "Atnam": "LGCY_SERVICE_MASTER",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "PURCHASE ORDER",
                  "Atnam": "PURCHASE_ORDER",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "CONTRACT",
                  "Atnam": "CONTRACT",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "RFQ",
                  "Atnam": "RFQ",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REF_MSS",
                  "Atnam": "REF_MSS",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "PURCHASE REQ",
                  "Atnam": "PURCHASE_REQ",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                }
              ],
              "NavReturn": [],
              "Pilogid": "",
              "Reccount": 1,
              "Refasnum": "",
              "Shortxt": "",
              "Sshcode": "B.15.12.02",
              "Unspsc": "71151202"
            }
          ],
          "Refasnum": ""
        },
        "existing": [
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:58.036844",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:ANLYTL",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004111243"
            },
            "rank": 1,
            "relevance": "59.10%",
            "service_text": " PROVIDE:SERVICES:ANALYTICAL; TYPE: SAND, APPLICATION: CRUDE OIL, RATE TYPE: PER SAMPLE TEST, OPERATING AREA: SAUDI ARAMCO LABORATORY  FACILITY"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:57.642595",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:ANLYTL",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004111241"
            },
            "rank": 2,
            "relevance": "56.83%",
            "service_text": " PROVIDE:SERVICES:ANALYTICAL; TYPE: SALT, APPLICATION: CRUDE OIL, RATE TYPE: PER SAMPLE TEST, OPERATING AREA: SAUDI ARAMCO LABORATORY  FACILITY"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:57.834842",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:ANLYTL",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004111242"
            },
            "rank": 3,
            "relevance": "55.60%",
            "service_text": " PROVIDE:SERVICES:ANALYTICAL; TYPE: VAPOR PRESSURE, APPLICATION: CRUDE OIL, RATE TYPE: PER SAMPLE TEST, OPERATING AREA: SAUDI ARAMCO LABORATORY FACILITY"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:12.241308",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:CNSLTG",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004063990"
            },
            "rank": 4,
            "relevance": "55.03%",
            "service_text": " PROVIDE:SERVICES:CONSULTING; TYPE: DELIVER ASSESSMENT INSTRUMENTS, RATE TYPE: EACH"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:13.443162",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:CNSLTG",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004063996"
            },
            "rank": 5,
            "relevance": "54.57%",
            "service_text": " PROVIDE:SERVICES:CONSULTING; TYPE: DEVELOPMENT ACCOUNTABILITY TOOL DELIVERY, RATE TYPE: EACH"
          }
        ],
        "new": [
          {
            "text": "ANALYZE RISK OILFIELD, Type Operational Risk, Intended Application Is Risk Analysis For Oilfield Operations To Improve Safety And Asset Reli, Method Or Procedure Hazard Identification, Hazop, Fmea, Quantitative Risk Assessment, And, Reference Data Well Ids, Equipment Tag Numbers, And Process Flow Diagrams, Sampling Method Stratified Sampling Of Field Data And Operational Logs, Rate Type For Remuneration Will Be Time And Materials, Material Will Be Provided By Client, Tools Will Be Provided By Consultant, Transportation Will Be Arranged By Client, Operating Location Or Area Or Region Saudi Arabia \u2013 Jeddah And Spark Facilities, Materials Which Are Included Are Data Sets, Analysis Reports, Risk Matrices, Materials Which Are Excluded Are Physical Hardware, Equipment, Manpower Will Be Provided By Consultant, Applicable Standard Api 53, Iso 9001, Iso 14001, Additional Information Supports Digital Transformation And Compliance With Saudi Aramco Safet, Scope Will Be Risk Analysis Services For Oilfield Operations, Additional Activity Includes Data Collection, Hazard Identification, Risk Quantification, Mitigatio",
            "type": "Aramco Standard"
          },
          {
            "text": "ANALYZE RISK OILFIELD, Type Operational Risk, Intended Application Is Risk Analysis For Oilfield Operations To Improve Safety And Asset Reli, Method Or Procedure Hazard Identification, Hazop, Fmea, Quantitative Risk Assessment, And, Reference Data Well Ids, Equipment Tag Numbers, And Process Flow Diagrams, Sampling Method Stratified Sampling Of Field Data And Operational Logs, Rate Type For Remuneration Will Be Time And Materials, Material Will Be Provided By Client, Tools Will Be Provided By Consultant, Transportation Will Be Arranged By Client, Operating Location Or Area Or Region Saudi Arabia \u2013 Jeddah And Spark Facilities, Materials Which Are Included Are Data Sets, Analysis Reports, Risk Matrices, Materials Which Are Excluded Are Physical Hardware, Equipment, Manpower Will Be Provided By Consultant, Applicable Standard Api 53, Iso 9001, Iso 14001, Additional Information Supports Digital Transformation And Compliance With Saudi Aramco Safet, Scope Will Be Risk Analysis Services For Oilfield Operations, Additional Activity Includes Data Collection, Hazard Identification, Risk Quantification, Mitigatio",
            "type": "Global Standard"
          }
        ]
      };

    case "regenerate-text":
      // New endpoint for regenerating text based on modified attributes
      const regeneratedText = generateRegeneratedText(data.attributes);
      return {
        "attr": [
          {
            "Name": "TYPE",
            "value": "Operational Risk"
          },
          {
            "Name": "APPLICATION",
            "value": "Risk analysis for oilfield operations to improve safety and asset reliability"
          },
          {
            "Name": "METHOD",
            "value": "Hazard identification, HAZOP, FMEA, quantitative risk assessment, and root\u2011cause analysis"
          },
          {
            "Name": "ACTIVITY TYPE CODE",
            "value": ""
          },
          {
            "Name": "REFERENCE DATA",
            "value": "Well IDs, equipment tag numbers, and process flow diagrams"
          },
          {
            "Name": "DIMENSIONS",
            "value": ""
          },
          {
            "Name": "SAMPLING METHOD",
            "value": "Stratified sampling of field data and operational logs"
          },
          {
            "Name": "PRESSURE RATING",
            "value": ""
          },
          {
            "Name": "HAZARD CLASS TYPE",
            "value": ""
          },
          {
            "Name": "BRAND NAME",
            "value": ""
          },
          {
            "Name": "MODEL",
            "value": ""
          },
          {
            "Name": "REPORTING RANGE",
            "value": ""
          },
          {
            "Name": "REPORTING LIMIT",
            "value": ""
          },
          {
            "Name": "RATE TYPE",
            "value": "Time and Materials"
          },
          {
            "Name": "MATERIAL PROVIDED BY",
            "value": "Client"
          },
          {
            "Name": "TOOLS PROVIDED BY",
            "value": "Consultant"
          },
          {
            "Name": "TRANSPORTATION ARRANGEMENT",
            "value": "Client"
          },
          {
            "Name": "OPERATING AREA",
            "value": "Saudi Arabia \u2013 Jeddah and SPARK facilities"
          },
          {
            "Name": "MATERIAL INCLUDES",
            "value": "Data sets, analysis reports, risk matrices"
          },
          {
            "Name": "MATERIAL EXCLUDES",
            "value": "Physical hardware, equipment"
          },
          {
            "Name": "MANPOWER PROVIDED BY",
            "value": "Consultant"
          },
          {
            "Name": "APPLICABLE STANDARD",
            "value": "API 53, ISO 9001, ISO 14001"
          },
          {
            "Name": "ADDITIONAL INFORMATION",
            "value": "Supports digital transformation and compliance with Saudi Aramco safety policies"
          },
          {
            "Name": "SCOPE",
            "value": "Risk analysis services for oilfield operations"
          },
          {
            "Name": "ADDITIONAL ACTIVITY INCLUDES",
            "value": "Data collection, hazard identification, risk quantification, mitigation recommendations"
          },
          {
            "Name": "LEGACY SERVICE MASTER",
            "value": ""
          },
          {
            "Name": "PURCHASE ORDER",
            "value": ""
          },
          {
            "Name": "CONTRACT",
            "value": ""
          },
          {
            "Name": "RFQ",
            "value": ""
          },
          {
            "Name": "REF_MSS",
            "value": ""
          },
          {
            "Name": "PURCHASE REQ",
            "value": ""
          }
        ],
        "create_text": {
          "Action": "SUBMIT",
          "NavHeader": [
            {
              "Action": "SUBMIT",
              "Asnum": "1",
              "Astyp": "",
              "Class": "ANLZ:RISK:OLFLD",
              "Isic": "K6621",
              "Lbnum": "",
              "Longtxt": "",
              "Matkl": "",
              "Meins": "EA",
              "Mstde": "",
              "NavDup": [],
              "NavItem": [
                {
                  "Asnum": "",
                  "Atbez": "TYPE",
                  "Atnam": "TYPE",
                  "Atwrt": "Operational Risk",
                  "Chlpt": "Enter the specific type of Oilfield Risk like Operational Risk, Environmental Risk, Financial Risk, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "YES",
                  "Meins": "",
                  "Posnr": 1,
                  "Refclass": "",
                  "Reqrd": "YES",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "APPLICATION",
                  "Atnam": "APPLN",
                  "Atwrt": "Risk analysis for oilfield operations to improve safety and asset reliability",
                  "Chlpt": "An indication of the intended use or purpose of performing the specified activity.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 2,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "METHOD",
                  "Atnam": "MTHD",
                  "Atwrt": "Hazard identification, HAZOP, FMEA, quantitative risk assessment, and root\u2011cause analysis",
                  "Chlpt": "Explains the means or process or manner or procedure or systematic way of accomplishing a task.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 3,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "ACTIVITY TYPE CODE",
                  "Atnam": "ACTVTY_TYPE_CODE",
                  "Atwrt": "",
                  "Chlpt": "Indicates an Aramco specific activity code to identify the activity covered under the service.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 4,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REFERENCE DATA",
                  "Atnam": "REF_DATA",
                  "Atwrt": "Well IDs, equipment tag numbers, and process flow diagrams",
                  "Chlpt": "Indicates Aramco specific information or data to identify a reference to internal or external data or code like tag numbers or equipment code.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 5,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "DIMENSIONS",
                  "Atnam": "DMNSN",
                  "Atwrt": "",
                  "Chlpt": "The physical dimensions such as length, width, height, diameter of the item like 100mm x 200mm x 300mm, 50mm x 100mm x 150mm, 80mm x 160mm x 240mm, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 6,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "SAMPLING METHOD",
                  "Atnam": "SAMPLING_MTHD",
                  "Atwrt": "Stratified sampling of field data and operational logs",
                  "Chlpt": "Specifies the method used to draw samples for analysis like Random Sampling, Stratified Sampling, Systematic Sampling, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 7,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "PRESSURE RATING",
                  "Atnam": "PRES_RTNG",
                  "Atwrt": "",
                  "Chlpt": "The pressure at which an item is rated to operate like 150 psi, 300 psi, 600 psi, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 8,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "HAZARD CLASS TYPE",
                  "Atnam": "HZRD_CLS_TYPE",
                  "Atwrt": "",
                  "Chlpt": "The hazardous classification of where the item is rated to be used and purpose. the term \u2018hazard class\u2019 refers to the un recommended system of nine classes (1 to 9) for identifying dangerous goods and subdivisions like Flammable, Toxic, Corrosive, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 9,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "BRAND NAME",
                  "Atnam": "BRND_NAME",
                  "Atwrt": "",
                  "Chlpt": "A word, name, symbol, etc., especially one legally registered as a trademark, used by a manufacturer or merchant to identify its products distinctively from others of the same type and usually prominently displayed on its goods, in advertising, etc like A",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 10,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MODEL",
                  "Atnam": "MODEL",
                  "Atwrt": "",
                  "Chlpt": "A unique\u00a0number\u00a0given to each product like Model A, Model B, Model C, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 11,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REPORTING RANGE",
                  "Atnam": "REPORTING_RNGE",
                  "Atwrt": "",
                  "Chlpt": "Specifies the minimum and maximum or smallest and largest concentration (or amount) of analyte, that can be reported by a laboratory like 0-1000 ppm, 0-500 mg/m\u00b3, 0-10 mA, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 12,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REPORTING LIMIT",
                  "Atnam": "REPORTING_LMT",
                  "Atwrt": "",
                  "Chlpt": "Specifies the smallest concentration (or amount) of analyte, that can be reported by a laboratory like 1 ppm, 0.5 mg/m\u00b3, 10 \u00b5g/L, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 13,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "RATE TYPE",
                  "Atnam": "RATE_TYPE",
                  "Atwrt": "Time and Materials",
                  "Chlpt": "An indication of the method used for calculating the compensation or price payable for the service activity.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "YES",
                  "Meins": "",
                  "Posnr": 14,
                  "Refclass": "",
                  "Reqrd": "YES",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MATERIAL PROVIDED BY",
                  "Atnam": "MTRL_PRVD",
                  "Atwrt": "Client",
                  "Chlpt": "The entity responsible to supply the required materials for the task to be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 15,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "TOOLS PROVIDED BY",
                  "Atnam": "TOOL_PRVIDE",
                  "Atwrt": "Consultant",
                  "Chlpt": "The entity responsible to provide the tools for the task to be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 16,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "TRANSPORTATION ARRANGEMENT",
                  "Atnam": "TRANS_ARR",
                  "Atwrt": "Client",
                  "Chlpt": "The entity responsible to supply the transportation for labors and goods. e.g. client, contractor, etc.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 17,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "OPERATING AREA",
                  "Atnam": "OPRTNG_AREA",
                  "Atwrt": "Saudi Arabia \u2013 Jeddah and SPARK facilities",
                  "Chlpt": "The geographical or spatial and physically identifiable area or zone or country or location where the activity will be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 18,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MATERIAL INCLUDES",
                  "Atnam": "MTRL_INCL",
                  "Atwrt": "Data sets, analysis reports, risk matrices",
                  "Chlpt": "Indicates the list of materials which are included.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 19,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MATERIAL EXCLUDES",
                  "Atnam": "MTRL_EXCL",
                  "Atwrt": "Physical hardware, equipment",
                  "Chlpt": "Indicates the list of materials which are excluded.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 20,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "MANPOWER PROVIDED BY",
                  "Atnam": "MANPWR_PRVIDE",
                  "Atwrt": "Consultant",
                  "Chlpt": "The entity responsible to provide the personnel for the task to be carried out.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 21,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "APPLICABLE STANDARD",
                  "Atnam": "APPL_STD",
                  "Atwrt": "API 53, ISO 9001, ISO 14001",
                  "Chlpt": "A technical standard is an established norm or requirement which is widely agreed upon or imposed by a governing body. it is usually a formal document that establishes uniform engineering or technical criteria, methods, processes and best practices like I",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 22,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "ADDITIONAL INFORMATION",
                  "Atnam": "ADD_INFO",
                  "Atwrt": "Supports digital transformation and compliance with Saudi Aramco safety policies",
                  "Chlpt": "Any information which is relevant for conducting an activity which also have an impact on the result expected.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 23,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "SCOPE",
                  "Atnam": "SCOPE",
                  "Atwrt": "Risk analysis services for oilfield operations",
                  "Chlpt": "Indicates the activities covered under service line item represented by SAP service activity number.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 24,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "ADDITIONAL ACTIVITY INCLUDES",
                  "Atnam": "ADD_ACTVTY",
                  "Atwrt": "Data collection, hazard identification, risk quantification, mitigation recommendations",
                  "Chlpt": "Specifies list of activites or taks which are to be carried out to complete the intended service or work.",
                  "Class": "ANLZ:RISK:OLFLD",
                  "Keychr": "NO",
                  "Meins": "",
                  "Posnr": 25,
                  "Refclass": "",
                  "Reqrd": "NO",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "LEGACY SERVICE MASTER",
                  "Atnam": "LGCY_SERVICE_MASTER",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "PURCHASE ORDER",
                  "Atnam": "PURCHASE_ORDER",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "CONTRACT",
                  "Atnam": "CONTRACT",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "RFQ",
                  "Atnam": "RFQ",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "REF_MSS",
                  "Atnam": "REF_MSS",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                },
                {
                  "Asnum": "",
                  "Atbez": "PURCHASE REQ",
                  "Atnam": "PURCHASE_REQ",
                  "Atwrt": "",
                  "Chlpt": "",
                  "Class": "SM_DOCS_REFS",
                  "Keychr": "",
                  "Meins": "",
                  "Posnr": 0,
                  "Refclass": "X",
                  "Reqrd": "",
                  "Selected": false,
                  "__metadata": {
                    "id": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')",
                    "type": "ZSCM_MDG_SER_MSTR_SRV.SMItem",
                    "uri": "https://DVC.ARAMCO.COM.SA:44405/sap/opu/odata/SAP/ZSCM_MDG_SER_MSTR_SRV/SMItemSet('')"
                  }
                }
              ],
              "NavReturn": [],
              "Pilogid": "",
              "Reccount": 1,
              "Refasnum": "",
              "Shortxt": "",
              "Sshcode": "B.15.12.02",
              "Unspsc": "71151202"
            }
          ],
          "Refasnum": ""
        },
        "existing": [
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:58.036844",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:ANLYTL",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004111243"
            },
            "rank": 1,
            "relevance": "59.10%",
            "service_text": " PROVIDE:SERVICES:ANALYTICAL; TYPE: SAND, APPLICATION: CRUDE OIL, RATE TYPE: PER SAMPLE TEST, OPERATING AREA: SAUDI ARAMCO LABORATORY  FACILITY"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:57.642595",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:ANLYTL",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004111241"
            },
            "rank": 2,
            "relevance": "56.83%",
            "service_text": " PROVIDE:SERVICES:ANALYTICAL; TYPE: SALT, APPLICATION: CRUDE OIL, RATE TYPE: PER SAMPLE TEST, OPERATING AREA: SAUDI ARAMCO LABORATORY  FACILITY"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:57.834842",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:ANLYTL",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004111242"
            },
            "rank": 3,
            "relevance": "55.60%",
            "service_text": " PROVIDE:SERVICES:ANALYTICAL; TYPE: VAPOR PRESSURE, APPLICATION: CRUDE OIL, RATE TYPE: PER SAMPLE TEST, OPERATING AREA: SAUDI ARAMCO LABORATORY FACILITY"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:12.241308",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:CNSLTG",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004063990"
            },
            "rank": 4,
            "relevance": "55.03%",
            "service_text": " PROVIDE:SERVICES:CONSULTING; TYPE: DELIVER ASSESSMENT INSTRUMENTS, RATE TYPE: EACH"
          },
          {
            "metadata": {
              "created_at": "2025-09-16T21:54:13.443162",
              "service_cat": "6PRS",
              "service_class": "PRVD:SRV:CNSLTG",
              "service_group": "993000",
              "service_type": "O51",
              "source": "000000000004063996"
            },
            "rank": 5,
            "relevance": "54.57%",
            "service_text": " PROVIDE:SERVICES:CONSULTING; TYPE: DEVELOPMENT ACCOUNTABILITY TOOL DELIVERY, RATE TYPE: EACH"
          }
        ],
        "new": [
          {
            "text": "ANALYZE RISK OILFIELD, Type Operational Risk, Intended Application Is Risk Analysis For Oilfield Operations To Improve Safety And Asset Reli, Method Or Procedure Hazard Identification, Hazop, Fmea, Quantitative Risk Assessment, And, Reference Data Well Ids, Equipment Tag Numbers, And Process Flow Diagrams, Sampling Method Stratified Sampling Of Field Data And Operational Logs, Rate Type For Remuneration Will Be Time And Materials, Material Will Be Provided By Client, Tools Will Be Provided By Consultant, Transportation Will Be Arranged By Client, Operating Location Or Area Or Region Saudi Arabia \u2013 Jeddah And Spark Facilities, Materials Which Are Included Are Data Sets, Analysis Reports, Risk Matrices, Materials Which Are Excluded Are Physical Hardware, Equipment, Manpower Will Be Provided By Consultant, Applicable Standard Api 53, Iso 9001, Iso 14001, Additional Information Supports Digital Transformation And Compliance With Saudi Aramco Safet, Scope Will Be Risk Analysis Services For Oilfield Operations, Additional Activity Includes Data Collection, Hazard Identification, Risk Quantification, Mitigatio",
            "type": "Aramco Standard"
          },
          {
            "text": "ANALYZE RISK OILFIELD, Type Operational Risk, Intended Application Is Risk Analysis For Oilfield Operations To Improve Safety And Asset Reli, Method Or Procedure Hazard Identification, Hazop, Fmea, Quantitative Risk Assessment, And, Reference Data Well Ids, Equipment Tag Numbers, And Process Flow Diagrams, Sampling Method Stratified Sampling Of Field Data And Operational Logs, Rate Type For Remuneration Will Be Time And Materials, Material Will Be Provided By Client, Tools Will Be Provided By Consultant, Transportation Will Be Arranged By Client, Operating Location Or Area Or Region Saudi Arabia \u2013 Jeddah And Spark Facilities, Materials Which Are Included Are Data Sets, Analysis Reports, Risk Matrices, Materials Which Are Excluded Are Physical Hardware, Equipment, Manpower Will Be Provided By Consultant, Applicable Standard Api 53, Iso 9001, Iso 14001, Additional Information Supports Digital Transformation And Compliance With Saudi Aramco Safet, Scope Will Be Risk Analysis Services For Oilfield Operations, Additional Activity Includes Data Collection, Hazard Identification, Risk Quantification, Mitigatio",
            "type": "Global Standard"
          }
        ]
      };

    case "validate-text":
      return generateServiceMasterResponse(data);

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

// Generic API call function with proper error handling
export const apiCall = async (endpoint, data = {}, method = "POST") => {
  try {
    console.log(`Making API call to: ${endpoint}`, { data, method });

    // For development/testing, use mock API
    if (!CLOUDERA_KHABER_CHAT_URL) {
      console.log("Using mock API for development");
      return await mockAPICall(endpoint, data, 1000);
    }

    // Production API call
    const response = await fetch(`${CLOUDERA_KHABER_CHAT_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
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
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(`API call to ${endpoint} successful:`, result);
    return result;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);

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

    throw error;
  }
};

// Batch process service master creation
export const createServiceMastersBatch = async (items, batchSize = 3) => {
  const results = [];
  const batches = [];

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

        const response = await apiCall("validate-text", payload);

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

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if (batchIndex < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
};

// API endpoints constants
export const API_ENDPOINTS = {
  PREDICT_SERVICE_CATEGORIES: "predict-service-categories",
  PREDICT_SERVICE_TYPES: "predict-service-types",
  PREDICT_SERVICE_CLASS: "predict-service-class",
  GENERATE_TEXT: "generate-text",
  REGENERATE_TEXT: "regenerate-text",
  VALIDATE_TEXT: "validate-text",
};

export const SERVICE_MASTER_STATUS = {
  PENDING: "pending",
  CREATED: "created",
  APPROVED: "approved",
  REJECTED: "rejected",
  ERROR: "error",
};
