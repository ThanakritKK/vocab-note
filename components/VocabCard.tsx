"use client";

import React from "react";
import { deleteVocab } from "@/app/actions";
import type { Vocab } from "@prisma/client";
import DeleteButton from "./DeleteButton";
import Swal from "sweetalert2";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

type VocabCardProps = Pick<Vocab, "id" | "word" | "definition" | "category">;

export default function VocabCard({
  id,
  word,
  definition,
  category,
}: VocabCardProps) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      {/* ส่วนหัว: คำศัพท์และไอคอนแก้ไข/ลบ */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-2xl font-bold text-gray-900 flex-1 pr-2">{word}</h2>
        
        {/* ไอคอนแก้ไขและลบ */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/vocab/${id}`}
            className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors"
            aria-label="แก้ไข"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>
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
      </div>

      {/* ส่วนเนื้อหา: ความหมาย */}
      <p className="text-gray-700 mb-3">{definition}</p>

      {/* ป้ายหมวดหมู่ (Badge) */}
      <div className="flex justify-start">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {category}
        </span>
      </div>
    </div>
  );
}
