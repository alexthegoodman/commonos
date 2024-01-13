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
  styled,
} from "@mui/material";
import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import CreateProjectModal from "../modals/CreateProjectModal";
import CreateOrganizationModal from "../modals/CreateOrganizationModal";
import { LauncherContext } from "@/context/LauncherContext";

const TightList = styled(List)(({ theme }) => ({
  padding: 0,
  "& .MuiListItem-root": {
    height: "48px",
    padding: "0px 10px",
  },
}));

export default function ProjectPicker() {
  const { state, dispatch } = useContext(LauncherContext);

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: organizationsData,
    error,
    isLoading,
  } = useSWR("organizationsKey", () => getOrganizationsData(token), {
    revalidateOnMount: true,
  });

  const currentOrganizationData = organizationsData?.find(
    (org) => org.id === state.currentOrganizationId
  );
  const currentProjectData = currentOrganizationData?.projects?.find(
    (project) => project.id === state.currentProjectId
  );

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

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event) => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePersonalClick = (event) => {
    handleMenuItemClick(event);
    dispatch({ type: "currentOrganizationId", payload: null });
    dispatch({ type: "currentProjectId", payload: null });
  };

  const handleProjectClick = (event, orgId, projectId) => {
    handleMenuItemClick(event);
    dispatch({ type: "currentOrganizationId", payload: orgId });
    dispatch({ type: "currentProjectId", payload: projectId });
  };

  return (
    <Box>
      <TightList component="nav">
        <ListItem button onClick={handleOpenMenu}>
          {!currentOrganizationData && !currentProjectData && (
            <ListItemText
              primary="Personal"
              secondary={"No project selected"}
            />
          )}
          {currentOrganizationData && currentProjectData && (
            <ListItemText
              primary={currentOrganizationData.name}
              secondary={currentProjectData.title}
            />
          )}
        </ListItem>
      </TightList>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={(event) => handlePersonalClick(event)}>
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
                  onClick={(event) =>
                    handleProjectClick(event, org.id, project.id)
                  }
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
