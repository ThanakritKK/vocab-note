"use client"; // 👈 ต้องเป็น Client Component เท่านั้นถึงจะใช้ Hook ได้

import { useFormStatus } from "react-dom"; // Hook ตัวใหม่ของ React สำหรับเช็คสถานะฟอร์ม

interface SubmitButtonProps {
  label: string;
}

export default function SubmitButton({ label }: SubmitButtonProps) {
  // pending = true เมื่อฟอร์มกำลังส่งข้อมูล
  const { pending } = useFormStatus();  

  return (
    <button
      type="submit"
      disabled={pending} // ห้ามกดซ้ำถ้ารออยู่
      className={`w-full font-bold py-2 px-4 rounded transition-colors ${
        pending 
          ? "bg-gray-400 cursor-not-allowed" // สีตอนโหลด (สีเทา)
          : "bg-blue-600 hover:bg-blue-700 text-white" // สีปกติ (สีฟ้า)
      }`}
    >
      {pending ? "กำลังบันทึก..." : label}
    </button>
  );
}