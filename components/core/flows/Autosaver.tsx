import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import { updateFlow } from "@/fetchers/flow";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useFlowQuestionsContext();
  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    if (
      debouncedState.initialQuestions.length > 0 ||
      debouncedState.files.length > 0
    ) {
      // save context to db
      console.info("save flow files/questions context to db", debouncedState);
      mutate("flowKey" + id, () =>
        updateFlow(token, id, "questions", JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState]);

  return <></>;
}
