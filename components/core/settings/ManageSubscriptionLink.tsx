"use client";

import * as React from "react";

import { useCookies } from "react-cookie";
import { getPortalUrl } from "@/fetchers/user";
import { Button } from "@mui/material";

const ManageSubscriptionLink = () => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [loading, setLoading] = React.useState(false);

  const onClick = async () => {
    setLoading(true);
    const portalUrl = await getPortalUrl(token);
    window.location.href = portalUrl;
  };

  return (
    <Button onClick={onClick} disabled={loading}>
      {!loading ? "Manage Subscription" : "Loading..."}
    </Button>
  );
};

export default ManageSubscriptionLink;
