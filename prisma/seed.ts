import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. ล้างข้อมูลเก่าทิ้งก่อน (ถ้ามี) จะได้ไม่ซ้ำ
  // (ระวัง: ใช้ deleteMany เฉพาะตอน dev นะครับ)
  await prisma.vocab.deleteMany()

  // 2. เพิ่มข้อมูลตัวอย่าง
  await prisma.vocab.createMany({
    data: [
      {
        word: "Resilience",
        definition: "ความสามารถในการฟื้นตัวจากความยากลำบาก",
        category: "Mindset",
        isMemorized: false,
      },
      {
        word: "Pragmatic",
        definition: "เน้นการปฏิบัติจริงมากกว่าทฤษฎี",
        category: "Adjective",
        isMemorized: true,
      },
      {
        word: "Supabase",
        definition: "Firebase alternative ที่ใช้ PostgreSQL",
        category: "Tech",
        isMemorized: false,
      },
      {
        word: "Consistency",
        definition: "ความสม่ำเสมอ, ความคงเส้นคงวา (กุญแจสู่ความสำเร็จ)",
        category: "Noun",
        isMemorized: false,
      },
      {
        word: "Empathy",
        definition: "ความเห็นอกเห็นใจ, การเข้าใจความรู้สึกผู้อื่น",
        category: "Soft Skill",
        isMemorized: false
      }
    ],
  })

  console.log('🌱 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })