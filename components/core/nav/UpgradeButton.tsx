"use client";

import { getUserData } from "@/fetchers/user";
import { Star } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function UpgradeButton() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  if (userData?.subscription === "STANDARD") {
    return <></>;
  }

  return (
    <>
      <Button
        color="warning"
        variant="contained"
        endIcon={<Star />}
        href="/pricing"
        size="small"
      >
        Upgrade
      </Button>
    </>
  );
}
