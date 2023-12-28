"use client";

import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import { getFileListData, getQuestionsData } from "@/fetchers/flow";
import {
  AutoAwesome,
  Check,
  CheckCircle,
  Close,
  DocumentScanner,
  Image,
  List,
  PresentToAllOutlined,
  Refresh,
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

const AnswerButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  width: "200px",
  height: "200px",
  backgroundColor: "rgba(255,255,255,0.1)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "scale(1.05)",
    transition: "all 0.2s ease-in-out",
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
    "-webkit-repeating-linear-gradient(bottom, #38efaf 0%, #38ef7d 100%) !important",
  // "-webkit-background-clip": "text !important",
  // "-webkit-text-fill-color": "transparent !important",
  color: "black",
  // boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  lineHeight: "3rem",
  padding: "4px",
}));

export const IconBox = styled(Box)(({ theme, app }) => {
  const backgroundColor = {
    documents: "rgba(155,255,255,0.2)",
    slides: "rgba(255,155,255,0.2)",
    sheets: "rgba(255,255,155,0.2)",
    images: "rgba(255,255,255,0.2)",
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
  borderRadius: "0px",
  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
  marginBottom: theme.spacing(2),
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
      <Typography variant="subtitle1">{question.question}</Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        width="fit-content"
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
              {chosen && <CheckCircle />}
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
      Background Information: "${prompt}"
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

  useEffect(() => {
    if (view === "initial") {
      if (!state.initialQuestions || state.initialQuestions.length === 0) {
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
          })
          .catch((err) => {
            console.error("caught error", err);
            // TODO: display error
          });
      }
    }
    if (view === "files") {
      if (state.files.length === 0 && !gotFiles) {
        // fetch file list from api and add to context
        console.info("fetch file list");

        getFileListData(token, id, "documents")
          .then((data1) => {
            console.info("got file list 1", data1);

            let files = data1.documents.map((file) => {
              return {
                id: uuidv4(),
                name: file,
                app: "documents",
                questions: [],
                skipQuestions: true,
              };
            });

            if (data1?.documents?.length) {
              getFileListData(token, id, "additionalFiles")
                .then((data2) => {
                  console.info("got file list 2", data2);

                  if (data2?.presentations?.length) {
                    files = [
                      ...files,
                      ...data2.presentations.map((file) => {
                        return {
                          id: uuidv4(),
                          name: file,
                          app: "slides",
                          questions: [],
                          skipQuestions: true,
                        };
                      }),
                    ];
                  }

                  if (data2?.spreadsheets?.length) {
                    files = [
                      ...files,
                      ...data2.spreadsheets.map((file) => {
                        return {
                          id: uuidv4(),
                          name: file,
                          app: "sheets",
                          questions: [],
                          skipQuestions: true,
                        };
                      }),
                    ];
                  }

                  if (data2?.images?.length) {
                    files = [
                      ...files,
                      ...data2.images.map((file) => {
                        return {
                          id: uuidv4(),
                          name: file,
                          app: "images",
                          questions: [],
                          skipQuestions: true,
                        };
                      }),
                    ];
                  }

                  if (
                    data1.documents.length ||
                    data2?.spreadsheets?.length ||
                    data2?.presentations?.length ||
                    data2?.images?.length
                  ) {
                    console.info("dispatch files", files);
                    dispatch({
                      type: "files",
                      payload: files,
                    });
                    setGotFiles(true);
                  }
                })
                .catch((err) => {
                  console.error("caught error", err);
                  // TODO: display error
                });
            }
          })
          .catch((err) => {
            console.error("caught error", err);
            // TODO: display error
          });
      }
    }
    if (view === "questions") {
      if (
        !currentFileData.questions ||
        currentFileData.questions.length === 0
      ) {
        getFileQuestions();
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
                <QuestionItem
                  key={question.id}
                  type="initial"
                  question={question}
                  state={state}
                  dispatch={dispatch}
                />
              ))
            ) : (
              <PrimaryLoader />
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
                              {file.app === "images" && <Image />}
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
                    options={[
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
                    ]}
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
          <Grid container gap={3}>
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
              }}
            >
              Finish
            </Button>
          </Grid>
        </>
      )}
    </Box>
  );
}
