import { useSlidesContext } from "@/context/SlidesContext";
import { updateSlide } from "@/fetchers/slide";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useSlidesContext();
  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    if (state.slides.length > 0) {
      // save context to db
      console.info("save context to db", debouncedState);
      updateSlide(
        token,
        id,
        debouncedState.title,
        JSON.stringify(debouncedState)
      );
    }
  }, [debouncedState]);

  return <></>;
}
