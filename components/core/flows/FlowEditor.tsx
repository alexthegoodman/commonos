"use client";

import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import { getFileListData, getQuestionsData } from "@/fetchers/flow";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

const AnswerButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  width: "200px",
  height: "200px",
}));

export default function FlowEditor({ id, prompt }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useFlowQuestionsContext();
  const [currentFileId, setCurrentFileId] = useState(null);
  const [gotFiles, setGotFiles] = useState(false);
  const [view, setView] = useState("initial"); // initial, files, questions

  const currentFileData = state.files.find((file) => file.id === currentFileId);

  const beginQuestions = (file) => {
    setCurrentFileId(file.id);
    setView("questions");
  };

  useEffect(() => {
    if (view === "initial") {
      if (!state.initialQuestions || state.initialQuestions.length === 0) {
        getQuestionsData(token, prompt, "initial").then((data) => {
          console.info("got initial questions", data);

          dispatch({
            type: "initialQuestions",
            payload: data.questions.map((question) => {
              return {
                id: uuidv4(),
                question: question.question,
                possibleAnswers: question.answers,
              };
            }),
          });
        });
      }
    }
    if (view === "files") {
      if (state.files.length === 0 && !gotFiles) {
        // fetch file list from api and add to context
        console.info("fetch file list");

        getFileListData(token, id, "documents").then((data1) => {
          console.info("got file list 1", data1);

          let files = data1.documents.map((file) => {
            return {
              id: uuidv4(),
              name: file,
              app: "documents",
              questions: [],
            };
          });

          if (data1?.documents?.length) {
            getFileListData(token, id, "additionalFiles").then((data2) => {
              console.info("got file list 2", data2);

              if (
                data2?.spreadsheets?.length &&
                data2?.presentations?.length &&
                data2?.images?.length
              ) {
                files = [
                  ...files,
                  ...data2.presentations.map((file) => {
                    return {
                      id: uuidv4(),
                      name: file,
                      app: "slides",
                      questions: [],
                    };
                  }),
                  ...data2.spreadsheets.map((file) => {
                    return {
                      id: uuidv4(),
                      name: file,
                      app: "sheets",
                      questions: [],
                    };
                  }),
                  ...data2.images.map((file) => {
                    return {
                      id: uuidv4(),
                      name: file,
                      app: "images",
                      questions: [],
                    };
                  }),
                ];

                console.info("dispatch files", files);
                dispatch({
                  type: "files",
                  payload: files,
                });
                setGotFiles(true);
              }
            });
          }
        });
      }
    }
  }, [view]);

  return (
    <Box>
      <Typography variant="h4">{prompt}</Typography>
      <Grid container gap={3}>
        {view === "initial" && (
          <>
            {state.initialQuestions && state.initialQuestions.length > 0 ? (
              state.initialQuestions.map((question, i) => (
                <Grid key={question.id} item xs={12} md={12}>
                  <Typography variant="subtitle1">
                    {question.question}
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-start"
                    width="fit-content"
                  >
                    {question.possibleAnswers.map((answer, j) => (
                      <AnswerButton
                        key={j}
                        onClick={() => {
                          // TODO
                        }}
                      >
                        {answer}
                      </AnswerButton>
                    ))}
                  </Box>
                </Grid>
              ))
            ) : (
              <CircularProgress />
            )}
          </>
        )}
        {view === "files" && (
          <>
            {state.files.length > 0 ? (
              state.files.map((file, i) => (
                <Grid key={file.id} item xs={12} md={12}>
                  <Box display="flex" flexDirection="row">
                    <Typography variant="body2" width={200}>
                      {file.app}
                    </Typography>
                    <TextField fullWidth label="File Name" value={file.name} />
                    <Box width={600}>
                      <Button>Skip File</Button>
                      <Button>Use Default</Button>
                      <Button
                        color="success"
                        variant="contained"
                        onClick={() => beginQuestions(file)}
                      >
                        Answer Questions
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <CircularProgress />
            )}
          </>
        )}
        {view === "questions" && (
          <>
            <Typography variant="h5">{currentFileData.name}</Typography>
            {currentFileData.questions.map((question, i) => (
              <Grid key={question.id} item xs={12} md={12}>
                <Typography variant="subtitle1">{question.question}</Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-start"
                  width="fit-content"
                >
                  {question.possibleAnswers.map((answer, j) => (
                    <AnswerButton
                      key={j}
                      onClick={() => {
                        // dispatch({
                        //     type: "files",
                        //     payload: state.files.map((file) => {
                        //     if (file.id === currentFileId) {
                        //         return {
                        //         ...file,
                        //         questions: [
                        //             ...(file.questions || []),
                        //             {
                        //             ...question,
                        //             chosenAnswer: answer,
                        //             },
                        //         ],
                        //         };
                        //     } else {
                        //         return file;
                        //     }
                        //     }),
                        // });
                      }}
                    >
                      {answer}
                    </AnswerButton>
                  ))}
                </Box>
              </Grid>
            ))}
            <Button
            // onClick={() => {
            //     setCurrentFileId(null);
            // }}
            >
              Finish
            </Button>
          </>
        )}
      </Grid>
    </Box>
  );
}
