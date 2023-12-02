import { useSlidesContext } from "@/context/SlidesContext";
import { Box, Button } from "@mui/material";

const testSlideData = [
  {
    id: "1",
    title: "Slide 1",
  },
  {
    id: "2",
    title: "Slide 2",
  },
  {
    id: "3",
    title: "Slide 3",
  },
];

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
        const slideData = testSlideData.find((s) => s.id === slide.id);
        return (
          <Button key={slide.id} onClick={() => selectSlide(slide.id)}>
            {slideData.title}
          </Button>
        );
      })}
    </Box>
  );
}
