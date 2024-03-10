"use client";

import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export default function Dropdown({ options, handleMenuItemClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
  );
}
