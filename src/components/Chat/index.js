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
} from "lucide-react";
import { ExistingServicesCarousel } from "../UI/index";
import { ItemSkeletonRow } from "../Skeletons.js";

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

// Enhanced Service Class Results Table
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
}) => {
  const hasSelectedItems = Object.keys(selectedItems).length > 0;
  const hasValidSelections = Object.values(selectedItems).some(
    (item) => item.choice
  );

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
export const ReviewScreen = ({ reviewData, onBack }) => {
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
