import React from "react";
import { Loader2 } from "lucide-react";

export const SkeletonRow = () => (
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

export const SkeletonTable = ({ rows = 3 }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="p-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
    </div>
    {Array.from({ length: rows }).map((_, index) => (
      <SkeletonRow key={index} />
    ))}
  </div>
);

export const ItemSkeletonRow = () => (
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

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
  </div>
);
