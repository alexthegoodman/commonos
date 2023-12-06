"use client";

import DrawingEditor from "@/components/drawings/editor/DrawingEditor";
import InnerLayout from "@/components/drawings/editor/InnerLayout";
import {
  DrawingsContext,
  DrawingsContextReducer,
  DrawingsContextState,
} from "@/context/DrawingsContext";
import { getDrawingData } from "@/fetchers/drawing";
import { BubbleChart, Business } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useReducer } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

const initialState = [
  {
    id: uuidv4(),
    name: "Business Plan for a Digital Cat Veterinary Clinic",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Technology Infrastructure Guide",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Cat-Specific Telemedicine Protocols",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Financial Management and Billing in Digital Veterinary Services",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Digital Marketing Strategy for a Cat Vet Business",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Client Communication and Engagement",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Team Training and Development",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Expansion and Growth Strategies",
    app: "documents",
  },
  {
    id: uuidv4(),
    name: "Pawsitively Digital: Revolutionizing Cat Veterinary Care",
    app: "slides",
  },
  {
    id: uuidv4(),
    name: "Feline Telemedicine: Navigating the Future of Cat Health",
    app: "slides",
  },
  {
    id: uuidv4(),
    name: "Financial Projections: Cat Vet Clinic's Digital Services Revenue Forecast",
    app: "sheets",
  },
  {
    id: uuidv4(),
    name: "Inventory Management: Digital Medical Supplies and Equipment for Cats",
    app: "sheets",
  },
  {
    id: uuidv4(),
    name: "An image of a cozy, cat-friendly telemedicine setup with a veterinarian virtually consulting a cat owner",
    app: "drawings",
  },
  {
    id: uuidv4(),
    name: "A collage showcasing before-and-after images of feline patients receiving remote care and thriving",
    app: "drawings",
  },
];

export default function Flow(props) {
  const { params } = props;
  const flowId = params.flowId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  return (
    <Box>
      <Typography variant="h4">
        Help me build a cat vet business that specializes in digital services
      </Typography>
      <Grid container gap={3}>
        {initialState.map((file, i) => (
          <Grid key={file.id} item xs={12} md={12}>
            <Box display="flex" flexDirection="row">
              <Typography variant="body2" width={200}>
                {file.app}
              </Typography>
              <TextField fullWidth label="File Name" value={file.name} />
              <Box width={600}>
                <Button>Skip File</Button>
                <Button>Use Default</Button>
                <Button color="success" variant="contained">
                  Answer Questions
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
