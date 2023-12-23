"use client";

import HeaderWrapper from "@/components/core/nav/HeaderWrapper";
import PrimaryHeader from "@/components/core/nav/PrimaryHeader";
import PrimaryTabs from "@/components/core/nav/PrimaryTabs";
import { LauncherContext } from "@/context/LauncherContext";
import useScrollPosition from "@/hooks/useScrollPosition";
import { Box, styled } from "@mui/material";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const Background = styled("main")(({ theme }) => ({
  width: "100%",
  // height: "100vh",
  // // backgroundColor: theme.palette.background.default,
  // overflowY: "scroll",

  background: "linear-gradient(355deg, #b92b27, #1565C0)",
  backgroundSize: "400% 400%",
  animation: "AnimationName 15s ease infinite",
}));

const Container = styled(Box)(({ theme, hasSidebar }) => ({
  maxWidth: hasSidebar ? "1600px" : "1400px",
  paddingRight: hasSidebar ? "400px" : "0px",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
}));

const Spacer = styled("div")(({ theme }) => ({
  paddingTop: "100px",
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useContext(LauncherContext);
  const pathname = usePathname();

  // use regex to check if pathname includes /slides/ or /sheets/ and a id
  let hasSidebar = /\/(slides|sheets|documents|drawings)\/[a-zA-Z0-9]+/.test(
    pathname
  );

  console.info("LauncherContext state", state);

  return (
    <Background>
      <HeaderWrapper hasSidebar={hasSidebar} />
      <Container hasSidebar={hasSidebar}>
        <Spacer />
        <Box>{children}</Box>
      </Container>

      <div
        id="tokenLimitReached"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div tabIndex="-1" data-micromodal-close>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tokenLimitReached-title"
          >
            <header>
              <h2 id="tokenLimitReached-title">Ready to upgrade?</h2>
            </header>

            <div id="tokenLimitReached-content">
              <p>
                Sadly, you have used up all of your tokens! However, you can
                upgrade to the Standard plan for $10/mo!
              </p>
              <p>
                <a href="/pricing">See Pricing</a>
                <a href="#!" aria-label="Close modal" data-micromodal-close>
                  Close Modal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        #tokenLimitReached {
          display: none;
          position: fixed;
          z-index: 1000;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: auto;
          outline: 0;
          background-color: rgba(0, 0, 0, 0.8);
          justify-content: center;
          align-items: center;
          color: #fff;
        }

        #tokenLimitReached-content {
          max-width: 500px;
        }

        #tokenLimitReached-content p {
          font-size: 16px;
          line-height: 1.5;
        }

        #tokenLimitReached a {
          color: #fff;
          margin-right: 10px;
        }

        #tokenLimitReached.is-open {
          display: flex !important;
        }

        @-webkit-keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
        @-moz-keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
        @-o-keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
        @keyframes AnimationName {
          0% {
            background-position: 0% 83%;
          }
          50% {
            background-position: 100% 18%;
          }
          100% {
            background-position: 0% 83%;
          }
        }
      `}</style>
    </Background>
  );
}
