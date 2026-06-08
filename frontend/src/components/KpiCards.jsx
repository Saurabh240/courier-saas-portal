import React from 'react';

export const KpiCard = ({ title, value, subtext, trendType }) => {
  const isPending = title.toLowerCase() === 'pending';

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] w-full">
      <div>
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          {title}
        </h3>
        <p className={`text-3xl font-extrabold mt-2 ${isPending ? 'text-amber-500' : 'text-slate-800'}`}>
          {value}
        </p>
      </div>

      {/* Keeps card footprint structurally full even if subtext hasn't loaded yet */}
      <div className="flex items-center gap-1 mt-3 text-xs font-semibold min-h-[16px]">
        {subtext ? (
          <>
            {trendType === 'up' && (
              <span className="text-emerald-500 flex items-center">
                ▲ <span className="ml-1 text-emerald-600">{subtext}</span>
              </span>
            )}
            {trendType === 'down' && (
              <span className="text-rose-500 flex items-center">
                ▼ <span className="ml-1 text-rose-600">{subtext}</span>
              </span>
            )}
            {trendType === 'neutral' && (
              <span className="text-amber-500">{subtext}</span>
            )}
          </>
        ) : (
          <span className="text-slate-300">-- vs last week</span>
        )}
      </div>
    </div>
  );
};

export const KpiSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="bg-slate-200/70 h-[140px] rounded-xl border border-slate-100" />
    ))}
  </div>
);