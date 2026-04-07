import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ReportTrend({ chartData = [], loading = false }) {
  const safeChartData = Array.isArray(chartData) ? chartData : [];

  return (
    <div className="mt-8 bg-white rounded-3xl pt-10 border border-[#E2E8F0] shadow-sm">
      <div className="px-10">
        <h2 className="text-lg font-semibold text-[#0F172A]">Report Trend</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Traffic violation analytics
        </p>
      </div>

      <div className="h-96 mt-8 pl-2 pr-10 pb-6">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-[#64748B]">
            Loading...
          </div>
        ) : safeChartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-[#64748B]">
            No data found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

              <XAxis
                dataKey="label"
                stroke="#475569"
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />

              <YAxis
                allowDecimals={false}
                stroke="#475569"
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="reports"
                stroke="#3A84E3"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
