"use client";

import { useState } from "react";
import { generateTopicAction, addVocab, type VocabWord } from "@/app/actions";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles, BookOpen, Check, CheckCheck } from "lucide-react";

export default function TopicGenerator() {
  const [loading, setLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState<string | null>(null);
  const [suggestedWords, setSuggestedWords] = useState<VocabWord[]>([]);
  
  // 🆕 State สำหรับ Multi-Select
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [addingWords, setAddingWords] = useState<Set<string>>(new Set()); // Track คำที่กำลังบันทึก

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    setTopicLoading(topic);
    setSuggestedWords([]);
    setSelectedWords(new Set()); // 🆕 ล้าง selection เมื่อ generate ใหม่

    try {
      const words = await generateTopicAction(topic);
      if (words.length > 0) {
        setSuggestedWords(words);
        toast.success(`AI เจอ ${words.length} คำน่าสนใจสำหรับ "${topic}"!`);
      } else {
        toast.warning("คุณน่าจะรู้ศัพท์หมวดนี้หมดแล้ว หรือ AI นึกไม่ออก");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ AI");
    } finally {
      setLoading(false);
      setTopicLoading(null);
    }
  };

  // 🆕 Toggle เลือก/ไม่เลือก คำศัพท์
  const toggleSelect = (word: string) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
  };

  // 🆕 เลือกทั้งหมด / ยกเลิกทั้งหมด
  const toggleSelectAll = () => {
    if (selectedWords.size === suggestedWords.length) {
      setSelectedWords(new Set()); // ยกเลิกทั้งหมด
    } else {
      setSelectedWords(new Set(suggestedWords.map((w) => w.word))); // เลือกทั้งหมด
    }
  };

  // Helper: บันทึกคำศัพท์ 1 คำ
  const saveWord = async (wordData: VocabWord): Promise<boolean> => {
    const formData = new FormData();
    formData.append("word", wordData.word);
    formData.append("definition", wordData.definition);
    formData.append("category", wordData.category);

    try {
      await addVocab(formData);
      return true;
    } catch {
      return false;
    }
  };

  // บันทึกคำเดียว (ปุ่ม + ที่การ์ด)
  const handleAddSingle = async (wordData: VocabWord) => {
    setAddingWords((prev) => new Set(prev).add(wordData.word));

    const success = await saveWord(wordData);
    
    if (success) {
      toast.success(`บันทึก "${wordData.word}" เรียบร้อย! 🎉`);
      setSuggestedWords((prev) => prev.filter((w) => w.word !== wordData.word));
      setSelectedWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordData.word);
        return newSet;
      });
    } else {
      toast.error(`บันทึก "${wordData.word}" ไม่สำเร็จ`);
    }

    setAddingWords((prev) => {
      const newSet = new Set(prev);
      newSet.delete(wordData.word);
      return newSet;
    });
  };

  // 🆕 บันทึกคำที่เลือก (Bulk Add)
  const handleAddSelected = async () => {
    if (selectedWords.size === 0) {
      toast.warning("กรุณาเลือกคำศัพท์ก่อนนะ");
      return;
    }

    const wordsToAdd = suggestedWords.filter((w) => selectedWords.has(w.word));
    
    // Mark ทุกคำที่จะเพิ่มว่ากำลัง loading
    setAddingWords(new Set(wordsToAdd.map((w) => w.word)));

    let successCount = 0;
    const savedWords: string[] = [];

    for (const wordData of wordsToAdd) {
      const success = await saveWord(wordData);
      if (success) {
        successCount++;
        savedWords.push(wordData.word);
      }
    }

    // ลบคำที่บันทึกสำเร็จออกจากรายการ
    setSuggestedWords((prev) => prev.filter((w) => !savedWords.includes(w.word)));
    setSelectedWords(new Set());
    setAddingWords(new Set());

    if (successCount > 0) {
      toast.success(`บันทึก ${successCount} คำเรียบร้อย! 🎉`);
    }
    if (successCount < wordsToAdd.length) {
      toast.error(`${wordsToAdd.length - successCount} คำบันทึกไม่สำเร็จ`);
    }
  };

  // 🆕 บันทึกทั้งหมด
  const handleAddAll = async () => {
    if (suggestedWords.length === 0) return;

    setAddingWords(new Set(suggestedWords.map((w) => w.word)));

    let successCount = 0;
    const savedWords: string[] = [];

    for (const wordData of suggestedWords) {
      const success = await saveWord(wordData);
      if (success) {
        successCount++;
        savedWords.push(wordData.word);
      }
    }

    setSuggestedWords((prev) => prev.filter((w) => !savedWords.includes(w.word)));
    setSelectedWords(new Set());
    setAddingWords(new Set());

    if (successCount > 0) {
      toast.success(`บันทึกทั้งหมด ${successCount} คำเรียบร้อย! 🎉`);
    }
  };

  return (
    <div className="w-full max-w-sm mb-8">
      {/* Header Section */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-4 rounded-t-lg shadow-sm flex items-center gap-2">
        <Sparkles className="text-yellow-300 w-5 h-5 animate-pulse" />
        <h3 className="font-bold text-white">AI Topic Generator</h3>
      </div>

      <div className="bg-white p-4 rounded-b-lg shadow-sm border-x border-b border-gray-200">
        <p className="text-sm text-gray-500 mb-3">เลือกหัวข้อที่อยากเรียนรู้เพิ่ม:</p>
        
        {/* Topic Buttons */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["Business", "Technology", "Travel", "Cooking", "Medical"].map((topic) => (
            <button
              key={topic}
              onClick={() => handleGenerate(topic)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-full transition-all border 
                ${topicLoading === topic 
                  ? "bg-purple-100 border-purple-300 text-purple-700" 
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600"
                } disabled:opacity-50`}
            >
              {topicLoading === topic ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> {topic}
                </span>
              ) : (
                topic
              )}
            </button>
          ))}
        </div>

        {/* Global Loading State (กรณีโหลดนาน) */}
        {loading && !suggestedWords.length && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="text-xs">AI กำลังคัดเลือกคำศัพท์ที่ไม่ซ้ำให้คุณ...</span>
          </div>
        )}

        {/* Results Grid */}
        {suggestedWords.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 🆕 Header with Actions */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  ผลลัพธ์จาก AI ({suggestedWords.length})
                </h4>
                {/* Select All Checkbox */}
                <button
                  onClick={toggleSelectAll}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    selectedWords.size === suggestedWords.length
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {selectedWords.size === suggestedWords.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                </button>
              </div>
              <button 
                onClick={() => {
                  setSuggestedWords([]);
                  setSelectedWords(new Set());
                }}
                className="text-xs text-red-400 hover:text-red-600"
              >
                ล้างทั้งหมด
              </button>
            </div>

            {/* 🆕 Bulk Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddAll}
                disabled={addingWords.size > 0}
                className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-emerald-500 text-white text-sm py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {addingWords.size > 0 && addingWords.size === suggestedWords.length ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                เพิ่มทั้งหมด ({suggestedWords.length})
              </button>
              
              {selectedWords.size > 0 && (
                <button
                  onClick={handleAddSelected}
                  disabled={addingWords.size > 0}
                  className="flex items-center justify-center gap-2 bg-purple-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {addingWords.size > 0 && addingWords.size < suggestedWords.length ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  เพิ่มที่เลือก ({selectedWords.size})
                </button>
              )}
            </div>

            {/* Word Cards with Stagger Animation */}
            <div className="grid gap-3">
              {suggestedWords.map((item, index) => {
                const isSelected = selectedWords.has(item.word);
                const isAdding = addingWords.has(item.word);
                
                return (
                  <div 
                    key={item.word} 
                    className={`group relative bg-white border-2 rounded-lg overflow-hidden transition-all cursor-pointer 
                      animate-in fade-in slide-in-from-bottom-2 duration-300
                      ${isSelected 
                        ? "border-purple-400 bg-purple-50/50 shadow-md" 
                        : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                      } ${isAdding ? "opacity-60 scale-95" : ""}`}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                    onClick={() => !isAdding && toggleSelect(item.word)}
                  >
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        {/* 🆕 Checkbox */}
                        <div className="flex items-start gap-3">
                          <div 
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                              isSelected 
                                ? "bg-purple-500 border-purple-500" 
                                : "border-gray-300 group-hover:border-purple-400"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          
                          <div className="flex-1">
                            {/* Word & Category */}
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-bold text-gray-800 text-lg">{item.word}</span>
                              <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded-full border border-purple-100">
                                {item.category}
                              </span>
                            </div>
                            
                            {/* Definition */}
                            <p className="text-sm text-gray-600 mb-2">{item.definition}</p>
                            
                            {/* Example Sentence */}
                            <div className="flex gap-2 items-start text-xs text-gray-400 bg-gray-50 p-2 rounded italic">
                              <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                              <span>{'"'}{item.example}{'"'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Add Button (Single) */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // ป้องกันไม่ให้ trigger การ select
                            handleAddSingle(item);
                          }}
                          disabled={isAdding}
                          className="bg-green-50 text-green-600 p-2 rounded-full hover:bg-green-500 hover:text-white transition-colors shrink-0 disabled:opacity-50"
                          title="เพิ่มเข้าสมุดจดทันที"
                        >
                          {isAdding ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}