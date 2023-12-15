import { LauncherContext, allTabs } from "@/context/LauncherContext";
import {
  Add,
  Apps,
  Article,
  DocumentScanner,
  GridOn,
  InsertPhoto,
  Launch,
  LibraryMusic,
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

const Tab = styled(Button)(({ theme }) => ({
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
}));

export default function PrimaryTabs() {
  const { state, dispatch } = useContext(LauncherContext);

  const router = useRouter();
  const pathname = usePathname();
  const slug1 = "/" + pathname.split("/")[1];

  const currentTabData = allTabs.find((tab) => tab.href === pathname);

  return (
    <Box display="flex" flexDirection="row" mb={2}>
      {state.openTabs.map((tab) => {
        const tabData = allTabs.find((t) => t.id === tab.id);

        if (!tabData) {
          return null;
        }

        return (
          <Tab
            key={tab.id}
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
      {/* <Tab>
        <Add />
      </Tab> */}
    </Box>
  );
}
