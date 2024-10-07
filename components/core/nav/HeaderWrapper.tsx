"use client";

import useScrollPosition from "@/hooks/useScrollPosition";
import { Box, styled } from "@mui/material";
import PrimaryHeader from "./PrimaryHeader";
import PrimaryTabs from "./PrimaryTabs";
import DynamicTabs from "./DynamicTabs";
import { useEffect, useState } from "react";

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
  paddingRight: hasSidebar ? "26vw" : "0px",
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
  backgroundColor: opaque ? "#99c7a2 !important" : "transparent !important",
  padding: "0 1vw",
}));

export default function HeaderWrapper({ hasSidebar }) {
  const scrollPosition = useScrollPosition();
  const isScrolling = scrollPosition > 0;

  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    if (scrollPosition > prevScrollPosition) {
      setIsScrollingDown(true); // Scrolling down
    } else {
      setIsScrollingDown(false); // Scrolling up
    }

    setPrevScrollPosition(scrollPosition); // Update the previous scroll position
  }, [scrollPosition]);

  // console.info("scrollPosition", scrollPosition, isScrollingDown);

  return (
    <FixedHeader opaque={isScrolling}>
      <Container hasSidebar={hasSidebar}>
        <InnerContainer opaque={isScrolling}>
          {!isScrollingDown || scrollPosition < 50 ? (
            <PrimaryHeader isScrollingDown={isScrollingDown} />
          ) : (
            <></>
          )}
          {/* <PrimaryTabs /> */}
          <DynamicTabs
            style={{
              marginTop: isScrollingDown ? 0 : 5,
              paddingTop: isScrolling ? 5 : 0,
            }}
          />
        </InnerContainer>
      </Container>
    </FixedHeader>
  );
}
