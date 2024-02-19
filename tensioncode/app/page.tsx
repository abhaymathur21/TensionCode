"use client";
import CodeDisplay from "@/components/CodeDisplay";
import Flowchart from "@/components/Flowchart";
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
  ClipboardIcon,
  CurlyBracesIcon,
  DownloadIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
    task: "",
    language: "",
    input_format: "",
    output_format: "",
    db_provider: "",
    db_schema: "",
    function_template: "",
    schema_format: "text",
    image: undefined,
    table: undefined,
  });

  const [genHistory, setGenHistory] = useState<
    {
      orignal: string;
      evaluated: string;
      flowchart: string;
    }[]
  >([]);
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
      setGenHistory((prev) => [
        ...prev,
        {
          orignal: data?.generated_code ? data.generated_code : "",
          evaluated: data?.autogen_code ? data.autogen_code : "",
          flowchart: data?.flowchart_code
            ? data.flowchart_code.replace(/(```)?(.*)(```)?/g, "$2")
            : "",
        },
      ]);
    } catch (e) {
      toast.error("Error generating function");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genHistory.length > 0 || loading)
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
        <div className="grid w-1/2 items-center gap-6">
          <h1 className="text-center font-mono text-4xl font-bold uppercase text-primary-foreground">
            Tension_code
          </h1>
          <form
            className="grid grid-cols-[1fr_auto] gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input placeholder="Task" name="task" onChange={handleFormInput} />
            <Button
              type="submit"
              onClick={() =>
                section_2.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowRightIcon size={24} />
            </Button>
          </form>
          <div className="div size-16"></div>
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
            onSubmit={(e) => e.preventDefault()}
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
              onClick={() =>
                section_3.current?.scrollIntoView({ behavior: "smooth" })
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
                className="h-48 font-mono"
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
                className=" h-48 font-mono"
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
              <SelectItem value="text">plaintext</SelectItem>
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
                  text: (
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
            <CodeDisplay
              history={history}
              formInput={formInput}
              index={index}
              loading={loading}
              handleFormInput={handleFormInput}
              handleSubmit={handleSubmit}
            />
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
