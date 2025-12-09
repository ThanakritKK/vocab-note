import { Skeleton, VocabCardSkeleton } from "@/components/Skeletons";


export default function Loading() {
    return (
        <div className="flex flex-col items-center p-12 gap-6 bg-gray-50 min-h-screen">
      
      {/* 1. จำลองฟอร์ม (Form Skeleton) */}
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6 h-[400px] animate-pulse bg-gray-100"></div>

      {/* 2. จำลองช่องค้นหา (Search Skeleton) */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* 3. จำลองรายการการ์ด (Card List Skeleton) */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {/* วนลูปโชว์สัก 3 ใบ ให้ดูเหมือนมีข้อมูล */}
        {Array.from({ length: 3 }).map((_, i) => (
          <VocabCardSkeleton key={i} />
        ))}
      </div>

    </div>
  );
}