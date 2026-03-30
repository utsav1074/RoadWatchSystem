import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

export default function ReportStatusPie({ statusData, COLORS }) {
  // ✅ Add color directly into data (modern approach)
  const coloredData = statusData.map((item, index) => ({
    ...item,
    fill: COLORS[index],
  }));

  const total = coloredData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="col-span-3 bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
        Report Status
      </h2>

      <div className="h-56 flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={coloredData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              stroke="#FFFFFF"
              strokeWidth={1}
            />

            <Tooltip
              formatter={(value, name) => {
                const percentage = ((value / total) * 100).toFixed(1);
                return [`${percentage}%`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Section */}
      <div className="mt-6 space-y-3">
        {coloredData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-[#1E293B] font-medium">{item.name}</span>
            </div>
            <span className="text-[#0F172A] font-semibold">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
