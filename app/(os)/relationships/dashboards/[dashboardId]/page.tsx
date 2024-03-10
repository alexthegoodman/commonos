"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import InnerLayout from "@/components/relationships/dashboards/InnerLayout";
import { RelationshipsDashboardsContextState } from "@/context/RelationshipsDashboardsContext";
import { getDashboardData } from "@/fetchers/relationship";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Dashboard(props) {
  const { params } = props;
  const dashboardId = params.dashboardId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: dashboardData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    "dashboardKey" + dashboardId,
    () => getDashboardData(token, dashboardId),
    {
      revalidateOnMount: true,
    }
  );

  console.info("dashboardData", dashboardData);

  return !isLoading ? (
    <>
      {dashboardData && dashboardData.context ? (
        <InnerLayout dashboardId={dashboardId} dashboardData={dashboardData} />
      ) : (
        <InnerLayout
          dashboardId={dashboardId}
          dashboardData={{
            title: "New Dashboard",
            context: RelationshipsDashboardsContextState,
          }}
        />
      )}
    </>
  ) : (
    <PrimaryLoader />
  );
}
