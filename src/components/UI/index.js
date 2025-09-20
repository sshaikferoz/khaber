import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  Eye,
  Check,
  Loader2,
} from "lucide-react";
import { LoadingSpinner } from "../Skeletons";

// Carousel Component for Existing Services
export const ExistingServicesCarousel = ({
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
export const SelectedItemsCard = ({
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
export const VersionSelector = ({
  versions,
  currentVersion,
  onVersionChange,
}) => {
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
export const SelectionHelpCard = ({ hasSelections }) => {
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

// Chain of Thought Step Component
export const ChainOfThoughtStep = ({
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
