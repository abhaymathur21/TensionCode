"use client";

import { cn } from "@/lib/utils";
import React, { use, useEffect, useRef } from "react";

interface FlowchartProps {
  chartCode: string;
  className?: string;
  options?: object;
  onClick?: (value: string) => void;
}

const Flowchart: React.FC<FlowchartProps> = ({
  chartCode,
  options = {},
  className = "",
  onClick = () => {},
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  let FlowChart = useRef<any>();

  useEffect(() => {
    FlowChart.current = require("flowchart.js");
  }, []);

  useEffect(() => {
    const flow = FlowChart.current.parse(chartCode);

    if (chartRef.current) {
      flow.drawSVG(chartRef.current, options);
    }
  }, [chartCode, options]);

  useEffect(() => {
    const flowNew = FlowChart.current.parse(chartCode);

    if (chartRef.current) {
      Array.from(chartRef.current.children).forEach((child) => {
        chartRef!.current?.removeChild(child);
      });
      flowNew.drawSVG(chartRef.current, options);
    }
  }, [chartCode, options]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "tspan") {
      onClick(target.innerHTML);
    }
    if (target.tagName === "rect" || target.tagName === "path") {
      onClick(target.id);
    }
  };

  return (
    <div
      ref={chartRef}
      onClick={handleClick}
      className={cn("grid place-items-center p-8 *:w-full", className)}
    />
  );
};

export default Flowchart;
