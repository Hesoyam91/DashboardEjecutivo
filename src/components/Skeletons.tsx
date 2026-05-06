export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-16 h-5 rounded-lg" />
      </div>
      <div className="skeleton h-9 w-28 rounded" />
      <div className="skeleton h-5 w-36 rounded" />
      <div className="skeleton h-6 w-40 rounded-full" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="skeleton h-4 w-36 rounded" />
        <div className="skeleton h-4 w-14 rounded-full" />
      </div>
      <div className="skeleton h-[130px] w-full rounded-xl" />
    </div>
  );
}

export function SkeletonFunnel() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="skeleton h-5 w-52 rounded mb-2" />
      <div className="skeleton h-3 w-72 rounded mb-6" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1 skeleton h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
