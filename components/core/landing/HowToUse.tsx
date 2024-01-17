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
      <Grid container mb={3}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={1}>
              Start with a prompt
            </Typography>
            <Typography variant="body1" mb={2}>
              Include any unique or important information so we can tailor your
              file plan.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlockImage src="/img/process/prompt.png" />
        </Grid>
      </Grid>
      <Grid container mb={3}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={1}>
              Answer intelligent questions
            </Typography>
            <Typography variant="body1" mb={2}>
              This is how you achieve custom, personalized results.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlockImage src="/img/process/questions.png" />
        </Grid>
      </Grid>
      <Grid container mb={3}>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="h4" mb={1}>
              Review your file plan
            </Typography>
            <Typography variant="body1" mb={2}>
              Review and change your file plan as desired before generating your
              files.
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
            <Typography variant="h4" mb={1}>
              Refine your new files
            </Typography>
            <Typography variant="body1" mb={2}>
              Use the built-in editors to refine, store, or transfer your files.
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
