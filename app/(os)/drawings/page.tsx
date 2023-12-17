"use client";

import { getDrawingsData, newDrawing } from "@/fetchers/drawing";
import { getUserData, updateDrawingFiles } from "@/fetchers/user";
import Directories from "@/helpers/Directories";
import { FileCopy, Folder } from "@mui/icons-material";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

const { DateTime } = require("luxon");

export default function Drawings() {
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
    data: drawingsData,
    error,
    isLoading,
  } = useSWR("drawingsKey", () => getDrawingsData(token), {
    revalidateOnMount: true,
  });

  const addDrawing = async () => {
    const { id } = await newDrawing(token);

    if (openFolder) {
      const newFolderFile = { id, type: "file" };
      const newFiles = userData?.drawingFiles;
      directories.recursiveSetFolderFiles(openFolder, newFiles, newFolderFile);
      mutate("homeLayout", () => updateDrawingFiles(token, newFiles), {
        optimisticData: { ...userData, drawingFiles: newFiles },
      });
    } else {
      const newFiles = userData?.drawingFiles
        ? [...userData?.drawingFiles, { id, type: "file" }]
        : [{ id, type: "file" }];
      mutate("homeLayout", () => updateDrawingFiles(token, newFiles), {
        optimisticData: { ...userData, drawingFiles: newFiles },
      });
    }

    mutate("drawingsKey", () => getDrawingsData(token));

    // router.push(`/drawings/${id}`);
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
      const newFiles = userData?.drawingFiles;
      directories.recursiveSetFolderFiles(openFolder, newFiles, newFolder);
      mutate("homeLayout", () => updateDrawingFiles(token, newFiles), {
        optimisticData: { ...userData, drawingFiles: newFiles },
      });
    } else {
      const newFiles = userData?.drawingFiles
        ? [...userData?.drawingFiles, newFolder]
        : [newFolder];
      mutate("homeLayout", () => updateDrawingFiles(token, newFiles), {
        optimisticData: { ...userData, drawingFiles: newFiles },
      });
    }

    mutate("drawingsKey", () => getDrawingsData(token));
  };

  const folderFiles = openFolder
    ? directories.recursiveGetFolderFiles(openFolder, userData?.drawingFiles)
    : userData?.drawingFiles;

  console.info("folder files", folderFiles, openFolder, userData?.drawingFiles);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addDrawing}>Add Drawing</Button>
        <Button onClick={addFolder}>Add Folder</Button>
      </Grid>
      {!isLoading ? (
        folderFiles?.map((drawing) => {
          const fileData = drawingsData?.find((file) => file.id === drawing.id);
          const creationDate = fileData?.createdAt
            ? DateTime.fromISO(fileData?.createdAt).toLocaleString(
                DateTime.DATE_MED
              )
            : DateTime.fromISO(drawing?.folderCreatedAt).toLocaleString(
                DateTime.DATE_MED
              );

          return (
            <Grid item xs={12} md={2} key={drawing.id}>
              <Button
                onClick={() => {
                  if (drawing.type === "file") {
                    router.push(`/drawings/${drawing.id}`);
                  } else if (drawing.type === "folder") {
                    console.info("open folder", drawing.id);
                    setOpenFolder(drawing.id);
                  }
                }}
              >
                {drawing.type === "file" && <FileCopy />}
                {drawing.type === "folder" && <Folder />}
                {fileData?.title ? fileData?.title : drawing?.folderTitle}
              </Button>
              <Typography variant="body2">{creationDate}</Typography>
            </Grid>
          );
        })
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}
