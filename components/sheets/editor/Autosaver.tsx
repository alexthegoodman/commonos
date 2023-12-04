import { useSheetsContext } from "@/context/SheetsContext";
import { updateSheet } from "@/fetchers/sheet";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id, title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useSheetsContext();
  const debouncedState = useDebounce(state, 500);
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedState.columns.length > 0 && debouncedState.rows.length > 0) {
      // save context to db
      console.info("save sheet context to db", debouncedState);

      mutate("sheetKey" + id, () =>
        updateSheet(token, id, debouncedTitle, JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState, debouncedTitle]);

  return <></>;
}
