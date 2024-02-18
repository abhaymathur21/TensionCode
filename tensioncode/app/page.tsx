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
import { json } from "stream/consumers";

export default function Home() {
  const [formInput, setFormInput] = useState<{
    task: string;
    language: string;
    input_format: string;
    output_format: string;
    db_provider: string;
    db_schema: string;
    function_template: string;
    schema_format: string;
    image: Blob | undefined;
    table: Blob | undefined;
  }>({
    task: "Write a function to generate a summary of student performance using mean, min and max marks in each subject.",
    language: "javascript",
    input_format: "{}",
    output_format: "",
    db_provider: "mongodb",
    db_schema: "",
    function_template: "",
    schema_format: "json",
    image: undefined,
    table: undefined,
  });

  const [genHistory, setGenHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const section_1 = useRef<HTMLDivElement>(null);
  const section_2 = useRef<HTMLDivElement>(null);
  const section_3 = useRef<HTMLDivElement>(null);
  const section_4 = useRef<HTMLDivElement>(null);
  const section_5 = useRef<HTMLDivElement>(null);

  const langToExt: Record<string, string> = {
    python: "py",
    javascript: "js",
  };

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

    const form_data = new FormData();
    form_data.append("task", formInput.task);
    form_data.append("language", formInput.language);
    form_data.append("input_params", formInput.input_format);
    form_data.append("output_format", formInput.output_format);
    form_data.append("provider", formInput.db_provider);
    form_data.append("schema", formInput.db_schema);
    form_data.append("function_template", formInput.function_template);
    form_data.append("schema_format", formInput.schema_format);
    form_data.append("image", formInput.image! as Blob);
    form_data.append("table", formInput.table! as Blob);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/generate_code", {
        method: "POST",
        body: form_data,
      });
      const data = await res.json();
      console.log(data);
      if (data.autogen_code) {
        setGenHistory((prev) => [...prev, data.autogen_code]);
      }
    } catch (e) {
      toast.error("Error generating function");
    } finally {
      setLoading(false);
    }
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
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
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
          <Select
            name="schema_format"
            onValueChange={(value) => {
              setFormInput((prev) => ({ ...prev, schema_format: value }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Schema Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON/Plaintext</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              {["csv", "json", "xml"].includes(formInput.db_provider) && (
                <SelectItem value="table">Table</SelectItem>
              )}
            </SelectContent>
          </Select>

          <form
            className="grid grid-cols-[1fr_auto] items-center gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative row-span-2">
              {
                {
                  json: (
                    <>
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
                    </>
                  ),
                  image: (
                    <Input
                      type="file"
                      placeholder="Database Schema"
                      name="image"
                      onChange={(e) => {
                        setFormInput((prev) => ({
                          ...prev,
                          image: e.target.files?.[0],
                        }));
                      }}
                    />
                  ),
                  table: (
                    <Input
                      type="file"
                      placeholder="Database Schema"
                      name="table"
                      onChange={(e) => {
                        setFormInput((prev) => ({
                          ...prev,
                          table: e.target.files?.[0],
                        }));
                      }}
                    />
                  ),
                }[formInput.schema_format]
              }
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
            {genHistory.length > 0 ? (
              <Button
                className="h-full"
                onClick={() =>
                  document
                    .querySelector("main > section:last-child")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <ArrowDownIcon size={24} />
              </Button>
            ) : (
              <Button
                className="h-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                <ArrowRightIcon size={24} />
              </Button>
            )}
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
                    a.download = `function_${index + 1}.${langToExt[formInput.language]}`;
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
