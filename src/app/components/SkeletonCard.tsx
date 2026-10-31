import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/50 animate-pulse">
      <div className="aspect-[16/10] w-full bg-slate-200 dark:bg-slate-700/40" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-4 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4" />
          <div className="h-3 bg-slate-300 dark:bg-slate-700/40 rounded w-1/2" />
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700/30 rounded w-full" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700/30 rounded w-4/5" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700/40 flex justify-between items-center">
          <div className="h-3 bg-slate-300 dark:bg-slate-700/40 rounded w-1/3" />
          <div className="h-3 bg-slate-300 dark:bg-slate-700/40 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};
