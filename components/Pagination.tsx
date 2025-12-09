"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // อ่านหน้าปัจจุบันจาก URL (ถ้าไม่มีให้เป็น 1)
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-8">
      {/* ปุ่มย้อนกลับ */}
      <button
        disabled={currentPage <= 1}
        onClick={() => createPageURL(currentPage - 1)}
        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        &lt; ก่อนหน้า
      </button>

      <span className="flex items-center text-sm text-gray-600">
        หน้า {currentPage} จาก {totalPages}
      </span>

      {/* ปุ่มถัดไป */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => createPageURL(currentPage + 1)}
        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        ถัดไป &gt;
      </button>
    </div>
  );
}