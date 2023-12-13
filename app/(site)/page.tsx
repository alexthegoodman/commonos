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
  width: "300px",
  flex: "0 0 auto",
  padding: "0 50px",
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

const HeroHeadline = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(90deg, #38efaf 0%, #38ef7d 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

export default function Home() {
  const steps = [
    "For decades, people have been doing manual work",
    "In 2022, ChatGPT took the world by storm",
    "Now, a new, semi-automated OS is possible",
  ];

  return (
    <>
      <Hero
        sx={{
          height: {
            xs: "auto",
            md: "500px",
          },
        }}
      >
        <InnerWrapper>
          <Box
            position="relative"
            sx={{
              width: {
                xs: "100%",
                md: "500px",
              },
            }}
          >
            <HeroHeadline
              variant="h1"
              sx={{
                fontSize: {
                  xs: "3rem",
                  md: "4.5rem",
                },
              }}
            >
              CommonOS
            </HeroHeadline>
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  md: "3.5rem",
                },
              }}
            >
              Creating at the speed of thought
            </Typography>
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                position: "absolute",
                bottom: "-125px",
                left: "300px",
              }}
            >
              <Typography variant="overline">
                Watch the video{" "}
                <ArrowRightSharp style={{ position: "relative", top: 7 }} />
              </Typography>
            </Box>
          </Box>
          <Box
            position="relative"
            sx={{
              padding: {
                xs: "0 50px",
                md: "0",
              },
            }}
          >
            <Box
              sx={{
                aspectRatio: "16/9",
                width: {
                  xs: "100%",
                  md: "55%",
                  xl: "880px",
                },

                backgroundColor: "grey",
                position: {
                  xs: "relative",
                  md: "absolute",
                },
                right: {
                  xs: "auto",
                  md: "20px",
                  xl: "0",
                },
                bottom: {
                  xs: "auto",
                  md: "-200px",
                  xl: "-275px",
                },
                boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <video style={{ width: "100%", height: "100%" }}>
                <source
                  src="https://commonos.s3.us-east-2.amazonaws.com/landing/landing.mp4"
                  type="video/mp4"
                />
              </video>
            </Box>
          </Box>
        </InnerWrapper>
      </Hero>
      <Box pt={30}>
        <InnerWrapper>
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
            display="flex"
            justifyContent="center"
          >
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
