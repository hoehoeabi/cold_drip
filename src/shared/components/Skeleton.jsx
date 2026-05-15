/**
 * [Skeleton.jsx]
 * 데이터를 불러오는 동안 보여줄 가짜(Placeholder) 부품입니다.
 */

export function PostSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm animate-pulse">
      {/* 가짜 이미지 영역 */}
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800" />

      <div className="p-8 flex flex-col gap-4">
        {/* 가짜 제목 */}
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
        {/* 가짜 본문 */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full w-full" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full w-5/6" />
        </div>
        {/* 가짜 별점 영역 */}
        <div className="h-20 bg-slate-50 dark:bg-slate-800/30 rounded-[24px] mt-4" />
        {/* 가짜 프로필 */}
        <div className="flex items-center gap-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
            <div className="h-2 bg-slate-100 dark:bg-slate-800/50 rounded-full w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
