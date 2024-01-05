import dynamic from "next/dynamic";

export const DynamicEditor = dynamic(() => import("./SlideEditor"), {
  ssr: false,
});
