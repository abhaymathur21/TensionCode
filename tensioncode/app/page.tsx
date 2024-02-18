"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {
  const [formInput, setFormInput] = useState({
    task: "",
    language: "",
    input_format: "",
    output_format: "",
    db_provider: "",
    db_schema: "",
  });

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="grid min-h-screen bg-slate-900">
      <section className="grid h-screen place-items-center p-8">
        <div className="grid w-1/2 items-center gap-2">
          <Image
            src="/logo.svg"
            alt="TensionCode Logo"
            className="mx-auto size-32"
            width={128}
            height={128}
          />
          <form className="grid grid-cols-[1fr_auto] gap-4">
            <Input placeholder="Task" name="task" onChange={handleFormInput} />
            <Button type="submit" className="">
              <ArrowRightIcon size={24} />
            </Button>
          </form>
          <div className="div size-32"></div>
        </div>
      </section>
      <section className="min-h-screen"></section>
    </main>
  );
}
