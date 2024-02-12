import { Box, Button, styled } from "@mui/material";

export const Wrapper = styled("main")(({ theme }) => ({
  width: "100%",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
}));

export const TabsWrapper = styled("div")(({ theme }) => ({
  maxWidth: "100vw",
  overflowX: "scroll",
  [theme.breakpoints.up("md")]: {
    overflowX: "hidden",
  },
}));

export const Tab = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: "0.9rem",
  fontWeight: "semibold",
  "&:hover": {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  // "&.Mui-selected": {
  //     color: theme.palette.primary.main,
  //     fontWeight: theme.typography.fontWeightMedium,
  // },
  // "&.Mui-focusVisible": {
  //     backgroundColor: theme.palette.primary.main,
  // },
  [theme.breakpoints.down("sm")]: {
    height: "40px",
  },
}));

export const CmSidebar = styled("aside")(({ theme, mobileOpen }) => ({
  width: "400px",
  // height: "100%",
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: "auto",
  height: "calc(100vh - 100px)",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  padding: "15px 25px",
  [theme.breakpoints.down("xl")]: {
    width: "300px",
  },
  [theme.breakpoints.down("md")]: {
    width: "250px",
  },
  [theme.breakpoints.down("sm")]: {
    display: mobileOpen ? "block" : "none",
    position: "absolute",
    zIndex: 20,
    top: "auto",
    left: "50px",
    right: "0px",
    height: "100%",
    backgroundColor: theme.palette.background.default,
  },
}));

export const CmContent = styled(Box)(({ theme }) => ({
  width: "calc(100% - 400px)",
  height: "100%",
  overflow: "auto",
  [theme.breakpoints.down("xl")]: {
    width: "calc(100% - 300px)",
  },
  [theme.breakpoints.down("md")]: {
    width: "calc(100% - 250px)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const MobileSideButton = styled(Button)(({ theme }) => ({
  writingMode: "vertical-rl",
  // textOrientation: "upright",
  transform: "rotate(180deg)",
  letterSpacing: "3px",
  height: "300px",
  zIndex: 5,
  color: "black",
  width: "50px",
  minWidth: "50px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));
