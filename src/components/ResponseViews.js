import React from "react";

// Utility function to truncate leading zeros from service master number
const truncateServiceNumber = (source) => {
  if (!source) return "N/A";
  // Remove leading zeros by converting to number and back to string
  return parseInt(source, 10).toString();
};

// Visual Response Components
export const CategoriesView = ({ response }) => (
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

export const TypesView = ({ response }) => (
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

export const ClassesView = ({ response }) => (
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

export const TextGenerationView = ({ response }) => (
  <div className="space-y-4">
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h4 className="font-medium text-orange-800 mb-3">
        Generated Text Results
      </h4>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-orange-100">
          <h5 className="font-medium text-gray-800 mb-3">Existing Services</h5>
          <div className="space-y-2">
            {response.existing?.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded p-3 text-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">
                      SM: {truncateServiceNumber(service.metadata?.source)}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      Rank: {service.rank}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {service.relevance}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 mb-2">{service.service_text}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {service.metadata?.service_cat}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {service.metadata?.service_class}
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    {service.metadata?.service_group}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                    {service.metadata?.service_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-orange-100">
          <h5 className="font-medium text-gray-800 mb-3">Enhanced Text</h5>
          <div className="bg-blue-50 rounded p-3 text-sm text-gray-700 leading-relaxed">
            {/* {response.new[0]?.text} */}
            {/* {console.log(response.new)} */}
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