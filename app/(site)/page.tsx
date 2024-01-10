"use client";

import { IconBox } from "@/components/core/flows/FlowEditor";
import {
  ArrowRightSharp,
  DocumentScanner,
  Image,
  List,
  PresentToAllOutlined,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
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

const AppsWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(3),
}));

const AppBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

const LIconBox = styled(IconBox)(({ theme }) => ({
  width: "60px",
  height: "60px",
  "& svg": {
    width: "50%",
    height: "50%",
  },
}));

const BlockImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "block",
}));

const HelpChip = styled(Chip)(({ theme }) => ({
  marginRight: "5px",
  marginBottom: "10px",
  backgroundColor: "#38ef7d",
  color: "#000",
  fontWeight: "bold",
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
                Semi-Automatic, Lightweight
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
      <Box pt={5} pb={10}>
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
                Sales should be about the customer, not the paperwork. CommonOS
                is a lightweight, semi-automated OS that helps you generate
                documents, slides, sheets, and drawings.
              </Typography>
              <Typography
                variant="overline"
                sx={{ display: "block", marginTop: 3, fontSize: "1rem" }}
              >
                Helps With
              </Typography>
              <Box>
                <HelpChip label="Proposals" />
                <HelpChip label="Literature" />
                <HelpChip label="Journies" />
                <HelpChip label="Lists" />
                <HelpChip label="Stories" />
                <HelpChip label="Plans" />
                <HelpChip label="Processes" />
                <HelpChip label="Maps" />
                <HelpChip label="Presentations" />
                <HelpChip label="Concepts" />
              </Box>

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
      <Box pb={10}>
        <InnerWrapper>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" mb={4}>
                Use Cases
              </Typography>
              <Typography variant="body1" mb={2}>
                1. Initialize project plans, requirements, and documentation in
                15 mins
              </Typography>
              <Typography variant="body1" mb={2}>
                2. Initialize proposals, literature, and presentations in one
                powerful motion
              </Typography>{" "}
              <Typography variant="body1" mb={2}>
                3. Refine your work with the intelligence of mankind
              </Typography>{" "}
              <Typography variant="body1" mb={2}>
                4. Abstract away some manual work, opening time for more
                important tasks
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" mb={4}>
                Integrated Apps
              </Typography>
              <AppsWrapper>
                <AppBox>
                  <LIconBox app={"documents"}>
                    <DocumentScanner />
                  </LIconBox>
                  <Typography>Documents</Typography>
                </AppBox>
                <AppBox>
                  <LIconBox app={"slides"}>
                    <PresentToAllOutlined />
                  </LIconBox>
                  <Typography>Slides</Typography>
                </AppBox>
                <AppBox>
                  <LIconBox app={"sheets"}>
                    <List />
                  </LIconBox>
                  <Typography>Sheets</Typography>
                </AppBox>
                <AppBox>
                  <LIconBox app={"images"}>
                    <Image />
                  </LIconBox>
                  <Typography>Drawings</Typography>
                </AppBox>
              </AppsWrapper>
            </Grid>
          </Grid>
        </InnerWrapper>
      </Box>
      <Box>
        <InnerWrapper>
          <Typography variant="h3" mb={4}>
            How To Use CommonOS
          </Typography>
          <Grid container mb={2}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                height="100%"
              >
                <Typography variant="h4" mb={4}>
                  Start with a prompt
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <BlockImage src="/img/process/prompt.png" />
            </Grid>
          </Grid>
          <Grid container mb={2}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                height="100%"
              >
                <Typography variant="h4" mb={4}>
                  Answer intelligent questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <BlockImage src="/img/process/questions.png" />
            </Grid>
          </Grid>
          <Grid container mb={2}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                height="100%"
              >
                <Typography variant="h4" mb={4}>
                  Review your file plan
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <BlockImage src="/img/process/review.png" />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                height="100%"
              >
                <Typography variant="h4" mb={4}>
                  Refine your new files
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <BlockImage src="/img/process/refine2.png" />
            </Grid>
          </Grid>
        </InnerWrapper>
      </Box>
      <Box padding="100px 0" display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h3" mb={2}>
            Get Started
          </Typography>
          <Typography variant="body1" mb={2}>
            Try CommonOS with the free Preview plan
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
