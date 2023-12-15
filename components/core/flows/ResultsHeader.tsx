"use client";

import { useFlowResultsContext } from "@/context/FlowResultsContext";
import { Status } from "@/helpers/defs";
import { AutoAwesome } from "@mui/icons-material";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";

export default function ResultsHeader() {
  const [state, dispatch] = useFlowResultsContext();

  const [files, setFiles] = useState(state.files);
  const [paused, setPaused] = useState(true);
  const [currentFile, setCurrentFile] = useState(0);

  const createFile = () => {
    console.log("Creating file...");

    setTimeout(() => {
      setPaused((paused) => {
        setCurrentFile((currentFile) => {
          if (currentFile < files.length) {
            const currentFileData = files[currentFile];
            if (
              currentFileData.status === Status.IN_PROGRESS ||
              currentFileData.status === Status.SUCCESS
            ) {
              // skip file
              return currentFile + 1;
            } else {
              // handle file
              if (!paused && currentFileData.status === Status.PENDING) {
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

                return currentFile + 1;
              }
            }
          }

          return currentFile;
        });

        return paused;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!paused) {
      createFile();
    }
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
