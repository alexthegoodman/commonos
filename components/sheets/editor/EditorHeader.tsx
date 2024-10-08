import * as React from "react";

import {
  Box,
  Button,
  IconButton,
  Paper,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  CurrencyDollar,
  Function,
  Palette,
  TextColumns,
} from "@phosphor-icons/react";
import { Add, Close, Info } from "@mui/icons-material";
import { useSheetsContext } from "@/context/SheetsContext";
import { realDefaultColumns, realDefaultRows } from "@/fixtures/sheets";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { MuiColorInput } from "mui-color-input";
const { DateTime } = require("luxon");

import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

const Header = styled("header")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "25px",
  gap: "10px",
}));

const Tab = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  border: "1px #E5E5E5 solid",
  borderRadius: "15px",
}));

const PopoverWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
}));

const PopoverPaper = styled(Paper)(({ theme, visible }) => ({
  display: visible ? "flex" : "none",
  position: "absolute",
  top: "50px",
  padding: "15px",
  zIndex: "10",
}));

const FormulaInfoButton = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Learn more about formulas">
        <Button onClick={handleClickOpen}>
          <Info />
        </Button>
      </Tooltip>
      <Dialog open={open} keepMounted onClose={handleClose}>
        <DialogTitle>{"How Formulas Work"}</DialogTitle>
        <DialogContent>
          <DialogContentText whiteSpace="break-spaces" width="100%">
            <p>{`Our spreadsheet supports a variety of formulas to help you analyze and manipulate your data. Here's what you can do:

1. Basic Arithmetic: Use +, -, *, and / for addition, subtraction, multiplication, and division.
2. Exponents: Use ^ for exponentiation (e.g., 2^3 = 8).
3. Parentheses: Group operations to control calculation order.
4. Functions:
   - SUM: Add up a series of numbers
   - AVERAGE: Calculate the mean of a set of values
   - MIN: Find the smallest value
   - MAX: Find the largest value
   - COUNT: Count the number of values

5. Comparisons: Use >, <, >=, <=, =, and <> to compare values.

Formulas always start with an equals sign (=). For example:

=A1 + B2       (adds values in cells A1 and B2)
=SUM(A1:A5)    (sums values from A1 to A5)
=AVERAGE(B1:B10) > 50  (checks if the average of B1 to B10 is greater than 50)

Simply select cell(s) and then add your formula!`}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const EditorHeader = ({
  title,
  setTitle,
  selectedCells,
  selectedSheet,
  setSelectedSheet,
}) => {
  const [state, dispatch] = useSheetsContext();

  selectedSheet = selectedSheet ? selectedSheet : 0;

  const hasAnySheets = state?.sheets?.length;
  const currentSheet = hasAnySheets ? state.sheets[selectedSheet] : state;

  let selectedSheetId = currentSheet.id;

  const columns = currentSheet.columns;
  const rows = currentSheet.rows;

  const selectedCellData = rows
    .map((row) => {
      return row.cells.filter((cell) => selectedCells?.includes(cell.id));
    })
    .flat();

  console.info("selectedCellData", selectedCellData);

  const [formatVisible, setFormatVisible] = React.useState(false);
  const [formulaVisible, setFormulaVisible] = React.useState(false);
  const [colorVisible, setColorVisible] = React.useState(false);

  const onTitleChange = (e: any) => {
    console.info("title change", e.target.value);
    setTitle(e.target.value);
  };

  const handleAddSheet = (e: any) => {
    console.info("add sheet");
    let newState = [];
    if (!hasAnySheets) {
      newState = [
        {
          id: uuidv4(),
          name: "New Sheet",
          ...state,
        },
      ];
    } else {
      newState = state.sheets;
    }

    dispatch({
      type: "sheets",
      payload: [
        ...newState,
        {
          id: uuidv4(),
          name: "New Sheet",
          columns: realDefaultColumns,
          rows: realDefaultRows,
        },
      ],
    });
    dispatch({ type: "rows", payload: [] });
    dispatch({ type: "columns", payload: [] });
  };

  const handleFormulaChange = (e) => {
    const formula = e.target.value;
    dispatch({
      type: "sheets",
      payload: state.sheets.map((sheet) => {
        if (sheet.id === selectedSheetId) {
          return {
            ...sheet,
            rows: rows.map((row) => {
              return {
                ...row,
                cells: row.cells.map((cell) => {
                  if (selectedCells.includes(cell.id)) {
                    return {
                      ...cell,
                      formula,
                    };
                  }
                  return cell;
                }),
              };
            }),
          };
        }
        return sheet;
      }),
    });
  };

  const handleSheetClick = (sheetIndex) => {
    setSelectedSheet(sheetIndex);
  };

  return (
    <>
      <Header>
        <TextField
          onChange={onTitleChange}
          defaultValue={title}
          placeholder="Title"
          style={{
            width: "400px",
            marginRight: "15px",
          }}
        />
        {/** Formula Box */}
        <Box display="flex" flexDirection="row">
          <TextField
            sx={{ width: 350 }}
            placeholder={`Cell Formula (ex. "=SUM(A1,A2,A3)")`}
            defaultValue={selectedCellData[0]?.formula}
            onChange={handleFormulaChange}
          />
          <FormulaInfoButton />
        </Box>

        {/** Format Box */}
        <PopoverWrapper>
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            endIcon={<CurrencyDollar size={20} />}
            onClick={() => setFormatVisible(!formatVisible)}
          >
            Format
          </Button>
          <PopoverPaper visible={formatVisible}></PopoverPaper>
        </PopoverWrapper>
        {/** Formula Box */}
        {/* <PopoverWrapper>
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            endIcon={<Function size={20} />}
            onClick={() => setFormulaVisible(!formulaVisible)}
          >
            Formula
          </Button>
          <PopoverPaper visible={formulaVisible}></PopoverPaper>
        </PopoverWrapper> */}
        {/** Color Box */}
        <PopoverWrapper>
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            endIcon={<Palette size={20} />}
            onClick={() => setColorVisible(!colorVisible)}
          >
            Color
          </Button>
          <PopoverPaper visible={colorVisible}>
            <MuiColorInput
              sx={{
                height: "40px",
                "& .MuiInputBase-root": {
                  height: "40px",
                  width: "200px",
                },
                "& .MuiInputBase-input": {
                  minHeight: "auto",
                  height: "40px",
                  width: "200px",
                },
                "& .MuiButtonBase-root": {
                  minHeight: "auto",
                  height: "40px",
                  // width: "200px",
                  padding: "5px",
                },
              }}
              // value={
              //   slide && slide[selectedItemType]
              //     ? slide[selectedItemType].filter(
              //         (text) => text.id === selectedItemId
              //       )[0]?.fill
              //     : "black"
              // }
              onChange={(color) => {
                console.info("color onChange", color);
                // update actual

                dispatch({
                  type: "sheets",
                  payload: state.sheets.map((sheet) => {
                    return {
                      ...sheet,
                      rows: sheet.rows.map((row) => {
                        return {
                          ...row,
                          cells: row.cells.map((cell) => {
                            const isSelected = selectedCells?.find(
                              (id) => id === cell.id
                            );

                            return {
                              ...cell,
                              color: isSelected ? color : cell.color,
                            };
                          }),
                        };
                      }),
                    };
                  }),
                });
              }}
            />
          </PopoverPaper>
        </PopoverWrapper>
      </Header>
      <Header>
        {!hasAnySheets && (
          <Tab
            style={{
              backgroundColor: selectedSheet === 0 ? "#E5E5E5" : "white",
            }}
          >
            <Button variant="text" onClick={() => handleSheetClick(0)}>
              Sheet 1
            </Button>
            <IconButton size="small">
              <Close />
            </IconButton>
          </Tab>
        )}
        {state?.sheets?.map((sheet, i) => (
          <Tab
            style={{
              backgroundColor: selectedSheet === i ? "#E5E5E5" : "white",
            }}
          >
            <Button
              size="small"
              variant="text"
              onClick={() => handleSheetClick(i)}
            >
              {sheet.name}
            </Button>
            <IconButton size="small">
              <Close />
            </IconButton>
          </Tab>
        ))}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          endIcon={<Add />}
          onClick={handleAddSheet}
        >
          Add Sheet
        </Button>
      </Header>
    </>
  );
};

export default EditorHeader;
