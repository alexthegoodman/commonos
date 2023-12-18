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
  const [currentFile, setCurrentFile] = useState(0);

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

  // var fileTimeout;
  // const handleCreateFile = () => {
  //   clearTimeout(fileTimeout);
  //   fileTimeout = setTimeout(() => {
  //     setFiles((files) => {
  //       setPaused((paused) => {
  //         setCurrentFile((currentFile) => {
  //           if (currentFile < files.length) {
  //             const currentFileData = files[currentFile];
  //             if (
  //               currentFileData.status === Status.IN_PROGRESS ||
  //               currentFileData.status === Status.SUCCESS
  //             ) {
  //               // skip file
  //               console.log("Skipping file...");
  //               return currentFile + 1;
  //             } else {
  //               // handle file
  //               if (!paused && currentFileData.status === Status.PENDING) {
  //                 console.log("Creating file...");

  //                 handleAPI(currentFile, currentFileData);

  //                 return currentFile + 1;
  //               }
  //             }
  //           }

  //           return currentFile;
  //         });

  //         return paused;
  //       });

  //       return files;
  //     });
  //   }, 5000);
  // };

  var fileTimeout;
  const handleCreateFile = () => {
    clearTimeout(fileTimeout);
    fileTimeout = setTimeout(async () => {
      if (currentFile < files.length) {
        const currentFileData = files[currentFile];
        if (
          currentFileData.status === Status.IN_PROGRESS ||
          currentFileData.status === Status.SUCCESS
        ) {
          // skip file
          console.log("Skipping file...");
          setCurrentFile(currentFile + 1);
        } else {
          // handle file
          if (!paused && currentFileData.status === Status.PENDING) {
            console.log("Creating file...");

            await handleAPI(currentFile, currentFileData);

            setCurrentFile(currentFile + 1);
          }
        }
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
