"use client";

import { createDashboard, myDashboards } from "@/fetchers/relationship";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function DashboardList() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: dashboardsData,
    error,
    isLoading,
  } = useSWR("dashboardsKey", () => myDashboards(token), {
    revalidateOnMount: true,
  });

  const handleCreateDashboard = async () => {
    console.info("create dashboard");

    const { id } = await createDashboard(token);

    mutate("dashboardsKey", () => myDashboards(token));

    router.push(`/relationships/dashboards/${id}`);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="overline">Your Dashboards</Typography>
      {dashboardsData &&
        dashboardsData.map((dashboard) => (
          <Button
            key={dashboard.id}
            onClick={() =>
              router.push(`/relationships/dashboards/${dashboard.id}`)
            }
          >
            {dashboard.title}
          </Button>
        ))}
      <Button
        variant="contained"
        color="success"
        onClick={handleCreateDashboard}
      >
        Create Dashboard
      </Button>
    </Box>
  );
}
