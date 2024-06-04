import { useSlidesContext } from "@/context/SlidesContext";
import { Box, Button, Typography, styled } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export const SlideButton = styled(Button)(({ theme, selected }) => ({
  padding: 0,
  borderBottom: "4px transparent solid",
  borderRadius: "0px !important",
  fontSize: "16px",
  position: "relative",

  // borderColor: selected ? `${theme.palette.success.main}` : "transparent",
  // backgroundColor: selected
  //   ? "rgba(56, 239, 125, 0.2) !important"
  //   : "transparent !important",

  paddingLeft: selected ? "25px" : "0px",
  transition: "all 0.2s",

  "&:before": {
    content: '" "',
    borderRadius: "50%",
    backgroundColor: theme.palette.success.main,
    display: selected ? "block" : "none",
    width: "8px",
    height: "8px",
    position: "absolute",
    left: "0px",
    top: "30px",
    transition: "all 0.2s",
  },

  "&:hover": {
    backgroundColor: "transparent !important",
    // borderColor: `${theme.palette.success.main}`,
    color: `${theme.palette.grey[700]} !important`,
    paddingLeft: "25px",
    transition: "all 0.2s",
    "&:before": {
      display: "block",
    },
  },
}));

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
          <SlideButton
            key={slide.id}
            disabled={exporting}
            selected={state.currentSlideId === slide.id}
            onClick={() => {
              // TODO: scroll sidebar to most recent message
              selectSlide(slide.id);
            }}
          >
            {slide.title}
          </SlideButton>
        );
      })}
      <Button
        disabled={exporting}
        color="success"
        variant="contained"
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
