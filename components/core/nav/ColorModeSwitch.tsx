import { ColorModeContext } from "@/context/ColorModeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useContext } from "react";

export default function ColorModeSwitch() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Button
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        marginRight: 2,
      }}
      onClick={colorMode.toggleColorMode}
    >
      <Typography textTransform="capitalize" mr={1}>
        {theme.palette.mode} mode
      </Typography>
      {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </Button>
  );
}
