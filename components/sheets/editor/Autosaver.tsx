import { useSheetsContext } from "@/context/SheetsContext";
import { updateSheet } from "@/fetchers/sheet";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

export default function Autosaver({ id, title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useSheetsContext();
  const debouncedState = useDebounce(state, 500);
  const debouncedTitle = useDebounce(title, 500);

  const [stateChecked, setStateChecked] = useState(false);

  useEffect(() => {
    if (
      debouncedState.sheets.length > 0 ||
      (debouncedState.columns.length > 0 && debouncedState.rows.length > 0)
    ) {
      // save context to db
      console.info("save sheet context to db", debouncedState);

      mutate("sheetKey" + id, () =>
        updateSheet(token, id, debouncedTitle, JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState, debouncedTitle]);

  // backwards compatability
  // add ids to cells
  useEffect(() => {
    if (!stateChecked) {
      setStateChecked(true);

      dispatch({
        type: "sheets",
        payload: state.sheets.map((sheet) => {
          return {
            ...sheet,
            rows: sheet.rows.map((row) => {
              return {
                ...row,
                cells: row.cells.map((cell) => {
                  return {
                    ...cell,
                    id: cell.id ? cell.id : uuidv4(),
                  };
                }),
              };
            }),
          };
        }),
      });
    }
  }, [state]);

  return <></>;
}
