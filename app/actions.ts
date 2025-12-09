"use server"; 

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { generateVocabData as generateVocabDataFromAI, generateVocabSet, type VocabWord } from "@/lib/ai";

// Re-export type เพื่อให้ components ใช้ได้
export type { VocabWord };

// ฟังก์ชัน wrapper สำหรับเรียก AI และตรวจสอบ authentication
export async function generateVocabData(word: string): Promise<{
  definition: string;
  category: string;
  example: string;
} | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("คุณต้องล็อกอินก่อนจึงจะสามารถจดศัพท์ได้!");
  }

  const data = await generateVocabDataFromAI(word);
  return data;
}

export async function generateTopicAction(topic: string): Promise<VocabWord[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("คุณต้องล็อกอินก่อนจึงจะสามารถจดศัพท์ได้!");    
  }

  const aiWords = await generateVocabSet(topic, 10) as VocabWord[];

  if (!aiWords || aiWords.length === 0) return [];

  // ดึงคำศัพท์ที่มีอยู่แล้วในฐานข้อมูล
  const existingVocabs = await prisma.vocab.findMany({
    where: {
      userId: userId,
      word: {
        in: aiWords.map((w) => w.word),
      },
    },
    select: {
      word: true,
    },
  });
  
  // สร้าง Set เพื่อให้เช็คง่ายๆ (เช่น { "apple", "banana" })
  const existingSet = new Set(existingVocabs.map(v => v.word.toLowerCase()));

  // กรองคำซ้ำทิ้ง!
  const newWords = aiWords.filter((w) => !existingSet.has(w.word.toLowerCase()));

  // ส่งกลับไปแค่ 5 คำแรก (หรือตามจำนวนที่เหลือ)
  return newWords.slice(0, 5);
}



// ฟังก์ชันนี้รับ FormData (ข้อมูลดิบจากฟอร์ม HTML)
export async function addVocab(formData: FormData) {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("คุณต้องล็อกอินก่อนจึงจะสามารถจดศัพท์ได้!");
  }
  
  // 1. ดึงค่าจาก input ทีละช่อง (ตามชื่อ name="..." ใน HTML)
  const word = formData.get("word") as string;
  const definition = formData.get("definition") as string;
  const category = formData.get("category") as string;

  // 2. ยัดลง Database ผ่าน Prisma
  await prisma.vocab.create({
    data: {
      word,
      definition,
      category,
      isMemorized: false, // ค่าเริ่มต้นคือยังจำไม่ได้
      userId,
    },
  });

  // 3. สั่งให้หน้าเว็บโหลดข้อมูลใหม่ (เพราะข้อมูลเปลี่ยนแล้ว)
  revalidatePath("/");

}


export async function deleteVocab(vocabId: number) {

  const { userId } = await auth();
  if (!userId) return;

  await prisma.vocab.deleteMany({
    where: {
      id: vocabId,
      userId: userId,
    },
  });

  revalidatePath("/");

}

export async function updateVocab(id:number, formData: FormData) {

  const { userId } = await auth();
  if (!userId) {
    throw new Error("คุณต้องล็อกอินก่อนจึงจะสามารถแก้ไขศัพท์ได้!");
  }

  const word = formData.get("word") as string;
  const definition = formData.get("definition") as string;
  const category = formData.get("category") as string;

  await prisma.vocab.update({
    where: {
      id: id,
      userId: userId,
    },
    data: {
      word,
      definition,
      category,
    },
  });

  revalidatePath("/");
  revalidatePath(`/vocab/${id}`);
}
