import { useSlidesContext } from "@/context/SlidesContext";
import { Box, Button, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function SlideList({ exporting }) {
  const [state, dispatch] = useSlidesContext();

  const selectSlide = (slideId) => {
    dispatch({
      type: "currentSlideId",
      payload: slideId,
    });
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="overline">Your Slides</Typography>
      {state.slides.map((slide) => {
        return (
          <Button
            key={slide.id}
            disabled={exporting}
            onClick={() => selectSlide(slide.id)}
          >
            {slide.title}
          </Button>
        );
      })}
      <Button
        disabled={exporting}
        onClick={() => {
          dispatch({
            type: "slides",
            payload: [
              ...state.slides,
              {
                id: uuidv4(),
                title: "New Slide",
                texts: [],
                shapes: [],
                images: [],
              },
            ],
          });
        }}
      >
        Add Slide
      </Button>
    </Box>
  );
}
