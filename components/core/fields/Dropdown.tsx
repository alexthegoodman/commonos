"use client";

import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export default function Dropdown({
  label = "Choose...",
  options,
  handleMenuItemClick,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button size="small" onClick={handleClick}>
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option, i) => (
          <MenuItem
            key={`menuItem` + i}
            onClick={(event) => handleMenuItemClick(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
