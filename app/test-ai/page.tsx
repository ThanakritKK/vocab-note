import { testAI } from "@/app/actions";

export default function TestPage() {
  return (
    <div className="p-10">
      <form action={async () => {
        "use server";
        await testAI("Resilience");
      }}>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Test AI (Check Terminal)
        </button>
      </form>
    </div>
  );
}