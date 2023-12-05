import { useDrawingsContext } from "@/context/DrawingsContext";
import { useSheetsContext } from "@/context/SheetsContext";
import { updateDrawing } from "@/fetchers/drawing";
import { updateSheet } from "@/fetchers/sheet";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id, title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useDrawingsContext();
  const debouncedState = useDebounce(state, 500);
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedState.lines.length > 0 || debouncedState.images.length > 0) {
      // save context to db
      console.info("save drawing context to db", debouncedState);

      mutate("drawingKey" + id, () =>
        updateDrawing(token, id, debouncedTitle, JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState, debouncedTitle]);

  return <></>;
}
