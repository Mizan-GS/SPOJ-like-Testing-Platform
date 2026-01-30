import { useEffect, useState } from "react";

/**
 * OverviewCard
 * -------------
 * icon: React component (Lucide icon)
 * label: string
 * value: number
 * description: string
 * onClick: function
 * color: tailwind color class (purple, green, etc.)
 */
function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
  onClick,
  color ,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate number from 0 → value
  useEffect(() => {
    let start = 0;
    const duration = 600; // ms
    const increment = Math.max(1, Math.floor(value / 40));
    const stepTime = Math.floor(duration / (value / increment || 1));

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(counter);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div
      onClick={onClick}
      className="min-w-[240px] cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-xl "
    >
      {/* Icon */}
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-${color}-100`}
      >
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>

      {/* Number */}
      <p className="text-3xl font-semibold text-gray-900">
        {displayValue.toLocaleString()}
      </p>

      {/* Label */}
      <p className="mt-1 text-sm font-medium text-gray-700">
        {label}
      </p>

      {/* Description */}
      {description && (
        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}

export default OverviewCard;
