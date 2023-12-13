"use client";

import { ArrowRightSharp } from "@mui/icons-material";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
} from "@mui/material";
import Link from "next/link";

const Hero = styled(Box)(({ theme }) => ({
  height: "500px",
  display: "flex",
  alignItems: "center",
  // justifyContent: "center",
  borderBottom: "1px solid #ccc",
}));

const InnerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
}));

const HistoryStepper = styled(Stepper)(({ theme }) => ({
  margin: "0 auto",
}));

const HistoryStep = styled(Step)(({ theme }) => ({
  width: "350px",
  flex: "0 0 auto",
  padding: "0 75px",
  // "& .MuiStepIcon-root": {
  //   color: "#000",
  // },
}));

const HistoryLabel = styled(StepLabel)(({ theme }) => ({
  // "& .MuiStepLabel-label": {
  //   color: "#000",
  //   fontWeight: "bold",
  // },
}));

export default function Home() {
  const steps = [
    "For decades, people have been doing manual work",
    "In 2022, ChatGPT took the world by storm",
    "Now, a new, semi-automated OS is possible",
  ];

  return (
    <>
      <Hero>
        <InnerWrapper>
          <Box position="relative" width={500}>
            <Typography variant="h1">CommonOS</Typography>
            <Typography variant="h2">
              Creating at the speed of thought
            </Typography>
            <Box
              style={{ position: "absolute", bottom: "-125px", left: "300px" }}
            >
              <Typography variant="overline">
                Watch the video{" "}
                <ArrowRightSharp style={{ position: "relative", top: 7 }} />
              </Typography>
            </Box>
          </Box>
          <Box position="relative">
            <video
              style={{
                aspectRatio: "16/9",
                width: "880px",
                backgroundColor: "grey",
                position: "absolute",
                right: "0",
                bottom: "-275px",
              }}
            >
              <source
                src="https://commonos.s3.us-east-2.amazonaws.com/landing/landing.mp4"
                type="video/mp4"
              />
            </video>
          </Box>
        </InnerWrapper>
      </Hero>
      <Box pt={30}>
        <InnerWrapper>
          <Box display="flex" justifyContent="center">
            <HistoryStepper
              alternativeLabel
              activeStep={3}
              //connector={<ColorlibConnector />}
            >
              {steps.map((label) => (
                <HistoryStep key={label}>
                  <HistoryLabel //</Step>StepIconComponent={ColorlibStepIcon}
                  >
                    {label}
                  </HistoryLabel>
                </HistoryStep>
              ))}
            </HistoryStepper>
          </Box>
        </InnerWrapper>
      </Box>
    </>
  );
}
