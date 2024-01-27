import { Button, styled } from "@mui/material";

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
