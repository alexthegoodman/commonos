import { LauncherContext, useLauncherContext } from "@/context/LauncherContext";
import { updateLauncherContext } from "@/fetchers/user";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

export default function Autosaver() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { state, dispatch } = useContext(LauncherContext);
  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    if (debouncedState?.openTabs) {
      // save context to db
      console.info("save launcher context to db", debouncedState);

      mutate("launcherKey", () =>
        updateLauncherContext(token, JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState]);

  return <></>;
}
