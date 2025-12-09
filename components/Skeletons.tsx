// สร้างแท่งสีเทากระพริบๆ (animate-pulse)
export function Skeleton({ className }: { className?: string }) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
    );
  }
  
  // สร้างการ์ดปลอมๆ ที่หน้าตาเหมือน VocabCard
  export function VocabCardSkeleton() {
    return (
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        {/* ส่วนหัว */}
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-8 w-1/2" /> {/* ชื่อศัพท์ */}
          <div className="flex gap-2">
             <Skeleton className="h-8 w-8" /> {/* ปุ่มแก้ไข */}
             <Skeleton className="h-8 w-8" /> {/* ปุ่มลบ */}
          </div>
        </div>
  
        {/* เนื้อหา */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
  
        {/* หมวดหมู่ */}
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    );
  }