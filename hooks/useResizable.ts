import { useState, useCallback } from "react";

export default function useResizable(initialWidth) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback(
    (mouseEvent) => {
      if (isResizing) {
        setWidth((prevWidth) => prevWidth + mouseEvent.movementX);
      }
    },
    [isResizing]
  );

  return { width, startResizing, stopResizing, resize };
}
