"use client"; // 👈 ต้องเป็น Client Component เท่านั้นถึงจะใช้ Hook ได้

import { addVocab } from "@/app/actions"; // import ฟังก์ชันเมื่อกี้มา
import SubmitButton from "./SubmitButton";
import { useRef } from "react";

export default function VocabForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">จดศัพท์ใหม่</h2>
      
      {/* action={addVocab} คือการผูกฟอร์มเข้ากับ Server Action ตรงๆ */}
      <form ref={formRef} 
      action={async (formData: FormData) => {
        await addVocab(formData);
        formRef.current?.reset();
      }} className="flex flex-col gap-4">
        
        {/* ช่อง Word */}
        <div>
          <label className="block text-sm font-medium text-gray-700">คำศัพท์</label>
          <input 
            name="word" // สำคัญ! ชื่อนี้ต้องตรงกับใน actions.ts
            type="text" 
            placeholder="เช่น Resilience" 
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
          >
            <option value="General">General</option>
            <option value="Noun">Noun</option>
            <option value="Verb">Verb</option>
            <option value="Adjective">Adjective</option>
            <option value="Mindset">Mindset</option>
            <option value="Tech">Tech</option>
          </select>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}