"use client";
import { useFormStatus } from "react-dom";
import { TrashIcon } from 'lucide-react';

export default function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`text-sm font-bold px-2 py-1 rounded transition-colors ${
        pending ? "text-gray-400 cursor-wait" : "text-red-400 hover:text-red-600 hover:bg-red-50"
      }`}
    >
      {pending ? "..." : <TrashIcon className="w-4 h-4" />}
    </button>
  );
}