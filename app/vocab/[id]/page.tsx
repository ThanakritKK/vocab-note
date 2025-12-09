import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import VocabForm from "@/components/VocabForm";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVocabPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) return <div>Access Denied</div>;

  // 1. รอรับค่า ID จาก URL
  const { id } = await params;
  
  // 2. ดึงข้อมูลศัพท์คำนั้นจาก Database
  const vocab = await prisma.vocab.findUnique({
    where: {
      id: Number(id), // แปลง string เป็น number
      userId: userId, // ต้องเป็นของฉันเท่านั้น
    },
  });

  if (!vocab) {
    return <div>ไม่พบข้อมูล หรือคุณไม่มีสิทธิ์แก้ไข</div>;
  }

  // 3. ส่งข้อมูล (vocab) ไปให้ฟอร์ม -> ฟอร์มจะรู้เองว่าเป็นโหมดแก้ไข
  return (
    <div className="flex flex-col items-center p-12 gap-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600">แก้ไขคำศัพท์</h1>
      
      <VocabForm vocab={vocab} />

      <Link href="/" className="text-gray-500 hover:underline">
        &larr; กลับหน้าแรก
      </Link>
    </div>
  );
}