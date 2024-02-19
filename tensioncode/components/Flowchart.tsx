// components/FlowChart.tsx
import React from "react";
import FlowChart from "react-flow-renderer";

interface Data {
  [key: string]: {
    description: string;
    next?: string;
    actions?: { [key: string]: string };
  };
}

interface FlowChartProps {
  data: Data;
}

const FlowChartComponent: React.FC<FlowChartProps> = ({ data }) => {
  const elements = Object.keys(data).map((key) => ({
    id: key,
    data: { label: data[key].description },
    position: { x: 0, y: 0 }, // You may adjust positions as needed
    type: "default",
  }));

  const edges = Object.keys(data)
    .map((key) => {
      const next = data[key].next;
      return next
        ? { id: `${key}-${next}`, source: key, target: next, type: "default" }
        : null;
    })
    .filter((edge) => edge !== null);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      {/*@ts-ignore*/}
      <FlowChart elements={elements} nodes={elements} edges={edges} />
    </div>
  );
};

export default FlowChartComponent;
