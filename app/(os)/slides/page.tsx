"use client";

import { getSlideData, getSlidesData, newSlide } from "@/fetchers/slide";
import { getUserData, updatePresentationFiles } from "@/fetchers/user";
import { FileCopy, Folder } from "@mui/icons-material";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

const { DateTime } = require("luxon");

export default function Slides(props) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();
  const [openFolder, setOpenFolder] = useState(null);

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  // console.info("user data", userData);

  const {
    data: slidesData,
    error,
    isLoading,
  } = useSWR("slidesKey", () => getSlidesData(token), {
    revalidateOnMount: true,
  });

  const recursiveSetFolderFiles = (folderId, files, newFolderFile) => {
    if (files) {
      files.forEach((file) => {
        if (file.type === "folder") {
          if (file.id === folderId) {
            file.files.push(newFolderFile);
          }
        }
        console.info("file", folderId, file);
        recursiveSetFolderFiles(folderId, file.files, newFolderFile);
      });
    }
  };

  const recursiveGetFolderFiles = (folderId, files) => {
    if (files) {
      for (const file of files) {
        if (file.type === "folder") {
          if (file.id === folderId) {
            console.info("match", file);
            return file.files;
          }
          const nestedFiles = recursiveGetFolderFiles(folderId, file.files);
          if (nestedFiles) {
            return nestedFiles;
          }
        }
      }
    }
  };

  const addPresentation = async () => {
    const { id } = await newSlide(token);

    if (openFolder) {
      const newFolderFile = { id, type: "file" };
      const newFiles = userData?.presentationFiles;
      recursiveSetFolderFiles(openFolder, newFiles, newFolderFile);
      mutate("homeLayout", () => updatePresentationFiles(token, newFiles), {
        optimisticData: { ...userData, presentationFiles: newFiles },
      });
    } else {
      const newFiles = userData?.presentationFiles
        ? [...userData?.presentationFiles, { id, type: "file" }]
        : [{ id, type: "file" }];
      mutate("homeLayout", () => updatePresentationFiles(token, newFiles), {
        optimisticData: { ...userData, presentationFiles: newFiles },
      });
    }

    mutate("slidesKey", () => getSlidesData(token));

    // router.push(`/slides/${id}`);
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
      const newFiles = userData?.presentationFiles;
      recursiveSetFolderFiles(openFolder, newFiles, newFolder);
      mutate("homeLayout", () => updatePresentationFiles(token, newFiles), {
        optimisticData: { ...userData, presentationFiles: newFiles },
      });
    } else {
      const newFiles = userData?.presentationFiles
        ? [...userData?.presentationFiles, newFolder]
        : [newFolder];
      mutate("homeLayout", () => updatePresentationFiles(token, newFiles), {
        optimisticData: { ...userData, presentationFiles: newFiles },
      });
    }

    mutate("slidesKey", () => getSlidesData(token));
  };

  const folderFiles = openFolder
    ? recursiveGetFolderFiles(openFolder, userData?.presentationFiles)
    : userData?.presentationFiles;

  console.info(
    "folder files",
    folderFiles,
    openFolder,
    userData?.presentationFiles
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button onClick={addPresentation}>Add Presentation</Button>
        <Button onClick={addFolder}>Add Folder</Button>
      </Grid>
      {!isLoading ? (
        folderFiles?.map((slide) => {
          const fileData = slidesData?.find((file) => file.id === slide.id);
          const creationDate = fileData?.createdAt
            ? DateTime.fromISO(fileData?.createdAt).toLocaleString(
                DateTime.DATE_FULL
              )
            : DateTime.fromISO(slide?.folderCreatedAt).toLocaleString(
                DateTime.DATE_FULL
              );

          return (
            <Grid item xs={12} md={2} key={slide.id}>
              <Button
                onClick={() => {
                  if (slide.type === "file") {
                    router.push(`/slides/${slide.id}`);
                  } else if (slide.type === "folder") {
                    console.info("open folder", slide.id);
                    setOpenFolder(slide.id);
                  }
                }}
              >
                {slide.type === "file" && <FileCopy />}
                {slide.type === "folder" && <Folder />}
                {fileData?.title ? fileData?.title : slide?.folderTitle}
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
