import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import FormInput from "../fields/FormInput";
import { mutate } from "swr";
import { createProject, getOrganizationsData } from "@/fetchers/collaboration";
import { useCookies } from "react-cookie";
import { useState } from "react";

export default function CreateProjectModal({
  organizationId,
  open,
  handleClose,
}) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await createProject(token, organizationId, data.title);
    await mutate("organizationsKey", () => getOrganizationsData(token));
    handleClose();
    setLoading(false);
  };

  const onError = (error) => console.error(error);

  return (
    <Dialog open={open} keepMounted onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogTitle>{"Create Project"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormInput
              type="text"
              name="title"
              placeholder="Title"
              register={register}
              errors={errors}
              validation={{ required: true }}
              style={{ width: "400px" }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go Back</Button>
          <Button
            color="success"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Save Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
