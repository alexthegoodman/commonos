"use client";

import { IconBox } from "@/components/core/flows/FlowEditor";
import AuthForm from "@/components/core/forms/AuthForm";
import HowToUse from "@/components/core/landing/HowToUse";
import { InnerWrapper } from "@/components/core/landing/InnerWrapper";
import {
  DocumentScanner,
  Image,
  List,
  PresentToAllOutlined,
} from "@mui/icons-material";
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

const FileItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${theme.palette.divider}`,
  padding: "25px",
  backgroundColor: "rgba(255,255,255,0.05)",
  [theme.breakpoints.down("md")]: {
    padding: "10px",
    "& > div": {
      display: "none",
    },
    "& .MuiTypography-root": {
      fontSize: "18px",
    },
  },
}));

export default function Founders() {
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
            {/* Drive Sales Success: CommonOS - A Founder&apos;s Secret to Growth! */}
            {/* Personalized, generative sales enablement for founders */}
            Sales Enablement for Founders
          </Typography>
          <SubTitle mb={1}>
            Founders have unique needs when it comes to sales. Determining
            strategy, setting up processes, and forming initial relationships
            are just a few examples. CommonOS simplifies that entire process.
          </SubTitle>
          <SubTitle>
            By creating your sales collateral, proposals, and presentations with
            CommonOS, you can produce files that are more engaging, more
            personalized, and more effective, in just minutes.
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
        <Typography variant="h5" mb={2}>
          CommonOS Helps With
        </Typography>
        <Grid container spacing={{ md: 4, xs: 2 }}>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Collateral</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Proposals</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"sheets"}>
                <List />
              </IconBox>
              <Typography variant="h5">Lists</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Literature</Typography>
            </FileItem>
          </Grid>

          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Journies</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"slides"}>
                <PresentToAllOutlined />
              </IconBox>
              <Typography variant="h5">Presentations</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Stories</Typography>
            </FileItem>
          </Grid>

          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Plans</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"drawings"}>
                <Image />
              </IconBox>
              <Typography variant="h5">Concepts</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Processes</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Templates</Typography>
            </FileItem>
          </Grid>
          <Grid item xs={6} md={3}>
            <FileItem>
              <IconBox app={"documents"}>
                <DocumentScanner />
              </IconBox>
              <Typography variant="h5">Maps</Typography>
            </FileItem>
          </Grid>
        </Grid>
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
