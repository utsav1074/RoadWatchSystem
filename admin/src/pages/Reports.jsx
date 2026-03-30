import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";

export default function Reports() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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

  // ================= STRUCTURED DATA =================
  const reports = [
    {
      id: 1,
      reporter: {
        name: "Ahmed Khan",
        username: "ahmedk",
      },
      vehicle: {
        plate: "BA-2-PA-1234",
        user: {
          name: "Fatima Ali",
          username: "fatima.ali",
        },
      },
      violation: "Speeding",
      status: "Accepted",
      date: "Feb 20, 2026",
    },
    {
      id: 2,
      reporter: {
        name: "Hassan Raza",
        username: "hassan_r",
      },
      vehicle: {
        plate: "BA-3-PA-5678",
        user: null,
      },
      violation: "Red Light",
      status: "Pending",
      date: "Feb 22, 2026",
    },
    {
      id: 3,
      reporter: {
        name: "Sara Malik",
        username: "sara_m",
      },
      vehicle: {
        plate: "BA-1-PA-9876",
        user: {
          name: "Ali Khan",
          username: "alikhan",
        },
      },
      violation: "Illegal Parking",
      status: "Rejected",
      date: "Feb 25, 2026",
    },
  ];

  // ================= FILTER LOGIC =================
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reporter.name.toLowerCase().includes(search.toLowerCase()) ||
      report.reporter.username.toLowerCase().includes(search.toLowerCase()) ||
      report.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
      report.violation.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
            <p className="text-sm text-[#64748B] mt-1">
              {filteredReports.length} total results
            </p>
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
              {filteredReports.map((report) => (
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

                      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FEE2E2] hover:bg-[#FECACA] transition">
                        <Trash2 size={15} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-[#64748B]">
                    No reports found.
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
