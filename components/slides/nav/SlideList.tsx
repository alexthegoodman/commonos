import { useSlidesContext } from "@/context/SlidesContext";
import { Box, Button } from "@mui/material";

export default function SlideList() {
  const [state, dispatch] = useSlidesContext();

  const selectSlide = (slideId) => {
    dispatch({
      type: "currentSlideId",
      payload: slideId,
    });
  };

  return (
    <Box display="flex" flexDirection="column">
      {state.slides.map((slide) => {
        return (
          <Button key={slide.id} onClick={() => selectSlide(slide.id)}>
            {slide.title}
          </Button>
        );
      })}
    </Box>
  );
}
