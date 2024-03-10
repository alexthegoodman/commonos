"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import InnerLayout from "@/components/relationships/funnels/InnerLayout";
import { RelationshipsFunnelsContextState } from "@/context/RelationshipsFunnelsContext";
import { getFunnelData } from "@/fetchers/relationship";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Funnel(props) {
  const { params } = props;
  const funnelId = params.funnelId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: funnelData,
    error,
    isLoading,
    mutate,
  } = useSWR("funnelKey" + funnelId, () => getFunnelData(token, funnelId), {
    revalidateOnMount: true,
  });

  return !isLoading ? (
    <>
      {funnelData && funnelData.context ? (
        <InnerLayout funnelId={funnelId} funnelData={funnelData} />
      ) : (
        <InnerLayout
          funnelId={funnelId}
          funnelData={{
            title: "New Funnel",
            context: RelationshipsFunnelsContextState,
          }}
        />
      )}
    </>
  ) : (
    <PrimaryLoader />
  );
}
