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
        return response?.data?.d?.NavHeader?.results?.[0]?.NavReturn?.results?.[0]?.Message || "No message available";
      } catch (e) {
        return "Unable to extract message";
      }
    };
  
    // Helper function to extract message type (S=Success, E=Error, W=Warning)
    const extractMessageType = (response) => {
      try {
        return response?.data?.d?.NavHeader?.results?.[0]?.NavReturn?.results?.[0]?.Type || "I";
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
  
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {results.map((result, index) => {
                const messageType = result.response ? extractMessageType(result.response) : null;
                const responseMessage = result.response ? extractResponseMessage(result.response) : null;
                const changeRequestId = result.response ? extractChangeRequestId(result.response) : null;
                const serviceMasterNumber = result.response ? extractServiceMasterNumber(result.response) : null;
                
                return (
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
                          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                        ) : (
                          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
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
                                    <Info size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-700">
                                      <span className="font-medium text-green-700">System Message: </span>
                                      {responseMessage}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Key Details */}
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                {changeRequestId && changeRequestId !== "N/A" && (
                                  <div className="bg-white rounded p-2 border border-green-200">
                                    <span className="text-xs text-gray-500">Change Request ID:</span>
                                    <div className="font-medium text-green-700">{changeRequestId}</div>
                                  </div>
                                )}
                                
                                {serviceMasterNumber && serviceMasterNumber !== "N/A" && (
                                  <div className="bg-white rounded p-2 border border-green-200">
                                    <span className="text-xs text-gray-500">Service Master #:</span>
                                    <div className="font-medium text-green-700">{serviceMasterNumber}</div>
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
                      <div className="text-xs text-gray-500 mb-1">Service Line Item Text:</div>
                      <div className="text-xs text-gray-600 bg-white rounded p-2 max-h-20 overflow-y-auto border border-gray-200">
                        {result.serviceText}
                      </div>
                    </div>
  
                    {/* Timestamp */}
                    {result.status === "success" && (
                      <div className="mt-3 pl-8">
                        <div className="text-xs text-gray-500">
                          <strong>Created At:</strong> {new Date().toLocaleString()}
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
              Process completed. {successCount} service master{successCount !== 1 ? 's' : ''} created successfully.
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