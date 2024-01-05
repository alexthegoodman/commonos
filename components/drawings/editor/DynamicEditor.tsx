import dynamic from "next/dynamic";

export const DynamicEditor = dynamic(() => import("./DrawingEditor"), {
  ssr: false,
});
