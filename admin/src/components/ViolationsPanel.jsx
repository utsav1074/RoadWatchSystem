import { useEffect, useState } from "react";

export default function ViolationsPanel() {
  const violations = [
    { label: "Speeding", percentage: 82 },
    { label: "Red Light", percentage: 67 },
    { label: "No Helmet", percentage: 54 },
    { label: "Illegal Parking", percentage: 46 },
    { label: "Others", percentage: 38 },
  ];

  const [animatedValues, setAnimatedValues] = useState(violations.map(() => 0));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValues(violations.map((v) => v.percentage));
    }, 200); // slight delay for smooth feel

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="col-span-5 bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-10">
        Top Violations
      </h2>

      {violations.map((item, index) => (
        <div key={index} className="mb-8 last:mb-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[15px] font-medium text-[#1E293B]">
              {item.label}
            </span>
            <span className="text-[15px] font-medium text-[#0F172A]">
              {animatedValues[index]}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-2.5 bg-[#2460B9] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${animatedValues[index]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
