import { useSlidesContext } from "@/context/SlidesContext";
import { useEffect } from "react";
import { useDebounce } from "usehooks-ts";

export default function Autosaver() {
  const [state, dispatch] = useSlidesContext();
  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    // save context to db
    console.info("save context to db", debouncedState);
  }, [debouncedState]);

  return <></>;
}
