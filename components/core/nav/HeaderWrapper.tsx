"use client";

import useScrollPosition from "@/hooks/useScrollPosition";
import { Box, styled } from "@mui/material";
import PrimaryHeader from "./PrimaryHeader";
import PrimaryTabs from "./PrimaryTabs";

const FixedHeader = styled("div")(({ theme, opaque }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 10,
  boxSizing: "border-box",
}));

const Container = styled(Box)(({ theme, opaque, hasSidebar }) => ({
  // maxWidth: hasSidebar ? "1600px" : "1400px",
  // paddingRight: hasSidebar ? "400px" : "0px",
  maxWidth: hasSidebar ? "100vw" : "100vw",
  paddingRight: hasSidebar ? "32vw" : "0px",
  // paddingLeft: "1vw",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "100vw",
    paddingRight: "0px",
  },
}));

const InnerContainer = styled(Box)(({ theme, opaque }) => ({
  transition: "background-color 0.2s ease",
  backgroundColor: opaque ? "#1565C0 !important" : "transparent !important",
  padding: "0 1vw",
}));

export default function HeaderWrapper({ hasSidebar }) {
  const scrollPosition = useScrollPosition();
  const isScrolling = scrollPosition > 0;

  //   console.info("scrollPosition", scrollPosition);

  return (
    <FixedHeader opaque={isScrolling}>
      <Container hasSidebar={hasSidebar}>
        <InnerContainer opaque={isScrolling}>
          <PrimaryHeader />
          <PrimaryTabs />
        </InnerContainer>
      </Container>
    </FixedHeader>
  );
}
