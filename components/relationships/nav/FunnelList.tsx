"use client";

import { RelationshipsFunnelsContextState } from "@/context/RelationshipsFunnelsContext";
import { createFunnel, myFunnels } from "@/fetchers/relationship";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

export default function FunnelList() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: funnelsData,
    error,
    isLoading,
  } = useSWR("funnelsKey", () => myFunnels(token), {
    revalidateOnMount: true,
  });

  const handleCreateFunnel = async () => {
    console.info("create funnel");

    const { id } = await createFunnel(token);

    mutate("funnelsKey", () => myFunnels(token));

    router.push(`/relationships/funnels/${id}`);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="overline">Your Funnels</Typography>
      {funnelsData &&
        funnelsData.map((funnel) => (
          <Button
            key={funnel.id}
            onClick={() => router.push(`/relationships/funnels/${funnel.id}`)}
          >
            {funnel.title}
          </Button>
        ))}
      <Button variant="contained" color="success" onClick={handleCreateFunnel}>
        Create Funnel
      </Button>
    </Box>
  );
}
