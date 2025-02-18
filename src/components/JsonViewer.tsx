"use client";

import React from "react";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

interface Props {
  data: any;
}

export default function JsonViewer({ data }: Props) {
  if (!data) return null;
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl mb-2">Risultato JSON</h3>
      <ReactJson src={data} theme="monokai" />
    </div>
  );
}
