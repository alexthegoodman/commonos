"use client";

import {
  createInbox,
  createWorkEmailFolder,
  myInboxes,
  myWorkEmailFolders,
} from "@/fetchers/work-email";
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
    await createWorkEmailFolder(token, data.name);
    await mutate("workEmailFoldersKey", () => myWorkEmailFolders(token));
    handleClose();
    setLoading(false);
  };

  const onError = (error) => console.error(error);

  return (
    <Dialog open={open} keepMounted onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>{"Create Folder"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormInput
              type="text"
              name="name"
              placeholder={`Name`}
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
            Save Folder
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

  // const { data: domainSettingsData } = useSWR(
  //   "domainSettingsKey",
  //   () => myDomainSettings(token),
  //   {
  //     revalidateOnMount: true,
  //   }
  // );

  const {
    data: foldersData,
    error,
    isLoading,
  } = useSWR("workEmailFoldersKey", () => myWorkEmailFolders(token), {
    revalidateOnMount: true,
  });

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" mb={2}>
        Your Folders
      </Typography>
      {foldersData &&
        foldersData.map((folder) => (
          <Button
            key={folder.id}
            onClick={() => router.push(`/work-email/folders/${folder.id}`)}
            sx={{
              marginBottom: 1,
              backgroundColor:
                thirdSlug === folder.id ? "#515151" : "transparent",
              color: thirdSlug === folder.id ? "#FFF" : "#515151",
            }}
          >
            {folder.name}
          </Button>
        ))}
      <Button variant="contained" color="success" onClick={() => setOpen(true)}>
        Create Folder
      </Button>
      <CreateInboxModal open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}
