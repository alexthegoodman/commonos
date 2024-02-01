"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import { styled } from "@mui/material";
import ColorModeSwitch from "@/components/core/nav/ColorModeSwitch";
import LogoutButton from "@/components/core/settings/LogoutButton";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const InnerWrappper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));

function LoggedInButtons() {
  return (
    <>
      <Button href="/launcher">Enter CommonOS</Button>
      <LogoutButton />
    </>
  );
}

function LoggedOutButtons() {
  return (
    <>
      <Button href="/login">Login</Button>
      <Button href="/sign-up">Sign Up</Button>
    </>
  );
}

export default function DrawerAppBar(props: Props) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CommonOS
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={`listItem${item.href}`} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {token ? <LoggedInButtons /> : <LoggedOutButtons />}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <InnerWrappper>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              CommonOS
            </Typography>
            <Box
              sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "row" }}
            >
              <ColorModeSwitch />
              {navItems.map((item) => (
                <Button key={item.href} href={item.href}>
                  {item.label}
                </Button>
              ))}
              {token ? <LoggedInButtons /> : <LoggedOutButtons />}
            </Box>
          </InnerWrappper>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
