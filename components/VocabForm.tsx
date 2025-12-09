"use client"; // 👈 ต้องเป็น Client Component เท่านั้นถึงจะใช้ Hook ได้


import { addVocab, updateVocab } from "@/app/actions"; // import ฟังก์ชันเมื่อกี้มา
import SubmitButton from "./SubmitButton";
import { useRef } from "react";
import type { Vocab } from "@prisma/client";
import { toast } from "sonner";



export default function VocabForm({ vocab }: { vocab?: Vocab }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = !!vocab;

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">จดศัพท์ใหม่</h2>
      
      {/* action={addVocab} คือการผูกฟอร์มเข้ากับ Server Action ตรงๆ */}
      <form ref={formRef} 
      action={async (formData: FormData) => {
        try {
        if (isEditMode) {
          await updateVocab(vocab.id, formData);
          toast.success("แก้ไขข้อมูลเรียบร้อย! 🎉");
        } else {
          await addVocab(formData);
          formRef.current?.reset();

          toast.success("จดศัพท์ใหม่เรียบร้อย! 🎉");
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง.");
      }
      }} className="flex flex-col gap-4">

        {/* ช่อง Word */}
        <div>
          <label className="block text-sm font-medium text-gray-700">คำศัพท์</label>
          <input 
            name="word" // สำคัญ! ชื่อนี้ต้องตรงกับใน actions.ts
            type="text" 
            placeholder="เช่น Resilience" 
            defaultValue={vocab?.word}
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* ช่อง Definition */}
        <div>
          <label className="block text-sm font-medium text-gray-700">คำแปล</label>
          <input 
            name="definition" 
            type="text" 
            placeholder="แปลว่า..." 
            defaultValue={vocab?.definition}
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm"
          />
        </div>

        {/* ช่อง Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
          <select 
            name="category" 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm"
            defaultValue={vocab?.category || "General"}
          >
            <option value="General">General</option>
            <option value="Adjective">Adjective</option>
            <option value="Noun">Noun</option>
            <option value="Verb">Verb</option>
            <option value="Adjective">Adjective</option>
            <option value="Mindset">Mindset</option>
            <option value="Tech">Tech</option>
            <option value="Soft Skill">Soft Skill</option>
          </select>
        </div>

        <SubmitButton label={isEditMode ? "บันทึกการแก้ไข" : "บันทึก"} />
      </form>
    </div>
  );
}