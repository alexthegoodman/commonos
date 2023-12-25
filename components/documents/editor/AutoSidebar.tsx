"use client";

import EmptyNotice from "@/components/core/layout/EmptyNotice";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import {
  MessageItem,
  SidebarQuestionItem,
  SidebarWrapper,
} from "@/components/slides/editor/AutoSidebar";
import { useDocumentsContext } from "@/context/DocumentsContext";
import { getDocumentsData } from "@/fetchers/document";
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
import useSWR from "swr";
import { useDebounce } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
export default function AutoSidebar({ documentId, documentData }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: documentsData,
    error,
    isLoading,
    // mutate,
  } = useSWR("browseKey", () => getDocumentsData(token));

  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [state, dispatch] = useDocumentsContext();
  const debouncedState = useDebounce(state, 500);
  const messagesContainerRef = useRef(null);

  const fileTitle = documentData?.title;

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
          regarding: documentData.id,
          //   originalText: document.texts.map((text) => text.content).join(" "),
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
    console.info(
      "mounted",
      hasMounted,
      debouncedState?.messages,
      debouncedState.markdown
    );
    if (!debouncedState?.messages && debouncedState.markdown) {
      // first set of questions
      const sectionContent = [
        {
          id: "1",
          text: debouncedState.markdown,
        },
      ];

      console.info("documents getGuideQuestionsData...");

      getGuideQuestionsData(token, "documents", fileTitle, sectionContent).then(
        dispatchNewMessage
      );
    }
  }, [debouncedState.markdown]);

  return (
    <SidebarWrapper>
      <Typography variant="overline" px={3}>
        Live Guide
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
            const regardingData = documentsData?.filter(
              (document) => document.id === message.regarding
            )[0];

            if (!regardingData) {
              return <></>;
            }

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
                        const sectionContent = [
                          {
                            id: "1",
                            text: state.markdown,
                          },
                        ];

                        setLoading(true);

                        getGuideQuestionsData(
                          token,
                          "documents",
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
                      const sectionContent = [
                        {
                          id: "1",
                          text: state.markdown,
                        },
                      ];

                      setLoading(true);

                      getRevisedContentData(
                        token,
                        "documents",
                        fileTitle,
                        sectionContent,
                        message.questions
                      ).then((data) => {
                        const newMarkdown = data.text;

                        dispatch({
                          type: "revisedMarkdown",
                          payload: newMarkdown,
                        });

                        // TODO: update LexicalRTE with new markdown

                        const newSectionContent = [
                          {
                            id: "1",
                            text: newMarkdown,
                          },
                        ];

                        getGuideQuestionsData(
                          token,
                          "documents",
                          fileTitle,
                          newSectionContent
                        ).then((data) => replaceMessage(data, message.id));
                      });
                    }}
                  >
                    Update Content
                  </Button>
                </MessageItem>
              );
            }
          })}
        {(!state?.messages || loading) && state.editorPlaintext && (
          <PrimaryLoader />
        )}
        {(!state?.messages || loading) && !state.editorPlaintext && (
          <EmptyNotice message="Add some text to a document!" />
        )}
      </Box>
    </SidebarWrapper>
  );
}
