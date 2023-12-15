"use client";

import { useFlowResultsContext } from "@/context/FlowResultsContext";
import { AutoAwesome } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Typography, styled } from "@mui/material";

const CSSGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

export default function ResultsViewer() {
  const [state, dispatch] = useFlowResultsContext();

  return (
    <CSSGrid>
      {state.files.map((file) => {
        return (
          <Box
            key={file.id}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            border="1px solid black"
            borderRadius="5px"
            padding="10px"
          >
            <Typography variant="body1">{file.name}</Typography>
            <Typography variant="body2">{file.app}</Typography>
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
        );
      })}
    </CSSGrid>
  );
}
