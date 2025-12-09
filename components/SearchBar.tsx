"use client"; // ต้องเป็น Client เพราะมีการดักจับการพิมพ์

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // ฟังก์ชันนี้จะทำงานหลังจากเรา "หยุดพิมพ์" ครบ 0.5 วินาที (ไม่ทำงานรัวๆ)
  const handleSearch = useDebouncedCallback((term: string) => {
    // 1. สร้างตัวจัดการ URL (เช่น ?query=hello&page=1)
    const params = new URLSearchParams(searchParams);
    
    // 2. ถ้ามีคำค้นหา ให้ใส่ ?query=... ถ้าไม่มี ให้ลบออก
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // 3. เปลี่ยน URL โดยไม่รีเฟรชหน้า (สำคัญ!)
    replace(`${pathname}?${params.toString()}`);
  }, 500); // รอ 500ms (ครึ่งวินาที)

  return (
    <div className="w-full max-w-sm mb-6">
      <label htmlFor="search" className="sr-only">ค้นหา</label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
        placeholder="ค้นหาคำศัพท์..."
        // ใส่ค่าเริ่มต้นจาก URL (เพื่อให้ตอนกด Refresh คำค้นหายังอยู่)
        defaultValue={searchParams.get('query')?.toString()} 
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}