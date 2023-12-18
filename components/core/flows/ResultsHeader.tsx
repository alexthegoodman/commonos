"use client";

import { useFlowResultsContext } from "@/context/FlowResultsContext";
import { createFile } from "@/fetchers/flow";
import { Status } from "@/helpers/defs";
import { AutoAwesome } from "@mui/icons-material";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function ResultsHeader({ id, prompt }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useFlowResultsContext();

  const [files, setFiles] = useState(state.files);
  const [paused, setPaused] = useState(true);
  // set current file to first pending file
  const initialFile = files
    ? files?.findIndex((file) => file.status === Status.PENDING)
    : 0;
  // console.info("initialFile", initialFile);
  const [currentFile, setCurrentFile] = useState(initialFile);

  const handleAPI = async (currentFile, currentFileData) => {
    setFiles((files) => {
      return files.map((file, index) => {
        if (index === currentFile) {
          return {
            ...file,
            status: Status.IN_PROGRESS,
          };
        } else {
          return file;
        }
      });
    });

    // create file based on app
    // if (currentFileData.status === Status.PENDING) {  redundant
    await createFile(token, prompt, id, currentFileData.id);
    // }

    setFiles((files) => {
      return files.map((file, index) => {
        if (index === currentFile) {
          return {
            ...file,
            status: Status.SUCCESS,
          };
        } else {
          return file;
        }
      });
    });
  };

  var fileTimeout;
  const handleCreateFile = () => {
    clearTimeout(fileTimeout);
    fileTimeout = setTimeout(async () => {
      if (currentFile > -1 && currentFile < files.length) {
        const currentFileData = files[currentFile];
        if (
          currentFileData.status === Status.IN_PROGRESS ||
          currentFileData.status === Status.SUCCESS
        ) {
          // skip file
          console.log("Skipping file...", currentFile);
          setCurrentFile(currentFile + 1);

          if (currentFile + 1 >= files.length) {
            setPaused(true);
          }
        } else {
          // handle file
          if (!paused && currentFileData.status === Status.PENDING) {
            console.log("Creating file...", currentFile);

            await handleAPI(currentFile, currentFileData);

            setCurrentFile(currentFile + 1);

            if (currentFile + 1 >= files.length) {
              setPaused(true);
            }
          }
        }
      } else if (currentFile === -1) {
        setPaused(true);
      }
    }, 5000);
  };

  useEffect(() => {
    if (!paused) {
      handleCreateFile();
    }

    return () => {
      clearTimeout(fileTimeout);
    };
  }, [paused, currentFile]);

  useEffect(() => {
    dispatch({
      type: "files",
      payload: files,
    });
  }, [files]);

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Typography variant="h3">Flow Results</Typography>
      <Button
        variant="contained"
        color={paused ? "success" : "warning"}
        style={{ fontSize: "24px", padding: "10px 25px" }}
        //   endIcon={<AutoAwesome />}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "Begin Creation" : "Pause Creation"}
      </Button>
    </Box>
  );
}
