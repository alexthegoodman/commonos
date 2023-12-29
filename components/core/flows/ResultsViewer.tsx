"use client";

import { useFlowResultsContext } from "@/context/FlowResultsContext";
import {
  AutoAwesome,
  DocumentScanner,
  Image,
  PresentToAllOutlined,
  List,
} from "@mui/icons-material";
import { Box, Button, Chip, Grid, Typography, styled } from "@mui/material";
import { FileItem, IconBox } from "./FlowEditor";

const CSSGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export default function ResultsViewer() {
  const [state, dispatch] = useFlowResultsContext();

  return (
    <CSSGrid>
      {state.files.map((file) => {
        return (
          <FileItem
            key={file.id}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">{file.name}</Typography>

            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography
                variant="body2"
                width={175}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
                textTransform="capitalize"
                textAlign="center"
              >
                <IconBox app={file.app}>
                  {file.app === "documents" && <DocumentScanner />}
                  {file.app === "slides" && <PresentToAllOutlined />}
                  {file.app === "sheets" && <List />}
                  {file.app === "images" && <Image />}
                </IconBox>

                {file.app}
              </Typography>
              <Chip
                label={file.status}
                color={
                  file.status === "SUCCESS"
                    ? "success"
                    : file.status === "IN_PROGRESS"
                      ? "warning"
                      : "error"
                }
              />
            </Box>
          </FileItem>
        );
      })}
    </CSSGrid>
  );
}
