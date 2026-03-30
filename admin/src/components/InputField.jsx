export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="mb-6">
      {/* LABEL */}
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      {/* INPUT */}
      <input
        autoComplete="off"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          bg-gray-50
          border border-gray-300
          rounded-2xl
          px-4 py-3
          text-gray-800
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2E4DA7]
          focus:border-transparent
          transition-all duration-200
        "
      />
    </div>
  );
}
