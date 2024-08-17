"use client";

import request from "graphql-request";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

import FormInput from "../fields/FormInput";
import FormMessage from "../fields/FormMessage";

import Helpers from "../../../helpers/Helpers";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  styled,
} from "@mui/material";
import FormTextarea from "../fields/FormTextarea";
import { newFlow } from "@/fetchers/flow";
import promptsMetadata from "../../../fixtures/promptsMetadata.json";

// import { useTranslation } from "next-i18next";
// import MixpanelBrowser from "../../../helpers/MixpanelBrowser";

const CmForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "25px",
}));

// const examplePrompts = [
//   "Help me create a game where the surface people with powerful solar technology enter into a war with the magical subsurface people. The game will be called The Abyss.",
//   "Help me debut a minimalist electronic music album focused on digital streaming. I want to call it Super Machina.",
//   "I want to cultivate coffee scientifically to achieve the most standout flavors and aromas. I also want to have rare, organic additives.",
//   "I need to create a collection of sales literature related to CommonOS which help us sell to early-stage founders and young tech workers.",
//   "Help me create a series of email newsletters for the upcoming launch season for my company Common. Common’s primary early market is startups and founders, and the emails should be centered around CommonOS’s automation features.",
//   "Architect a sustainable, self-sufficient habitat design for a Mars colonization project, optimizing for minimal resource consumption and maximum resilience.",
//   "Create an immersive virtual reality experience that simulates historical events, focusing on ancient civilizations like the Mayans or Mesopotamians, emphasizing accuracy and educational value.",
//   "Craft a strategic plan for a non-profit organization dedicated to preserving endangered species, integrating conservation efforts with community engagement and education.",
//   "Create a comprehensive training module using interactive simulations to educate call center agents on handling escalated customer complaints, focusing on de-escalation techniques and conflict resolution.",
//   "Implement a post-call survey system that collects detailed feedback from customers, analyzing data to identify trends and areas for call center service improvement.",
//   "Develop a comprehensive business growth strategy for Company X that leverages emerging markets and innovative technologies to expand our customer base by 30% within the next fiscal year.",
//   "Create a detailed financial forecasting model that accounts for potential market fluctuations and growth scenarios, ensuring robust financial planning for the next five years.",
//   "Design a scalable organizational structure for Company X that accommodates rapid growth, fostering innovation and maintaining operational efficiency across multiple departments. Company X is ____.",
//   "Define a lean go-to-market strategy for Company X that maximizes Product Y exposure within a limited budget, targeting early adopters and validating market demand. Product Y is a ____ for _____.",
//   "Create a Minimum Viable Product (MVP) roadmap for Product Y outlining key features and functionalities to swiftly launch and gather user feedback for iterative improvements. Product Y is a ____ where _____.",
//   "Develop a compelling pitch deck for Company X optimized for investor presentations, emphasizing the problem-solution fit, market opportunity, and early traction. Company X was founded ______ and has been _____ for _____.",
//   "Assist in creating sales scripts or talking points for Product Y to use in upcoming client presentations or pitches, highlighting key selling propositions. Product Y is about _____.",
//   "Develop content ideas for upcoming blog posts or social media campaigns regarding Product Y, aligning content with current industry trends or customer pain points. Product Y is about _____.",
// ].sort(() => Math.random() - 0.5);

const ExamplePromptsButton = ({ setPromptValue }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClickOpen}
      >
        See Example Prompts
      </Button>
      <Dialog open={open} keepMounted onClose={handleClose}>
        <DialogTitle>{"Example Prompts"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {promptsMetadata.map((prompt, i) => (
              <>
                <Box
                  key={`prompt${i}`}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={2}
                  mt={2}
                >
                  <Box>
                    <Typography variant="overline" mr={2}>
                      {prompt.category}
                    </Typography>
                    <Typography variant="body1" mr={2}>
                      {prompt.promptText}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setPromptValue("prompt", prompt.promptText);
                      handleClose();
                    }}
                  >
                    Try Prompt
                  </Button>
                </Box>
                <hr />
              </>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const PrimaryPromptForm = ({
  onClick = (e) => console.info("Click AuthForm"),
  type = "login",
}) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  // const { t } = useTranslation();
  const helpers = new Helpers();
  // const mixpanel = new MixpanelBrowser();

  const router = useRouter();

  const [formErrorMessage, setFormErrorMessage] = React.useState("");
  const [submitLoading, setSubmitLoading] = React.useState(false);

  console.info("cookies", cookies);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log("onSubmit", data);

    setSubmitLoading(true);

    try {
      // prompt power
      const { id } = await newFlow(token, data.prompt, "edit");
      router.push(`/flows/${id}`);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.errors[0].message;
      setFormErrorMessage(errorMessage);
      setSubmitLoading(false);
    }
  };

  const onError = (error: any) => console.error(error);

  let submitButtonText = "Begin Flow";

  if (submitLoading) submitButtonText = "Working...";

  return (
    <Box>
      <Alert
        severity="info"
        sx={{
          borderRadius: "25px",
          padding: "15px",
          position: "relative",
          zIndex: "10",
        }}
      >
        <Typography variant="body1" mb={1}>
          The magic of CommonOS is in the Flow experience.
          <br />
          Try it with a prompt!
        </Typography>
        <ExamplePromptsButton setPromptValue={setValue} />
      </Alert>
      <CmForm onSubmit={handleSubmit(onSubmit, onError)}>
        <FormMessage type="error" message={formErrorMessage} />

        <FormTextarea
          type="prompt"
          name="prompt"
          placeholder={"What do you want to do?"}
          register={register}
          errors={errors}
          validation={{
            required: "Prompt Required",
          }}
          minRows={3}
          autoFocus={true}
          style={{
            fontSize: "1rem",
            lineHeight: "1.5rem",
            // padding: "20px",
            boxSizing: "border-box",
            marginBottom: "20px",
          }}
        />

        <Button
          type="submit"
          color="success"
          variant="contained"
          disabled={submitLoading}
          sx={{ minWidth: "200px" }}
        >
          {submitButtonText}
        </Button>
      </CmForm>
    </Box>
  );
};

export default PrimaryPromptForm;
