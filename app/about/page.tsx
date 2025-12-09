import Link from "next/link";

export default function About() {
    return (
        <div className="flex flex-col items-center p-12 gap-6 bg-gray-50">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">About</h1>
            <p>Developer: JAY </p>
            <p>Goal: practice Next.js and Tailwind CSS for 1 hour each day</p>
            <Link href="/">back to homepage</Link>
        </div>
    );
}