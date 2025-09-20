import React from "react";
import { X } from "lucide-react";
import {
  CategoriesView,
  TypesView,
  ClassesView,
  TextGenerationView,
} from "./ResponseViews.js";

// Response Details Modal
export const ResponseDetailsModal = ({ isOpen, onClose, stepId, response }) => {
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
export const ServiceClassInfoDialog = ({
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
