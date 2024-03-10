"use client";

import { createInbox, myInboxes } from "@/fetchers/work-email";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import FormInput from "../../core/fields/FormInput";
import { useState } from "react";
import { myDomainSettings } from "@/fetchers/send-email";

export function CreateInboxModal({ open, handleClose }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await createInbox(token, data.username);
    await mutate("inboxesKey", () => myInboxes(token));
    handleClose();
    setLoading(false);
  };

  const onError = (error) => console.error(error);

  return (
    <Dialog open={open} keepMounted onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>{"Create Inbox"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormInput
              type="text"
              name="username"
              placeholder={`Username (ex. "alex" of alex@commonos.cloud)`}
              register={register}
              errors={errors}
              validation={{ required: true }}
              style={{ width: "400px" }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go Back</Button>
          <Button
            color="success"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Save Inbox
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function InboxList() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const thirdSlug = pathname.split("/")[3];

  const { data: domainSettingsData } = useSWR(
    "domainSettingsKey",
    () => myDomainSettings(token),
    {
      revalidateOnMount: true,
    }
  );

  const {
    data: inboxesData,
    error,
    isLoading,
  } = useSWR("inboxesKey", () => myInboxes(token), {
    revalidateOnMount: true,
  });

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" mb={2}>
        Your Inboxes
      </Typography>
      {inboxesData &&
        inboxesData.map((inbox) => (
          <Button
            key={inbox.id}
            onClick={() => router.push(`/work-email/inboxes/${inbox.id}`)}
            sx={{
              marginBottom: 1,
              backgroundColor:
                thirdSlug === inbox.id ? "#515151" : "transparent",
              color: thirdSlug === inbox.id ? "#FFF" : "#515151",
            }}
          >
            {inbox.username}@{domainSettingsData?.domainName}
          </Button>
        ))}
      <Button variant="contained" color="success" onClick={() => setOpen(true)}>
        Create Inbox
      </Button>
      <CreateInboxModal open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}
