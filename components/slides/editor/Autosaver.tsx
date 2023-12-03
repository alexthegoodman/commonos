import { useSlidesContext } from "@/context/SlidesContext";
import { getSlideData, updateSlide } from "@/fetchers/slide";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { mutate } from "swr";
import { useDebounce } from "usehooks-ts";

export default function Autosaver({ id, title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useSlidesContext();
  const debouncedState = useDebounce(state, 500);
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedState.slides.length > 0) {
      // save context to db
      console.info("save context to db", debouncedState);

      mutate("slideKey" + id, () =>
        updateSlide(token, id, debouncedTitle, JSON.stringify(debouncedState))
      );
    }
  }, [debouncedState, debouncedTitle]);

  return <></>;
}
