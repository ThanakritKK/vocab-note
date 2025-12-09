"use client";

import React from "react";
import { deleteVocab } from "@/app/actions";
import type { Vocab } from "@prisma/client";
import DeleteButton from "./DeleteButton";
import Swal from "sweetalert2";

type VocabCardProps = Pick<Vocab, "id" | "word" | "definition" | "category">;

export default function VocabCard({
  id,
  word,
  definition,
  category,
}: VocabCardProps) {
  return (
    <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="absolute top-4 right-4">
        <form
          action={async () => {
            const result = await Swal.fire({
              title: "แน่ใจนะ?",
              text: `คุณต้องการลบคำว่า "${word}" ใช่ไหม?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6", // สีฟ้า (ปุ่มยืนยัน)
              cancelButtonColor: "#d33", // สีแดง (ปุ่มยกเลิก)
              confirmButtonText: "ใช่, ลบเลย!",
              cancelButtonText: "ยกเลิก",
            });

            if (result.isConfirmed) {
              await deleteVocab(id);

              await Swal.fire({
                title: "ลบเสร็จสิ้น!",
                text: "คำศัพท์ถูกลบเรียบร้อยแล้ว",
                icon: "success",
                timer: 1500, // ปิดเองใน 1.5 วิ
                showConfirmButton: false,
              });
            }
          }}
        >
          <DeleteButton />
        </form>
      </div>

      {/* ส่วนหัว: จัดให้ชื่ออยู่ซ้าย หมวดหมู่อยู่ขวา */}
      <div className="flex justify-between items-start mb-2 pr-8">
        <h2 className="text-2xl font-bold text-gray-900">{word}</h2>

        {/* ป้ายหมวดหมู่ (Badge) */}
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5rounded-full">
          {category}
        </span>
      </div>

      {/* ส่วนเนื้อหา: ความหมาย */}
      <p className="text-gray-700 mt-2">{definition}</p>
    </div>
  );
}
