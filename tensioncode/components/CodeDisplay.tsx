"use client";
import Flowchart from "@/components/Flowchart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ClipboardIcon,
  DownloadIcon,
} from "lucide-react";
import { useState } from "react";

const langToExt: Record<string, string> = {
  python: "py",
  javascript: "js",
};

const options = {
  // 'x': 30,
  // 'y': 50,
  "line-width": 2,
  maxWidth: 5, //ensures the flowcharts fits within a certian width
  "line-length": 50,
  "text-margin": 10,
  "font-size": 16,
  "font-family": "Helvetica",
  "font-weight": "normal",
  "font-color": "black",
  "line-color": "white",
  "element-color": "white",
  fill: "rgb(22, 163, 74)",
  "yes-text": "yes",
  "no-text": "no",
  "arrow-end": "block",
  "text-align": "center",
  scale: 1,
  symbols: {
    start: {
      "font-weight": "bold",
    },
    end: {
      "font-weight": "bold",
    },
  },
  flowstate: {
    // past: { fill: "#CCCCCC", "font-size": 12 },
    // current: { fill: "green", "font-color": "black", "font-weight": "bold" },
    // future: { fill: "#FFFF99" },
    // request: { fill: "blue" },
    // invalid: { fill: "#444444" },
    // approved: {
    //   fill: "#58C4A3",
    //   "font-size": 12,
    //   "yes-text": "APPROVED",
    //   "no-text": "n/a",
    // },
    // rejected: {
    //   fill: "#C45879",
    //   "font-size": 12,
    //   "yes-text": "n/a",
    //   "no-text": "REJECTED",
    // },
  },
};

const CodeDisplay = ({
  history,
  index,
  handleFormInput,
  formInput,
  handleSubmit,
  loading,
}: any) => {
  const [mode, setMode] = useState<"original" | "evaluated">("original");
  console.log(history);

  return (
    <div className="grid w-2/3 grid-cols-[1fr_auto] items-center  gap-2">
      <h2 className="text-2xl font-bold text-primary-foreground">
        Generated {index + 1}
      </h2>
      <div className="flex gap-4">
        <Toggle
          onPressedChange={() => {
            setMode((prev) => (prev === "original" ? "evaluated" : "original"));
          }}
          variant="outline"
          pressed={mode === "evaluated"}
        >
          {mode === "original" ? "Original" : "Evaluated"}
        </Toggle>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              mode === "original" ? history.orignal : history.evaluated,
            );
          }}
        >
          <ClipboardIcon size={24} />
        </Button>
        <Button
          onClick={() => {
            const blob = new Blob(
              [mode === "original" ? history.orignal : history.evaluated],
              {
                type: "text/plain",
              },
            );
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

      <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-primary-foreground p-4 font-mono text-sm text-slate-900">
        <code>{mode === "original" ? history.orignal : history.evaluated}</code>
      </pre>

      {history.flowchart && (
        <Flowchart
          chartCode={history.flowchart}
          options={options}
          className="h-96 overflow-auto bg-slate-900"
        />
      )}

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
  );
};
export default CodeDisplay;
