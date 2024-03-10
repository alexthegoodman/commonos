import { useDrawingsContext } from "@/context/DrawingsContext";
import { useRelationshipsFunnelsContext } from "@/context/RelationshipsFunnelsContext";
import { useSheetsContext } from "@/context/SheetsContext";
import { updateDrawing } from "@/fetchers/drawing";
import { myFunnels, updateFunnel } from "@/fetchers/relationship";
import { updateSheet } from "@/fetchers/sheet";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id, title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useRelationshipsFunnelsContext();
  const debouncedState = useDebounce(state, 500);
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (
      debouncedState.zones.length > 1 ||
      debouncedState.zones[0].cards.length > 0
    ) {
      // save context to db
      console.info("save funnel context to db", debouncedState);

      mutate("funnel" + id, () =>
        updateFunnel(token, id, debouncedTitle, JSON.stringify(debouncedState))
      );
      mutate("funnelsKey", () => myFunnels(token));
    }
  }, [debouncedState, debouncedTitle]);

  return <></>;
}
