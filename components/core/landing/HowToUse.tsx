import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
} from "@mui/material";
import { BlockImage } from "./InnerWrapper";

export default function HowToUse() {
  return (
    <>
      <Typography variant="h3" mb={4}>
        How To Use CommonOS
      </Typography>
      <Grid container mb={2}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={4}>
              Start with a prompt
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlockImage src="/img/process/prompt.png" />
        </Grid>
      </Grid>
      <Grid container mb={2}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={4}>
              Answer intelligent questions
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlockImage src="/img/process/questions.png" />
        </Grid>
      </Grid>
      <Grid container mb={2}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={4}>
              Review your file plan
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlockImage src="/img/process/review.png" />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={4}>
              Refine your new files
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlockImage src="/img/process/refine2.png" />
        </Grid>
      </Grid>
    </>
  );
}
