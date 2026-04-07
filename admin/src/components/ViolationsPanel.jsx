import { useEffect, useState } from "react";

export default function ViolationsPanel({ violations = [], loading = false }) {
  const [animatedValues, setAnimatedValues] = useState([]);

  useEffect(() => {
    if (!Array.isArray(violations) || violations.length === 0) {
      setAnimatedValues([]);
      return;
    }

    setAnimatedValues(violations.map(() => 0));

    const timeout = setTimeout(() => {
      setAnimatedValues(violations.map((item) => Number(item.percentage || 0)));
    }, 200);

    return () => clearTimeout(timeout);
  }, [violations]);

  return (
    <div className="col-span-5 bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-10">
        Top Violations
      </h2>

      {loading ? (
        <div className="text-sm text-[#64748B]">Loading...</div>
      ) : !Array.isArray(violations) || violations.length === 0 ? (
        <div className="text-sm text-[#64748B]">No data found.</div>
      ) : (
        violations.map((item, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[15px] font-medium text-[#1E293B]">
                {item.label}
              </span>
              <span className="text-[15px] font-medium text-[#0F172A]">
                {animatedValues[index] || 0}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-2.5 bg-[#2460B9] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedValues[index] || 0}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
