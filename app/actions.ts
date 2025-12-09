"use server"; 

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { generateVocabData } from "@/lib/ai";

// ทดสอบ AI เดี๋ยวมาลบออก
export async function testAI(word: string) {
  const data = await generateVocabData(word);
  console.log("🤖 AI Answer:", data);
  return data;
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