import React from "react";

const AdminDataTable = ({ columns, data, renderRow, emptyMessage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-50">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-slate-900 text-white">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 text-left font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500 bg-slate-900"
              >
                {emptyMessage || "No data found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const AdminPageLayout = ({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  columns,
  data,
  renderRow,
  emptyMessage,
}) => {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-86 border text-white border-gray-300 rounded-lg px-12 py-2 focus:outline-none bg-slate-800 placeholder-gray-400"
          />
        </div>
        {/* Table */}
        <AdminDataTable
          columns={columns}
          data={data}
          renderRow={renderRow}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
};

export default AdminPageLayout;
