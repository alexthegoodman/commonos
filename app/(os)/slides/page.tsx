"use client";

import { getSlideData, getSlidesData, newSlide } from "@/fetchers/slide";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function Slides(props) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();

  const {
    data: slidesData,
    error,
    isLoading,
  } = useSWR("slidesKey", () => getSlidesData(token), {
    revalidateOnMount: true,
  });

  const addPresentation = async () => {
    const { id } = await newSlide(token);

    router.push(`/slides/${id}`);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addPresentation}>Add Presentation</Button>
      </Grid>
      {!isLoading ? (
        slidesData?.map((slide) => (
          <Grid item xs={12} md={2} key={slide.id}>
            <Button
              onClick={() => {
                router.push(`/slides/${slide.id}`);
              }}
            >
              {slide.title}
            </Button>
          </Grid>
        ))
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}
