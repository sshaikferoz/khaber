import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Database,
  Clock,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Brain,
  Check,
  Info,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { ExistingServicesCarousel } from "../UI/index";
import { ItemSkeletonRow } from "../Skeletons.js";
import { apiCall } from "../../utils/mockApi.js"; // Import the API utility

// Utility function to truncate leading zeros from service master number
const truncateServiceNumber = (source) => {
  if (!source) return "N/A";
  // Remove leading zeros by converting to number and back to string
  return parseInt(source, 10).toString();
};

// Chat Thread Sidebar Component
export const ChatThreadSidebar = ({
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
// Service Master Creation Results Dialog
const ServiceMasterResultsDialog = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null;

  const successCount = results.filter(
    (result) => result.status === "success"
  ).length;
  const errorCount = results.filter(
    (result) => result.status === "error"
  ).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Service Master Creation Results
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {successCount} successful, {errorCount} failed out of{" "}
                {results.length} items
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.status === "success"
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {result.status === "success" ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <AlertCircle className="text-red-600" size={20} />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Line Item {result.sno} - {result.serviceType}
                      </h4>
                      {result.status === "success" ? (
                        <div className="text-sm text-green-700 mt-1">
                          <span className="font-medium">
                            Service Master Created:{" "}
                          </span>
                          {result.serviceMasterId || "SM-" + Date.now() + index}
                        </div>
                      ) : (
                        <div className="text-sm text-red-700 mt-1">
                          <span className="font-medium">Error: </span>
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pl-8">
                  <div className="text-xs text-gray-600 bg-white rounded p-2 max-h-20 overflow-y-auto">
                    {result.serviceText}
                  </div>
                </div>

                {result.status === "success" && result.response && (
                  <div className="mt-3 pl-8">
                    <div className="text-xs text-gray-500">
                      <strong>Created At:</strong> {new Date().toLocaleString()}
                    </div>
                    {result.response.additional_info && (
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Additional Info:</strong>{" "}
                        {result.response.additional_info}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Process completed. {successCount} service masters created
            successfully.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Pipeline History Component for Chat Interface
export const CompactPipelineHistory = ({
  historyItems,
  onViewDetails,
  onRemoveItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!historyItems || historyItems.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-3xl my-4 animate-fadeIn">
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
          {historyItems.map((historyItem) => {
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
              {historyItems[0]
                ? new Date(historyItems[0].timestamp).toLocaleString()
                : "No history"}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {historyItems[0]?.serviceClasses?.length || 0} items generated
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Service Class Results Table with Editing Capability
export const ServiceClassTable = ({
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
  onUpdateGeneratedText, // New prop for handling text updates
}) => {
  const [editingItems, setEditingItems] = useState({}); // Track which items are being edited
  const [editValues, setEditValues] = useState({}); // Track edited values

  const hasSelectedItems = Object.keys(selectedItems).length > 0;
  const hasValidSelections = Object.values(selectedItems).some(
    (item) => item.choice
  );

  // Handle starting edit mode
  const handleStartEdit = (index, currentText) => {
    setEditingItems((prev) => ({ ...prev, [index]: true }));
    setEditValues((prev) => ({ ...prev, [index]: currentText }));
  };

  // Handle canceling edit
  const handleCancelEdit = (index) => {
    setEditingItems((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
    setEditValues((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  // Handle saving edited text
  const handleSaveEdit = (index) => {
    const newText = editValues[index];
    if (newText && newText.trim() !== "") {
      // Call the parent component's update function
      onUpdateGeneratedText(index, newText.trim());
    }

    // Exit edit mode
    setEditingItems((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
    setEditValues((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  // Handle text area value change
  const handleTextChange = (index, value) => {
    setEditValues((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div className="space-y-4">
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
                const isEditing = editingItems[index];
                const editValue = editValues[index] || "";

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
                              services={textGen.existing}
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
                          {isEditing ? (
                            // Edit Mode
                            <div className="space-y-2">
                              <textarea
                                value={editValue}
                                onChange={(e) =>
                                  handleTextChange(index, e.target.value)
                                }
                                className="w-full text-xs text-gray-700 bg-yellow-50 border border-yellow-300 rounded p-2 min-h-[80px] resize-y focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                placeholder="Edit the AI generated service line item..."
                                rows={4}
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(index)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors"
                                  title="Save changes"
                                >
                                  <Save size={12} />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => handleCancelEdit(index)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md transition-colors"
                                  title="Cancel editing"
                                >
                                  <X size={12} />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="relative group">
                              <div className="text-xs text-gray-600 bg-blue-50 rounded p-2 max-h-32 overflow-auto">
                                {textGen.new}
                              </div>
                              <button
                                onClick={() =>
                                  handleStartEdit(index, textGen.new)
                                }
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-gray-100 rounded-md transition-all shadow-sm border border-gray-200"
                                title="Edit AI generated text"
                              >
                                <Edit3 size={12} className="text-gray-600" />
                              </button>
                            </div>
                          )}

                          {isSelected && !isEditing && (
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

// Review Screen Component with Service Master Creation
export const ReviewScreen = ({ reviewData, onBack, onComplete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [creationResults, setCreationResults] = useState([]);

  // Function to create service masters for new items
  const handleConfirmAndSubmit = async () => {
    setIsCreating(true);

    // Filter items that need new service masters
    const newItems = reviewData.filter((item) => item.choice === "new");

    if (newItems.length === 0) {
      alert("No new service masters to create.");
      setIsCreating(false);
      return;
    }

    const results = [];

    try {
      // Process each new item
      for (const item of newItems) {
        try {
          // Create payload for the API call
          const payload = {
            create_text: item.textGen?.create_text || {},
            new: item.textGen?.new || item.serviceText,
          };

          console.log(`Creating service master for item ${item.sno}:`, payload);

          // Call the create_service_master endpoint
          const response = await apiCall("create_service_master", payload);

          results.push({
            sno: item.sno,
            serviceType: item.serviceType,
            serviceText: item.textGen?.new || item.serviceText,
            status: "success",
            response: response,
            serviceMasterId:
              response.service_master_id ||
              response.id ||
              `SM-${Date.now()}-${item.sno}`,
          });
        } catch (error) {
          console.error(
            `Error creating service master for item ${item.sno}:`,
            error
          );
          results.push({
            sno: item.sno,
            serviceType: item.serviceType,
            serviceText: item.textGen?.new || item.serviceText,
            status: "error",
            error: error.message || "Failed to create service master",
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error during service master creation:", error);
    }

    setCreationResults(results);
    setIsCreating(false);
    setShowResults(true);
  };

  // Function to download results as JSON/CSV
  const handleDownloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_items: reviewData.length,
        new_items_processed: creationResults.length,
        successful_creations: creationResults.filter(
          (r) => r.status === "success"
        ).length,
        failed_creations: creationResults.filter((r) => r.status === "error")
          .length,
      },
      results: creationResults,
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `service_master_creation_report_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    if (onComplete) {
      onComplete(creationResults);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isCreating}
          >
            <ArrowLeft size={16} />
            <span>Back to Selection</span>
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            disabled={isCreating}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handleConfirmAndSubmit}
            disabled={isCreating}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader className="animate-spin" size={16} />
                <span>Creating Service Masters...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Confirm & Submit</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="font-semibold text-gray-800">
            Review Selected Service Line Items
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Please review your selections before confirming.
            {reviewData.filter((item) => item.choice === "new").length > 0 && (
              <span className="font-medium text-green-700">
                {" "}
                {reviewData.filter((item) => item.choice === "new").length} new
                service master(s) will be created.
              </span>
            )}
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
                      {item.choice === "matching" ? "Existing SM" : "New SM"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      {item.choice === "matching" &&
                        item.selectedExistingService && (
                          <div className="text-xs font-medium text-gray-500">
                            Service Master:{" "}
                            {truncateServiceNumber(
                              item.selectedExistingService.metadata?.source
                            )}{" "}
                            - {item.selectedExistingService.relevance}
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
                          ? item.selectedExistingService?.service_text
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

      {/* Service Master Creation Results Dialog */}
      <ServiceMasterResultsDialog
        isOpen={showResults}
        onClose={handleCloseResults}
        results={creationResults}
      />
    </div>
  );
};
