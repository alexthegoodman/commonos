"use client";

import { useCookies } from "react-cookie";
import { CookieSettings } from "../../../helpers/CookieSettings";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["cmUserToken"]);

  const logout = () => {
    removeCookie("cmUserToken", {
      ...CookieSettings,
    });
    router.push("/");
  };

  return (
    <>
      <Button onClick={logout}>Logout</Button>
    </>
  );
}
