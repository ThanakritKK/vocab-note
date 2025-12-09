import Link from "next/link"; // ใช้ Link แทน <a> เพื่อให้เปลี่ยนหน้าไม่ต้องโหลดใหม่
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
      {/* ส่วนโลโก้ซ้ายมือ */}
      <div className="font-bold text-2xl text-blue-600">
        <Link href="/">VocabNote</Link>
      </div>

      {/* ส่วนเมนูขวามือ */}
      <div className="flex gap-4">
        <Link href="/" className="text-gray-600 py-2 px-4 hover:text-blue-600 transition-colors">
          หน้าแรก
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              ลงชื่อเข้าใช้
            </button>
          </SignInButton>
        </SignedOut>

        {/* ถ้าล็อกอินแล้ว ให้โชว์รูปโปรไฟล์ของผู้ใช้ */}
        <SignedIn>
          <div className="flex items-center [&_.cl-avatarBox]:aspect-square! [&_.cl-avatarBox]:rounded-full! [&_.cl-userButtonTrigger]:aspect-square! [&_.cl-userButtonTrigger]:rounded-full! [&_.cl-userButtonTrigger]:h-8! [&_.cl-userButtonTrigger]:w-8! [&_.cl-avatarBox]:h-8! [&_.cl-avatarBox]:w-8!">
            <UserButton />
          </div>
        </SignedIn>

      </div>
    </nav>
  );
}