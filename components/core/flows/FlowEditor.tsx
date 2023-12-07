"use client";

import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import { getFileListData, getQuestionsData } from "@/fetchers/flow";
import {
  Check,
  CheckCircle,
  DocumentScanner,
  Image,
  List,
  PresentToAllOutlined,
} from "@mui/icons-material";
import {
  Alert,
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

const PromptWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PromptTitle = styled(Typography)(({ theme }) => ({
  display: "inline",
  backgroundColor: "white",
  color: "black",
  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  lineHeight: "3rem",
  padding: "4px",
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "50%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}));

const FileItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "0px",
  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  marginBottom: theme.spacing(2),
}));

const FileTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    fontSize: "0.8rem",
  },
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
                type: "multipleChoice",
                question: question.question,
                possibleAnswers: question.answers,
                chosenAnswers: [],
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
              skipFile: false,
              skipQuestions: true,
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
                      skipFile: false,
                      skipQuestions: true,
                    };
                  }),
                  ...data2.spreadsheets.map((file) => {
                    return {
                      id: uuidv4(),
                      name: file,
                      app: "sheets",
                      questions: [],
                      skipFile: false,
                      skipQuestions: true,
                    };
                  }),
                  ...data2.images.map((file) => {
                    return {
                      id: uuidv4(),
                      name: file,
                      app: "images",
                      questions: [],
                      skipFile: false,
                      skipQuestions: true,
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
      <PromptWrapper>
        <Typography variant="overline">Your Prompt</Typography>
        <Box>
          <PromptTitle variant="h4">{prompt}</PromptTitle>
        </Box>
      </PromptWrapper>

      {view === "initial" && (
        <>
          <Grid container gap={3}>
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
            <Button
              onClick={() => {
                setView("files");
              }}
            >
              Next
            </Button>
          </Grid>
        </>
      )}
      {view === "files" && (
        <>
          <Grid container gap={0}>
            <Grid item xs={12} md={8}>
              {state.files.length > 0 ? (
                <>
                  <Typography variant="overline">Your File Plan</Typography>
                  {state.files.map((file, i) => {
                    const hasAnsweredQuestion = file.questions.find(
                      (question) => question.chosenAnswers.length > 0
                    );

                    return (
                      <FileItem key={file.id}>
                        <Box
                          display="flex"
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            width={175}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            textTransform="capitalize"
                            textAlign="center"
                          >
                            <IconBox>
                              {file.app === "documents" && <DocumentScanner />}
                              {file.app === "slides" && (
                                <PresentToAllOutlined />
                              )}
                              {file.app === "sheets" && <List />}
                              {file.app === "images" && <Image />}
                            </IconBox>

                            {file.app}
                          </Typography>
                          <Box flex={1}>
                            <FileTextField fullWidth value={file.name} />
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            width={350}
                            padding="0px 20px"
                          >
                            <Button size="small">
                              Skip File {file.skipFile && <CheckCircle />}
                            </Button>
                            <Button size="small">
                              Skip Questions{" "}
                              {file.skipQuestions && <CheckCircle />}
                            </Button>
                            <Button
                              size="small"
                              color="success"
                              variant="contained"
                              onClick={() => beginQuestions(file)}
                            >
                              Answer Questions
                              {hasAnsweredQuestion && <CheckCircle />}
                            </Button>
                          </Box>
                        </Box>
                      </FileItem>
                    );
                  })}
                </>
              ) : (
                <CircularProgress />
              )}
            </Grid>
            <Grid item xs={12} md={4} paddingLeft={2}>
              <Alert severity="info">
                <Typography variant="h6" mb={1}>
                  Please review your files
                </Typography>
                <Typography variant="body2">
                  The files in this list will be created based on your answers
                  to questions for each file. You can also skip files or skip
                  the questions. Easily extend the list by adding new files or
                  editing file titles.
                </Typography>
              </Alert>
              <Box padding={2} textAlign="center">
                <Typography variant="h5">
                  {state.files.length} Files to be created
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => {
                    // TODO
                  }}
                >
                  Create Files
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      {view === "questions" && (
        <>
          <Grid container gap={3}>
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
          </Grid>
        </>
      )}
    </Box>
  );
}
