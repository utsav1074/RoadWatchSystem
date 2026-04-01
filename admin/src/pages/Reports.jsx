import { useState, useEffect } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";

import { fetchReports, deleteReport } from "../services/adminReportService";

export default function Reports() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= DROPDOWN OPTIONS =================
  const STATUS_OPTIONS = ["All", "Accepted", "Pending", "Rejected"];
  const DATE_OPTIONS = [
    "All Time",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
  ];

  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");

  // ================= FETCH DATA =================
  useEffect(() => {
    loadReports();
  }, [search, statusFilter]);

  const loadReports = async () => {
    try {
      const { res, data } = await fetchReports(search, statusFilter);

      if (!res.ok) return;

      const formatted = data.map((r) => ({
        id: r.report_id,
        reporter: {
          name: r.reporter_name,
          username: r.reporter_username,
        },
        vehicle: {
          plate: r.vehicle_number,
          user: r.owner_name
            ? {
                name: r.owner_name,
                username: r.owner_username,
              }
            : null,
        },
        violation: r.violation_type,
        // FIX: normalize status to match original UI exactly
        status:
          r.report_status === "accepted"
            ? "Accepted"
            : r.report_status === "rejected"
              ? "Rejected"
              : "Pending",
        date: new Date(r.report_date).toLocaleDateString(),
      }));

      setReports(formatted);
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const { res } = await deleteReport(id);

      if (!res.ok) return;

      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
      }
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    if (status === "Accepted") return "bg-[#E0F2FE] text-[#0369A1]";
    if (status === "Pending") return "bg-[#FEF9C3] text-[#CA8A04]";
    if (status === "Rejected") return "bg-[#FEE2E2] text-[#B91C1C]";
  };

  return (
    <div className="min-h-screen bg-[#F6F9FE] py-14">
      <div className="max-w-7xl mx-auto px-10">
        {/* PAGE HEADER */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            Report Management
          </h1>
          <p className="text-sm text-[#64748B] mt-2">
            Manage reported traffic violations and review reports.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]"
            />
            <input
              type="text"
              placeholder="Search by reporter, vehicle or violation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2460B9] text-[14px] shadow-sm"
            />
          </div>

          <Dropdown
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
            width="w-44"
          />

          <Dropdown
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={setDateFilter}
            width="w-44"
          />
        </div>

        {/* LIST HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Reports List
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-sm overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4 ">Linked User</th>
                <th className="px-6 py-4">Violation</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-12 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition"
                >
                  {/* Reporter */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#0F172A]">
                      {report.reporter.name}
                    </p>
                    <p className="text-[12px] text-[#2460B9]">
                      @{report.reporter.username}
                    </p>
                  </td>

                  {/* Vehicle */}
                  <td className="px-6 py-4 font-medium text-[#334155]">
                    {report.vehicle.plate}
                  </td>

                  {/* Linked User */}
                  <td className="px-6 py-4">
                    {report.vehicle.user ? (
                      <>
                        <p className="font-medium text-[#0F172A]">
                          {report.vehicle.user.name}
                        </p>
                        <p className="text-[12px] text-[#2460B9]">
                          @{report.vehicle.user.username}
                        </p>
                      </>
                    ) : (
                      <span className="px-3 py-1 text-[12px] font-medium rounded-full bg-[#F1F5F9] text-[#64748B]">
                        Not Linked
                      </span>
                    )}
                  </td>

                  {/* Violation */}
                  <td className="px-6 py-4 text-[#334155]">
                    {report.violation}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-[#334155]">{report.date}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[12px] font-semibold rounded-full ${getStatusStyle(
                        report.status,
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/reports/review/${report.id}`)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#E8F0FE] hover:bg-[#D6E4FF] transition"
                      >
                        <Eye size={15} className="text-[#2460B9]" />
                      </button>

                      <button
                        onClick={() => handleDelete(report.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] transition"
                      >
                        <Trash2 size={15} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-[#64748B]">
                    {loading ? "Loading..." : "No reports found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
