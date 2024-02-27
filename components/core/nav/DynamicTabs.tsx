"use client";

import { LauncherContext, allTabs } from "@/context/LauncherContext";
import {
  Add,
  Analytics,
  Apps,
  Article,
  ChildFriendly,
  Close,
  ContentCopy,
  DocumentScanner,
  Email,
  GridOn,
  InsertPhoto,
  Launch,
  LibraryMusic,
  People,
  Slideshow,
  Start,
  VideoLibrary,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  Icon,
  IconButton,
  Menu,
  Typography,
  styled,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { LiveTab, Tab, TabsWrapper } from "../layout/Wrapper";
import { v4 as uuidv4 } from "uuid";

const Ctrls = styled(Box)(({ theme }) => ({
  background: "#c8cc7c",
  borderRadius: "25px",
  padding: "10px",
  "& button, & a": {
    color: "white",
    borderColor: "white",
    backgroundColor: "rgba(0, 0, 0, 0.1) !important",
  },
}));

const LiveTabs = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: "10px 15px",
}));

const AppGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  padding: "10px",
}));

const LaunchAppMenu = ({ onSelectApp }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectApp = (appId) => {
    console.log("handleSelectApp", appId);
    setAnchorEl(null);
    onSelectApp(appId);
  };

  return (
    <>
      <Tab onClick={handleOpenMenu} size="small">
        <Box mr={0.5} position="relative" top="3px">
          <Apps />
        </Box>
        {"Launch App"}
      </Tab>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <AppGrid>
          {allTabs.map((tabData) => {
            return (
              <Button
                key={tabData.id}
                disabled={tabData.href === ""}
                onClick={() => handleSelectApp(tabData.id)}
                size="small"
              >
                <Box mr={0.5} position="relative" top="3px">
                  {tabData?.id === "launcher" && <Apps />}
                  {tabData?.id === "documents" && <Article />}
                  {tabData?.id === "slides" && <Slideshow />}
                  {tabData?.id === "sheets" && <GridOn />}
                  {tabData?.id === "drawings" && <InsertPhoto />}
                  {tabData?.id === "sounds" && <LibraryMusic />}
                  {tabData?.id === "videos" && <VideoLibrary />}
                  {tabData?.id === "content" && <ContentCopy />}
                  {tabData?.id === "analytics" && <Analytics />}
                  {tabData?.id === "send-email" && <Email />}
                  {tabData?.id === "relationships" && <People />}
                  {tabData?.id === "work-email" && <Email />}
                </Box>

                {tabData?.label}
                {tabData?.badge && (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={tabData?.badge}
                    style={{
                      marginLeft: "7px",
                      fontSize: "0.7rem",
                      borderColor: "white",
                      opacity: 0.4,
                    }}
                  />
                )}
              </Button>
            );
          })}
        </AppGrid>
      </Menu>
    </>
  );
};

export default function DynamicTabs() {
  const { state, dispatch } = useContext(LauncherContext);

  const tabs = state.openTabs;

  const router = useRouter();
  const pathname = usePathname();
  // const slug1 = pathNum > 0 ? "/" + pathname.split("/")[pathNum] : pathname;

  const currentTabData = allTabs.find((tab) => pathname.includes(tab.href));
  const slug1 = currentTabData?.href;

  const onSelectApp = (appId) => {
    const selectedAppTabData = allTabs.find((tab) => tab.id === appId);

    dispatch({
      type: "openTabs",
      payload: [...tabs, { appId: appId, id: uuidv4() }],
    });

    router.push(selectedAppTabData.href);
  };

  const handleRemoveTab = (tabId) => {
    const removeTab = tabs.find((tab) => tab.id === tabId);
    const removeTabData = allTabs.find((tab) => tab.id === removeTab.appId);

    dispatch({
      type: "openTabs",
      payload: tabs.filter((tab) => tab.id !== tabId),
    });

    if (removeTabData.href === pathname) {
      router.push("/launcher");
    }
  };

  return (
    <TabsWrapper style={{ marginTop: "5px" }}>
      <Box display="flex" flexDirection="row" width="fit-content" mb={2}>
        <Ctrls>
          <Tab
            onClick={() => router.push("/launcher")}
            size="small"
            sx={
              "/launcher" === slug1
                ? { background: "#99c7a2", color: "white" }
                : { background: "transparent" }
            }
          >
            <Box mr={0.5} position="relative" top="3px">
              <Start />
            </Box>
            {"Start Flow"}
          </Tab>
          <LaunchAppMenu onSelectApp={onSelectApp} />
        </Ctrls>
        <LiveTabs>
          {tabs.map((tab) => {
            const tabData = allTabs.find((t) => t.id === tab.appId);

            if (!tabData) {
              return null;
            }

            return (
              <LiveTab
                key={tabData.id}
                sx={
                  tabData.href === slug1
                    ? { background: "#99c7a2", color: "white" }
                    : { background: "#515151" }
                }
              >
                <Button
                  disabled={tabData.href === ""}
                  onClick={() => router.push(tabData.href)}
                  variant="contained"
                  size="small"
                  sx={{
                    height: "40px",
                    minHeight: "40px",
                    minWidth: "auto",
                    paddingLeft: "15px",
                    paddingRight: "5px",
                    background: "transparent",
                    "&:hover": {
                      background: "transparent",
                    },
                  }}
                >
                  <Box mr={0.5} position="relative" top="3px">
                    {tabData?.id === "launcher" && <Apps />}
                    {tabData?.id === "documents" && <Article />}
                    {tabData?.id === "slides" && <Slideshow />}
                    {tabData?.id === "sheets" && <GridOn />}
                    {tabData?.id === "drawings" && <InsertPhoto />}
                    {tabData?.id === "sounds" && <LibraryMusic />}
                    {tabData?.id === "videos" && <VideoLibrary />}
                    {tabData?.id === "content" && <ContentCopy />}
                    {tabData?.id === "analytics" && <Analytics />}
                    {tabData?.id === "send-email" && <Email />}
                    {tabData?.id === "relationships" && <People />}
                    {tabData?.id === "work-email" && <Email />}
                  </Box>

                  {tabData?.label}
                  {tabData?.badge && (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={tabData?.badge}
                      style={{
                        marginLeft: "7px",
                        fontSize: "0.7rem",
                        borderColor: "white",
                        opacity: 0.4,
                      }}
                    />
                  )}
                </Button>
                <IconButton
                  size="small"
                  sx={{
                    margin: 0,
                    width: "auto",
                    minWidth: "auto",
                    marginRight: "4px",
                  }}
                  onClick={() => handleRemoveTab(tab.id)}
                >
                  <Close style={{ fontSize: "20px" }} />
                </IconButton>
              </LiveTab>
            );
          })}
        </LiveTabs>
      </Box>
    </TabsWrapper>
  );
}
