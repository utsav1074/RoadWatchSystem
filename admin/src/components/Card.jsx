export default function Card({ icon, iconBg, circleColor, title, value }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Decorative Circle */}
      <div
        className={`absolute -right-20 -bottom-20 w-48 h-48 rounded-full ${circleColor} opacity-50`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>

        <p className="mt-6 text-sm text-[#64748B] font-medium">{title}</p>

        <h2 className="mt-1.5 text-2xl font-semibold text-[#0F172A]">
          {value}
        </h2>
      </div>
    </div>
  );
}
