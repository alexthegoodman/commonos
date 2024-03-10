"use client";

import { autocomplete } from "@algolia/autocomplete-js";
import React, { createElement, Fragment, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export function Autocomplete(props) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  const panelContainer = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      detachedMediaQuery: "none",
      container: containerRef.current,
      //   panelContainer: panelRootRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          if (!panelContainer.current) {
            return;
          }

          rootRef.current = root;

          //   console.info("root", root);

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(panelContainer.current);
        }

        panelRootRef.current.render(children);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return (
    <>
      <div ref={containerRef} />
      <div ref={panelContainer} />
    </>
  );
}
