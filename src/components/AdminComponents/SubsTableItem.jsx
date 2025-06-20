"use client";
import React from "react";

const SubsTableItem = ({ email, mongoId, deleteEmail, date }) => {
  const emailDate = new Date(date);

  return (
    <tr className="bg-white border-b hover:bg-gray-50 transition duration-200 text-sm text-gray-800">
      {/* Email */}
      <td className="px-6 py-4 whitespace-nowrap font-medium">
        {email || "No Email"}
      </td>

      {/* Date */}
      <td className="px-6 py-4 hidden sm:table-cell text-gray-600">
        {emailDate.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      {/* Delete */}
      <td className="px-6 py-4 text-red-500">
        <button
          onClick={() => deleteEmail(mongoId)}
          className="hover:text-red-700 transition duration-150"
          title="Delete subscriber"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default SubsTableItem;
