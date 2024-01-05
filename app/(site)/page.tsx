"use client";

import { ArrowRightSharp } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
} from "@mui/material";
import Link from "next/link";
import YouTube, { YouTubeProps } from "react-youtube";

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

const BenefitsContainer = styled(Grid)(({ theme }) => ({
  border: "1px rgba(255, 255, 255, 0.1) solid",
}));

const BenefitItem = styled(Grid)(({ theme }) => ({
  padding: "35px",
  "&:nth-of-type(2), &:nth-of-type(3)": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

export default function Home() {
  const steps = [
    "For decades, people have been doing manual work",
    "In 2022, ChatGPT took the world by storm",
    "Now, a new, semi-automated OS is possible",
  ];

  const opts = {
    height: "100%",
    width: "100%",
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    //   autoplay: 1,
    // },
  };

  return (
    <>
      <Hero
        sx={{
          height: {
            xs: "auto",
            md: "30vw",
            xl: "500px",
          },
        }}
      >
        <InnerWrapper>
          <Grid container>
            <Grid
              item
              xs={12}
              md={4}
              position="relative"
              sx={{
                padding: {
                  xs: "0",
                  md: "0 20px 0px 0",
                },
              }}
            >
              <HeroHeadline
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2rem",
                    md: "4vw",
                    xl: "4.5rem",
                  },
                }}
              >
                CommonOS
              </HeroHeadline>
              <Typography
                variant="h2"
                sx={{
                  fontSize: {
                    xs: "1.5rem",
                    md: "2.5vw",
                    xl: "3.5rem",
                  },
                }}
              >
                Do more. Save loads of time.
              </Typography>

              <Box
                sx={{
                  display: {
                    xs: "none",
                    xl: "block",
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
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              position="relative"
              // sx={{
              //   padding: {
              //     xs: "0 50px",
              //     md: "0",
              //   },
              // }}
            >
              <Box
                sx={{
                  aspectRatio: "16/9",
                  // maxHeight: "535px",
                  // width: {
                  //   xs: "100%",
                  //   md: "55%",
                  //   xl: "880px",
                  // },
                  width: "100%",

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
                    md: "-250px",
                    xl: "-275px",
                  },
                  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                  "& > div": {
                    height: "100%",
                  },
                }}
              >
                {/* <video style={{ width: "100%", height: "100%" }}>
                  <source
                    src="https://commonos.s3.us-east-2.amazonaws.com/landing/landing.mp4"
                    type="video/mp4"
                  />
                </video> */}
                <YouTube
                  videoId={"OMVw3QPSYSg"} // defaults -> ''
                  // id={string}                       // defaults -> ''
                  // className={string}                // defaults -> ''
                  // iframeClassName={string}          // defaults -> ''
                  // style={object}                    // defaults -> {}
                  // title={string}                    // defaults -> ''
                  // loading={string}                  // defaults -> undefined
                  opts={opts} // defaults -> {}
                  // onReady={func}                    // defaults -> noop
                  // onPlay={func}                     // defaults -> noop
                  // onPause={func}                    // defaults -> noop
                  // onEnd={func}                      // defaults -> noop
                  // onError={func}                    // defaults -> noop
                  // onStateChange={func}              // defaults -> noop
                  // onPlaybackRateChange={func}       // defaults -> noop
                  // onPlaybackQualityChange={func}    // defaults -> noop
                />
              </Box>
            </Grid>
          </Grid>
        </InnerWrapper>
      </Hero>
      <Box pt={5}>
        <InnerWrapper>
          <Grid container>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                padding: {
                  xs: "0 20px 0 0",
                  xl: "0 20px 0 0",
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    md: "1.4rem",
                  },
                  lineHeight: "1.7",
                }}
              >
                CommonOS serves you. By asking you intelligent questions, it
                learns what you want and how you want it. Then, it does the work
                for you, so you can focus on what matters.
              </Typography>
              <Typography
                variant="overline"
                sx={{ display: "block", marginTop: 3, fontSize: "1rem" }}
              >
                The Challenges
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    md: "1.4rem",
                  },
                  lineHeight: "1.7",
                  mb: 1,
                }}
              >
                1. To build an OS that offered to do work for you, it had to
                have a suite of uniform, integrated apps. It couldn't simply
                integrate with existing tools.
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    md: "1.4rem",
                  },
                  lineHeight: "1.7",
                }}
              >
                2. CommonOS is centered around freeform prompts and answering
                questions, which is a new way of working. This means that it's
                not always immediately obvious how to use it.
              </Typography>
              <Typography
                variant="overline"
                sx={{ display: "block", marginTop: 3, fontSize: "1rem" }}
              >
                The Technology
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    md: "1.4rem",
                  },
                  lineHeight: "1.7",
                }}
              >
                CommonOS integrates the powerful AI behind ChatGPT with a suite
                of apps that are designed to be automated.
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={8}
              sx={{
                paddingTop: "150px",
                display: {
                  xs: "none",
                  md: "grid",
                },
              }}
              // display="flex"
              // justifyContent="center"
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
              <Box padding="0 50px">
                <Typography
                  variant="overline"
                  sx={{ display: "block", marginTop: 3, fontSize: "1rem" }}
                >
                  Benefits
                </Typography>
                <BenefitsContainer container>
                  <BenefitItem item xs={12} md={6}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: {
                          xs: "1.2rem",
                          md: "1.4rem",
                        },
                        lineHeight: "1.7",
                      }}
                    >
                      Add the expertise of AI to your workflow
                    </Typography>
                  </BenefitItem>
                  <BenefitItem item xs={12} md={6}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: {
                          xs: "1.2rem",
                          md: "1.4rem",
                        },
                        lineHeight: "1.7",
                      }}
                    >
                      Save time preparing a variety of files for every project
                    </Typography>
                  </BenefitItem>
                  <BenefitItem item xs={12} md={6}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: {
                          xs: "1.2rem",
                          md: "1.4rem",
                        },
                        lineHeight: "1.7",
                      }}
                    >
                      Spend more time refining your work
                    </Typography>
                  </BenefitItem>
                  <BenefitItem item xs={12} md={6}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: {
                          xs: "1.2rem",
                          md: "1.4rem",
                        },
                        lineHeight: "1.7",
                      }}
                    >
                      Guide the AI to achieve personalized results
                    </Typography>
                  </BenefitItem>
                </BenefitsContainer>
              </Box>
            </Grid>
          </Grid>
        </InnerWrapper>
      </Box>
      <Box padding="100px 0" display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3" mb={2}>
            Leap into the future
          </Typography>
          <Typography variant="body1" mb={2}>
            Try CommonOS with our free Preview plan
          </Typography>
          <Box>
            <Button size="large" href="/sign-up">
              Sign Up
            </Button>
            <Button size="large" href="/pricing">
              Pricing
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
