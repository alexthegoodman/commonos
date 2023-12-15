import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import { useFlowResultsContext } from "@/context/FlowResultsContext";
import { updateFlow } from "@/fetchers/flow";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function ResultsAutosaver({ id }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useFlowResultsContext();
  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    if (debouncedState.files.length > 0) {
      // save context to db
      console.info("save flow results context to db", debouncedState);
      mutate("resultsKey" + id, () =>
        updateFlow(token, id, "results", JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState]);

  return <></>;
}
