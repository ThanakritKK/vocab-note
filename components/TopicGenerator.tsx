"use client";

import { useState } from "react";
import { generateTopicAction, addVocab, type VocabWord } from "@/app/actions"; // เราจะ reuse addVocab
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export default function TopicGenerator() {
  const [loading, setLoading] = useState(false);
  const [suggestedWords, setSuggestedWords] = useState<VocabWord[]>([]);

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    setSuggestedWords([]); // ล้างของเก่า
    toast.info(`กำลังค้นหาศัพท์เกี่ยวกับ "${topic}"...`);

    try {
      const words = await generateTopicAction(topic);
      if (words.length > 0) {
        setSuggestedWords(words);
        toast.success(`เจอ ${words.length} คำใหม่ที่ไม่ซ้ำ!`);
      } else {
        toast.warning("คุณน่าจะรู้ศัพท์หมวดนี้หมดแล้ว หรือ AI นึกไม่ออก");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันกดปุ่มบวก แล้วบันทึกลง DB ทันที
  const handleAdd = async (wordData: VocabWord) => {
    // สร้าง FormData หลอกๆ เพื่อ reuse server action เดิม
    const formData = new FormData();
    formData.append("word", wordData.word);
    formData.append("definition", wordData.definition);
    formData.append("category", wordData.category);

    await addVocab(formData);
    toast.success(`เพิ่ม "${wordData.word}" แล้ว!`);
    
    // ลบคำที่เพิ่มแล้วออกจากรายการโชว์
    setSuggestedWords((prev) => prev.filter((w) => w.word !== wordData.word));
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-purple-100 mb-6">
      <h3 className="font-bold text-purple-700 mb-3">✨ ไอเดียคำศัพท์ (AI)</h3>
      
      <div className="flex gap-2 flex-wrap mb-4">
        {["Business", "Technology", "Travel", "Cooking"].map((topic) => (
          <button
            key={topic}
            onClick={() => handleGenerate(topic)}
            disabled={loading}
            className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            {topic}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-purple-500" /></div>}

      <div className="space-y-2">
        {suggestedWords.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
            <div>
              <div className="font-bold">{item.word}</div>
              <div className="text-gray-500 text-xs">{item.definition}</div>
            </div>
            <button 
              onClick={() => handleAdd(item)}
              className="bg-green-100 text-green-600 p-1 rounded hover:bg-green-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}