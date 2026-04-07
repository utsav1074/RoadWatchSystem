import { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../components/Dropdown";
import Card from "../components/Card";
import ViolationsPanel from "../components/ViolationsPanel";
import ReportStatusPie from "../components/ReportStatusPie";
import ReportTrend from "../components/ReportTrend";
import { fetchDashboardAnalytics } from "../services/dashboardService";

export default function Dashboard() {
  const navigate = useNavigate();

  const FILTERS = ["All Time", "Last 7 Days", "Last 30 Days", "This Month"];
  const [filter, setFilter] = useState("All Time");
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalReports: 0,
      totalRevenue: 0,
      underReview: 0,
      totalUsers: 0,
    },
    statusData: [
      { name: "Accepted", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Rejected", value: 0 },
    ],
    violationsData: [],
    chartData: [],
  });

  const COLORS = ["#3B82F6", "#F59E0B", "#F43F5E"];


  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      
      const { res, data } = await fetchDashboardAnalytics();

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/");
          return;
        }

        setDashboardData({
          summary: {
            totalReports: 0,
            totalRevenue: 0,
            underReview: 0,
            totalUsers: 0,
          },
          statusData: [
            { name: "Accepted", value: 0 },
            { name: "Pending", value: 0 },
            { name: "Rejected", value: 0 },
          ],
          violationsData: [],
          chartData: [],
        });
        return;
      }

      setDashboardData({
        summary: {
          totalReports: Number(data?.summary?.totalReports || 0),
          totalRevenue: Number(data?.summary?.totalRevenue || 0),
          underReview: Number(data?.summary?.underReview || 0),
          totalUsers: Number(data?.summary?.totalUsers || 0),
        },
        statusData:
          Array.isArray(data?.statusData) && data.statusData.length > 0
            ? data.statusData
            : [
                { name: "Accepted", value: 0 },
                { name: "Pending", value: 0 },
                { name: "Rejected", value: 0 },
              ],
        violationsData: Array.isArray(data?.violationsData)
          ? data.violationsData
          : [],
        chartData: Array.isArray(data?.chartData) ? data.chartData : [],
      });
    } catch (err) {
      if (err.message === "NO_TOKEN") {
        navigate("/");
        return;
      }

      setDashboardData({
        summary: {
          totalReports: 0,
          totalRevenue: 0,
          underReview: 0,
          totalUsers: 0,
        },
        statusData: [
          { name: "Accepted", value: 0 },
          { name: "Pending", value: 0 },
          { name: "Rejected", value: 0 },
        ],
        violationsData: [],
        chartData: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => Number(value || 0).toLocaleString();
  const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#F6F9FE]">
      <div className="px-20 pt-12 pb-10">
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

        <div className="grid grid-cols-4 gap-6 mt-10">
          <Card
            icon={<ShieldCheck className="text-white" size={18} />}
            iconBg="bg-[#2460B9]"
            circleColor="bg-[#DBEAFE]"
            title="Total Reports"
            value={
              loading ? "..." : formatNumber(dashboardData.summary.totalReports)
            }
          />

          <Card
            icon={<TrendingUp className="text-white" size={18} />}
            iconBg="bg-[#059669]"
            circleColor="bg-[#D1FAE5]"
            title="Total Revenue"
            value={
              loading
                ? "..."
                : formatCurrency(dashboardData.summary.totalRevenue)
            }
          />

          <Card
            icon={<Clock className="text-white" size={18} />}
            iconBg="bg-[#F59E0B]"
            circleColor="bg-[#FEF3C7]"
            title="Under Review"
            value={
              loading ? "..." : formatNumber(dashboardData.summary.underReview)
            }
          />

          <Card
            icon={<Users className="text-white" size={18} />}
            iconBg="bg-[#9333EA]"
            circleColor="bg-[#E9D5FF]"
            title="Total Users"
            value={
              loading ? "..." : formatNumber(dashboardData.summary.totalUsers)
            }
          />
        </div>

        <div className="grid grid-cols-8 gap-8 mt-8">
          <ViolationsPanel
            violations={dashboardData.violationsData}
            loading={loading}
          />

          <ReportStatusPie
            statusData={dashboardData.statusData}
            COLORS={COLORS}
            loading={loading}
          />
        </div>

        <ReportTrend chartData={dashboardData.chartData} loading={loading} />
      </div>
    </div>
  );
}
