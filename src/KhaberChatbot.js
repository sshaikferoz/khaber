import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Send,
  MessageSquare,
  X,
  Brain,
  Info,
  Settings,
  Paperclip,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";

// Import components
import { SkeletonTable } from "./components/Skeletons.js";
import {
  ExistingServicesCarousel,
  SelectedItemsCard,
  VersionSelector,
  SelectionHelpCard,
  ChainOfThoughtStep,
} from "./components/UI/index";
import {
  CategoriesView,
  TypesView,
  ClassesView,
  TextGenerationView,
} from "./components/ResponseViews";
import {
  ResponseDetailsModal,
  ServiceClassInfoDialog,
} from "./components/Modals.js";
import {
  ChatThreadSidebar,
  CompactPipelineHistory,
  ServiceClassTable,
  ReviewScreen,
} from "./components/Chat/index";

// Import utilities
import {
  saveChatThreadsToStorage,
  loadChatThreadsFromStorage,
  saveCurrentChatIdToStorage,
  loadCurrentChatIdFromStorage,
  createNewChatThread,
  saveVariantsToStorage,
  loadVariantsFromStorage,
  clearVariantsStorage,
  addToPipelineHistory,
} from "./utils/storage";
import {
  apiCall,
  mockAPICall,
  removeDuplicateServiceClasses,
} from "./utils/mockApi";

import { USE_MOCK_API } from "./utils/constants";

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

  //Fetch function based on environment
  const fetchFn = USE_MOCK_API ? mockAPICall : apiCall;

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

  // Load chat threads and set current chat on component mount
  useEffect(() => {
    const loadedChatThreads = loadChatThreadsFromStorage();
    const loadedCurrentChatId = loadCurrentChatIdFromStorage();

    if (Object.keys(loadedChatThreads).length === 0) {
      const newChat = createNewChatThread();
      const initialChatThreads = { [newChat.id]: newChat };
      setChatThreads(initialChatThreads);
      setCurrentChatId(newChat.id);
      saveChatThreadsToStorage(initialChatThreads);
      saveCurrentChatIdToStorage(newChat.id);
    } else {
      setChatThreads(loadedChatThreads);
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

  // Get current chat's pipeline history
  const getCurrentChatHistory = () => {
    return currentChatId && chatThreads[currentChatId]
      ? chatThreads[currentChatId].pipelineHistory || []
      : [];
  };

  // PDF processing functions
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

    const selectedChat = chatThreads[chatId];
    if (selectedChat) {
      setHasSubmittedPrompt(selectedChat.hasSubmittedPrompt || false);
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

      clearVariantsStorage();
      setVersions([]);
      setCurrentVersion(0);

      const newPrompt = promptText;
      setPromptText("");

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

      const categoriesResponse = await fetchFn("predict-service-categories", {
        text: query,
      });
      setApiResponses((prev) => ({ ...prev, categories: categoriesResponse }));
      setCompletedSteps((prev) => new Set([...prev, 0]));

      // Step 2: Predict Service Types
      setCurrentStep(1);
      const typesResponse = await fetchFn("predict-service-types", {
        text: query,
        llm_cat_formatted: categoriesResponse.llm_cat,
      });

      setApiResponses((prev) => ({ ...prev, types: typesResponse }));
      setCompletedSteps((prev) => new Set([...prev, 1]));

      // Step 3: Predict Service Classes
      setCurrentStep(2);
      const classesResponse = await fetchFn("predict-service-class", {
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

        const textResponse = await fetchFn("generate-text", {
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
        const enhancedResponse = await fetchFn("generate-text", {
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
    } catch (error) {
      console.error("Error regenerating items:", error);
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

  const handleUpdateGeneratedText = (index, newText) => {
    // Update the textGenerations state
    setTextGenerations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], new: newText };
      return updated;
    });

    // Also update the current version if versions exist
    if (versions.length > 0) {
      setVersions((prev) => {
        const updated = [...prev];
        if (updated[currentVersion]) {
          const updatedTextGenerations = [
            ...(updated[currentVersion].textGenerations || []),
          ];
          updatedTextGenerations[index] = {
            ...updatedTextGenerations[index],
            new: newText,
          };
          updated[currentVersion] = {
            ...updated[currentVersion],
            textGenerations: updatedTextGenerations,
          };
        }
        return updated;
      });
    }

    // Optionally, you can also update the apiResponses to keep everything in sync
    setApiResponses((prev) => {
      if (prev.text && prev.text[index]) {
        const updatedText = [...prev.text];
        updatedText[index] = { ...updatedText[index], new: newText };
        return { ...prev, text: updatedText };
      }
      return prev;
    });
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
        const selectedExistingService = textGen?.existing?.[carouselIndex];

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
                          style={{
                            backgroundColor:  knowledgeMode === "aramco" ? '#0070f2':''
                          }}
                            onClick={() => setKnowledgeMode("aramco")}
                            className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                              knowledgeMode === "aramco"
                                ? "bg-blue text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white"
                            }`}
                          >
                            Aramco Knowledge
                          </button>
                          <button
                            onClick={() => setKnowledgeMode("general")}
                            style={{
                              backgroundColor:  knowledgeMode === "general" ? '#0070f2':''
                            }}
                            className={`px-3 py-2 rounded-md transition-all text-sm font-medium ${
                              knowledgeMode === "general"
                                ? "text-white shadow-sm"
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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span>{chainSteps[currentStep]?.description}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 text-green-500">✓</div>
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
                          ? "Select service line items above, then ask questions to get AI-enhanced responses..."
                          : "Select line items from the selection screen, then ask your enhancement question here..."
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
                            style={{
                              backgroundColor:  knowledgeMode === "aramco" ? '#0070f2':''
                            }}
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
                            style={{
                              backgroundColor:  knowledgeMode === "general" ? '#0070f2':''
                            }}
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

                  <SelectionHelpCard
                    hasSelections={Object.values(selectedItems).some(
                      (item) => item.choice
                    )}
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
                      onUpdateGeneratedText={handleUpdateGeneratedText} // Add this line
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
