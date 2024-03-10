"use client";

import { IconBox } from "@/components/core/flows/FlowEditor";
import {
  DocumentScanner,
  Image,
  List,
  PresentToAllOutlined,
} from "@mui/icons-material";
import { Box, Grid, Typography, styled } from "@mui/material";

const FileItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${theme.palette.divider}`,
  padding: "25px",
  backgroundColor: "rgba(255,255,255,0.05)",
  [theme.breakpoints.down("md")]: {
    padding: "10px",
    "& > div": {
      display: "none",
    },
    "& .MuiTypography-root": {
      fontSize: "18px",
    },
  },
}));

export default function HelpsWith() {
  return (
    <>
      <Typography variant="h5" mb={2}>
        CommonOS Helps With
      </Typography>
      <Grid container spacing={{ md: 4, xs: 2 }}>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Collateral</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Proposals</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"sheets"}>
              <List />
            </IconBox>
            <Typography variant="h5">Lists</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Literature</Typography>
          </FileItem>
        </Grid>

        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Journies</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"slides"}>
              <PresentToAllOutlined />
            </IconBox>
            <Typography variant="h5">Presentations</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Stories</Typography>
          </FileItem>
        </Grid>

        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Plans</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"drawings"}>
              <Image />
            </IconBox>
            <Typography variant="h5">Concepts</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Processes</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Templates</Typography>
          </FileItem>
        </Grid>
        <Grid item xs={6} md={3}>
          <FileItem>
            <IconBox app={"documents"}>
              <DocumentScanner />
            </IconBox>
            <Typography variant="h5">Maps</Typography>
          </FileItem>
        </Grid>
      </Grid>
    </>
  );
}
