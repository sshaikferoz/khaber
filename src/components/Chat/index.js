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
            className={`group p-3 rounded-md cursor-pointer transition-colors relative ${currentChatId === chat.id
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

  // Helper function to extract message from response
  const extractResponseMessage = (response) => {
    try {
      return (
        response?.data?.d?.NavHeader?.results?.[0]?.NavReturn?.results?.[0]
          ?.Message || "No message available"
      );
    } catch (e) {
      return "Unable to extract message";
    }
  };

  // Helper function to extract message type (S=Success, E=Error, W=Warning)
  const extractMessageType = (response) => {
    try {
      return (
        response?.data?.d?.NavHeader?.results?.[0]?.NavReturn?.results?.[0]
          ?.Type || "I"
      );
    } catch (e) {
      return "I";
    }
  };

  // Helper function to extract Change Request ID
  const extractChangeRequestId = (response) => {
    try {
      return response?.data?.d?.UsmdCrequest || "N/A";
    } catch (e) {
      return "N/A";
    }
  };

  // Helper function to extract Service Master Number (Asnum)
  const extractServiceMasterNumber = (response) => {
    try {
      return response?.data?.d?.NavHeader?.results?.[0]?.Asnum || "N/A";
    } catch (e) {
      return "N/A";
    }
  };

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

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
          <div className="space-y-4">
            {results.map((result, index) => {
              const messageType = result.response
                ? extractMessageType(result.response)
                : null;
              const responseMessage = result.response
                ? extractResponseMessage(result.response)
                : null;
              // const changeRequestId = result.response ? extractChangeRequestId(result.response) : null;
              const serviceMasterNumber = result.response
                ? extractChangeRequestId(result.response)
                : null;

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${result.status === "success"
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {result.status === "success" ? (
                        <CheckCircle
                          className="text-green-600 flex-shrink-0"
                          size={20}
                        />
                      ) : (
                        <AlertCircle
                          className="text-red-600 flex-shrink-0"
                          size={20}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          Line Item {result.sno} - {result.serviceType}
                        </h4>

                        {result.status === "success" ? (
                          <div className="mt-2 space-y-2">
                            {/* System Response Message */}
                            {responseMessage && (
                              <div className="bg-white rounded-md p-3 border border-green-300">
                                <div className="flex items-start space-x-2">
                                  <Info
                                    size={14}
                                    className="text-green-600 mt-0.5 flex-shrink-0"
                                  />
                                  <div className="text-sm text-gray-700">
                                    <span className="font-medium text-green-700">
                                      System Message:{" "}
                                    </span>
                                    {responseMessage}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Key Details */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {/* {changeRequestId && changeRequestId !== "N/A" && (
                                <div className="bg-white rounded p-2 border border-green-200">
                                  <span className="text-xs text-gray-500">Change Request ID:</span>
                                  <div className="font-medium text-green-700">{changeRequestId}</div>
                                </div>
                              )} */}

                              {serviceMasterNumber &&
                                serviceMasterNumber !== "N/A" && (
                                  <div className="bg-white rounded p-2 border border-green-200">
                                    <span className="text-xs text-gray-500">
                                      Service Master #:
                                    </span>
                                    <div className="font-medium text-green-700">
                                      {serviceMasterNumber}
                                    </div>
                                  </div>
                                )}
                            </div>
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

                  {/* Service Text Preview */}
                  <div className="mt-3 pl-8">
                    <div className="text-xs text-gray-500 mb-1">
                      Service Line Item Text:
                    </div>
                    <div className="text-xs text-gray-600 bg-white rounded p-2 max-h-20 overflow-y-auto border border-gray-200">
                      {result.serviceText}
                    </div>
                  </div>

                  {/* Timestamp */}
                  {result.status === "success" && (
                    <div className="mt-3 pl-8">
                      <div className="text-xs text-gray-500">
                        <strong>Created At:</strong>{" "}
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Process completed. {successCount} service master
            {successCount !== 1 ? "s" : ""} created successfully.
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
// Attribute Edit Dialog Component
const AttributeEditDialog = ({
  isOpen,
  onClose,
  attributes,
  onSave,
  itemIndex,
  isLoading,
}) => {
  const [editedAttributes, setEditedAttributes] = useState({});

  React.useEffect(() => {
    if (isOpen && attributes) {
      // Initialize with current attribute values
      const initialValues = {};
      attributes.forEach((attr) => {
        initialValues[attr.Atnam] = attr.Atwrt || "";
      });
      setEditedAttributes(initialValues);
    }
  }, [isOpen, attributes]);

  if (!isOpen) return null;

  const handleAttributeChange = (atnam, value) => {
    setEditedAttributes((prev) => ({
      ...prev,
      [atnam]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedAttributes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Service Master Attributes
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Modify the attributes below and save to regenerate the service
                text
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "60vh" }}>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {attributes &&
                attributes.slice(0, Math.ceil(attributes.length / 2)).map((attr, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {attr.Atbez}
                          {attr.Reqrd === "YES" && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          {attr.Keychr === "YES" && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Key
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {attr.Atnam}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editedAttributes[attr.Atnam] || ""}
                        onChange={(e) =>
                          handleAttributeChange(attr.Atnam, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={attr.Chlpt || `Enter ${attr.Atbez}`}
                        disabled={isLoading}
                      />
                      {attr.Chlpt && (
                        <p className="text-xs text-gray-500 mt-1">{attr.Chlpt}</p>
                      )}
                    </label>
                  </div>
                ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {attributes &&
                attributes.slice(Math.ceil(attributes.length / 2)).map((attr, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {attr.Atbez}
                          {attr.Reqrd === "YES" && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          {attr.Keychr === "YES" && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Key
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {attr.Atnam}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={editedAttributes[attr.Atnam] || ""}
                        onChange={(e) =>
                          handleAttributeChange(attr.Atnam, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={attr.Chlpt || `Enter ${attr.Atbez}`}
                        disabled={isLoading}
                      />
                      {attr.Chlpt && (
                        <p className="text-xs text-gray-500 mt-1">{attr.Chlpt}</p>
                      )}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={16} />
                <span>Regenerating...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save & Regenerate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


// Detailed Info Dialog Component
const DetailedInfoDialog = ({
  isOpen,
  onClose,
  item,
  textGen,
  itemIndex,
  carouselIndex,
}) => {
  if (!isOpen) return null;

  const selectedExisting = textGen?.existing?.[carouselIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Service Item Details - Line {itemIndex + 1}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Complete information about this service line item
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

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
          {/* Service Classification */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
              Service Classification
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500">Service Type</span>
                <div className="font-medium text-gray-800 mt-1">
                  {item.Type || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500">Service Class</span>
                <div className="font-medium text-gray-800 mt-1">
                  {item.Class || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500">Category</span>
                <div className="font-medium text-gray-800 mt-1">
                  {item.Category || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-xs text-gray-500">Group</span>
                <div className="font-medium text-gray-800 mt-1">
                  {item.Group || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                <span className="text-xs text-gray-500">Class Description</span>
                <div className="font-medium text-gray-800 mt-1">
                  {item.Kltxt || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* AI Generated Service Text */}
          {textGen?.new && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
                AI Generated Service Text
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {textGen.new}
                </div>
              </div>
            </div>
          )}

          {/* Service Attributes */}
          {textGen?.create_text && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
                Service Attributes
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(textGen.create_text).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100"
                  >
                    <span className="text-xs text-indigo-600 font-medium">
                      {key}
                    </span>
                    <div className="text-sm text-gray-800 mt-1">
                      {value || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Existing Service */}
          {selectedExisting && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
                Selected Existing Service Master
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500">
                      Service Master Number
                    </span>
                    <div className="font-medium text-green-700 text-lg">
                      SM-
                      {truncateServiceNumber(selectedExisting.metadata?.source)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      Relevance Score
                    </span>
                    <div className="font-medium text-green-700">
                      {selectedExisting.relevance}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Service Text</span>
                  <div className="text-sm text-gray-700 mt-2 bg-white p-3 rounded border border-green-300">
                    {selectedExisting.service_text}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-2 rounded border border-green-200">
                    <span className="text-xs text-gray-500">
                      Service Category
                    </span>
                    <div className="text-sm font-medium text-gray-800 mt-1">
                      {selectedExisting.metadata?.service_cat || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-200">
                    <span className="text-xs text-gray-500">Service Type</span>
                    <div className="text-sm font-medium text-gray-800 mt-1">
                      {selectedExisting.metadata?.service_type || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-200">
                    <span className="text-xs text-gray-500">Service Class</span>
                    <div className="text-sm font-medium text-gray-800 mt-1">
                      {selectedExisting.metadata?.service_class || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-200">
                    <span className="text-xs text-gray-500">Service Group</span>
                    <div className="text-sm font-medium text-gray-800 mt-1">
                      {selectedExisting.metadata?.service_group || "N/A"}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-200 col-span-2">
                    <span className="text-xs text-gray-500">Created At</span>
                    <div className="text-sm font-medium text-gray-800 mt-1">
                      {selectedExisting.metadata?.created_at
                        ? new Date(
                          selectedExisting.metadata.created_at
                        ).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Available Existing Services */}
          {textGen?.existing && textGen.existing.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
                All Matching Existing Services ({textGen.existing.length})
              </h4>
              <div className="space-y-3">
                {textGen.existing.map((service, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${idx === carouselIndex
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        SM-{truncateServiceNumber(service.metadata?.source)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {service.relevance}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Rank: {service.rank}
                        </span>
                        {idx === carouselIndex && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                      {service.service_text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
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
  onUpdateGeneratedText,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editingAttributes, setEditingAttributes] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [detailedInfoOpen, setDetailedInfoOpen] = useState(false);
  const [detailedInfoData, setDetailedInfoData] = useState(null);

  const hasValidSelections = Object.values(selectedItems).some(
    (item) => item.choice
  );

  // Handle opening the attribute edit dialog
  const handleEditAttributes = (index, type) => {
    const textGen = textGenerations[index];
    if (!textGen || !textGen.create_text) {
      alert("No attributes available to edit");
      return;
    }

    // Convert create_text object to NavItem format for the dialog

    const attributes = textGen.create_text?.NavHeader[0]?.NavItem
      .map((navItem) => ({
        Atnam: navItem.Atnam,
        Atbez: navItem.Atbez.replace(/_/g, " "),
        Atwrt: navItem.Atwrt,
        Chlpt: `Enter the ${navItem.Atnam.toLowerCase().replace(/_/g, " ")}`,
        Keychr: ["TYPE", "RATE_TYPE"].includes(navItem.Atnam) ? "YES" : "NO",
        Reqrd: ["TYPE", "RATE_TYPE"].includes(navItem.Atnam) ? "YES" : "NO",
      }))
      .sort((a, b) => (a.Reqrd === "YES" ? -1 : 1));

    setEditingAttributes(attributes);
    setEditingItemIndex(index);
    setEditDialogOpen(true);
  };

  // Handle saving edited attributes and regenerating text
  const handleSaveAttributes = async (editedAttributes) => {
    setIsRegenerating(true);
    try {
      const payload = {
        attributes: editedAttributes,
        serviceClass: serviceClasses[editingItemIndex],
      };

      const response = await apiCall("regenerate-text", payload);

      // Update the text generation with the new response
      onUpdateGeneratedText(
        editingItemIndex,
        response.new,
        response.create_text,
        response.existing
      );

      setEditDialogOpen(false);
      setEditingItemIndex(null);
      setEditingAttributes(null);
    } catch (error) {
      console.error("Error regenerating text:", error);
      alert(`Failed to regenerate text: ${error.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle clearing selection
  const handleClearSelection = (index) => {
    onItemSelect(index, false);
  };

  // Handle showing detailed info
  const handleShowDetailedInfo = (item, textGen, index, carouselIndex) => {
    setDetailedInfoData({ item, textGen, index, carouselIndex });
    setDetailedInfoOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Procurement Service Line Items
            </h3>
            {hasValidSelections && (
              <button
                onClick={onReview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700 w-12">
                  S.No.
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-24">
                  Service Type
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-5/12">
                  Existing Service Line Item
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-5/12">
                  AI Generated Service Line Item
                </th>
                <th className="text-left p-4 font-medium text-gray-700 w-16">
                  Info
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceClasses.map((item, index) => {
                const textGen = textGenerations[index];
                const isGenerating = isGeneratingText[index];
                const isSelected = selectedItems[index];
                const carouselIndex = carouselSelections[index] || 0;

                if (isGenerating) {
                  return <ItemSkeletonRow key={`skeleton-${index}`} />;
                }

                return (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 hover:bg-gray-50 animate-fadeIn transition-colors ${isSelected ? "bg-blue-50" : ""
                      }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <td className="p-4 text-gray-600 text-center">
                      {index + 1}
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-xs break-words">
                      <div className="font-semibold">{item.Type}</div>
                      <div className="mt-1 text-xs font-normal text-gray-500 line-clamp-3">
                        {item.Kltxt}
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`space-y-2 cursor-pointer transition-all duration-200 p-3 rounded-lg border-2 ${isSelected?.choice === "matching"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                        style={{ maxHeight: "180px" }}
                        onClick={() => {
                          if (!isSelected) {
                            onItemSelect(index, true);
                          }
                          onChoiceSelect(index, "matching");
                        }}
                      >
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
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected?.choice === "matching"
                                    ? "border-blue-600 bg-blue-600"
                                    : "border-gray-300 bg-white"
                                    }`}
                                >
                                  {isSelected?.choice === "matching" && (
                                    <Check size={14} className="text-white" />
                                  )}
                                </div>
                                <label className="text-xs text-gray-700 font-medium cursor-pointer select-none">
                                  Use Existing SM
                                </label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAttributes(index, "existing");
                                  }}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                                  title="Edit attributes"
                                >
                                  <Edit3 size={14} />
                                </button>
                                {isSelected?.choice === "matching" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClearSelection(index);
                                    }}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                                    title="Clear selection"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                            Loading services...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`space-y-2 cursor-pointer transition-all duration-200 p-3 rounded-lg border-2 ${isSelected?.choice === "new"
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                          }`}
                        style={{ maxHeight: "180px" }}
                        onClick={() => {
                          if (!isSelected) {
                            onItemSelect(index, true);
                          }
                          onChoiceSelect(index, "new");
                        }}
                      >
                        {textGen ? (
                          <>
                            <div className="text-xs text-gray-600 bg-white rounded p-2 overflow-auto border border-gray-200" style={{height:"120px"}}>
                              {textGen.new}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected?.choice === "new"
                                    ? "border-green-600 bg-green-600"
                                    : "border-gray-300 bg-white"
                                    }`}
                                >
                                  {isSelected?.choice === "new" && (
                                    <Check size={14} className="text-white" />
                                  )}
                                </div>
                                <label className="text-xs text-gray-700 font-medium cursor-pointer select-none">
                                  Use New SM
                                </label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAttributes(index, "new");
                                  }}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                                  title="Edit attributes"
                                >
                                  <Edit3 size={14} />
                                </button>
                                {isSelected?.choice === "new" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClearSelection(index);
                                    }}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                                    title="Clear selection"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                            Pending generation...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          handleShowDetailedInfo(
                            item,
                            textGen,
                            index,
                            carouselIndex
                          )
                        }
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors mx-auto block"
                        title="View detailed information"
                      >
                        <Info size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribute Edit Dialog */}
      <AttributeEditDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingItemIndex(null);
          setEditingAttributes(null);
        }}
        attributes={editingAttributes}
        onSave={handleSaveAttributes}
        itemIndex={editingItemIndex}
        isLoading={isRegenerating}
      />

      {/* Detailed Info Dialog */}
      <DetailedInfoDialog
        isOpen={detailedInfoOpen}
        onClose={() => {
          setDetailedInfoOpen(false);
          setDetailedInfoData(null);
        }}
        item={detailedInfoData?.item}
        textGen={detailedInfoData?.textGen}
        itemIndex={detailedInfoData?.index}
        carouselIndex={detailedInfoData?.carouselIndex}
      />
    </div>
  );
};
// Review Screen Component with Service Master Creation
export const ReviewScreen = ({ reviewData, onBack, onComplete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [creationResults, setCreationResults] = useState([]);

  // Separate items into existing and new
  const existingItems = reviewData.filter((item) => item.choice === "matching");
  const newItems = reviewData.filter((item) => item.choice === "new");

  // Function to create service masters for new items
  const handleConfirmAndSubmit = async () => {
    if (newItems.length === 0) {
      alert("No new service masters to create.");
      return;
    }

    setIsCreating(true);
    const results = [];

    try {
      // Process each new item
      for (const item of newItems) {
        try {
          // Create payload for the API call
          const payload = {
            payload: item.textGen?.create_text || {},
            // new: item.textGen?.new || item.serviceText,
          };

          console.log(`Creating service master for item ${item.sno}:`, payload);

          // Call the create_service_master endpoint
          const response = await apiCall("validate-text", payload);

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
        </div>
      </div>

      {/* Existing Service Masters Section */}
      {existingItems.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-800">
              Existing Service Masters ({existingItems.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              These items will use existing service masters
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
                    Service Master
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Service Line Item Text
                  </th>
                </tr>
              </thead>
              <tbody>
                {existingItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-600">{item.sno}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">
                      {item.serviceType}
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">
                        SM-
                        {truncateServiceNumber(
                          item.selectedExistingService.metadata?.source
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.selectedExistingService.relevance}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto bg-blue-50 border border-blue-200">
                        {item.selectedExistingService?.service_text}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Service Masters Section */}
      {newItems.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  New Service Masters ({newItems.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  These items will create new service masters
                </p>
              </div>
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
                    <span>Create New Service Masters</span>
                  </>
                )}
              </button>
            </div>
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
                  <th className="text-left p-4 font-medium text-gray-700">
                    Service Line Item Text
                  </th>
                </tr>
              </thead>
              <tbody>
                {newItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 text-gray-600">{item.sno}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">
                      {item.serviceType}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto bg-green-50 border border-green-200">
                        {item.textGen?.new}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Master Creation Results Dialog */}
      <ServiceMasterResultsDialog
        isOpen={showResults}
        onClose={handleCloseResults}
        results={creationResults}
      />
    </div>
  );
};
