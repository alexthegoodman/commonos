"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { FilesItem } from "@/components/core/layout/Wrapper";
import {
  getSlideData,
  getSlidesData,
  getSlideTemplatesData,
  newSlide,
} from "@/fetchers/slide";
import { getUserData, updatePresentationFiles } from "@/fetchers/user";
import Directories from "@/helpers/Directories";
import { FileCopy, Folder } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

const { DateTime } = require("luxon");

export default function Slides(props) {
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
    data: slidesData,
    error,
    isLoading,
  } = useSWR("slidesKey", () => getSlidesData(token), {
    revalidateOnMount: true,
  });

  const {
    data: presentationTemplates,
    error: templatesError,
    isLoading: templatesLoading,
  } = useSWR("presentationTemplates", () => getSlideTemplatesData(token), {
    revalidateOnMount: true,
  });

  console.info("presentationTemplates", presentationTemplates);

  const addPresentation = async () => {
    const { id } = await newSlide(token);

    if (openFolder) {
      const newFolderFile = { id, type: "file" };
      const newFiles = userData?.presentationFiles;
      directories.recursiveSetFolderFiles(openFolder, newFiles, newFolderFile);
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
      directories.recursiveSetFolderFiles(openFolder, newFiles, newFolder);
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
    ? directories.recursiveGetFolderFiles(
        openFolder,
        userData?.presentationFiles
      )
    : userData?.presentationFiles;

  console.info(
    "folder files",
    folderFiles,
    openFolder,
    userData?.presentationFiles
  );

  return (
    <>
      <Box>
        <Typography variant="h5" mb={2}>
          Want to start with a template?
        </Typography>
        <Grid container spacing={3}>
          {!templatesLoading && presentationTemplates?.length && (
            <>
              {presentationTemplates.map((template) => {
                const creationDate = DateTime.fromISO(
                  template?.createdAt
                ).toLocaleString(DateTime.DATE_MED);

                return (
                  <Grid item xs={12} md={3} key={template.id}>
                    <FilesItem
                      onClick={() => {
                        router.push(`/slides/${template.sourceId}`);
                        // create new presentation based on template
                        // then navigate to it
                      }}
                    >
                      <FileCopy />
                      {template?.title}
                      <Typography variant="body2" mt={1}>
                        {creationDate}
                      </Typography>
                    </FilesItem>
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>
      </Box>
      <Box mt={5}>
        <Typography variant="h5" mb={2}>
          Your Presentations
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Button onClick={addPresentation}>Add Presentation</Button>
            <Button onClick={addFolder}>Add Folder</Button>
          </Grid>
          {!isLoading ? (
            folderFiles?.map((slide) => {
              const fileData = slidesData?.find((file) => file.id === slide.id);
              const creationDate = fileData?.createdAt
                ? DateTime.fromISO(fileData?.createdAt).toLocaleString(
                    DateTime.DATE_MED
                  )
                : DateTime.fromISO(slide?.folderCreatedAt).toLocaleString(
                    DateTime.DATE_MED
                  );

              return (
                <Grid item xs={12} md={3} key={slide.id}>
                  <FilesItem
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
                    <Typography variant="body2" mt={1}>
                      {creationDate}
                    </Typography>
                  </FilesItem>
                </Grid>
              );
            })
          ) : (
            <PrimaryLoader />
          )}
        </Grid>
      </Box>
    </>
  );
}
