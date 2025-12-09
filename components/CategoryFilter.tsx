"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (category: string) => {
    // 1. สร้างตัวจัดการ URL
    const params = new URLSearchParams(searchParams);
    
    // 2. ถ้าเลือกหมวดหมู่ ให้ใส่ ?category=... ถ้าเลือก "ทั้งหมด" ให้ลบออก
    if (category && category !== "All") {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    // 3. เปลี่ยน URL ทันที
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-sm mb-6">
      <select
        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
        // อ่านค่าจาก URL มาเป็นค่าเริ่มต้น (เพื่อให้ Refresh แล้วค่าไม่หาย)
        defaultValue={searchParams.get('category')?.toString() || "All"}
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="All">ทั้งหมด (All Categories)</option>
        <option value="General">General</option>
        <option value="Noun">Noun</option>
        <option value="Verb">Verb</option>
        <option value="Adjective">Adjective</option>
        <option value="Mindset">Mindset</option>
        <option value="Tech">Tech</option>
        <option value="Soft Skill">Soft Skill</option>
      </select>
    </div>
  );
}