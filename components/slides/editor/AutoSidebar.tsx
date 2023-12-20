"use client";

import { useSlidesContext } from "@/context/SlidesContext";
import { getGuideQuestionsData } from "@/fetchers/flow";
import { CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDebounce } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

const SidebarWrapper = styled("aside")(({ theme }) => ({
  width: "400px",
  height: "100vh",
  position: "fixed",
  top: "0",
  right: "0",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "20px 0",
  boxSizing: "border-box",
}));

const AnswerButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  width: "90px",
  height: "90px",
  fontSize: "0.7rem",
  backgroundColor: "rgba(255,255,255,0.1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "scale(1.05)",
    transition: "all 0.2s ease-in-out",
  },
}));

const MessageItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "rgba(0,0,0,0.1)",
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

function SidebarQuestionItem({ question, state, dispatch }) {
  return (
    <Grid key={question.id} item xs={12} md={12}>
      <Typography variant="subtitle2">{question.question}</Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        flexWrap="wrap"
      >
        {question.possibleAnswers.map((answer, j) => {
          const chosen = question.chosenAnswers.find((a) => a === answer)
            ? true
            : false;
          return (
            <AnswerButton key={j} onClick={() => {}}>
              {chosen && <CheckCircle />}
              {answer}
            </AnswerButton>
          );
        })}
        <AnswerButton onClick={() => {}}>Add Your Own Answer</AnswerButton>
      </Box>
      <Box sx={{ width: 600, padding: 1 }}>
        <TextareaAutosize
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
            resize: "none",
            display:
              state.openQuestionIds &&
              state.openQuestionIds.find((id) => id === question.id)
                ? "block"
                : "none",
          }}
          placeholder="Enter your own answer"
          minRows={3}
          onChange={(e) => {}}
          defaultValue={question.freeformAnswer}
        />
      </Box>
    </Grid>
  );
}

export default function AutoSidebar() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [state, dispatch] = useSlidesContext();
  const debouncedState = useDebounce(state, 500);

  const slide = state.slides.filter(
    (slide) => slide.id === state.currentSlideId
  )[0];

  const dispatchNewMessage = (data) => {
    const prevMessages = state?.messages ? state.messages : [];
    dispatch({
      type: "messages",
      payload: [
        ...prevMessages,
        {
          id: uuidv4(),
          type: "questions",
          from: "system",
          regarding: slide.id,
          questions: data.questions.map((question) => {
            return {
              id: uuidv4(),
              type: "multipleChoice",
              question: question.question,
              possibleAnswers: question.answers,
              chosenAnswers: [],
              freeformAnswer: "",
            };
          }),
        },
      ],
    });
    setLoading(false);
  };

  useEffect(() => {
    setHasMounted(true);
    if (!state?.messages) {
      // first set of questions
      const sectionContent = slide.texts.map((text) => ({
        id: text.id,
        text: text.content,
      }));

      getGuideQuestionsData(token, "slides", slide.title, sectionContent).then(
        dispatchNewMessage
      );
    }
  }, []);

  useEffect(() => {
    // do not call on first mount, only after currentSlideId changes
    if (hasMounted && debouncedState.currentSlideId && state?.messages) {
      const lastMessageRegardingSlide = state.messages.filter(
        (message) => message.regarding === debouncedState.currentSlideId
      )[0];
      const questionsAnswered = lastMessageRegardingSlide?.questions?.filter(
        (question) =>
          question.chosenAnswers.length > 0 || question.freeformAnswer
      );

      console.log(
        "questionsAnswered",
        lastMessageRegardingSlide,
        questionsAnswered
      );

      // if last message regarding this slide has questions answered, then fetch more questions
      if (
        (!lastMessageRegardingSlide && !questionsAnswered) ||
        (questionsAnswered && questionsAnswered.length > 0)
      ) {
        const sectionContent = slide.texts.map((text) => ({
          id: text.id,
          text: text.content,
        }));

        setLoading(true);

        getGuideQuestionsData(
          token,
          "slides",
          slide.title,
          sectionContent
        ).then(dispatchNewMessage);
      }
    }
  }, [debouncedState.currentSlideId]);

  return (
    <SidebarWrapper>
      <Typography variant="overline" px={3}>
        Live Guide
      </Typography>
      <Box
        sx={{
          height: "calc(100vh - 200px)",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        {state?.messages &&
          state.messages.map((message) => {
            const regardingData = state.slides.filter(
              (slide) => slide.id === message.regarding
            )[0];

            if (message.type === "questions") {
              return (
                <MessageItem key={message.id} container spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" mb={2}>
                      Regarding {regardingData.title}
                    </Typography>
                  </Box>
                  {message.questions.map((question) => (
                    <SidebarQuestionItem
                      key={question.id}
                      question={question}
                      state={state}
                      dispatch={dispatch}
                    />
                  ))}
                </MessageItem>
              );
            }
          })}
        {(!state?.messages || loading) && <CircularProgress />}
      </Box>
    </SidebarWrapper>
  );
}
