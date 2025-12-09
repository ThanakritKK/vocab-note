import Link from "next/link";

export default function Footer() {
    return (
      <footer className="w-full bg-gray-100 py-6 text-center text-gray-500 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} VocabNote. All rights reserved.</p>
      </footer>
    );
  }