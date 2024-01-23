"use client";

import AuthForm from "@/components/core/forms/AuthForm";
import HelpsWith from "@/components/core/landing/HelpsWith";
import HowToUse from "@/components/core/landing/HowToUse";
import { InnerWrapper } from "@/components/core/landing/InnerWrapper";

import { Box, Button, Grid, Typography, styled } from "@mui/material";
import YouTube from "react-youtube";

const Wrapper = styled(InnerWrapper)(({ theme }) => ({}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  lineHeight: "34px",
  [theme.breakpoints.down("md")]: {
    fontSize: "18px",
    lineHeight: "32px",
  },
}));

export default function SalesResources() {
  const opts = {
    height: "100%",
    width: "100%",
    // playerVars: {
    //   // https://developers.google.com/youtube/player_parameters
    //   autoplay: 1,
    // },
  };

  return (
    <Wrapper>
      <Grid py={5} container spacing={8}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h1"
            mb={2}
            sx={{ fontSize: { md: "68px", xs: "48px" } }}
          >
            Custom Sales Resources in Minutes
          </Typography>
          <SubTitle mb={1}>
            Create your sales resources, including literature, proposals, and
            presentations, in just minutes.
          </SubTitle>
          <SubTitle>
            The CommonOS semi-automated approach creates tailored files.
          </SubTitle>
          {/* <SubTitle>
            CommonOS is different because it doesn&apos;t just help you generate
            files, it helps you determine exactly what your files say.
          </SubTitle> */}

          <Box maxWidth="350px">
            <AuthForm
              type="sign-up"
              buttonText="Sign Up for Free"
              showLinks={false}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* <img src="/images/landing/founders.png" /> */}
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            justifyContent="center"
          >
            <Box
              sx={{
                aspectRatio: "16/9",
                "& > div": {
                  height: "100%",
                },
              }}
            >
              <YouTube
                videoId={"OMVw3QPSYSg"} // defaults -> ''
                opts={opts} // defaults -> {}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box my={4} mb={8}>
        <HelpsWith />
      </Box>
      <Box my={4}>
        <HowToUse />
      </Box>
      <Box my={4} display="flex" justifyContent="center" padding="30px 0">
        <Button color="success" variant="contained" href="/sign-up">
          Sign Up for Free
        </Button>
      </Box>
    </Wrapper>
  );
}
