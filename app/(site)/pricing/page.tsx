"use client";

import { getUserData } from "@/fetchers/user";
import { Box, Button, Typography, styled } from "@mui/material";
import { Check } from "@phosphor-icons/react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: theme.breakpoints.values.md,
  margin: "0 auto",
  textAlign: "center",
  padding: "50px 0",
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const PlanBox = styled(Box)(({ theme }) => ({
  width: "100%",
  border: `2px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const features = ["Access all apps"];

const previewFeatures = ["50k tokens", ...features];

const standardFeatures = ["2m tokens", ...features];

export default function Page() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  console.info("userData", userData);

  return (
    <Container>
      <Typography variant="h1" mb={4}>
        Pricing
      </Typography>
      <BoxWrapper>
        <PlanBox height="350px">
          <Box>
            <Typography variant="overline">Preview Plan</Typography>
            <Typography variant="h2">Free</Typography>
          </Box>
          <Box>
            {previewFeatures.map((feature, i) => (
              <Typography key={`previewFeature${i}`} variant="body1">
                <Check /> {feature}
              </Typography>
            ))}
            {!userData && (
              <Button
                variant="contained"
                color="success"
                href="/sign-up"
                style={{ marginTop: "15px", minWidth: "150px" }}
              >
                Sign Up
              </Button>
            )}
            {userData?.subscription === "NONE" && (
              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "15px", minWidth: "150px" }}
                disabled
              >
                Current Plan
              </Button>
            )}
          </Box>
        </PlanBox>
        <PlanBox height="450px">
          <Box>
            <Typography variant="overline">Standard Plan</Typography>
            <Typography variant="h2">$10/mo</Typography>
          </Box>
          <Box>
            {standardFeatures.map((feature, i) => (
              <Typography key={`standardFeature${i}`} variant="body1">
                <Check /> {feature}
              </Typography>
            ))}
            {!userData && (
              <Button
                variant="contained"
                color="success"
                href="/sign-up"
                style={{ marginTop: "15px", minWidth: "150px" }}
              >
                Sign Up
              </Button>
            )}
            {userData?.subscription === "NONE" && (
              <Button
                variant="contained"
                color="success"
                href="/upgrade"
                style={{ marginTop: "15px", minWidth: "150px" }}
              >
                Upgrade
              </Button>
            )}
          </Box>
        </PlanBox>
      </BoxWrapper>
    </Container>
  );
}
