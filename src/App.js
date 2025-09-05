import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Edit3,
  Paperclip,
  Send,
  MessageSquare,
  Search,
  Check,
  X,
  Brain,
  Zap,
  Info,
  Settings,
} from "lucide-react";

// Static data for service line items
const staticServiceData = [
  {
    header: true,
    sub_header: false,
    header_title: "Test Hari",
    sub_header_title: "",
    header_id: "1",
    sub_header_id: "",
    sm_number: "",
    parent_id: "",
    service_master: "",
    reference_service: "",
    service_group: "",
    standardized_text: "",
  },
  {
    header: false,
    sub_header: true,
    header_title: "",
    sub_header_title: "Test Hari Node",
    header_id: "",
    sub_header_id: "1.1",
    sm_number: "",
    parent_id: "1",
    service_master: "",
    reference_service: "",
    service_group: "",
    standardized_text: "",
  },
  {
    header: false,
    sub_header: false,
    header_title: "",
    sub_header_title: "",
    header_id: "",
    sub_header_id: "",
    sm_number: "1143313",
    parent_id: "1.1",
    service_master: "HIRE RIG ONSHORE",
    reference_service: "1EDP",
    service_group: "951000",
    standardized_text:
      "A01 | HIRE:RIG:ONSHORE | 71122900 | B091000 | B.12.29.00 | EA",
  },
  {
    header: false,
    sub_header: false,
    header_title: "",
    sub_header_title: "",
    header_id: "",
    sub_header_id: "",
    sm_number: "1143314",
    parent_id: "1.1",
    service_master: "BRKOUT CONC:RF:HNDTL:XHL DMPA:CS BRK&CTN",
    reference_service: "1EDP",
    service_group: "951000",
    standardized_text:
      "A01 | HIRE:RIG:ONSHORE | 71122900 | B091000 | B.12.29.00 | EA",
  },
  {
    header: false,
    sub_header: true,
    header_title: "",
    sub_header_title: "Test Hari Node 2",
    header_id: "",
    sub_header_id: "1.2",
    sm_number: "",
    parent_id: "1",
    service_master: "",
    reference_service: "",
    service_group: "",
    standardized_text: "",
  },
  {
    header: false,
    sub_header: false,
    header_title: "",
    sub_header_title: "",
    header_id: "",
    sub_header_id: "",
    sm_number: "4000103",
    parent_id: "1.2",
    service_master: "ARAMCO VSL-DIVE MED PRAC - NON-SAUDI",
    reference_service: "6PRS",
    service_group: "991000",
    standardized_text:
      "M58 | HIRE:MVPR:SPLZD | 80111620 | M7810.02 | H.11.16.20 | DAY",
  },
  {
    header: false,
    sub_header: false,
    header_title: "",
    sub_header_title: "",
    header_id: "",
    sub_header_id: "",
    sm_number: "4000104",
    parent_id: "1.2",
    service_master: "ARAMCO VSL-DIVE MED PRAC - SAUDI",
    reference_service: "6PRS",
    service_group: "991000",
    standardized_text:
      "M58 | HIRE:MVPR:SPLZD | 80111620 | M7810.02 | H.11.16.20 | DAY",
  },
];

// Sample service masters for search help
const sampleServiceMasters = [
  {
    sm_number: "1143315",
    service_master: "drilling equipment rental",
    reference_service: "1edp",
    service_group: "951000",
  },
  {
    sm_number: "1143316",
    service_master: "offshore platform services",
    reference_service: "2edp",
    service_group: "952000",
  },
  {
    sm_number: "4000105",
    service_master: "safety inspection services",
    reference_service: "6prs",
    service_group: "991000",
  },
];

// Animated thinking component
const AnimatedThinking = ({
  isThinking = true,
  isCompact = false,
  isCompleted = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Analyzing query context and requirements...",
    "Searching service master database...",
    "Applying business rules and standards...",
    "Matching relevant service categories...",
    "Generating structured recommendations...",
  ];

  useEffect(() => {
    if (!isThinking || isCompleted) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isThinking, isCompleted, steps.length]);

  // If completed, show all steps as done
  const displayCurrentStep = isCompleted ? steps.length : currentStep;

  if (isCompact) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600 py-2">
        <div className="relative">
          <Brain className="w-4 h-4 text-blue-600" />
          {isThinking && !isCompleted && (
            <div className="absolute -top-0.5 -right-0.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute top-0 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
          {isCompleted && (
            <div className="absolute -top-0.5 -right-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
        <span className={isCompleted ? "text-green-600" : "animate-pulse"}>
          {isCompleted ? "Analysis completed successfully" : steps[currentStep]}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="relative">
          <Brain className="w-5 h-5 text-blue-600" />
          {isThinking && !isCompleted && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute top-0 w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          )}
          {isCompleted && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-700 font-medium mb-2">
          {isCompleted ? "AI Analysis Complete" : "AI Thought Process"}
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 text-sm transition-all duration-500 ${
                index <= displayCurrentStep || isCompleted
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index < displayCurrentStep || isCompleted
                    ? "bg-green-500"
                    : index === displayCurrentStep && !isCompleted
                    ? "bg-blue-500 animate-pulse"
                    : "bg-gray-300"
                }`}
              />
              <span>{step}</span>
              {(index < displayCurrentStep || isCompleted) && (
                <Check className="w-4 h-4 text-green-500" />
              )}
              {index === displayCurrentStep && isThinking && !isCompleted && (
                <Zap className="w-4 h-4 text-blue-500 animate-bounce" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TreeNode = ({
  item,
  level = 0,
  onEdit,
  onDelete,
  onAdd,
  expandedNodes,
  onToggle,
}) => {
  const isExpanded =
    expandedNodes[item.header_id || item.sub_header_id || item.sm_number];
  const hasChildren = item.header || item.sub_header;

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(item.header_id || item.sub_header_id);
    }
  };

  if (item.header) {
    return (
      <div className="tree-node">
        <div
          className="tree-row header-row flex items-center p-3 hover:bg-gray-50 cursor-pointer border-l-4 border-blue-500"
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={handleToggle}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            ))}
          <span className="font-semibold text-blue-700 ml-2">
            {item.header_title}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item.header_id);
            }}
            className="ml-auto text-green-600 hover:text-green-800 hover:bg-green-50 p-1 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (item.sub_header) {
    return (
      <div className="tree-node">
        <div
          className="tree-row sub-header-row flex items-center p-3 hover:bg-gray-50 cursor-pointer border-l-4 border-indigo-400"
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={handleToggle}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            ))}
          <span className="font-medium text-indigo-600 ml-2">
            {item.sub_header_title}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item.sub_header_id);
            }}
            className="ml-auto text-green-600 hover:text-green-800 hover:bg-green-50 p-1 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tree-node">
      <div
        className="tree-row service-row grid gap-2 p-3 hover:bg-gray-50 border-b border-gray-100"
        style={{
          paddingLeft: `${level * 20 + 12}px`,
          gridTemplateColumns: "120px 80px 80px 1fr 80px",
        }}
      >
        <div className="font-medium text-gray-800 text-sm truncate">
          {item.service_master}
        </div>
        <div className="text-gray-600 text-sm">{item.reference_service}</div>
        <div className="text-gray-600 text-sm">{item.service_group}</div>
        <div className="text-gray-600 text-xs break-words">
          {item.standardized_text}
        </div>
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(item.sm_number)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
          >
            <Minus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceLineTree = ({ data, onEdit, onDelete, onAdd }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    1: true,
    1.1: true,
    1.2: true,
  });

  const handleToggle = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const buildTree = (items) => {
    const tree = [];
    const headers = items.filter((item) => item.header);

    headers.forEach((header) => {
      tree.push(header);

      if (expandedNodes[header.header_id]) {
        // Add direct service masters under this header
        const directServices = items.filter(
          (item) =>
            !item.header &&
            !item.sub_header &&
            item.parent_id === header.header_id
        );
        directServices.forEach((service) => {
          tree.push({ ...service, level: 1 });
        });

        // Add sub-headers under this header
        const subHeaders = items.filter(
          (item) => item.sub_header && item.parent_id === header.header_id
        );

        subHeaders.forEach((subHeader) => {
          tree.push({ ...subHeader, level: 1 });

          if (expandedNodes[subHeader.sub_header_id]) {
            // Add service masters under this sub-header
            const subServices = items.filter(
              (item) =>
                !item.header &&
                !item.sub_header &&
                item.parent_id === subHeader.sub_header_id
            );
            subServices.forEach((service) => {
              tree.push({ ...service, level: 2 });
            });
          }
        });
      }
    });

    return tree;
  };

  const treeItems = buildTree(data);

  return (
    <div className="tree-container bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="tree-body flex-1 overflow-y-auto">
        {treeItems.map((item, index) => (
          <React.Fragment
            key={`${
              item.header_id || item.sub_header_id || item.sm_number
            }-${index}`}
          >
            {index === 1 && (
              <div
                className="tree-header grid gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 font-semibold text-gray-700 border-b border-gray-200 rounded-t-lg text-sm"
                style={{ gridTemplateColumns: "120px 80px 80px 1fr 80px" }}
              >
                <div>Service Master</div>
                <div>Ref Service</div>
                <div>Group</div>
                <div>Standardized Text</div>
                <div className="text-center">Actions</div>
              </div>
            )}

            <TreeNode
              item={item}
              level={item.level || 0}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
              expandedNodes={expandedNodes}
              onToggle={handleToggle}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ServiceMasterSearchDialog = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMasters, setFilteredMasters] = useState(sampleServiceMasters);

  React.useEffect(() => {
    const filtered = sampleServiceMasters.filter(
      (master) =>
        master.service_master
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        master.sm_number.includes(searchTerm)
    );
    setFilteredMasters(filtered);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Service Master</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search service masters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredMasters.map((master) => (
            <div
              key={master.sm_number}
              onClick={() => onSelect(master)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 rounded-md"
            >
              <div className="font-medium">{master.service_master}</div>
              <div className="text-sm text-gray-600">
                SM: {master.sm_number} | Group: {master.service_group}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function KhaberChatbot() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState("existing");
  const [chainOfThoughtExpanded, setChainOfThoughtExpanded] = useState(false);
  const [serviceItemsExpanded, setServiceItemsExpanded] = useState(false); // Changed to false initially
  const [promptText, setPromptText] = useState("");
  const [knowledgeMode, setKnowledgeMode] = useState("aramco");
  const [serviceData, setServiceData] = useState(staticServiceData);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [editingParentId, setEditingParentId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showChainOfThought, setShowChainOfThought] = useState(false); // New state to control chain of thought visibility
  const [chainOfThoughtCompleted, setChainOfThoughtCompleted] = useState(false); // New state to track completion
  const fileInputRef = useRef(null);

  const handlePromptSubmit = () => {
    if (promptText.trim()) {
      setSubmittedQuery(promptText);
      setHasSubmittedPrompt(true);
      setIsThinking(true);
      setShowChainOfThought(true); // Show chain of thought
      setChainOfThoughtCompleted(false); // Reset completion state
      setChainOfThoughtExpanded(false);
      setShowResponse(false);
      setServiceItemsExpanded(false); // Keep service items collapsed initially

      // Clear the input
      setPromptText("");

      // Simulate API response delay
      setTimeout(() => {
        setIsThinking(false);
        setChainOfThoughtCompleted(true); // Mark chain of thought as completed
        setShowResponse(true);
      }, 8000);
    }
  };

  const handleEditService = (item) => {
    console.log("Editing service:", item);
  };

  const handleDeleteService = (smNumber) => {
    setServiceData((prev) =>
      prev.filter((item) => item.sm_number !== smNumber)
    );
  };

  const handleAddService = (parentId) => {
    setEditingParentId(parentId);
    setShowSearchDialog(true);
  };

  const handleServiceMasterSelect = (master) => {
    const newService = {
      header: false,
      sub_header: false,
      header_title: "",
      sub_header_title: "",
      header_id: "",
      sub_header_id: "",
      sm_number: master.sm_number,
      parent_id: editingParentId,
      service_master: master.service_master,
      reference_service: master.reference_service,
      service_group: master.service_group,
      standardized_text: `${master.service_group} | ${master.service_master} | sample text`,
    };

    setServiceData((prev) => [...prev, newService]);
    setShowSearchDialog(false);
    setEditingParentId(null);
  };

  const sidebarWidth = hasSubmittedPrompt
    ? sidebarExpanded
      ? "w-1/5"
      : "w-16"
    : sidebarExpanded
    ? "w-1/5"
    : "w-16";

  const promptAreaWidth = hasSubmittedPrompt ? "w-2/5" : "w-full";
  const responseAreaWidth = hasSubmittedPrompt ? "w-3/5" : "w-0";

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
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>
      <div className="h-screen flex bg-gray-50">
        {/* Left Sidebar */}
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

          {sidebarExpanded && (
            <div className="flex-1 p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Chat History</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="text-sm font-medium">Previous Chat 1</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="text-sm font-medium">Previous Chat 2</div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Area */}

        <div
          className={`${promptAreaWidth} flex flex-col transition-all duration-300 max-h-screen`}
        >
          {!hasSubmittedPrompt ? (
            // Landing Page - Optimized for single page view
            <div className="flex flex-col h-screen">
              {/* Compact Hero Banner */}
              <div className="bg-gradient-to-r from-blue-100/60 via-green-100/60 to-blue-100/60 border-b border-gray-200 px-6 py-4 min-h-[15vh]">
                <div className="flex items-center justify-end">
                  <div className="flex space-x-3">
                    {/* <MessageSquare size={18} className="text-gray-500" /> */}
                    <Info size={18} className="text-gray-500" />
                    <Settings size={18} className="text-gray-500" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {/* <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">K</span> */}
                      <img
                        src="khaber-logo.png"
                        alt="KHABER"
                        className="h-24 w-auto"
                      />
                      {/* </div> */}
                      <div>
                        <h1 className="text-4xl font-semibold text-gray-900">
                          Chat with{" "}
                          <span className="text-purple-600">KHABER</span>
                        </h1>
                        <p className="text-gray-600 text-sm">
                          Fuel your productivity and make smarter decisions with
                          ease.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Optimized spacing */}
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Features List - Compact */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      KHABER Knowledge (Default Mode)
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Answers with internal context and business relevance.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Ask questions about OUs, manuals, and internal
                          engineering standards.
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Get responses grounded in KHABER's internal documents.
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Tag specific internal documents using "@" to tailor
                          responses.
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">
                          Ask for assistance in writing highlights.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Input - Fixed at bottom */}
              <div className="px-6 pb-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white border border-gray-300 rounded-xl shadow-lg">
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Ask me about OUs, manuals, engineering standards and procedures and more!"
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
                        {/* Knowledge Mode Selector */}
                        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => setKnowledgeMode("aramco")}
                            className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                              knowledgeMode === "aramco"
                                ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white"
                            }`}
                          >
                            Aramco Knowledge
                          </button>
                          <button
                            onClick={() => setKnowledgeMode("general")}
                            className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                              knowledgeMode === "general"
                                ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white"
                            }`}
                          >
                            Non Aramco Knowledge
                          </button>
                        </div>

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-md"
                        >
                          <Paperclip size={16} className="mr-1" />
                          <span className="text-sm">Attach</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            console.log("File selected:", e.target.files[0]);
                          }}
                        />
                      </div>
                      <button
                        onClick={handlePromptSubmit}
                        disabled={!promptText.trim()}
                        className="bg-[#0070f2] hover:bg-[#005bb5] text-white px-5 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
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
            // Compact Chat Interface
            <div className="flex flex-col h-screen">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <img
                    src="khaber-logo.png"
                    alt="KHABER"
                    className="w-auto h-12"
                  />
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

              {/* Chat Content */}
              <div className="flex-1 px-6 py-4 overflow-y-auto bg-gray-50">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-3xl">
                  <div className="text-sm text-blue-800 font-medium mb-2">
                    Your Query:
                  </div>
                  <div className="text-blue-700">{submittedQuery}</div>
                </div>

                {/* Chain of Thought in Prompt Area - Keep visible even after completion */}
                {showChainOfThought && (
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
                          {chainOfThoughtCompleted
                            ? "AI Analysis Complete"
                            : "AI is thinking..."}
                        </span>
                        {chainOfThoughtExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      {!chainOfThoughtExpanded && (
                        <div className="mt-2">
                          <AnimatedThinking
                            isThinking={isThinking}
                            isCompleted={chainOfThoughtCompleted}
                            isCompact={true}
                          />
                        </div>
                      )}
                    </div>
                    {chainOfThoughtExpanded && (
                      <div className="animate-slideDown">
                        <AnimatedThinking
                          isThinking={isThinking}
                          isCompleted={chainOfThoughtCompleted}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Response area */}
                {showResponse && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-3xl animate-slideUp">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <div className="text-sm font-medium text-gray-700">
                        Response Ready
                      </div>
                    </div>
                    <div className="text-gray-600">
                      Analysis completed successfully. Service line items have
                      been generated and are available in the response panel.
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="max-w-3xl">
                  <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Ask another question..."
                      className="w-full p-4 border-0 rounded-t-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handlePromptSubmit();
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
                                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            Aramco
                          </button>
                          <button
                            onClick={() => setKnowledgeMode("general")}
                            className={`px-3 py-1 rounded-md transition-all text-sm ${
                              knowledgeMode === "general"
                                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                          >
                            Non-Aramco
                          </button>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-md transition-colors">
                          <Paperclip size={16} />
                        </button>
                      </div>
                      <button
                        onClick={handlePromptSubmit}
                        disabled={!promptText.trim()}
                        className="bg-[#0070f2] hover:bg-[#005bb5] text-white px-4 py-2 rounded-md hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <Send size={16} className="mr-1" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Response Area */}
        {hasSubmittedPrompt && (
          <div
            className={`${responseAreaWidth} bg-white border-l border-gray-200 flex flex-col transition-all duration-500 transform ${
              showResponse
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-70"
            }`}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("existing")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "existing"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Service Line Item (Existing)
                </button>
                <button
                  onClick={() => setActiveTab("new")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "new"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Service Line Item (New)
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Service Line Items Panel */}
              <div className="flex-1 flex flex-col m-4 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <button
                  onClick={() => setServiceItemsExpanded(!serviceItemsExpanded)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-200 rounded-t-lg"
                >
                  <span className="font-medium text-gray-700 flex items-center">
                    {showResponse && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    )}
                    Service Line Items
                  </span>
                  {serviceItemsExpanded ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
                {serviceItemsExpanded && (
                  <div className="flex-1 p-4 overflow-hidden">
                    <ServiceLineTree
                      data={serviceData}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      onAdd={handleAddService}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Service Master Search Dialog */}
        <ServiceMasterSearchDialog
          isOpen={showSearchDialog}
          onClose={() => setShowSearchDialog(false)}
          onSelect={handleServiceMasterSelect}
        />
      </div>
    </>
  );
}
