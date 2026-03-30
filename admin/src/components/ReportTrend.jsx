import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ReportTrend({ chartData }) {
  return (
    <div className="mt-8 bg-white rounded-3xl pt-10 border border-[#E2E8F0] shadow-sm">
      {/* Header */}
      <div className="px-10">
        <h2 className="text-lg font-semibold text-[#0F172A]">Report Trend</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Traffic violation analytics
        </p>
      </div>

      {/* Chart */}
      <div className="h-96 mt-8 pl-2 pr-10 pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

            <XAxis
              dataKey="label"
              stroke="#475569"
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />

            <YAxis stroke="#475569" tick={{ fontSize: 12 }} tickMargin={8} />

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
      </div>
    </div>
  );
}