"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CurlyBracesIcon,
  ClipboardIcon,
  DownloadIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [formInput, setFormInput] = useState({
    task: "Write a function to generate a summary of student performance using mean, min and max marks in each subject.",
    language: "javascript",
    input_format: "{}",
    output_format: "",
    db_provider: "mongodb",
    db_schema: "",
    function_template: "",
  });

  const [genHistory, setGenHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const section_1 = useRef<HTMLDivElement>(null);
  const section_2 = useRef<HTMLDivElement>(null);
  const section_3 = useRef<HTMLDivElement>(null);
  const section_4 = useRef<HTMLDivElement>(null);
  const section_5 = useRef<HTMLDivElement>(null);

  const handleFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.log(formInput);
    const body = {
      task: formInput.task,
      language: formInput.language,
      input_params: formInput.input_format,
      output_format: formInput.output_format,
      provider: formInput.db_provider,
      schema: formInput.db_schema,
      function_template: formInput.function_template,
    };
    setLoading(true);
    const res = await fetch("http://localhost:5000/generate_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log(data);
    if (data.autogen_code) {
      setGenHistory((prev) => [...prev, data.autogen_code]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (genHistory.length > 0)
      document.querySelector("main > section:last-child")?.scrollIntoView({
        behavior: "smooth",
      });
  }, [genHistory, loading]);

  return (
    <main className="h-screen snap-y snap-proximity overflow-y-scroll">
      <section
        className="grid h-screen snap-center place-items-center p-8"
        ref={section_1}
      >
        <div className="grid w-1/2 items-center gap-2">
          <Image
            src="/logo.svg"
            alt="TensionCode Logo"
            className="mx-auto size-32"
            width={128}
            height={128}
            priority
          />
          <form
            className="grid grid-cols-[1fr_auto] gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              section_2.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Input placeholder="Task" name="task" onChange={handleFormInput} />
            <Button type="submit" className="">
              <ArrowRightIcon size={24} />
            </Button>
          </form>
          <div className="div size-32"></div>
        </div>
      </section>
      <section
        className="grid h-screen snap-center place-items-center p-8"
        ref={section_2}
      >
        <div className="grid w-1/2 items-center gap-4">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Choose Language and Database
          </h2>
          <form
            className="grid grid-cols-[1fr_1fr_auto] items-center gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              section_3.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Select
              name="language"
              onValueChange={(value) => {
                setFormInput((prev) => ({ ...prev, language: value }));
              }}
            >
              <SelectTrigger className="row-span-2">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>

            <Select
              name="db_provider"
              onValueChange={(value) => {
                setFormInput((prev) => ({ ...prev, db_provider: value }));
              }}
            >
              <SelectTrigger className="row-span-2">
                <SelectValue placeholder="Database" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectGroup>
                  <SelectLabel>SQL</SelectLabel>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                </SelectGroup>
                <SelectGroup className="mt-4">
                  <SelectLabel>NoSQL</SelectLabel>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                </SelectGroup>
                <SelectGroup className="mt-4">
                  <SelectLabel>Flatfile DB</SelectLabel>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              onClick={() =>
                section_1.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowUpIcon size={24} />
            </Button>
            <Button
              type="submit"
              onClick={() =>
                section_4.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowDownIcon size={24} />
            </Button>
          </form>
        </div>
      </section>
      <section
        className="grid h-screen snap-center place-items-center p-8"
        ref={section_3}
      >
        <div className="grid w-2/3 items-center gap-2">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Input and Output Format
          </h2>
          <form
            className="grid grid-cols-[1fr_1fr_auto] items-center gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative row-span-2">
              <Textarea
                placeholder="Input Format"
                name="input_format"
                onChange={handleFormInput}
                className="h-32 font-mono"
                value={formInput.input_format}
              />
              <Button
                className="absolute right-1 top-1 h-fit border border-primary p-2"
                variant="ghost"
                onClick={() => {
                  try {
                    const input = JSON.parse(formInput.input_format);
                    setFormInput((prev) => ({
                      ...prev,
                      input_format: JSON.stringify(input, null, 2),
                    }));
                  } catch (e) {
                    toast.error("Invalid JSON");
                  }
                }}
              >
                <CurlyBracesIcon size={12} />
              </Button>
            </div>

            <div className="relative row-span-2">
              <Textarea
                placeholder="Output Format"
                name="output_format"
                onChange={handleFormInput}
                className=" h-32 font-mono"
                value={formInput.output_format}
              />
              <Button
                className="absolute right-1 top-1 h-fit border border-primary p-2"
                variant="ghost"
                onClick={() => {
                  try {
                    const output = JSON.parse(formInput.output_format);
                    setFormInput((prev) => ({
                      ...prev,
                      output_format: JSON.stringify(output, null, 2),
                    }));
                  } catch (e) {
                    toast.error("Invalid JSON");
                  }
                }}
              >
                <CurlyBracesIcon size={12} />
              </Button>
            </div>
            <Button
              className="h-full"
              onClick={() =>
                section_2.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowUpIcon size={24} />
            </Button>
            <Button
              type="submit"
              className="h-full"
              onClick={() =>
                section_4.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowDownIcon size={24} />
            </Button>
          </form>
        </div>
      </section>
      <section
        className="grid h-screen snap-center place-items-center p-8"
        ref={section_4}
      >
        <div className="grid w-1/2 items-center gap-2">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Database Schema
          </h2>
          <form
            className="grid grid-cols-[1fr_auto] items-center gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative row-span-2">
              <Textarea
                placeholder="Database Schema"
                name="db_schema"
                onChange={handleFormInput}
                className="h-64 font-mono"
                value={formInput.db_schema}
              />
              <Button
                className="absolute right-1 top-1 h-fit border border-primary p-2"
                variant="ghost"
                onClick={() => {
                  try {
                    const schema = JSON.parse(formInput.db_schema);
                    setFormInput((prev) => ({
                      ...prev,
                      db_schema: JSON.stringify(schema, null, 2),
                    }));
                  } catch (e) {
                    toast.error("Invalid JSON");
                  }
                }}
              >
                <CurlyBracesIcon size={12} />
              </Button>
            </div>

            <Button
              className="h-full"
              onClick={() =>
                section_3.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowUpIcon size={24} />
            </Button>

            <Button
              type="submit"
              className="h-full"
              onClick={() =>
                section_5.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowDownIcon size={24} />
            </Button>
          </form>
        </div>
      </section>
      <section
        className="grid h-screen snap-center place-items-center p-8"
        ref={section_5}
      >
        <div className="grid w-1/2 items-center gap-2">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Function Template
          </h2>
          <form
            className="grid grid-cols-[1fr_auto] items-center gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Textarea
              placeholder="Function Template"
              name="function_template"
              onChange={handleFormInput}
              className="row-span-2 h-64 font-mono"
              value={formInput.function_template}
            />

            <Button
              className="h-full"
              onClick={() =>
                section_4.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowUpIcon size={24} />
            </Button>
            <Button
              className="h-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              <ArrowRightIcon size={24} />
            </Button>
          </form>
        </div>
      </section>
      {genHistory.length > 0 &&
        genHistory.map((history, index) => (
          <section
            key={index}
            className="grid h-screen snap-start place-items-center p-8"
          >
            <div className="grid w-2/3 grid-cols-[1fr_auto] items-center  gap-2">
              <h2 className="text-2xl font-bold text-primary-foreground">
                Generated Function {index + 1}
              </h2>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(history);
                  }}
                >
                  <ClipboardIcon size={24} />
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([history], {
                      type: "text/plain",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `function_${index + 1}.txt`;
                    a.click();
                  }}
                >
                  <DownloadIcon size={24} />
                </Button>

                <Button
                  onClick={() => {
                    document
                      .querySelector(`main > section:nth-child(${index + 5})`)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ArrowUpIcon size={24} />
                </Button>
                <Button
                  onClick={() => {
                    document
                      .querySelector(`main > section:nth-child(${index + 7})`)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ArrowDownIcon size={24} />
                </Button>
              </div>

              <pre className="col-span-2 max-h-96 overflow-y-auto rounded-lg bg-primary-foreground p-4 font-mono text-sm text-slate-900">
                <code>{history}</code>
              </pre>
              <div className="col-span-2 flex gap-4">
                <Input
                  type="task"
                  placeholder="Task"
                  name="task"
                  onChange={handleFormInput}
                  value={formInput.task}
                />
                <Button onClick={handleSubmit} disabled={loading}>
                  <ArrowRightIcon size={24} />
                </Button>
              </div>
            </div>
          </section>
        ))}
      {loading && (
        <section className="grid h-screen snap-start place-items-center p-8">
          <div className="grid w-2/3 place-items-center items-center gap-2">
            <h2 className="text-2xl font-bold text-primary-foreground">
              Generating Function
            </h2>
            <div className="m-8 size-8 animate-spin rounded-full border-t-2 border-primary-foreground"></div>
          </div>
        </section>
      )}
    </main>
  );
}
