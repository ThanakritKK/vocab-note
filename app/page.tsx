import VocabForm from "@/components/VocabForm";
import VocabCard from "@/components/VocabCard";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

export default async function Home(props: { 
  searchParams?: Promise<{
     query?: string;
     category?: string;
     }>;
     }) {

      const searchParams = await props.searchParams;
      const query = searchParams?.query || "";
      const category = searchParams?.category || "";

  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex flex-col items-center p-12 gap-6 bg-gray-50 h-full min-h-screen justify-center">
        <h1 className="text-3xl font-bold">กรุณาล็อกอินเพื่อเริ่มใช้งาน</h1>
      </div>
    );
  }


  const vocabList = await prisma.vocab.findMany({
    where: {
      userId: userId,
      ...(category ? { category: category } : {}),
      ...(query ? {
        OR: [
          { word: { contains: query, mode: "insensitive" } },
          { definition: { contains: query, mode: "insensitive" } }
        ]
      } : {})
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col items-center p-12 gap-6 bg-gray-50 h-full min-h-screen">

      <VocabForm />

      <div className="relative w-full max-w-sm">
        <SearchBar />
        <CategoryFilter />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {vocabList.length > 0 ? (
          vocabList.map((vocab, index) => {
            return (
              <VocabCard
                key={index}
                id={vocab.id}
                word={vocab.word}
                definition={vocab.definition}
                category={vocab.category}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <p className="text-gray-500 text-center">ยังไม่มีคำศัพท์จ้า เริ่มจดศัพท์เลย!</p>
          </div>
        )}
      </div>
    </div>
  );
}
