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
import { Link, styled } from "@mui/material";
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
  justifyContent: "space-between",
}));

function LoggedInButtons() {
  return (
    <>
      <Link href="/launcher">Enter CommonOS</Link>
      <LogoutButton />
    </>
  );
}

function LoggedOutButtons() {
  return (
    <>
      <Link href="/login">Login</Link>
      <Link href="/sign-up">Sign Up</Link>
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
      <Link href="/">
        <Typography variant="h6" sx={{ my: 2, fontWeight: "600" }}>
          CommonOS
        </Typography>
      </Link>
      <Divider />
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            <Link href="/">
              <Typography variant="h6" sx={{ fontWeight: "600" }}>
                CommonOS
              </Typography>
            </Link>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1,
                display: { sm: "none" },
                position: "absolute",
                right: "15px",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "row",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <ColorModeSwitch />
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              {token ? <LoggedInButtons /> : <LoggedOutButtons />}
            </Box>
          </InnerWrappper>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          anchor="right"
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          disableScrollLock={true}
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
