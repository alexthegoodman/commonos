import { LauncherContext, allTabs } from "@/context/LauncherContext";
import {
  Add,
  Analytics,
  Apps,
  Article,
  ChildFriendly,
  ContentCopy,
  DocumentScanner,
  Email,
  GridOn,
  InsertPhoto,
  Launch,
  LibraryMusic,
  People,
  Slideshow,
  VideoLibrary,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  Icon,
  Typography,
  styled,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { Tab, TabsWrapper } from "../layout/Wrapper";

export default function PrimaryTabs({ tabs = allTabs, pathNum = 1 }) {
  const { state, dispatch } = useContext(LauncherContext);

  const router = useRouter();
  const pathname = usePathname();
  const slug1 = pathNum > 0 ? "/" + pathname.split("/")[pathNum] : pathname;

  const currentTabData = tabs.find((tab) => tab.href === pathname);

  return (
    <TabsWrapper>
      <Box display="flex" flexDirection="row" width="fit-content" mb={2}>
        {tabs.map((tabData) => {
          // const tabData = allTabs.find((t) => t.id === tab.id);

          // if (!tabData) {
          //   return null;
          // }

          return (
            <Tab
              key={tabData.id}
              disabled={tabData.href === ""}
              onClick={() => router.push(tabData.href)}
              style={
                tabData.href === slug1
                  ? { borderBottom: "2px #FFF solid" }
                  : { borderBottom: "2px transparent solid" }
              }
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
            </Tab>
          );
        })}
      </Box>
    </TabsWrapper>
  );
}
