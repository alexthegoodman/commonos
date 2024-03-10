"use client";

import EmptyNotice from "@/components/core/layout/EmptyNotice";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { useSlidesContext } from "@/context/SlidesContext";
import { getGuideQuestionsData, getRevisedContentData } from "@/fetchers/flow";
import { CheckCircle, Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDebounce } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

export const SidebarWrapper = styled("aside")(({ theme, mobileOpen }) => ({
  // minWidth: "400px",
  // width: "25vw",
  // maxWidth: "600px",
  width: "26vw",
  height: "100vh",
  position: "fixed",
  zIndex: "20",
  top: "0",
  right: "0",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "20px 0",
  boxSizing: "border-box",

  // background: "linear-gradient(355deg, #373b44, #4286f4)",
  // backgroundSize: "400% 400%",
  // animation: "AnimationName 15s ease infinite",

  [theme.breakpoints.down("lg")]: {
    padding: "10px 0",
    width: "100vw",
    maxWidth: "100vw",
    height: "350px",
    backgroundColor: theme.palette.background.default,
    top: "auto",
    bottom: mobileOpen ? "0" : "-300px",
    transition: "all 0.2s ease-in-out",
  },
}));

const AnswerButton = styled(Button)(({ theme }) => ({
  margin: "4px",
  width: "30%",
  minHeight: "90px",
  aspectRatio: "3/2",
  fontSize: "14px",
  backgroundColor: "rgba(255,255,255,0.1)",
  transition: "all 0.2s ease-in-out",
  padding: "4px",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "scale(1.05)",
    transition: "all 0.2s ease-in-out",
  },
}));

export const MessageItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "rgba(0,0,0,0.02)",
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

export function SidebarQuestionItem({
  messageData,
  question,
  state,
  dispatch,
  disabled = false,
}) {
  return (
    <Grid key={question.id} item xs={12} md={12}>
      <Typography variant="body1">{question.question}</Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        flexWrap="wrap"
      >
        {question?.possibleAnswers?.map((answer, j) => {
          const chosen = question.chosenAnswers.find((a) => a === answer)
            ? true
            : false;
          return (
            <AnswerButton
              key={j}
              disabled={disabled}
              onClick={() => {
                if (chosen) {
                  dispatch({
                    type: "messages",
                    payload: state.messages.map((message) => {
                      if (message.id === messageData.id) {
                        return {
                          ...message,
                          questions: message.questions.map((q) => {
                            if (q.id === question.id) {
                              return {
                                ...q,
                                chosenAnswers: q.chosenAnswers.filter(
                                  (a) => a !== answer
                                ),
                              };
                            }
                            return q;
                          }),
                        };
                      }
                      return message;
                    }),
                  });
                } else {
                  dispatch({
                    type: "messages",
                    payload: state.messages.map((message) => {
                      if (message.id === messageData.id) {
                        return {
                          ...message,
                          questions: message.questions.map((q) => {
                            if (q.id === question.id) {
                              return {
                                ...q,
                                chosenAnswers: [...q.chosenAnswers, answer],
                              };
                            }
                            return q;
                          }),
                        };
                      }
                      return message;
                    }),
                  });
                }
              }}
            >
              {chosen && <CheckCircle />}
              {answer}
            </AnswerButton>
          );
        })}
        <AnswerButton
          disabled={disabled}
          onClick={() => {
            const questionInIds = state?.openQuestionIds?.find(
              (id) => id === question.id
            );
            if (questionInIds) {
              dispatch({
                type: "openQuestionIds",
                payload: state.openQuestionIds.filter(
                  (id) => id !== question.id
                ),
              });
              dispatch({
                type: "messages",
                payload: state.messages.map((message) => {
                  if (message.id === messageData.id) {
                    return {
                      ...message,
                      questions: message.questions.map((q) => {
                        if (q.id === question.id) {
                          return {
                            ...q,
                            freeformAnswer: "",
                          };
                        }
                        return q;
                      }),
                    };
                  }
                  return message;
                }),
              });
            } else {
              const questionIds = state.openQuestionIds || [];
              dispatch({
                type: "openQuestionIds",
                payload: [...questionIds, question.id],
              });
            }
          }}
        >
          Add Your Own Answer
        </AnswerButton>
      </Box>
      <Box sx={{ width: 400, padding: 1 }}>
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
          onChange={(e) => {
            dispatch({
              type: "messages",
              payload: state.messages.map((message) => {
                if (message.id === messageData.id) {
                  return {
                    ...message,
                    questions: message.questions.map((q) => {
                      if (q.id === question.id) {
                        return {
                          ...q,
                          freeformAnswer: e.target.value,
                        };
                      }
                      return q;
                    }),
                  };
                }
                return message;
              }),
            });
          }}
          defaultValue={question.freeformAnswer}
          disabled={disabled}
        />
      </Box>
    </Grid>
  );
}

export default function AutoSidebar({ title }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [state, dispatch] = useSlidesContext();
  const debouncedState = useDebounce(state, 500);
  const messagesContainerRef = useRef(null);

  const slide = state.slides.filter(
    (slide) => slide.id === state.currentSlideId
  )[0];

  const fileTitle = title + " - " + slide?.title;

  const scrollToMessage = (messageId) => {
    const replacedMessageTop = document.getElementById(
      `messageItem${messageId}`
    ).offsetTop;
    const padding = 90;
    const newScrollTop = replacedMessageTop - padding;

    // console.info(
    //   "scrollToMessage",
    //   replacedMessageTop,
    //   newScrollTop
    // );

    messagesContainerRef.current.scrollTop = newScrollTop;
  };

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
          originalText: slide.texts.map((text) => text.content).join(" "),
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

    // scroll sidebar to bottom
    setTimeout(() => {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }, 500);
  };

  const replaceMessage = (data, messageId, originalText) => {
    const prevMessages = state?.messages ? state.messages : [];
    const newMessages = prevMessages.map((message) => {
      if (message.id === messageId) {
        let addtProps = {};
        if (originalText) {
          addtProps = { originalText };
        }
        return {
          ...message,
          ...addtProps,
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
        };
      }
      return message;
    });
    dispatch({
      type: "messages",
      payload: newMessages,
    });
    setLoading(false);

    // scroll sidebar to replacedMessage
    const replacedMessage = newMessages.find(
      (message) => message.id === messageId
    );
    const replacedMessageIndex = newMessages.indexOf(replacedMessage);
    scrollToMessage(replacedMessage.regarding + replacedMessageIndex);
  };

  useEffect(() => {
    setHasMounted(true);
    if (!state?.messages && slide?.texts) {
      // first set of questions
      const sectionContent = slide.texts.map((text) => ({
        id: text.id,
        text: text.content,
      }));

      if (!sectionContent.length) return;

      getGuideQuestionsData(token, "slides", fileTitle, sectionContent).then(
        dispatchNewMessage
      );
    }
  }, [debouncedState.currentSlideId]);

  useEffect(() => {
    // do not call on first mount, only after currentSlideId changes
    if (hasMounted && debouncedState.currentSlideId && state?.messages) {
      const messagesRegardingSlide = state.messages.filter(
        (message) => message.regarding === debouncedState.currentSlideId
      );
      const lastMessageRegardingSlide =
        messagesRegardingSlide[messagesRegardingSlide.length - 1];
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

        if (!sectionContent.length) return;

        setLoading(true);

        getGuideQuestionsData(token, "slides", fileTitle, sectionContent).then(
          dispatchNewMessage
        );
      }
    }
  }, [debouncedState.currentSlideId]);

  useEffect(() => {
    // do not call on first mount, make sure slide didn't just change
    // also make sure it was the text content that changed, not its other properties
    if (hasMounted && debouncedState.currentSlideId === slide.id) {
      if (!state.messages) return;

      const messagesRegardingSlide = state.messages.filter(
        (message) => message.regarding === state.currentSlideId
      );
      const lastMessageRegardingSlide =
        messagesRegardingSlide[messagesRegardingSlide.length - 1];

      if (!lastMessageRegardingSlide) return;

      const currentText = slide.texts.map((text) => text.content).join(" ");

      if (lastMessageRegardingSlide.originalText === currentText) return;

      const sectionContent = slide.texts.map((text) => ({
        id: text.id,
        text: text.content,
      }));

      if (!sectionContent.length) return;

      console.info("slide.texts changed... replace questions");

      setLoading(true);

      getGuideQuestionsData(token, "slides", fileTitle, sectionContent).then(
        (data) =>
          replaceMessage(data, lastMessageRegardingSlide.id, currentText)
      );
    }
  }, [slide?.texts]);

  useEffect(() => {
    // scroll sidebar to most recent message regarding current slide
    if (debouncedState.currentSlideId && state?.messages) {
      const messagesRegardingSlide = state.messages.filter(
        (message) => message.regarding === debouncedState.currentSlideId
      );
      const lastMessageRegardingSlide =
        messagesRegardingSlide[messagesRegardingSlide.length - 1];

      if (lastMessageRegardingSlide) {
        const lastMessageRegardingSlideIndex = state.messages.indexOf(
          lastMessageRegardingSlide
        );
        scrollToMessage(
          debouncedState.currentSlideId + lastMessageRegardingSlideIndex
        );
      }
    }
  }, [debouncedState.currentSlideId]);

  return (
    <SidebarWrapper>
      <Typography variant="overline" px={3}>
        Flow
      </Typography>
      <Box
        ref={messagesContainerRef}
        sx={{
          height: "calc(100vh - 200px)",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        {state?.messages &&
          state.messages.map((message, i) => {
            const regardingData = state.slides.filter(
              (slide) => slide.id === message.regarding
            )[0];

            if (message.type === "questions") {
              const questionsAnswered = message.questions.filter(
                (question) =>
                  question.chosenAnswers.length > 0 || question.freeformAnswer
              );
              return (
                <MessageItem
                  key={message.id}
                  id={`messageItem${message.regarding + i}`}
                  container
                  spacing={2}
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="subtitle1">
                      Regarding {regardingData.title}
                    </Typography>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      disabled={loading}
                      onClick={() => {
                        const messageSlide = state.slides.filter(
                          (slide) => slide.id === message.regarding
                        )[0];
                        const sectionContent = messageSlide.texts.map(
                          (text) => ({
                            id: text.id,
                            text: text.content,
                          })
                        );

                        setLoading(true);

                        getGuideQuestionsData(
                          token,
                          "slides",
                          fileTitle,
                          sectionContent
                        ).then((data) => replaceMessage(data, message.id));
                      }}
                    >
                      <Refresh />
                    </Button>
                  </Box>
                  {message.questions.map((question) => (
                    <SidebarQuestionItem
                      key={question.id}
                      messageData={message}
                      question={question}
                      state={state}
                      dispatch={dispatch}
                      disabled={loading}
                    />
                  ))}
                  <Button
                    color="success"
                    variant="contained"
                    disabled={loading || questionsAnswered.length === 0}
                    onClick={() => {
                      const sectionContent = slide.texts.map((text) => ({
                        id: text.id,
                        text: text.content,
                      }));

                      if (!sectionContent.length) return;

                      setLoading(true);

                      getRevisedContentData(
                        token,
                        "slides",
                        fileTitle,
                        sectionContent,
                        message.questions
                      ).then((data) => {
                        let sections = data["Slide Sections"];
                        sections = Object.keys(sections).map((key) => ({
                          section: key,
                          content: sections[key],
                        }));
                        console.log("sections", sections);
                        dispatch({
                          type: "slides",
                          payload: state.slides.map((slide) => {
                            if (slide.id === message.regarding) {
                              return {
                                ...slide,
                                texts: slide.texts.map((text, i) => {
                                  // const section = sections.find(
                                  //   (section) => section.section === i + 1
                                  // );
                                  const section = sections[i];
                                  console.info("section", section);
                                  return {
                                    ...text,
                                    content: section?.content ?? text.content,
                                  };
                                }),
                              };
                            }
                            return slide;
                          }),
                        });
                        setLoading(false);
                      });
                    }}
                  >
                    Update Content
                  </Button>
                </MessageItem>
              );
            }
          })}
        {(!state?.messages || loading) && slide?.texts?.length > 0 && (
          <PrimaryLoader />
        )}
        {(!state?.messages || loading) &&
          (!slide?.texts || slide?.texts?.length === 0) && (
            <EmptyNotice message="Add some text to a slide!" />
          )}
      </Box>
    </SidebarWrapper>
  );
}
