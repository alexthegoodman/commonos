"use client";

import { useFlowQuestionsContext } from "@/context/FlowQuestionsContext";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

const AnswerButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  width: "200px",
  height: "200px",
}));

export default function FlowEditor(props) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useFlowQuestionsContext();
  const [currentFileId, setCurrentFileId] = useState(null);

  const currentFileData = state.files.find((file) => file.id === currentFileId);

  const beginQuestions = (file) => {
    setCurrentFileId(file.id);
  };

  return (
    <Box>
      <Typography variant="h4">
        Help me build a cat vet business that specializes in digital services
      </Typography>
      <Grid container gap={3}>
        {currentFileId ? (
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
        ) : (
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
        )}
      </Grid>
    </Box>
  );
}
