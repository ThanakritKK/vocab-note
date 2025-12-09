import Link from "next/link";

export default function Footer() {
    return (
      <footer className="w-full bg-gray-100 py-6 text-center text-gray-500 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Vocab Note App. All rights reserved.</p>
        <p>Created by You (Day 6 Progress)</p>
        <Link href="https://www.google.com" className="text-blue-500 hover:text-blue-600 transition-colors">Google</Link>
      </footer>
    );
  }