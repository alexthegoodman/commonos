import { useRelationshipsDashboardsContext } from "@/context/RelationshipsDashboardsContext";
import { myDashboards, updateDashboard } from "@/fetchers/relationship";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id, title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useRelationshipsDashboardsContext();
  const debouncedState = useDebounce(state, 500);
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedState.visuals.length > 0) {
      // save context to db
      console.info("save dashboard context to db", debouncedState);

      mutate("dashboard" + id, () =>
        updateDashboard(
          token,
          id,
          debouncedTitle,
          JSON.stringify(debouncedState)
        )
      );
      mutate("dashboardsKey", () => myDashboards(token));
    }
  }, [debouncedState, debouncedTitle]);

  return <></>;
}
