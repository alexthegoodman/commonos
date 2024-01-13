"use client";

import { getOrganizationsData } from "@/fetchers/collaboration";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import CreateProjectModal from "../modals/CreateProjectModal";
import CreateOrganizationModal from "../modals/CreateOrganizationModal";

export default function ProjectPicker() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: organizationsData,
    error,
    isLoading,
  } = useSWR("organizationsKey", () => getOrganizationsData(token), {
    revalidateOnMount: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [organizationOpen, setOrganizationOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [openOrgId, setOpenOrgId] = useState(null);

  const handleProjectOpen = (id) => {
    setAnchorEl(null);
    setProjectOpen(true);
    setOpenOrgId(id);
  };
  const handleProjectClose = () => setProjectOpen(false);

  const handleOrganizationOpen = () => {
    setAnchorEl(null);
    setOrganizationOpen(true);
  };
  const handleOrganizationClose = () => setOrganizationOpen(false);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event) => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <List component="nav">
        <ListItem button onClick={handleClickListItem}>
          <ListItemText primary="Personal" secondary={"No project selected"} />
        </ListItem>
      </List>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={(event) => handleMenuItemClick(event)}>
          Personal
        </MenuItem>
        <Divider />
        {organizationsData?.map((org, index) => (
          <Box key={`projectPicker${index}`}>
            <Typography variant="overline" px={2}>
              {org.name}
            </Typography>
            {org.projects &&
              org.projects.map((project, index) => (
                <MenuItem
                  key={project}
                  onClick={(event) => handleMenuItemClick(event)}
                >
                  {project.title}
                </MenuItem>
              ))}
            {!org.projects && <>No projects</>}
            <MenuItem
              onClick={() => handleProjectOpen(org.id)}
              style={{ fontSize: "13px" }}
            >
              Create Project
            </MenuItem>
          </Box>
        ))}
        <MenuItem onClick={handleOrganizationOpen} style={{ fontSize: "13px" }}>
          Create Organization
        </MenuItem>
      </Menu>
      <CreateProjectModal
        organizationId={openOrgId}
        open={projectOpen}
        handleClose={handleProjectClose}
      />
      <CreateOrganizationModal
        open={organizationOpen}
        handleClose={handleOrganizationClose}
      />
    </Box>
  );
}
