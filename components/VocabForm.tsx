"use client"; // 👈 ต้องเป็น Client Component เท่านั้นถึงจะใช้ Hook ได้

import { addVocab, generateVocabData, updateVocab  } from "@/app/actions"; 
import SubmitButton from "./SubmitButton";
import { useRef , useState } from "react";
import type { Vocab } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";



export default function VocabForm({ vocab }: { vocab?: Vocab }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const isEditMode = !!vocab;

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const wordInput = formRef.current?.querySelector('input[name="word"]') as HTMLInputElement;
    const word = wordInput?.value;

    if (!word) {
      toast.error("กรุณาพิมพ์คำศัพท์ก่อนกดปุ่ม AI นะ!");
      return;
    }
    setIsGenerating(true); // เริ่มหมุน
    toast.info(`กำลังถาม AI เกี่ยวกับ "${word}"...`);

    try {
      // เรียก Server Action
      const data = await generateVocabData(word);

      if (data) {
        // 6. เอาข้อมูลที่ได้มายัดใส่ช่อง Input (Auto-fill)
        const defInput = formRef.current?.querySelector('input[name="definition"]') as HTMLInputElement;
        const catSelect = formRef.current?.querySelector('select[name="category"]') as HTMLSelectElement;

        if (defInput) defInput.value = data.definition; // เติมคำแปล
        if (catSelect) catSelect.value = data.category; // เลือกหมวดหมู่

        toast.success("AI เสกข้อมูลให้แล้ว! ✨");
      } else {
        toast.error("AI นึกไม่ออก ลองคำอื่นดูนะ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ AI");
    } finally {
      setIsGenerating(false); // หยุดหมุน
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">จดศัพท์ใหม่</h2>
      
      {/* action={addVocab} คือการผูกฟอร์มเข้ากับ Server Action ตรงๆ */}
      <form ref={formRef} 
      action={async (formData: FormData) => {
        try {
          const word = formData.get("word") as string;
          
          if (isEditMode) {
            await updateVocab(vocab.id, formData);
            toast.success("บันทึกการแก้ไขเรียบร้อย! 📝");
            // Redirect กลับหน้าแรกหลังจากแก้ไขเสร็จ
            setTimeout(() => {
              router.push("/");
            }, 500);
          } else {
            await addVocab(formData);
            formRef.current?.reset();
            toast.success(`เพิ่มคำว่า "${word}" สำเร็จ! 🎉`);
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง.");
        }
      }} className="flex flex-col gap-4">

        {/* ช่อง Word */}
        <div>
          <label className="block text-sm font-medium text-gray-700">คำศัพท์</label>
          <div className="flex gap-2 mt-1">
            <input 
              name="word" 
              type="text" 
              placeholder="เช่น Resilience" 
              defaultValue={vocab?.word}
              required 
              className="block w-full rounded-md border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {/* 7. ปุ่ม Magic AI */}
            <button
              type="button" // ต้องเป็น button ธรรมดา (ห้าม submit)
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-purple-100 text-purple-600 p-2 rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50"
              title="ให้ AI ช่วยแปล"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </button>
          </div>
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