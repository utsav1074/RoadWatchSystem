import { useState } from "react";
import { ShieldCheck, TrendingUp, Clock, Users } from "lucide-react";

import Dropdown from "../components/Dropdown";
import Card from "../components/Card";
import ViolationsPanel from "../components/ViolationsPanel";
import ReportStatusPie from "../components/ReportStatusPie";
import ReportTrend from "../components/ReportTrend";

export default function Dashboard() {
  // ================= FILTER =================
  const FILTERS = ["All Time", "Last 7 Days", "Last 30 Days", "This Month"];
  const [filter, setFilter] = useState("All Time");

  const statusData = [
    { name: "Accepted", value: 5400 },
    { name: "Pending", value: 2300 },
    { name: "Rejected", value: 1200 },
  ];

  const COLORS = ["#3B82F6", "#F59E0B", "#F43F5E"];

  // ================= DAILY CHART DATA =================
  const chartData = [
    { label: "Jan 1", reports: 12 },
    { label: "Jan 2", reports: 18 },
    { label: "Jan 4", reports: 22 },
    { label: "Jan 5", reports: 15 },
    { label: "Jan 6", reports: 30 },
    { label: "Jan 7", reports: 24 },
    { label: "Jan 10", reports: 21 },
    { label: "Jan 11", reports: 16 },
    { label: "Jan 12", reports: 33 },
  ];

  return (
    <div className="min-h-screen bg-[#F6F9FE]">
      <div className="px-20 pt-12 pb-10">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">
              Analytics Overview
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Real-time performance insights across reports and users.
            </p>
          </div>

          <div className="flex items-end">
            <Dropdown
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              width="w-44"
            />
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-4 gap-6 mt-10">
          <Card
            icon={<ShieldCheck className="text-white" size={18} />}
            iconBg="bg-[#2460B9]"
            circleColor="bg-[#DBEAFE]"
            title="Total Reports"
            value="13,897"
          />
          <Card
            icon={<TrendingUp className="text-white" size={18} />}
            iconBg="bg-[#059669]"
            circleColor="bg-[#D1FAE5]"
            title="Total Revenue"
            value="$3,842,650"
          />
          <Card
            icon={<Clock className="text-white" size={18} />}
            iconBg="bg-[#F59E0B]"
            circleColor="bg-[#FEF3C7]"
            title="Under Review"
            value="3,847"
          />
          <Card
            icon={<Users className="text-white" size={18} />}
            iconBg="bg-[#9333EA]"
            circleColor="bg-[#E9D5FF]"
            title="Total Users"
            value="1,247"
          />
        </div>

        {/* ================= FLOATING SECTION ================= */}
        <div className="grid grid-cols-8 gap-8 mt-8">
          <ViolationsPanel />
          <ReportStatusPie statusData={statusData} COLORS={COLORS} />
        </div>

        {/* ================= REPORT TREND ================= */}
        <ReportTrend chartData={chartData} />
      </div>
    </div>
  );
}
