"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function PrimaryLoader() {
  const [showTryAgain, setShowTryAgain] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTryAgain(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <CircularProgress />
      {showTryAgain && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}
