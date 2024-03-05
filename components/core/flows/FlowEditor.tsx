"use client";

import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import { getFileListData, getQuestionsData } from "@/fetchers/flow";
import {
  Analytics,
  Apps,
  Article,
  AutoAwesome,
  Check,
  CheckCircle,
  Close,
  ContentCopy,
  DocumentScanner,
  Email,
  GridOn,
  Image,
  InsertPhoto,
  LibraryMusic,
  List,
  People,
  PresentToAllOutlined,
  Refresh,
  Slideshow,
  VideoLibrary,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import FormSelect from "../fields/FormSelect";
import FormInput from "../fields/FormInput";
import { useRouter } from "next/navigation";
import PrimaryLoader from "../layout/PrimaryLoader";
import { allTabs } from "@/context/LauncherContext";

const AnswerButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  // width: "200px",
  width: "18vw",
  height: "200px",
  backgroundColor: "rgba(0,0,0,0.1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.2)",
    transform: "scale(1.05)",
    transition: "all 0.2s ease-in-out",
  },
  [theme.breakpoints.down("md")]: {
    width: "40vw",
    height: "auto",
  },
}));

const PromptWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PromptTitle = styled(Typography)(({ theme }) => ({
  display: "inline",
  // backgroundColor: "white",
  // background:
  //   "linear-gradient(90deg, rgba(126,345,255,1) 0%, rgba(255,185,90,0.1) 100%)",
  background:
    "-webkit-repeating-linear-gradient(bottom, #c8cc7c 0%, #c8cc7c 100%) !important",
  // "-webkit-background-clip": "text !important",
  // "-webkit-text-fill-color": "transparent !important",
  color: "black",
  // boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  lineHeight: "3rem",
  padding: "4px",
  // borderRadius: "15px",
  [theme.breakpoints.down("md")]: {
    fontSize: "24px",
    lineHeight: "2.2rem",
  },
}));

export const IconBox = styled(Box)(({ theme, app }) => {
  const backgroundColor = {
    documents: "#99c7a2",
    slides: "#faf56e",
    sheets: "#89e0d3",
    drawings: "#9190e0",
    relationships: "#E493B3",
    content: "#FFB996",
    "work-email": "#AAD7D9",
  }[app];
  return {
    width: "40px",
    height: "40px",
    backgroundColor,
    borderRadius: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing(1),
  };
});

export const FileItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "rgba(255,255,255,0.1)",
  // boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
  marginBottom: theme.spacing(3),
  borderRadius: "25px",
  "& input": {
    boxShadow: "none",
  },
}));

const FileTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    fontSize: "0.8rem",
    backgroundColor: "white",
    borderRadius: "0px !important",
    color: "green",
  },
}));

function QuestionItem({ type, fileId = null, question, state, dispatch }) {
  return (
    <Grid key={question.id} item xs={12} md={12}>
      <Typography variant="body1" sx={{ fontSize: "20px", marginBottom: 2 }}>
        {question.question}
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        width="fit-content"
        flexWrap="wrap"
      >
        {question.possibleAnswers.map((answer, j) => {
          const chosen = question.chosenAnswers.find((a) => a === answer)
            ? true
            : false;
          return (
            <AnswerButton
              key={j}
              onClick={() => {
                if (type === "initial") {
                  if (chosen) {
                    dispatch({
                      type: "initialQuestions",
                      payload: state.initialQuestions.map((q) => {
                        if (q.id === question.id) {
                          return {
                            ...q,
                            chosenAnswers: q.chosenAnswers.filter(
                              (a) => a !== answer
                            ),
                          };
                        } else {
                          return q;
                        }
                      }),
                    });
                  } else {
                    dispatch({
                      type: "initialQuestions",
                      payload: state.initialQuestions.map((q) => {
                        if (q.id === question.id) {
                          return {
                            ...q,
                            chosenAnswers: [...q.chosenAnswers, answer],
                          };
                        } else {
                          return q;
                        }
                      }),
                    });
                  }
                } else if (type === "files") {
                  if (chosen) {
                    dispatch({
                      type: "files",
                      payload: state.files.map((file) => {
                        if (file.id === fileId) {
                          return {
                            ...file,
                            questions: file.questions.map((q) => {
                              if (q.id === question.id) {
                                return {
                                  ...q,
                                  chosenAnswers: q.chosenAnswers.filter(
                                    (a) => a !== answer
                                  ),
                                };
                              } else {
                                return q;
                              }
                            }),
                          };
                        } else {
                          return file;
                        }
                      }),
                    });
                  } else {
                    // update chosenAnswers and update skipQuestions to false
                    dispatch({
                      type: "files",
                      payload: state.files.map((file) => {
                        if (file.id === fileId) {
                          return {
                            ...file,
                            skipQuestions: false,
                            questions: file.questions.map((q) => {
                              if (q.id === question.id) {
                                return {
                                  ...q,
                                  chosenAnswers: [...q.chosenAnswers, answer],
                                };
                              } else {
                                return q;
                              }
                            }),
                          };
                        } else {
                          return file;
                        }
                      }),
                    });
                  }
                }
              }}
            >
              {chosen && <CheckCircle style={{ marginRight: "5px" }} />}
              {answer}
            </AnswerButton>
          );
        })}
        <AnswerButton
          onClick={() => {
            const questionInIds = state.openQuestionIds.find(
              (id) => id === question.id
            );
            if (questionInIds) {
              dispatch({
                type: "openQuestionIds",
                payload: state.openQuestionIds.filter(
                  (id) => id !== question.id
                ),
              });
              if (type === "initial") {
                dispatch({
                  type: "initialQuestions",
                  payload: state.initialQuestions.map((q) => {
                    if (q.id === question.id) {
                      return {
                        ...q,
                        freeformAnswer: "",
                      };
                    } else {
                      return q;
                    }
                  }),
                });
              } else if (type === "files") {
                // update freeformAnswer
                dispatch({
                  type: "files",
                  payload: state.files.map((file) => {
                    if (file.id === fileId) {
                      return {
                        ...file,
                        questions: file.questions.map((q) => {
                          if (q.id === question.id) {
                            return {
                              ...q,
                              freeformAnswer: "",
                            };
                          } else {
                            return q;
                          }
                        }),
                      };
                    } else {
                      return file;
                    }
                  }),
                });
              }
            } else {
              dispatch({
                type: "openQuestionIds",
                payload: [...(state.openQuestionIds || []), question.id],
              });
            }
          }}
        >
          Add Your Own Answer
        </AnswerButton>
      </Box>
      <Box sx={{ padding: 1, width: "100%", maxWidth: "600px" }}>
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
            if (type === "initial") {
              dispatch({
                type: "initialQuestions",
                payload: state.initialQuestions.map((q) => {
                  if (q.id === question.id) {
                    return {
                      ...q,
                      freeformAnswer: e.target.value,
                    };
                  } else {
                    return q;
                  }
                }),
              });
            } else if (type === "files") {
              dispatch({
                type: "files",
                payload: state.files.map((file) => {
                  if (file.id === fileId) {
                    return {
                      ...file,
                      questions: file.questions.map((q) => {
                        if (q.id === question.id) {
                          return {
                            ...q,
                            freeformAnswer: e.target.value,
                          };
                        } else {
                          return q;
                        }
                      }),
                    };
                  } else {
                    return file;
                  }
                }),
              });
            }
          }}
          defaultValue={question.freeformAnswer}
        />
      </Box>
    </Grid>
  );
}

export default function FlowEditor({ id, prompt }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const router = useRouter();
  const [state, dispatch] = useFlowQuestionsContext();
  const [currentFileId, setCurrentFileId] = useState(null);
  const [gotFiles, setGotFiles] = useState(false);
  const [view, setView] = useState("initial"); // initial, files, questions
  const [questionsView, setQuestionsView] = useState("background"); // background, questions
  const [loading, setLoading] = useState(false);

  const currentFileData = state.files.find((file) => file.id === currentFileId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    dispatch({
      type: "files",
      payload: [
        ...state.files,
        {
          id: uuidv4(),
          name: data.name,
          app: data.app,
          questions: [],
          skipQuestions: true,
        },
      ],
    });
    reset();
  };
  const onError = (error) => console.error(error);

  const beginQuestions = (file) => {
    setCurrentFileId(file.id);
    setView("questions");
  };

  const getFileQuestions = () => {
    setLoading(true);
    getQuestionsData(
      token,
      id,
      currentFileData.app,
      `
      File Title: "${currentFileData.name}"
      Background Information: "${currentFileData.background}"
    `,
      "files"
    )
      .then((data) => {
        console.info("got file questions", data);

        dispatch({
          type: "files",
          payload: state.files.map((file) => {
            if (file.id === currentFileId) {
              return {
                ...file,
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
            } else {
              return file;
            }
          }),
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("caught error", err);
        // TODO: display error
      });
  };

  const getInitialQuestions = () => {
    setLoading(true);
    getQuestionsData(token, id, "", prompt, "initial")
      .then((data) => {
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
              freeformAnswer: "",
            };
          }),
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("caught error", err);
        // TODO: display error
      });
  };

  const getFiles = () => {
    // fetch file list from api and add to context
    console.info("fetch file list");

    setLoading(true);

    getFileListData(token, id)
      .then((data1) => {
        console.info("got file list 1", data1);

        let files = [] as any;

        Object.keys(data1).forEach((key) => {
          if (data1[key].length) {
            files = [
              ...files,
              ...data1[key].map((file) => {
                return {
                  id: uuidv4(),
                  name: file,
                  app: key,
                  questions: [],
                  skipQuestions: true,
                };
              }),
            ];
          }
        });

        if (files.length > 0) {
          console.info("dispatch files", files);
          dispatch({
            type: "files",
            payload: files,
          });
          setGotFiles(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("caught error", err);
        // TODO: display error
      });
  };

  useEffect(() => {
    if (view === "initial") {
      if (!state.initialQuestions || state.initialQuestions.length === 0) {
        getInitialQuestions();
      }
    }
    if (view === "apps") {
      if (!state.chosenApps || state.chosenApps.length === 0) {
        dispatch({
          type: "chosenApps",
          payload: ["documents", "slides", "work-email"],
        });
      }
    }
    if (view === "files") {
      if (state.files.length === 0 && !gotFiles) {
        getFiles();
      }
    }
    if (view === "questions" && questionsView === "questions") {
      if (
        !currentFileData.questions ||
        currentFileData.questions.length === 0
      ) {
        getFileQuestions();
      }
    }
  }, [view, questionsView]);

  return (
    <Box pb={4}>
      <PromptWrapper>
        <Typography variant="overline">Your Prompt</Typography>
        <Box>
          <PromptTitle variant="h4">{prompt}</PromptTitle>
        </Box>
      </PromptWrapper>

      {view === "initial" && (
        <>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Box></Box>
            <Button
              color="info"
              variant="contained"
              onClick={getInitialQuestions}
            >
              <Refresh />
            </Button>
          </Box>
          <Grid container spacing={3}>
            {!loading &&
              state.initialQuestions &&
              state.initialQuestions.length > 0 &&
              state.initialQuestions.map((question, i) => (
                <QuestionItem
                  key={question.id}
                  type="initial"
                  question={question}
                  state={state}
                  dispatch={dispatch}
                />
              ))}
            {loading && <PrimaryLoader />}
          </Grid>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setView("apps");
            }}
          >
            Next
          </Button>
        </>
      )}
      {view === "apps" && (
        <>
          <Typography variant="h4" mb={1}>
            App Selection
          </Typography>
          <Typography variant="body1" mb={4}>
            Please select the apps you would like to generate files for.
          </Typography>
          <Box maxWidth="700px" mb={1}>
            {!loading && allTabs && (
              <>
                {allTabs.map((tab, i) => {
                  const chosen = state?.chosenApps?.find((id) => id === tab.id)
                    ? true
                    : false;
                  return (
                    <Button
                      key={tab.id}
                      sx={{
                        backgroundColor: chosen ? "#99c7a2" : "transparent",
                        color: chosen ? "white" : "black",
                        marginLeft: 2,
                        marginBottom: 2,
                      }}
                      onClick={() => {
                        let chosenApps = state.chosenApps || [];
                        if (chosen) {
                          dispatch({
                            type: "chosenApps",
                            payload: chosenApps.filter((id) => id !== tab.id),
                          });
                        } else {
                          dispatch({
                            type: "chosenApps",
                            payload: [...chosenApps, tab.id],
                          });
                        }
                      }}
                    >
                      {chosen && <CheckCircle style={{ marginRight: "5px" }} />}
                      <Box>
                        <Box mr={0.5} position="relative" top="3px">
                          {tab?.id === "launcher" && <Apps />}
                          {tab?.id === "documents" && <Article />}
                          {tab?.id === "slides" && <Slideshow />}
                          {tab?.id === "sheets" && <GridOn />}
                          {tab?.id === "drawings" && <InsertPhoto />}
                          {tab?.id === "sounds" && <LibraryMusic />}
                          {tab?.id === "videos" && <VideoLibrary />}
                          {tab?.id === "content" && <ContentCopy />}
                          {tab?.id === "analytics" && <Analytics />}
                          {tab?.id === "send-email" && <Email />}
                          {tab?.id === "relationships" && <People />}
                          {tab?.id === "work-email" && <Email />}
                        </Box>
                      </Box>
                      {tab.label}
                    </Button>
                  );
                })}
              </>
            )}
            {loading && <PrimaryLoader />}
          </Box>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setView("files");
            }}
          >
            Next
          </Button>
        </>
      )}
      {view === "files" && (
        <>
          <Grid container gap={0}>
            <Grid item xs={12} md={8}>
              {!loading && state.files.length > 0 ? (
                <>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    width="100%"
                    mb={2}
                  >
                    <Typography variant="overline">Your File Plan</Typography>
                    <Button
                      size="small"
                      color="info"
                      variant="contained"
                      onClick={getFiles}
                    >
                      <Refresh />
                    </Button>
                  </Box>

                  {state.files.map((file, i) => {
                    const hasAnsweredQuestion = file.questions.find(
                      (question) =>
                        question.chosenAnswers.length > 0 ||
                        question.freeformAnswer.length > 0
                    );

                    return (
                      <FileItem key={file.id}>
                        <Box
                          display="flex"
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          flexWrap="wrap"
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
                            <IconBox app={file.app}>
                              {file.app === "documents" && <DocumentScanner />}
                              {file.app === "slides" && (
                                <PresentToAllOutlined />
                              )}
                              {file.app === "sheets" && <List />}
                              {file.app === "drawings" && <Image />}
                              {file.app === "relationships" && <People />}
                              {file.app === "content" && <ContentCopy />}
                              {file.app === "work-email" && <Email />}
                            </IconBox>

                            {file.app}
                          </Typography>
                          <Box flex={1}>
                            <FileTextField
                              fullWidth
                              value={file.name}
                              onChange={(e) => {
                                dispatch({
                                  type: "files",
                                  payload: state.files.map((f) => {
                                    if (f.id === file.id) {
                                      return {
                                        ...f,
                                        name: e.target.value,
                                      };
                                    } else {
                                      return f;
                                    }
                                  }),
                                });
                              }}
                            />
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            width={350}
                            padding="0px 20px"
                          >
                            {/* <Button size="small">
                              Skip File {file.skipFile && <CheckCircle />}
                            </Button> */}
                            <Button
                              size="small"
                              onClick={() => {
                                dispatch({
                                  type: "files",
                                  payload: state.files.map((f) => {
                                    if (f.id === file.id) {
                                      return {
                                        ...f,
                                        skipQuestions: true,
                                      };
                                    } else {
                                      return f;
                                    }
                                  }),
                                });
                              }}
                            >
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
                            <Tooltip title="Remove File">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  dispatch({
                                    type: "files",
                                    payload: state.files.filter(
                                      (f) => f.id !== file.id
                                    ),
                                  });
                                }}
                              >
                                <Close />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </FileItem>
                    );
                  })}
                </>
              ) : (
                <PrimaryLoader />
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
                <form
                  className="form"
                  onSubmit={handleSubmit(onSubmit, onError)}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <FormSelect
                    name="app"
                    placeholder="Select an app"
                    label="Select an app"
                    options={
                      [
                        {
                          label: "Documents",
                          value: "documents",
                        },
                        {
                          label: "Slides",
                          value: "slides",
                        },
                        {
                          label: "Sheets",
                          value: "sheets",
                        },
                        {
                          label: "Images",
                          value: "images",
                        },
                        {
                          label: "Relationships",
                          value: "relationships",
                        },
                        {
                          label: "Content",
                          value: "content",
                        },
                        {
                          label: "Work Email",
                          value: "work-email",
                        },
                      ] as any
                    }
                    register={register}
                    errors={errors}
                    validation={{ required: true }}
                    style={{
                      minWidth: "150px",
                    }}
                  />
                  <FormInput
                    type="text"
                    name="name"
                    placeholder="File name"
                    register={register}
                    errors={errors}
                    validation={{ required: true }}
                  />
                  <Button type="submit">Add File</Button>
                </form>
              </Box>
              <Box padding={2} textAlign="center">
                <Typography variant="h5">
                  {state.files.length} Files to be created
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <Button
                  endIcon={<AutoAwesome />}
                  color="success"
                  variant="contained"
                  onClick={() => {
                    // TODO
                    router.push(`/flows/${id}/results`);
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
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
          >
            <Box>
              <Typography variant="overline">File Title</Typography>
              <Typography variant="h5">{currentFileData.name}</Typography>
            </Box>
          </Box>
          {questionsView === "background" && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Typography variant="overline">Background Information</Typography>
              <Typography variant="body2">
                Please provide some background information about this file.
              </Typography>
              <TextareaAutosize
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  outline: "none",
                  resize: "none",
                }}
                placeholder="Enter background information"
                minRows={3}
                onChange={(e) => {
                  dispatch({
                    type: "files",
                    payload: state.files.map((f) => {
                      if (f.id === currentFileId) {
                        return {
                          ...f,
                          background: e.target.value,
                        };
                      } else {
                        return f;
                      }
                    }),
                  });
                }}
                defaultValue={currentFileData.background}
              />
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => {
                    setQuestionsView("questions");
                  }}
                  disabled={
                    !currentFileData.background ||
                    currentFileData.background.length === 0
                  }
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
          {questionsView === "questions" && (
            <Grid container gap={3}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                width="100%"
              >
                <Button
                  color="info"
                  variant="contained"
                  onClick={getFileQuestions}
                >
                  <Refresh />
                </Button>
              </Box>

              {!loading &&
                currentFileData.questions &&
                currentFileData.questions.length > 0 &&
                currentFileData.questions.map((question, i) => (
                  <QuestionItem
                    key={question.id}
                    fileId={currentFileId}
                    type="files"
                    question={question}
                    state={state}
                    dispatch={dispatch}
                  />
                ))}
              {loading && <PrimaryLoader />}
              <Button
                onClick={() => {
                  setCurrentFileId(null);
                  setView("files");
                  setQuestionsView("background");
                }}
              >
                Finish
              </Button>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
