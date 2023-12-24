"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { getSheetsData, newSheet } from "@/fetchers/sheet";
import { getUserData, updateSheetFiles } from "@/fetchers/user";
import Directories from "@/helpers/Directories";
import { FileCopy, Folder } from "@mui/icons-material";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

const { DateTime } = require("luxon");

export default function Sheets(props) {
  const directories = new Directories();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();
  const [openFolder, setOpenFolder] = useState(null);

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  // console.info("user data", userData);

  const {
    data: sheetsData,
    error,
    isLoading,
  } = useSWR("sheetsKey", () => getSheetsData(token), {
    revalidateOnMount: true,
  });

  const addSheet = async () => {
    const { id } = await newSheet(token);

    if (openFolder) {
      const newFolderFile = { id, type: "file" };
      const newFiles = userData?.sheetFiles;
      directories.recursiveSetFolderFiles(openFolder, newFiles, newFolderFile);
      mutate("homeLayout", () => updateSheetFiles(token, newFiles), {
        optimisticData: { ...userData, sheetFiles: newFiles },
      });
    } else {
      const newFiles = userData?.sheetFiles
        ? [...userData?.sheetFiles, { id, type: "file" }]
        : [{ id, type: "file" }];
      mutate("homeLayout", () => updateSheetFiles(token, newFiles), {
        optimisticData: { ...userData, sheetFiles: newFiles },
      });
    }

    mutate("sheetsKey", () => getSheetsData(token));

    // router.push(`/sheets/${id}`);
  };

  const addFolder = async () => {
    const id = uuidv4();
    const newFolder = {
      id,
      type: "folder",
      folderTitle: "New Folder",
      folderCreatedAt: DateTime.now().toISO(),
      files: [],
    };

    if (openFolder) {
      const newFiles = userData?.sheetFiles;
      directories.recursiveSetFolderFiles(openFolder, newFiles, newFolder);
      mutate("homeLayout", () => updateSheetFiles(token, newFiles), {
        optimisticData: { ...userData, sheetFiles: newFiles },
      });
    } else {
      const newFiles = userData?.sheetFiles
        ? [...userData?.sheetFiles, newFolder]
        : [newFolder];
      mutate("homeLayout", () => updateSheetFiles(token, newFiles), {
        optimisticData: { ...userData, sheetFiles: newFiles },
      });
    }

    mutate("sheetsKey", () => getSheetsData(token));
  };

  const folderFiles = openFolder
    ? directories.recursiveGetFolderFiles(openFolder, userData?.sheetFiles)
    : userData?.sheetFiles;

  console.info("folder files", folderFiles, openFolder, userData?.sheetFiles);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addSheet}>Add Sheet</Button>
        <Button onClick={addFolder}>Add Folder</Button>
      </Grid>
      {!isLoading ? (
        folderFiles?.map((sheet) => {
          const fileData = sheetsData?.find((file) => file.id === sheet.id);
          const creationDate = fileData?.createdAt
            ? DateTime.fromISO(fileData?.createdAt).toLocaleString(
                DateTime.DATE_MED
              )
            : DateTime.fromISO(sheet?.folderCreatedAt).toLocaleString(
                DateTime.DATE_MED
              );

          return (
            <Grid item xs={12} md={2} key={sheet.id}>
              <Button
                onClick={() => {
                  if (sheet.type === "file") {
                    router.push(`/sheets/${sheet.id}`);
                  } else if (sheet.type === "folder") {
                    console.info("open folder", sheet.id);
                    setOpenFolder(sheet.id);
                  }
                }}
              >
                {sheet.type === "file" && <FileCopy />}
                {sheet.type === "folder" && <Folder />}
                {fileData?.title ? fileData?.title : sheet?.folderTitle}
              </Button>
              <Typography variant="body2">{creationDate}</Typography>
            </Grid>
          );
        })
      ) : (
        <PrimaryLoader />
      )}
    </Grid>
  );
}
