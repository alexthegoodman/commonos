"use client";

import { Box, Button, Typography, styled } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { howToUseSteps } from "../landing/HowToUse";
import { useState } from "react";

const responsive = {
  all: {
    breakpoint: { max: 5000, min: 0 },
    items: 1,
  },
};

const CarouselItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
  },
}));

// NOTE: don't wrap in flex container

export default function HowItWorks() {
  const [allowPass, setAllowPass] = useState(false);

  const handleCarouselChange = (previousSlide, { currentSlide, onMove }) => {
    if (currentSlide - 1 === howToUseSteps.length) {
      setAllowPass(true);
    } else {
      setAllowPass(false);
    }
  };

  return (
    <>
      <Carousel
        responsive={responsive}
        ssr={false}
        infinite={true}
        afterChange={handleCarouselChange}
      >
        {howToUseSteps.map((step, index) => (
          <CarouselItem key={index}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h4" mb={1}>
                {step.label}
              </Typography>
              <Typography variant="body1" mb={2}>
                {step.description}
              </Typography>
              <img src={step.image} />
            </Box>
          </CarouselItem>
        ))}
      </Carousel>
      <Button
        variant="contained"
        color="success"
        href="/start"
        disabled={!allowPass}
      >
        Get Started
      </Button>
    </>
  );
}
