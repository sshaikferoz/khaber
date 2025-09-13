import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Send,
  MessageSquare,
  Check,
  X,
  Brain,
  Info,
  Settings,
  Eye,
  Paperclip,
  FileText,
  Loader2,
  ArrowLeft,
  ChevronLeft,
  AlertCircle,
  Package,
  ChevronUp,
  Clock,
  Database,
  Plus,
  Trash2,
} from "lucide-react";

// Skeleton Components
const SkeletonRow = () => (
  <div className="animate-pulse p-4 border-b border-gray-100">
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "60px 120px 1fr 1fr 120px" }}
    >
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const SkeletonTable = ({ rows = 3 }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="p-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
    </div>
    {Array.from({ length: rows }).map((_, index) => (
      <SkeletonRow key={index} />
    ))}
  </div>
);

const ItemSkeletonRow = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    <td className="p-4">
      <div className="w-4 h-4 bg-gray-200 rounded"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="text-blue-600 animate-spin" />
          <span className="text-xs text-blue-600">AI is thinking...</span>
        </div>
        <div className="h-16 bg-blue-50 rounded border border-blue-200 animate-pulse"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-gray-200 rounded w-8"></div>
    </td>
  </tr>
);

// Enhanced Storage utilities for Chat Threads
const CHAT_THREADS_STORAGE_KEY = "khaber_chat_threads";
const CURRENT_CHAT_STORAGE_KEY = "khaber_current_chat";
const STORAGE_KEY = "khaber_variants";

const saveChatThreadsToStorage = (chatThreads) => {
  try {
    sessionStorage.setItem(
      CHAT_THREADS_STORAGE_KEY,
      JSON.stringify(chatThreads)
    );
  } catch (error) {
    console.error("Failed to save chat threads to storage:", error);
  }
};

const loadChatThreadsFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(CHAT_THREADS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load chat threads from storage:", error);
  }
  return {};
};

const saveCurrentChatIdToStorage = (chatId) => {
  try {
    sessionStorage.setItem(CURRENT_CHAT_STORAGE_KEY, chatId);
  } catch (error) {
    console.error("Failed to save current chat ID:", error);
  }
};

const loadCurrentChatIdFromStorage = () => {
  try {
    return sessionStorage.getItem(CURRENT_CHAT_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to load current chat ID:", error);
  }
  return null;
};

const createNewChatThread = () => {
  const chatId = `chat_${Date.now()}`;
  return {
    id: chatId,
    title: "New Chat",
    createdAt: Date.now(),
    lastActivity: Date.now(),
    pipelineHistory: [],
    hasSubmittedPrompt: false,
  };
};

const saveVariantsToStorage = (variants) => {
  try {
    const variantsData = {};
    variants.forEach((variant, index) => {
      variantsData[`version_${index + 1}`] = variant;
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(variantsData));
  } catch (error) {
    console.error("Failed to save variants to storage:", error);
  }
};

const loadVariantsFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const variantsData = JSON.parse(stored);
      return Object.values(variantsData);
    }
  } catch (error) {
    console.error("Failed to load variants from storage:", error);
  }
  return [];
};

const clearVariantsStorage = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear variants storage:", error);
  }
};

const addToPipelineHistory = (chatThreads, chatId, historyItem) => {
  try {
    const updatedThreads = { ...chatThreads };
    if (updatedThreads[chatId]) {
      const existingHistory = updatedThreads[chatId].pipelineHistory || [];
      updatedThreads[chatId].pipelineHistory = [
        historyItem,
        ...existingHistory,
      ].slice(0, 10);
      updatedThreads[chatId].lastActivity = Date.now();
    }
    return updatedThreads;
  } catch (error) {
    console.error("Failed to add to pipeline history:", error);
    return chatThreads;
  }
};

const removeDuplicateServiceClasses = (response, dedupeBy = "Class") => {
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

// Enhanced Mock API with carousel data
const mockAPICall = async (endpoint, data, delay = 2000) => {
  await new Promise((resolve) => setTimeout(resolve, delay));

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

// Chat Thread Sidebar Component
const ChatThreadSidebar = ({
  chatThreads,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  sidebarExpanded,
}) => {
  if (!sidebarExpanded) return null;

  const sortedChats = Object.values(chatThreads).sort(
    (a, b) => b.lastActivity - a.lastActivity
  );

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Chat Threads</h3>
        <button
          onClick={onNewChat}
          className="p-2 hover:bg-blue-100 rounded-md transition-colors text-blue-600 hover:text-blue-800"
          title="New Chat"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedChats.map((chat) => (
          <div
            key={chat.id}
            className={`group p-3 rounded-md cursor-pointer transition-colors relative ${
              currentChatId === chat.id
                ? "bg-blue-100 border border-blue-200"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{chat.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(chat.lastActivity).toLocaleDateString()}
                </div>
                {chat.pipelineHistory && chat.pipelineHistory.length > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    {chat.pipelineHistory.length} pipeline
                    {chat.pipelineHistory.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {currentChatId !== chat.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-md transition-all text-red-600"
                  title="Delete Chat"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        ))}

        {sortedChats.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat threads yet</p>
            <p className="text-xs">Click + to start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact Pipeline History Component for Chat Interface
const CompactPipelineHistory = ({
  historyItems,
  onViewDetails,
  onRemoveItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!historyItems || historyItems.length === 0) return null;

  const latestItems = historyItems;
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-3xl mb-4 animate-fadeIn">
      <div className="border-b border-gray-200 pb-2 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between hover:bg-gray-50 rounded p-2"
        >
          <span className="font-medium text-gray-700 flex items-center">
            <Database className="w-4 h-4 mr-2 text-purple-600" />
            Pipeline Generation History ({historyItems.length})
          </span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {isExpanded ? (
        <div className="space-y-3">
          {latestItems.map((historyItem) => {
            const createdAt = new Date(historyItem.timestamp).toLocaleString();
            return (
              <div
                key={historyItem.id}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-800">
                      Generation #{historyItem.id}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {historyItem.serviceClasses?.length || 0} items
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewDetails(historyItem)}
                      className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onRemoveItem(historyItem.id)}
                      className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-2">{createdAt}</div>

                <div className="text-sm text-gray-700 bg-white rounded p-2 max-h-16 overflow-hidden">
                  {historyItem.query?.length > 100
                    ? `${historyItem.query.substring(0, 100)}...`
                    : historyItem.query}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>
              Latest:{" "}
              {latestItems[0]
                ? new Date(latestItems[0].timestamp).toLocaleString()
                : "No history"}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {latestItems[0]?.serviceClasses?.length || 0} items generated
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Carousel Component for Existing Services
const ExistingServicesCarousel = ({
  services,
  selectedIndex,
  onSelect,
  isGenerating,
}) => {
  if (isGenerating || !services?.length) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center space-x-2">
          <Loader2 size={16} className="text-blue-600 animate-spin" />
          <span className="text-sm text-gray-600">Loading services...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">
          {services[selectedIndex]?.sm_no}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onSelect(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex === 0}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-gray-500">
            {selectedIndex + 1} of {services.length}
          </span>
          <button
            onClick={() =>
              onSelect(Math.min(services.length - 1, selectedIndex + 1))
            }
            disabled={selectedIndex === services.length - 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 min-h-24 overflow-y-auto border">
        {services[selectedIndex]?.text}
      </div>
    </div>
  );
};

// Selected Items Card Component
const SelectedItemsCard = ({
  selectedItems,
  serviceClasses,
  textGenerations,
  isExpanded,
  onToggle,
}) => {
  const selectedCount = Object.keys(selectedItems).length;

  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-blue-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <Package size={16} className="text-blue-600" />
          <div>
            <span className="font-medium text-blue-800">
              Selected Service Items ({selectedCount})
            </span>
            <p className="text-sm text-blue-600">
              Click to {isExpanded ? "hide" : "view"} selected items
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-blue-600" />
        ) : (
          <ChevronDown size={16} className="text-blue-600" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-blue-200 bg-white rounded-b-lg">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-100">
                  <th className="text-left py-2 text-blue-800">Item</th>
                  <th className="text-left py-2 text-blue-800">Type</th>
                  <th className="text-left py-2 text-blue-800">Selection</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedItems).map(([index, item]) => (
                  <tr key={index} className="border-b border-blue-50">
                    <td className="py-2">#{parseInt(index) + 1}</td>
                    <td className="py-2 text-blue-700 font-mono text-xs">
                      {serviceClasses[index]?.Type}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.choice === "matching"
                            ? "bg-blue-100 text-blue-800"
                            : item.choice === "new"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.choice === "matching"
                          ? "Existing SM"
                          : item.choice === "new"
                          ? "New SM"
                          : "Not Selected"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Version Selector Component
const VersionSelector = ({ versions, currentVersion, onVersionChange }) => {
  if (versions.length <= 1) return null;

  return (
    <div className="mb-4 flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Variants:</span>
      <div className="flex space-x-2">
        {versions.map((_, index) => (
          <button
            key={index}
            onClick={() => onVersionChange(index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentVersion === index
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Version {index + 1}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        {versions.length} variant{versions.length > 1 ? "s" : ""} available
      </div>
    </div>
  );
};

// Selection Help Card
const SelectionHelpCard = ({ hasSelections }) => {
  if (hasSelections) return null;

  return (
    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle size={16} className="text-amber-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-amber-800 mb-1">
            Selection Required
          </h4>
          <p className="text-sm text-amber-700">
            Please select at least one service item and choose either "Use
            Existing SM" or "Use New SM" for each selected item before
            proceeding to review.
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
  </div>
);

// Chain of Thought Step Component
const ChainOfThoughtStep = ({
  step,
  isActive,
  isCompleted,
  onViewDetails,
  response,
}) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
        isCompleted
          ? "bg-green-50 border border-green-200"
          : isActive
          ? "bg-blue-50 border border-blue-200"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full transition-all duration-500 ${
          isCompleted
            ? "bg-green-500"
            : isActive
            ? "bg-blue-500 animate-pulse"
            : "bg-gray-300"
        }`}
      />

      <div className="flex-1">
        <div
          className={`text-sm font-medium ${
            isCompleted
              ? "text-green-700"
              : isActive
              ? "text-blue-700"
              : "text-gray-600"
          }`}
        >
          {step.title}
        </div>
        <div className="text-xs text-gray-500 mt-1">{step.description}</div>
      </div>

      <div className="flex items-center space-x-2">
        {isActive && !isCompleted && <LoadingSpinner />}
        {isCompleted && (
          <>
            <Check className="w-4 h-4 text-green-500" />
            {response && (
              <button
                onClick={() => onViewDetails(step.id, response)}
                className="p-1 hover:bg-white rounded-md transition-colors"
                title="View response details"
              >
                <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Visual Response Components (keeping existing ones)
const CategoriesView = ({ response }) => (
  <div className="space-y-4">
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 className="font-medium text-green-800 mb-3">Predicted Categories</h4>
      <div className="grid gap-2">
        {response.llm_cat?.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded p-3 border border-green-100"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">{category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500">
        Status:{" "}
        <span className="font-medium text-green-600">{response.status}</span>
      </div>
    </div>
  </div>
);

const TypesView = ({ response }) => (
  <div className="space-y-4">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-800 mb-3">
        Predicted Service Types
      </h4>
      <div className="space-y-3">
        {response.llm_types?.service_types?.map((type, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-blue-100"
          >
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-800 mb-2">
                  {type.service_type}
                </h5>
                <p className="text-sm text-gray-600 mb-3">{type.reason}</p>
                <div className="flex flex-wrap gap-2">
                  {type.classes?.map((cls, clsIndex) => (
                    <span
                      key={clsIndex}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500">
        Status:{" "}
        <span className="font-medium text-green-600">{response.status}</span>
      </div>
    </div>
  </div>
);

const ClassesView = ({ response }) => (
  <div className="space-y-4">
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h4 className="font-medium text-purple-800 mb-3">
        Predicted Service Classes
      </h4>
      <div className="space-y-3">
        {response.llm_class?.map((cls, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-purple-100"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Category
                </label>
                <div className="text-sm text-gray-800 mt-1">{cls.Category}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Class
                </label>
                <div className="text-sm text-gray-800 mt-1 font-mono">
                  {cls.Class}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Group
                </label>
                <div className="text-sm text-gray-800 mt-1">{cls.Group}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Type
                </label>
                <div className="text-sm text-gray-800 mt-1">{cls.Type}</div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </label>
                <div className="text-sm text-gray-800 mt-1 bg-gray-50 rounded p-2">
                  {cls.Kltxt}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500">
        Status:{" "}
        <span className="font-medium text-green-600">{response.status}</span>
      </div>
    </div>
  </div>
);

const TextGenerationView = ({ response }) => (
  <div className="space-y-4">
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h4 className="font-medium text-orange-800 mb-3">
        Generated Text Results
      </h4>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-orange-100">
          <h5 className="font-medium text-gray-800 mb-3">Existing Services</h5>
          <div className="space-y-2">
            {response.existing_services?.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded p-3 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {service.sm_no}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {service.score}
                  </span>
                </div>
                <div className="text-gray-700">{service.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-orange-100">
          <h5 className="font-medium text-gray-800 mb-3">Enhanced Text</h5>
          <div className="bg-blue-50 rounded p-3 text-sm text-gray-700 leading-relaxed">
            {response.new}
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs text-gray-500">
        Status:{" "}
        <span className="font-medium text-green-600">{response.status}</span>
      </div>
    </div>
  </div>
);

// Response Details Modal
const ResponseDetailsModal = ({ isOpen, onClose, stepId, response }) => {
  if (!isOpen) return null;

  const getStepTitle = (stepId) => {
    const titles = {
      categories: "Service Categories Prediction",
      types: "Service Types Prediction",
      classes: "Service Classes Prediction",
      text: "Text Generation",
    };
    return titles[stepId] || "API Response";
  };

  const renderContent = () => {
    switch (stepId) {
      case "categories":
        return <CategoriesView response={response} />;
      case "types":
        return <TypesView response={response} />;
      case "classes":
        return <ClassesView response={response} />;
      case "text":
        return <TextGenerationView response={response} />;
      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-2/3 max-w-3xl h-[500px] flex flex-col shadow-xl overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {getStepTitle(stepId)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

// Service Class Info Dialog
const ServiceClassInfoDialog = ({
  isOpen,
  onClose,
  serviceClass,
  textGeneration,
  reason,
  selectedCarouselIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl min-h-[50vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {serviceClass.Type} - Service Line Item Standardized Text
          </h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {reason && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Scope Reference</h4>
            <p className="text-blue-700 text-sm leading-relaxed">{reason}</p>
          </div>
        )}

        <div className="space-y-4">
          {textGeneration && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-3">
                Current Selected Service Line Item
              </h4>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Existing Service ({selectedCarouselIndex + 1} of{" "}
                    {textGeneration.existing_services?.length || 0})
                  </h5>
                  <div className="text-sm text-gray-800 mt-1 bg-gray-100 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {
                          textGeneration.existing_services?.[
                            selectedCarouselIndex
                          ]?.sm_no
                        }
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {
                          textGeneration.existing_services?.[
                            selectedCarouselIndex
                          ]?.score
                        }
                      </span>
                    </div>
                    {
                      textGeneration.existing_services?.[selectedCarouselIndex]
                        ?.text
                    }
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    New Service Line Item Long Text
                  </h5>
                  <div className="text-sm text-gray-800 mt-1 bg-blue-100 rounded p-3">
                    {textGeneration.new}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Service Class Results Table
const ServiceClassTable = ({
  serviceClasses,
  textGenerations,
  onShowInfo,
  isGeneratingText,
  selectedItems,
  onItemSelect,
  onChoiceSelect,
  onReview,
  carouselSelections,
  onCarouselSelect,
  onAskAboutItems,
}) => {
  const hasSelectedItems = Object.keys(selectedItems).length > 0;
  const hasValidSelections = Object.values(selectedItems).some(
    (item) => item.choice
  );

  return (
    <div className="space-y-4">
      <SelectionHelpCard hasSelections={hasValidSelections} />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Procurement Service Line Items
            </h3>
            <div className="flex space-x-3">
              {hasSelectedItems && (
                <button
                  onClick={() => onAskAboutItems(selectedItems)}
                  className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Brain size={16} />
                  <span>Ask KHABER about Selected</span>
                </button>
              )}
              {hasValidSelections && (
                <button
                  onClick={onReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>
                    Review Selected Items (
                    {
                      Object.values(selectedItems).filter((item) => item.choice)
                        .length
                    }
                    )
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700 w-12">
                  Select
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-16">
                  S.No.
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-32">
                  Service Type
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-1/3">
                  Existing Service Line Item
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-2/3">
                  AI Generated Service Line Item
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceClasses.map((item, index) => {
                const textGen = textGenerations[index];
                const isGenerating = isGeneratingText[index];
                const isSelected = selectedItems[index];
                const carouselIndex = carouselSelections[index] || 0;

                // Show skeleton if this specific item is being regenerated
                if (isGenerating) {
                  return <ItemSkeletonRow key={`skeleton-${index}`} />;
                }

                return (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 hover:bg-gray-50 animate-fadeIn transition-colors ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={(e) => onItemSelect(index, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                    <td className="p-4 text-gray-600">{index + 1}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">
                      {item.Type}
                    </td>
                    <td className="p-4">
                      <div className="space-y-2 min-h-[80px]">
                        {textGen ? (
                          <>
                            <ExistingServicesCarousel
                              services={textGen.existing_services}
                              selectedIndex={carouselIndex}
                              onSelect={(newIndex) =>
                                onCarouselSelect(index, newIndex)
                              }
                              isGenerating={false}
                            />
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`matching-${index}`}
                                  name={`choice-${index}`}
                                  value="matching"
                                  checked={isSelected?.choice === "matching"}
                                  onChange={() =>
                                    onChoiceSelect(index, "matching")
                                  }
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor={`matching-${index}`}
                                  className="text-xs text-gray-700 font-medium"
                                >
                                  Use Existing SM
                                </label>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-gray-400">
                            Loading services...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {textGen ? (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 bg-blue-50 rounded p-2 max-h-32 overflow-auto">
                            {textGen.new}
                          </div>
                          {isSelected && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={`new-${index}`}
                                name={`choice-${index}`}
                                value="new"
                                checked={isSelected?.choice === "new"}
                                onChange={() => onChoiceSelect(index, "new")}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`new-${index}`}
                                className="text-xs text-gray-700 font-medium"
                              >
                                Use New SM
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">
                          Pending generation...
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          onShowInfo(item, textGen, index, carouselIndex)
                        }
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="View service class details"
                      >
                        <Info size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Review Screen Component
const ReviewScreen = ({ reviewData, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Selection</span>
          </button>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Save Draft
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Confirm & Submit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="font-semibold text-gray-800">
            Review Selected Service Line Items
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Please review your selections before confirming
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700 w-16">
                  S.No.
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-32">
                  Service Type
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-40">
                  Selection
                </th>
                <th className="text-left p-4 font-medium text-gray-700">
                  Service Line Item Text
                </th>
              </tr>
            </thead>
            <tbody>
              {reviewData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 text-gray-600">{item.sno}</td>
                  <td className="p-4 text-gray-600 font-mono text-sm">
                    {item.serviceType}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.choice === "matching"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.choice === "matching"
                        ? "Matching Service"
                        : "New Service"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {item.choice === "matching" &&
                        item.selectedExistingService && (
                          <div className="text-xs font-medium text-gray-500">
                            Service Master: {item.selectedExistingService.sm_no}{" "}
                            - {item.selectedExistingService.score}
                          </div>
                        )}
                      <div
                        className={`text-sm text-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto ${
                          item.choice === "matching"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-green-50 border border-green-200"
                        }`}
                      >
                        {item.choice === "matching"
                          ? item.selectedExistingService?.text
                          : item.textGen?.new}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function KhaberChatbot() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState("predictions");
  const [chainOfThoughtExpanded, setChainOfThoughtExpanded] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [knowledgeMode, setKnowledgeMode] = useState("aramco");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const fileInputRef = useRef(null);

  // PDF processing states
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [pdfJSLoaded, setPdfJSLoaded] = useState(false);

  // API workflow states
  const [apiResponses, setApiResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [serviceClasses, setServiceClasses] = useState([]);
  const [textGenerations, setTextGenerations] = useState([]);
  const [isGeneratingText, setIsGeneratingText] = useState([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [modalData, setModalData] = useState({ stepId: "", response: null });

  // Service class info dialog states
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedServiceClass, setSelectedServiceClass] = useState(null);
  const [selectedTextGeneration, setSelectedTextGeneration] = useState(null);
  const [selectedServiceClassReason, setSelectedServiceClassReason] =
    useState(null);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0);

  // Selection and Review states
  const [selectedItems, setSelectedItems] = useState({});
  const [reviewData, setReviewData] = useState([]);

  // Enhanced features states
  const [carouselSelections, setCarouselSelections] = useState({});
  const [selectedItemsExpanded, setSelectedItemsExpanded] = useState(false);
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [isRegeneratingItems, setIsRegeneratingItems] = useState({});

  // Chat Thread Management states
  const [chatThreads, setChatThreads] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyModalData, setHistoryModalData] = useState(null);

  // Load chat threads and set current chat on component mount
  useEffect(() => {
    const loadedChatThreads = loadChatThreadsFromStorage();
    const loadedCurrentChatId = loadCurrentChatIdFromStorage();

    // If no chat threads exist, create the first one
    if (Object.keys(loadedChatThreads).length === 0) {
      const newChat = createNewChatThread();
      const initialChatThreads = { [newChat.id]: newChat };
      setChatThreads(initialChatThreads);
      setCurrentChatId(newChat.id);
      saveChatThreadsToStorage(initialChatThreads);
      saveCurrentChatIdToStorage(newChat.id);
    } else {
      setChatThreads(loadedChatThreads);
      // If current chat ID exists and is valid, use it, otherwise use the most recent
      if (loadedCurrentChatId && loadedChatThreads[loadedCurrentChatId]) {
        setCurrentChatId(loadedCurrentChatId);
        setHasSubmittedPrompt(
          loadedChatThreads[loadedCurrentChatId].hasSubmittedPrompt || false
        );
      } else {
        const mostRecentChatId = Object.values(loadedChatThreads).sort(
          (a, b) => b.lastActivity - a.lastActivity
        )[0]?.id;
        if (mostRecentChatId) {
          setCurrentChatId(mostRecentChatId);
          setHasSubmittedPrompt(
            loadedChatThreads[mostRecentChatId].hasSubmittedPrompt || false
          );
          saveCurrentChatIdToStorage(mostRecentChatId);
        }
      }
    }

    const loadedVersions = loadVariantsFromStorage();
    if (loadedVersions.length > 0) {
      setVersions(loadedVersions);
    }
  }, []);

  // Save versions when they change
  useEffect(() => {
    if (versions.length > 0) {
      saveVariantsToStorage(versions);
    }
  }, [versions]);

  // Save chat threads when they change
  useEffect(() => {
    if (Object.keys(chatThreads).length > 0) {
      saveChatThreadsToStorage(chatThreads);
    }
  }, [chatThreads]);

  // Chain of thought steps
  const chainSteps = [
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

  // Get current chat's pipeline history
  const getCurrentChatHistory = () => {
    return currentChatId && chatThreads[currentChatId]
      ? chatThreads[currentChatId].pipelineHistory || []
      : [];
  };

  // Load PDF.js dynamically (keeping existing implementation)
  const loadPDFJS = async () => {
    if (pdfJSLoaded) return;

    return new Promise(function (resolve, reject) {
      if (window.pdfjsLib) {
        return resolve(window.pdfjsLib);
      }

      var pdfScript = document.createElement("script");
      pdfScript.src = "pdf.min.js";
      pdfScript.onload = function () {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js";
          console.log("PDF.js loaded and worker configured");
          setPdfJSLoaded(true);
          resolve(window.pdfjsLib);
        } else {
          reject(new Error("PDF.js loaded but pdfjsLib not available"));
        }
      };
      pdfScript.onerror = function () {
        reject(new Error("Failed to load PDF.js library"));
      };
      document.head.appendChild(pdfScript);
    });
  };

  // Extract text from PDF (keeping existing implementation)
  const extractTextFromPDF = async (file) => {
    try {
      await loadPDFJS();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ")
          .trim();

        if (pageText) {
          fullText += pageText + "\n\n";
        }
      }

      return fullText.trim();
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error(
        "Failed to extract text from PDF. Please ensure the PDF is not encrypted or corrupted."
      );
    }
  };

  // Handle file selection (keeping existing implementation)
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessingPDF(true);

    try {
      const extractedText = await extractTextFromPDF(file);

      const fileInfo = {
        name: file.name,
        size: file.size,
        extractedText: extractedText,
      };

      setAttachedFiles((prev) => [...prev, fileInfo]);

      const textToAdd = `\n\n--- Content from ${file.name} ---\n${extractedText}`;
      setPromptText((prev) => prev + textToAdd);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessingPDF(false);
      event.target.value = "";
    }
  };

  // Remove attached file (keeping existing implementation)
  const removeAttachedFile = (index) => {
    const fileToRemove = attachedFiles[index];
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

    const contentToRemove = `\n\n--- Content from ${fileToRemove.name} ---\n${fileToRemove.extractedText}`;
    setPromptText((prev) => prev.replace(contentToRemove, ""));
  };

  // Chat Thread Management Functions
  const handleNewChat = () => {
    const newChat = createNewChatThread();
    const updatedChatThreads = {
      ...chatThreads,
      [newChat.id]: newChat,
    };

    setChatThreads(updatedChatThreads);
    setCurrentChatId(newChat.id);
    saveCurrentChatIdToStorage(newChat.id);

    // Reset all current chat state
    setHasSubmittedPrompt(false);
    setShowResponse(false);
    setCurrentStep(-1);
    setCompletedSteps(new Set());
    setApiResponses({});
    setServiceClasses([]);
    setTextGenerations([]);
    setIsGeneratingText([]);
    setChainOfThoughtExpanded(false);
    setAttachedFiles([]);
    setSelectedItems({});
    setReviewData([]);
    setActiveTab("predictions");
    setCarouselSelections({});
    setVersions([]);
    setCurrentVersion(0);
    setPromptText("");
    setSubmittedQuery("");
    clearVariantsStorage();
  };

  const handleSelectChat = (chatId) => {
    if (chatId === currentChatId) return;

    setCurrentChatId(chatId);
    saveCurrentChatIdToStorage(chatId);

    // Load chat-specific state
    const selectedChat = chatThreads[chatId];
    if (selectedChat) {
      setHasSubmittedPrompt(selectedChat.hasSubmittedPrompt || false);
      // Reset other state for now - you could extend this to save per-chat state
      setShowResponse(false);
      setCurrentStep(-1);
      setCompletedSteps(new Set());
      setApiResponses({});
      setServiceClasses([]);
      setTextGenerations([]);
      setIsGeneratingText([]);
      setChainOfThoughtExpanded(false);
      setAttachedFiles([]);
      setSelectedItems({});
      setReviewData([]);
      setActiveTab("predictions");
      setCarouselSelections({});
      setVersions([]);
      setCurrentVersion(0);
      setPromptText("");
      setSubmittedQuery("");
      clearVariantsStorage();
    }
  };

  const handleDeleteChat = (chatId) => {
    if (Object.keys(chatThreads).length <= 1) {
      alert("Cannot delete the last chat thread.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this chat thread?")) {
      const updatedChatThreads = { ...chatThreads };
      delete updatedChatThreads[chatId];

      setChatThreads(updatedChatThreads);

      // If deleting current chat, switch to most recent remaining chat
      if (chatId === currentChatId) {
        const remainingChats = Object.values(updatedChatThreads);
        const mostRecentChat = remainingChats.sort(
          (a, b) => b.lastActivity - a.lastActivity
        )[0];
        if (mostRecentChat) {
          handleSelectChat(mostRecentChat.id);
        }
      }
    }
  };

  const updateChatTitle = (chatId, query) => {
    const updatedChatThreads = { ...chatThreads };
    if (updatedChatThreads[chatId]) {
      // Generate a short title from the query
      const title = query.length > 50 ? `${query.substring(0, 50)}...` : query;
      updatedChatThreads[chatId].title = title;
      updatedChatThreads[chatId].lastActivity = Date.now();
      updatedChatThreads[chatId].hasSubmittedPrompt = true;
      setChatThreads(updatedChatThreads);
    }
  };

  const createNewVersion = (newData) => {
    const newVersionData = {
      serviceClasses: newData.serviceClasses || serviceClasses,
      textGenerations: newData.textGenerations || textGenerations,
      apiResponses: newData.apiResponses || apiResponses,
      timestamp: Date.now(),
      query: newData.query || submittedQuery,
    };

    setVersions((prev) => {
      const updated = [...prev, newVersionData];
      return updated;
    });
    setCurrentVersion(versions.length);
  };

  const switchToVersion = (versionIndex) => {
    if (versionIndex < 0 || versionIndex >= versions.length) return;

    const version = versions[versionIndex];
    setServiceClasses(version.serviceClasses || []);
    setTextGenerations(version.textGenerations || []);
    setApiResponses(version.apiResponses || {});
    setCurrentVersion(versionIndex);
  };

  // Pipeline History Functions
  const savePipelineToHistory = (pipelineData) => {
    if (!currentChatId) return;

    const historyItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      query: pipelineData.query,
      serviceClasses: pipelineData.serviceClasses,
      textGenerations: pipelineData.textGenerations,
      apiResponses: pipelineData.apiResponses,
    };

    const updatedChatThreads = addToPipelineHistory(
      chatThreads,
      currentChatId,
      historyItem
    );
    setChatThreads(updatedChatThreads);
  };

  const handleViewHistoryDetails = (historyItem) => {
    setHistoryModalData(historyItem);
    setShowHistoryModal(true);
  };

  const handleRemoveHistoryItem = (itemId) => {
    if (!currentChatId) return;

    const updatedChatThreads = { ...chatThreads };
    if (updatedChatThreads[currentChatId]) {
      updatedChatThreads[currentChatId].pipelineHistory = updatedChatThreads[
        currentChatId
      ].pipelineHistory.filter((item) => item.id !== itemId);
      setChatThreads(updatedChatThreads);
    }
  };

  const handlePromptSubmit = async () => {
    if (promptText.trim()) {
      setSubmittedQuery(promptText);
      setHasSubmittedPrompt(true);
      setShowResponse(false);
      setCurrentStep(0);
      setCompletedSteps(new Set());
      setApiResponses({});
      setServiceClasses([]);
      setTextGenerations([]);
      setIsGeneratingText([]);
      setChainOfThoughtExpanded(false);
      setAttachedFiles([]);
      setSelectedItems({});
      setReviewData([]);
      setActiveTab("predictions");
      setCarouselSelections({});

      // Clear versions when starting fresh
      clearVariantsStorage();
      setVersions([]);
      setCurrentVersion(0);

      const newPrompt = promptText;
      setPromptText("");

      // Update chat title
      if (currentChatId) {
        updateChatTitle(currentChatId, newPrompt);
      }

      await executeAPIWorkflow(newPrompt);
    }
  };

  const executeAPIWorkflow = async (query) => {
    try {
      // Step 1: Predict Service Categories
      setCurrentStep(0);
      const categoriesResponse = await mockAPICall(
        "predict-service-categories",
        {
          text: query,
        }
      );
      setApiResponses((prev) => ({ ...prev, categories: categoriesResponse }));
      setCompletedSteps((prev) => new Set([...prev, 0]));

      // Step 2: Predict Service Types
      setCurrentStep(1);
      const typesResponse = await mockAPICall("predict-service-types", {
        text: query,
        llm_cat_formatted: categoriesResponse.llm_cat,
      });

      setApiResponses((prev) => ({ ...prev, types: typesResponse }));
      setCompletedSteps((prev) => new Set([...prev, 1]));

      // Step 3: Predict Service Classes
      setCurrentStep(2);
      const classesResponse = await mockAPICall("predict-service-class", {
        text: query,
        llm_cat_formatted: categoriesResponse.llm_cat,
        llm_types: typesResponse.llm_types,
      });
      const cleanedClassesResponse =
        removeDuplicateServiceClasses(classesResponse);
      setApiResponses((prev) => ({ ...prev, classes: cleanedClassesResponse }));
      setCompletedSteps((prev) => new Set([...prev, 2]));

      // Set service classes for table with streaming effect
      const classes = cleanedClassesResponse.llm_class;
      setServiceClasses([]);
      setTextGenerations([]);
      setIsGeneratingText(new Array(classes.length).fill(false));
      setCarouselSelections({});

      // Stream service classes one by one
      for (let i = 0; i < classes.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setServiceClasses((prev) => [...prev, classes[i]]);
        setCarouselSelections((prev) => ({ ...prev, [i]: 0 }));
      }

      // Step 4: Generate Text for each service class
      setCurrentStep(3);
      const textGenResponses = [];

      for (let i = 0; i < classes.length; i++) {
        setIsGeneratingText((prev) => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });

        const textResponse = await mockAPICall("generate-text", {
          text: query,
          llm_class: classes[i],
        });

        textGenResponses.push(textResponse);
        setTextGenerations((prev) => [...prev, textResponse]);

        setIsGeneratingText((prev) => {
          const newState = [...prev];
          newState[i] = false;
          return newState;
        });
      }

      const finalApiResponses = {
        categories: categoriesResponse,
        types: typesResponse,
        classes: cleanedClassesResponse,
        text: textGenResponses,
      };

      setApiResponses((prev) => ({ ...prev, text: textGenResponses }));
      setCompletedSteps((prev) => new Set([...prev, 3]));
      setCurrentStep(-1);
      setShowResponse(true);

      // Create initial version
      createNewVersion({
        serviceClasses: classes,
        textGenerations: textGenResponses,
        apiResponses: finalApiResponses,
        query,
      });

      // Save to pipeline history
      savePipelineToHistory({
        query,
        serviceClasses: classes,
        textGenerations: textGenResponses,
        apiResponses: finalApiResponses,
      });
    } catch (error) {
      console.error("API workflow error:", error);
    }
  };

  // Enhanced function to handle asking AI about selected items
  const handleAskAboutItems = async (selectedItemsData) => {
    if (!promptText.trim()) {
      alert("Please enter your question in the prompt box first.");
      return;
    }

    const selectedIndices = Object.keys(selectedItemsData).map((index) =>
      parseInt(index)
    );
    const userPrompt = promptText.trim();

    // Set loading states for selected items
    const newIsRegenerating = {};
    selectedIndices.forEach((index) => {
      newIsRegenerating[index] = true;
    });
    setIsRegeneratingItems(newIsRegenerating);

    try {
      const newTextGenerations = [...textGenerations];
      const regeneratedResponses = [];

      // Regenerate text for selected items
      for (let index of selectedIndices) {
        const serviceClass = serviceClasses[index];

        // Call API with additional user prompt
        const enhancedResponse = await mockAPICall("generate-text", {
          text: submittedQuery, // Original query
          user_prompt: userPrompt, // New user question
          llm_class: serviceClass,
        });

        newTextGenerations[index] = enhancedResponse;
        regeneratedResponses.push(enhancedResponse);

        // Update loading state
        setIsRegeneratingItems((prev) => ({
          ...prev,
          [index]: false,
        }));
      }

      // Update text generations
      setTextGenerations(newTextGenerations);

      const updatedApiResponses = {
        ...apiResponses,
        text: newTextGenerations,
      };

      // Create new version with the updated data
      createNewVersion({
        serviceClasses,
        textGenerations: newTextGenerations,
        apiResponses: updatedApiResponses,
        query: `${submittedQuery} [Enhanced with: ${userPrompt}]`,
      });

      // Save enhanced pipeline to history
      savePipelineToHistory({
        query: `${submittedQuery} [Enhanced with: ${userPrompt}]`,
        serviceClasses,
        textGenerations: newTextGenerations,
        apiResponses: updatedApiResponses,
      });

      // Clear the prompt
      setPromptText("");

      // Show success message
      alert(
        `Successfully regenerated ${selectedIndices.length} service item(s) based on your question.`
      );
    } catch (error) {
      console.error("Error regenerating items:", error);
      alert("Failed to regenerate service items. Please try again.");

      // Clear loading states
      setIsRegeneratingItems({});
    }
  };

  const handleViewDetails = (stepId, response) => {
    setModalData({ stepId, response });
    setShowResponseModal(true);
  };

  const handleShowInfo = (
    serviceClass,
    textGeneration,
    index,
    carouselIndex = 0
  ) => {
    let reason = null;
    if (apiResponses.types?.llm_types?.service_types) {
      const matchingServiceType =
        apiResponses.types.llm_types.service_types.find(
          (serviceType) => serviceType.service_type === serviceClass.Type
        );
      reason = matchingServiceType?.reason || null;
    }

    setSelectedServiceClass(serviceClass);
    setSelectedTextGeneration(textGeneration);
    setSelectedServiceClassReason(reason);
    setSelectedCarouselIndex(carouselIndex);
    setShowInfoDialog(true);
  };

  // Selection handlers
  const handleItemSelect = (index, isSelected) => {
    if (isSelected) {
      setSelectedItems((prev) => ({
        ...prev,
        [index]: { choice: null },
      }));
    } else {
      const newSelected = { ...selectedItems };
      delete newSelected[index];
      setSelectedItems(newSelected);
    }
  };

  const handleChoiceSelect = (index, choice) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: { ...prev[index], choice },
    }));
  };

  const handleCarouselSelect = (itemIndex, carouselIndex) => {
    setCarouselSelections((prev) => ({
      ...prev,
      [itemIndex]: carouselIndex,
    }));
  };

  const handleReview = () => {
    const reviewItems = Object.entries(selectedItems)
      .filter(([_, item]) => item.choice)
      .map(([index, item]) => {
        const itemIndex = parseInt(index);
        const carouselIndex = carouselSelections[itemIndex] || 0;
        const textGen = textGenerations[itemIndex];
        const selectedExistingService =
          textGen?.existing_services?.[carouselIndex];

        return {
          sno: itemIndex + 1,
          serviceType: serviceClasses[itemIndex].Type,
          choice: item.choice,
          textGen: textGen,
          serviceClass: serviceClasses[itemIndex],
          selectedExistingService: selectedExistingService,
        };
      });

    setReviewData(reviewItems);
    setActiveTab("review");
  };

  const handleBackToSelection = () => {
    setActiveTab("predictions");
  };

  // Enhanced prompt submit for follow-up questions
  const handleFollowUpSubmit = async () => {
    if (promptText.trim() && hasSubmittedPrompt) {
      // This is a follow-up question, handle differently
      if (Object.keys(selectedItems).length > 0) {
        await handleAskAboutItems(selectedItems);
      } else {
        // General follow-up question - you can implement this as needed
        alert(
          "Please select some items first, then ask your question to get AI-enhanced responses."
        );
      }
    } else {
      // Regular new prompt
      await handlePromptSubmit();
    }
  };

  const sidebarWidth = hasSubmittedPrompt
    ? sidebarExpanded
      ? "w-1/5"
      : "w-16"
    : sidebarExpanded
    ? "w-1/5"
    : "w-16";

  const promptAreaWidth = hasSubmittedPrompt ? "w-2/5" : "w-full";
  const responseAreaWidth = hasSubmittedPrompt ? "w-4/5" : "w-0";

  const currentChatHistory = getCurrentChatHistory();

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>

      <div className="h-screen flex bg-gray-50">
        {/* Left Sidebar - Enhanced with Chat Threads */}
        <div
          className={`${sidebarWidth} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}
        >
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MessageSquare size={20} className="text-gray-600" />
            </button>
          </div>

          <ChatThreadSidebar
            chatThreads={chatThreads}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            sidebarExpanded={sidebarExpanded}
          />
        </div>

        {/* Prompt Area */}
        <div
          className={`${promptAreaWidth} flex flex-col transition-all duration-300 max-h-screen`}
        >
          {!hasSubmittedPrompt ? (
            // Landing Page
            <div className="flex flex-col h-screen">
              <div className="bg-gradient-to-r from-blue-100/60 via-green-100/60 to-blue-100/60 border-b border-gray-200 px-6 py-4 min-h-[15vh]">
                <div className="flex items-center justify-end">
                  <div className="flex space-x-3">
                    <Info size={18} className="text-gray-500" />
                    <Settings size={18} className="text-gray-500" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src="khaber-logo.png"
                        alt="KHABER Logo"
                        className="h-20 w-auto"
                      />
                      <div>
                        <h1 className="text-4xl font-semibold text-gray-900">
                          Chat with{" "}
                          <span className="text-purple-600">KHABER</span>
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Streamline procurement and service classification with
                          AI-powered insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      KHABER Knowledge (Default Mode)
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Find or create Service line items with internal context
                      and business relevance
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Get response grounded in Khabers internal database
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Find matching Service line items .
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Create new Service Masters workflows.
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Create new Bill of Services workflows
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  {/* Attached Files Display */}
                  {attachedFiles.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Attached Files:
                      </div>
                      <div className="space-y-2">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText size={16} className="text-blue-600" />
                              <div>
                                <div className="text-sm font-medium text-blue-800">
                                  {file.name}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {(file.size / 1024).toFixed(1)} KB •{" "}
                                  {file.extractedText.split(" ").length} words
                                  extracted
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachedFile(index)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing Indicator */}
                  {isProcessingPDF && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2
                          size={16}
                          className="text-yellow-600 animate-spin"
                        />
                        <span className="text-sm text-yellow-800">
                          Processing PDF and extracting text...
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-300 rounded-xl shadow-lg">
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Paste your Statement of Work, contract details, or service descriptions for automatic classification and analysis!"
                      className="w-full p-4 text-gray-700 resize-none border-0 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handlePromptSubmit();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => setKnowledgeMode("aramco")}
                            className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                              knowledgeMode === "aramco"
                                ? "bg-[#0070f2] text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white"
                            }`}
                          >
                            Aramco Knowledge
                          </button>
                          <button
                            onClick={() => setKnowledgeMode("general")}
                            className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                              knowledgeMode === "general"
                                ? "bg-[#0070f2] text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white"
                            }`}
                          >
                            Non Aramco Knowledge
                          </button>
                        </div>

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessingPDF}
                          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessingPDF ? (
                            <Loader2 size={16} className="mr-1 animate-spin" />
                          ) : (
                            <Paperclip size={16} className="mr-1" />
                          )}
                          <span className="text-sm">
                            {isProcessingPDF ? "Processing..." : "Attach"}
                          </span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
                      <button
                        onClick={handlePromptSubmit}
                        disabled={!promptText.trim()}
                        style={{
                          backgroundColor: "#0070f2",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#005bb5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#0070f2")
                        }
                        className=" text-white px-5 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                      >
                        <Send size={16} className="mr-2" />
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface
            <div className="flex flex-col h-screen">
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="khaber-logo.png"
                      alt="KHABER Logo"
                      className="h-10 w-auto"
                    />
                    <span className="font-semibold text-gray-800">KHABER</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        knowledgeMode === "aramco"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {knowledgeMode === "aramco"
                        ? "Aramco Mode"
                        : "General Mode"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-6 py-4 overflow-y-auto bg-gray-50">
                <div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-3xl overflow-y-auto animate-slideDown"
                  style={{ maxHeight: "20vh" }}
                >
                  <div className="text-sm text-blue-800 font-medium mb-2">
                    Your Query:
                  </div>
                  <div className="text-blue-700">{submittedQuery}</div>
                </div>

                {/* Chain of Thought */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-3xl mb-4 animate-fadeIn">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <button
                      onClick={() =>
                        setChainOfThoughtExpanded(!chainOfThoughtExpanded)
                      }
                      className="w-full flex items-center justify-between hover:bg-gray-50 rounded p-2"
                    >
                      <span className="font-medium text-gray-700 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-blue-600" />
                        KHABER Chain of Thought Pipeline
                      </span>
                      {chainOfThoughtExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  </div>

                  {chainOfThoughtExpanded ? (
                    <div className="space-y-3">
                      {chainSteps.map((step, index) => (
                        <ChainOfThoughtStep
                          key={step.id}
                          step={step}
                          isActive={currentStep === index}
                          isCompleted={completedSteps.has(index)}
                          onViewDetails={handleViewDetails}
                          response={apiResponses[step.id]}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {currentStep >= 0 ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner />
                          <span>{chainSteps[currentStep]?.description}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>AI processing completed successfully</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {showResponse && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-3xl animate-slideUp">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <div className="text-sm font-medium text-gray-700">
                        Processing Complete
                      </div>
                    </div>
                    <div className="text-gray-600">
                      Service line items have been successfully predicted and
                      generated. You can now select items and ask follow-up
                      questions to get AI-enhanced responses. View the detailed
                      results in the response panel.
                    </div>
                  </div>
                )}

                {/* Compact Pipeline History - Shows after processing complete */}
                {showResponse && currentChatHistory.length > 0 && (
                  <CompactPipelineHistory
                    historyItems={currentChatHistory}
                    onViewDetails={handleViewHistoryDetails}
                    onRemoveItem={handleRemoveHistoryItem}
                  />
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="max-w-3xl">
                  {/* Selected Items Card */}
                  <SelectedItemsCard
                    selectedItems={selectedItems}
                    serviceClasses={serviceClasses}
                    textGenerations={textGenerations}
                    isExpanded={selectedItemsExpanded}
                    onToggle={() =>
                      setSelectedItemsExpanded(!selectedItemsExpanded)
                    }
                  />

                  {/* Attached Files Display */}
                  {attachedFiles.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Attached Files:
                      </div>
                      <div className="space-y-2">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText size={16} className="text-blue-600" />
                              <div>
                                <div className="text-sm font-medium text-blue-800">
                                  {file.name}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {(file.size / 1024).toFixed(1)} KB •{" "}
                                  {file.extractedText.split(" ").length} words
                                  extracted
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachedFile(index)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing Indicator */}
                  {isProcessingPDF && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2
                          size={16}
                          className="text-yellow-600 animate-spin"
                        />
                        <span className="text-sm text-yellow-800">
                          Processing PDF and extracting text...
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder={
                        Object.keys(selectedItems).length > 0
                          ? "Ask a question about the selected service items to get AI-enhanced responses..."
                          : "Ask another question..."
                      }
                      className="w-full p-4 border-0 rounded-t-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleFollowUpSubmit();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => setKnowledgeMode("aramco")}
                            className={`px-3 py-1 rounded-md transition-all text-sm ${
                              knowledgeMode === "aramco"
                                ? "bg-[#0070f2] text-white"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            Aramco
                          </button>
                          <button
                            onClick={() => setKnowledgeMode("general")}
                            className={`px-3 py-1 rounded-md transition-all text-sm ${
                              knowledgeMode === "general"
                                ? "bg-[#0070f2] text-white"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            Non-Aramco
                          </button>
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessingPDF}
                          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessingPDF ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Paperclip size={16} />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handleFollowUpSubmit}
                        disabled={!promptText.trim()}
                        style={{
                          backgroundColor: "#0070f2",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#005bb5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#0070f2")
                        }
                        className="text-white px-4 py-2 rounded-md hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <Send size={16} className="mr-1" />
                        {Object.keys(selectedItems).length > 0
                          ? "Enhance"
                          : "Send"}
                      </button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Response Area */}
        {hasSubmittedPrompt && (
          <div
            className={`${responseAreaWidth} bg-white border-l border-gray-200 flex flex-col transition-all duration-500`}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("predictions")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "predictions"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Selection Screen
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "review"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Review/Confirm Service Line Items
                  {reviewData.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {reviewData.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {activeTab === "predictions" && (
                <>
                  {/* Version Selector */}
                  <VersionSelector
                    versions={versions}
                    currentVersion={currentVersion}
                    onVersionChange={switchToVersion}
                  />

                  {serviceClasses.length > 0 ? (
                    <ServiceClassTable
                      serviceClasses={serviceClasses}
                      textGenerations={textGenerations}
                      onShowInfo={handleShowInfo}
                      isGeneratingText={isGeneratingText.map(
                        (loading, index) =>
                          loading || isRegeneratingItems[index] || false
                      )}
                      selectedItems={selectedItems}
                      onItemSelect={handleItemSelect}
                      onChoiceSelect={handleChoiceSelect}
                      onReview={handleReview}
                      carouselSelections={carouselSelections}
                      onCarouselSelect={handleCarouselSelect}
                      onAskAboutItems={handleAskAboutItems}
                    />
                  ) : currentStep >= 0 ? (
                    <SkeletonTable rows={3} />
                  ) : null}
                </>
              )}

              {activeTab === "review" && (
                <ReviewScreen
                  reviewData={reviewData}
                  onBack={handleBackToSelection}
                />
              )}
            </div>
          </div>
        )}

        {/* Response Details Modal */}
        <ResponseDetailsModal
          isOpen={showResponseModal}
          onClose={() => setShowResponseModal(false)}
          stepId={modalData.stepId}
          response={modalData.response}
        />

        {/* Service Class Info Dialog */}
        <ServiceClassInfoDialog
          isOpen={showInfoDialog}
          onClose={() => setShowInfoDialog(false)}
          serviceClass={selectedServiceClass}
          textGeneration={selectedTextGeneration}
          reason={selectedServiceClassReason}
          selectedCarouselIndex={selectedCarouselIndex}
        />

        {/* Pipeline History Details Modal */}
        {showHistoryModal && historyModalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl h-4/5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pipeline Generation Details - #{historyModalData.id}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6">
                  {/* Query Section */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      Original Query
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-700">{historyModalData.query}</p>
                    </div>
                  </div>

                  {/* Categories Section */}
                  {historyModalData.apiResponses?.categories && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">
                        Predicted Categories
                      </h4>
                      <CategoriesView
                        response={historyModalData.apiResponses.categories}
                      />
                    </div>
                  )}

                  {/* Types Section */}
                  {historyModalData.apiResponses?.types && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">
                        Service Types
                      </h4>
                      <TypesView
                        response={historyModalData.apiResponses.types}
                      />
                    </div>
                  )}

                  {/* Classes Section */}
                  {historyModalData.apiResponses?.classes && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">
                        Service Classes
                      </h4>
                      <ClassesView
                        response={historyModalData.apiResponses.classes}
                      />
                    </div>
                  )}

                  {/* Text Generation Section */}
                  {historyModalData.textGenerations &&
                    historyModalData.textGenerations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">
                          Generated Services
                        </h4>
                        <div className="space-y-4">
                          {historyModalData.textGenerations.map(
                            (textGen, index) => (
                              <div
                                key={index}
                                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                              >
                                <h5 className="font-medium text-orange-800 mb-3">
                                  Service Item #{index + 1} -{" "}
                                  {
                                    historyModalData.serviceClasses?.[index]
                                      ?.Type
                                  }
                                </h5>
                                <TextGenerationView response={textGen} />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
