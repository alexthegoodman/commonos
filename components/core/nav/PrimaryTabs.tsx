import { LauncherContext, allTabs } from "@/context/LauncherContext";
import { Add } from "@mui/icons-material";
import { Box, Button, Icon, styled } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

const Tab = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
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

  const currentTabData = allTabs.find((tab) => tab.href === pathname);

  return (
    <Box display="flex" flexDirection="row">
      {state.openTabs.map((tab) => {
        const tabData = allTabs.find((t) => t.id === tab.id);

        if (!tabData) {
          return null;
        }

        return (
          <Tab
            key={tab.id}
            onClick={() => router.push(tabData.href)}
            style={tabData.href === pathname ? { color: "#1976d2" } : {}}
          >
            {tabData?.label}
          </Tab>
        );
      })}
      <Tab>
        <Add />
      </Tab>
    </Box>
  );
}
