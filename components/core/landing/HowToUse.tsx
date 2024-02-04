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

export const howToUseSteps = [
  {
    label: "Start with a prompt",
    description:
      "Include any unique or important information so we can tailor your file plan.",
    image: "/img/process/prompt.png",
  },
  {
    label: "Answer intelligent questions",
    description: "This is how you achieve custom, personalized results.",
    image: "/img/process/questions.png",
  },
  {
    label: "Review your file plan",
    description:
      "Review and change your file plan as desired before generating your files.",
    image: "/img/process/review.png",
  },
  {
    label: "Refine your new files",
    description:
      "Use the built-in editors to refine, store, or transfer your files.",
    image: "/img/process/refine2.png",
  },
];

export default function HowToUse() {
  return (
    <>
      <Typography variant="h3" mb={4}>
        How To Use CommonOS
      </Typography>
      {howToUseSteps.map((step, index) => (
        <Grid container mb={index !== howToUseSteps.length ? 3 : 0} key={index}>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h4" mb={1}>
                {step.label}
              </Typography>
              <Typography variant="body1" mb={2}>
                {step.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <BlockImage src={step.image} />
          </Grid>
        </Grid>
      ))}
    </>
  );
}
