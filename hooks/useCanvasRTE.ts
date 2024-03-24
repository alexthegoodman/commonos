import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import * as fontkit from "fontkit";
import { KonvaEventObject } from "konva/lib/Node";

const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

const loadFont = async (setFont: (font: fontkit.Font) => void) => {
  const loadBlob = async (blob: Blob) => {
    const buffer = await blobToBuffer(blob);

    let font = fontkit.create(buffer);
    setFont(font as fontkit.Font);
  };

  fetch("/fonts/Inter-Regular.ttf")
    .then((res) => res.blob())
    .then(loadBlob, console.error);
};

export type Location = {
  page: number;
  line: number;
  lineIndex: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Style = {
  color: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  italic: boolean;
  underline: boolean;
};

export type CharacterType = "newline" | "character" | "tab";

export type Character = {
  characterId: string;
  character: string;
  location: Location;
  position: Position;
  size: Size;
  style: Style;
  type: CharacterType;
  // testing
  lastLineCharacter: boolean | null;
  wordIndex: number | null;
  paragraphIndex: number | null;
};

export type MasterJson = Character[];

export type DocumentSize = {
  width: number;
  height: number;
};

// extend window type
// declare global {
//   interface Window {
//     __canvasRTEEditorActive: boolean;
//     __canvasRTEInsertCharacterId: string | null;
//   }
// }

// window.__canvasRTEEditorActive = false;
// window.__canvasRTEInsertCharacterId = null;

export const useCanvasRTE = (
  initialMarkdown: string,
  mainTextSize: DocumentSize
) => {
  const checkSpace = 10; // check for extra space to delinate end of paragraph
  const letterSpacing = 1;
  const defaultSpacing = 5;
  const defaultStyle = {
    color: "black",
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Inter",
    italic: false,
    underline: false,
  };

  const [editorActive, _setEditorActive] = useState(false);
  // use ref to get up-to-date values in event listener
  const editorActiveRef = useRef(editorActive);
  const setEditorActive = (active: boolean) => {
    editorActiveRef.current = active;
    _setEditorActive(active);
  };

  const [insertCharacterId, _setInsertCharcterId] = useState<string | null>(
    null
  );
  const insertCharacterIdRef = useRef(insertCharacterId);
  const setInsertCharcterId = (id: string | null) => {
    insertCharacterIdRef.current = id;
    _setInsertCharcterId(id);
  };

  const [insertCharacterIndex, _setInsertCharacterIndex] = useState<
    number | null
  >(null);
  const insertCharacterIndexRef = useRef(insertCharacterIndex);
  const setInsertCharacterIndex = (index: number | null) => {
    insertCharacterIndexRef.current = index;
    _setInsertCharacterIndex(index);
  };

  const [masterJson, _setMasterJson] = useState<MasterJson>([]);
  const masterJsonRef = useRef(masterJson);
  const setMasterJson = (data: MasterJson) => {
    masterJsonRef.current = data;
    _setMasterJson(data);
  };

  const [fontData, _setFontData] = useState<fontkit.Font | null>(null);
  const fontDataRef = useRef(fontData);
  const setFontData = (font: fontkit.Font) => {
    fontDataRef.current = font;
    _setFontData(font);
  };

  //   console.info("masterJson", masterJson);

  const getCharacterBoundingBox = (
    fontData: fontkit.Font,
    character: string,
    style: Style
  ) => {
    const glyph = fontData?.layout(character);
    const boundingBox = glyph?.bbox;
    const unitsPerEm = fontDataRef.current?.unitsPerEm;
    const { xAdvance, xOffset } = glyph.positions[0];

    if (
      !boundingBox ||
      boundingBox.width == -Infinity ||
      boundingBox.height == -Infinity ||
      !unitsPerEm
    ) {
      return {
        width: defaultSpacing,
        height: defaultSpacing,
      };
    }

    return {
      width: (boundingBox.width / unitsPerEm) * style.fontSize,
      height: (boundingBox.height / unitsPerEm) * style.fontSize,
    };
  };

  const getNewlineLocation = (
    insertLocation: Location,
    replace: boolean = false
  ) => {
    const proposedLine = replace
      ? insertLocation.line
      : insertLocation.line + 1;
    const linesPerPage = Math.floor(
      mainTextSize.height / getCapHeightPx(defaultStyle.fontSize)
    );
    const isNewPage = proposedLine >= linesPerPage;

    if (isNewPage) {
      const nextLocation = {
        page: insertLocation.page + 1, // adds one to existing newlines as-is
        line: 0,
        lineIndex: 0,
      };

      return nextLocation;
    } else {
      const nextLocation = {
        page: insertLocation.page,
        line: proposedLine,
        lineIndex: 0,
      };

      return nextLocation;
    }
  };

  const getCurrentLine = (insertLocation: Location) => {
    // PERF: check
    const currentLine = masterJsonRef.current.filter(
      (char) =>
        char.location.page === insertLocation.page &&
        char.location.line === insertLocation.line
    );

    return currentLine;
  };

  const getCurrentLinePrecedingWidth = (insertLocation: Location) => {
    const currentLine = getCurrentLine(insertLocation);
    const currentLinePrecedingWidth = currentLine.reduce((acc, char) => {
      return char.location.lineIndex < insertLocation.lineIndex && char.size
        ? acc + char.size.width + letterSpacing
        : acc;
    }, 0);

    return currentLinePrecedingWidth;
  };

  const calculateNextLocation = (
    insertLocation: Location,
    newSize: Size,
    newType: CharacterType,
    replace: boolean,
    fitsOnLine: boolean,
    lineIndexShift: number = 1
  ) => {
    // calculate newlines and pages as needed
    // will need to calculate width of current line and compare to page width

    if (newType === "newline") {
      return {
        shouldContinue: true, // would be false if working
        nextLocation: getNewlineLocation(insertLocation, replace),
      };
    } else {
      // TODO: address performance hit, masterJson filter inside a masterJson loop

      //   const isEndOfParagraph =
      //     currentLinePrecedingWidth + newSize.width + checkSpace <
      //     mainTextSize.width;
      //   const isLastCharacterOfLine =
      //     currentLine.length === insertLocation.lineIndex;
      //   const stopCalculating = isLastCharacterOfLine && isEndOfParagraph; // perf king?
      const stopCalculating = false; // broken

      if (fitsOnLine) {
        const nextLocation = {
          page: insertLocation.page,
          line: insertLocation.line,
          lineIndex: insertLocation.lineIndex + lineIndexShift,
        };

        return { shouldContinue: !stopCalculating, nextLocation };
      } else {
        return {
          shouldContinue: true,
          nextLocation: getNewlineLocation(insertLocation),
        };
      }
    }
  };

  const getCapHeightPx = (fontSize: number) => {
    if (!fontDataRef.current) {
      return 0;
    }

    return (
      ((fontDataRef.current.capHeight +
        fontDataRef.current.ascent +
        fontDataRef.current.descent) /
        fontDataRef.current.unitsPerEm) *
      fontSize
    );
  };

  const calculateNextPosition = (
    insertCharacter: Character,
    newLocation: Location,
    newSize: Size,
    replace: boolean = false
  ) => {
    if (!insertCharacter) {
      return {
        x: 0,
        y: 0,
      };
    }

    if (!fontDataRef.current) {
      return insertCharacter.position;
    }

    const isNewLine =
      newLocation.line > insertCharacter.location.line &&
      newLocation.lineIndex === 0;
    const isNewPage =
      newLocation.page > insertCharacter.location.page &&
      newLocation.lineIndex === 0;

    let nextX =
      isNewLine || isNewPage
        ? 0
        : insertCharacter.position.x + newSize.width + letterSpacing;

    const capHeightPx = getCapHeightPx(insertCharacter.style.fontSize);
    let nextY = isNewLine
      ? insertCharacter.position.y + capHeightPx
      : insertCharacter.position.y;
    nextY = isNewPage ? 0 : nextY;

    const nextPosition = {
      x: nextX,
      y: nextY,
    };

    return nextPosition;
  };

  // this needs to select characters based on location value
  const getAllCharactersAfterInsert = (insertCharacter: Character) => {
    return masterJsonRef.current.filter((char) => {
      if (char.location.page > insertCharacter.location.page) {
        return true;
      } else if (char.location.page === insertCharacter.location.page) {
        if (char.location.line > insertCharacter.location.line) {
          return true;
        } else if (char.location.line === insertCharacter.location.line) {
          if (char.location.lineIndex > insertCharacter.location.lineIndex) {
            return true;
          }
        }
      }

      return false;
    });
  };

  const getEndOfParagraphLocation = (insertCharacter: Character) => {};

  const getCharactersBetweenInsertAndParagraphEnd = (
    insertCharacter: Character
  ) => {
    let returnArray = [] as Character[];
    // TODO: need to address traversing whole object

    let stoppingNewlines: Character[] = [];
    // PERF: check
    for (let i = 0; i < masterJsonRef.current.length; i++) {
      const char = masterJsonRef.current[i];

      if (
        char.type === "newline" &&
        char.location.page === insertCharacter.location.page &&
        char.location.line > insertCharacter.location.line &&
        char.location.lineIndex === 0
      ) {
        stoppingNewlines.push(char);

        break;
      }
    }

    const closestNewline = stoppingNewlines.reduce((acc, newline) => {
      return newline.location.line < acc.location.line ? newline : acc;
    }, stoppingNewlines[0]);

    // console.info("stoppingNewlines", closestNewline, stoppingNewlines);

    if (!closestNewline) {
      return [];
    }

    // PERF: check
    for (let i = 0; i < masterJsonRef.current.length; i++) {
      const char = masterJsonRef.current[i];
      if (
        char.location.page > insertCharacter.location.page &&
        char.location.page <= closestNewline?.location.page
      ) {
        returnArray.push(char);
      } else if (
        char.location.page === insertCharacter.location.page &&
        char.location.page <= closestNewline?.location.page
      ) {
        if (
          char.location.line > insertCharacter.location.line &&
          char.location.line <= closestNewline?.location.line
        ) {
          returnArray.push(char);
        } else if (
          char.location.line === insertCharacter.location.line &&
          char.location.line <= closestNewline?.location.line
        ) {
          if (char.location.lineIndex > insertCharacter.location.lineIndex) {
            returnArray.push(char);
          }
        }
      }
    }

    return returnArray;
  };

  const spliceMasterJson = (
    newCharacter: Character,
    insertCharacterIndex: number
  ) => {
    // PERF: check
    // const insertCharacterIndex = masterJsonRef.current.findIndex(
    //   (char) => char.characterId === insertCharacterIdRef.current
    // );

    // PERF: check
    // const next = [
    //   ...masterJsonRef.current.slice(0, insertCharacterIndex + 1),
    //   newCharacter,
    //   ...masterJsonRef.current.slice(insertCharacterIndex + 1),
    // ];

    // insert newCharacter into masterJson at insertCharacterIndex
    // PERF: seems to be a major perf hit
    // const next = masterJsonRef.current.slice();
    // next.splice(insertCharacterIndex + 1, 0, newCharacter);

    // much faster
    const next = [...masterJsonRef.current, newCharacter];

    return next;
  };

  // best ran as post-processing step, after everything is loaded?
  const calculateIsCharacterLast = (
    updated: Character[],
    location: Location
  ) => {
    // character after next location and on same line
    // const characterAfterNextLocation = masterJsonRef.current.find((char) => char.location.page === nextLocation.page && char.location.line === nextLocation.line && char.location.lineIndex === nextLocation.lineIndex + 1)
    // return characterAfterNextLocation ? false : true;

    const maxLineIndexOfLine = Math.max(
      ...updated.map((char) =>
        char.location.page === location.page &&
        char.location.line === location.line
          ? char.location.lineIndex
          : 0
      )
    );
    return location.lineIndex === maxLineIndexOfLine;
  };

  const getSpaceCharsBeforeChar = (updated: Character[], char: Character) => {
    let spaceCount = 0;
    updated.filter((checkChar) => {
      if (checkChar.character === " ") {
        if (
          checkChar.location.page < char.location.page ||
          (checkChar.location.page === char.location.page &&
            checkChar.location.line < char.location.line) ||
          (checkChar.location.page === char.location.page &&
            checkChar.location.line === char.location.line &&
            checkChar.location.lineIndex < char.location.lineIndex)
        ) {
          spaceCount++;
        }
      }
    });
    return spaceCount;
  };

  const calculateWordIndex = (updated: Character[], char: Character) => {
    let wordCount = 0;
    updated.forEach((checkChar) => {
      if (checkChar.character === " " || checkChar.type === "newline") {
        if (
          checkChar.location.page < char.location.page ||
          (checkChar.location.page === char.location.page &&
            checkChar.location.line < char.location.line) ||
          (checkChar.location.page === char.location.page &&
            checkChar.location.line === char.location.line &&
            checkChar.location.lineIndex < char.location.lineIndex)
        ) {
          wordCount++;
        }
      }
    });
    return wordCount;
  };

  const calculateParagraphIndex = (updated: Character[], char: Character) => {
    let paragraphCount = 0;
    updated.forEach((checkChar) => {
      if (checkChar.type === "newline") {
        if (
          checkChar.location.page < char.location.page ||
          (checkChar.location.page === char.location.page &&
            checkChar.location.line < char.location.line) ||
          (checkChar.location.page === char.location.page &&
            checkChar.location.line === char.location.line &&
            checkChar.location.lineIndex < char.location.lineIndex)
        ) {
          paragraphCount++;
        }
      }
    });
    return paragraphCount;
  };

  const postProcessChar = (updated: Character[], char: Character) => {
    const lastLineCharacter = calculateIsCharacterLast(updated, char.location);
    const wordIndex = calculateWordIndex(updated, char);
    const paragraphIndex = calculateParagraphIndex(updated, char);

    const postChar = {
      ...char,
      lastLineCharacter,
      wordIndex,
      paragraphIndex,
    };

    return postChar;
  };

  const postProcessMasterJson = (
    updated: Character[],
    limitArray: Character[] | null
  ) => {
    console.info("post processing...");
    let postProcessed = [] as Character[];

    if (!limitArray) {
      updated.forEach((char) => {
        const postChar = postProcessChar(updated, char);
        postProcessed.push(postChar);
      });
    } else {
      updated.forEach((char) => {
        const afterInsertIndex = limitArray.findIndex(
          (c) => c.characterId === char.characterId
        );

        // if the character is after the insert, calculate new location and position
        if (afterInsertIndex > -1) {
          const postChar = postProcessChar(updated, char);
          postProcessed.push(postChar);
        } else {
          // TODO: update only updated portion, rather than pushing every char every time
          postProcessed.push(char);
        }
      });
    }

    return postProcessed;
  };

  const insertCharacter = (
    characterId: string,
    character: string,
    type: CharacterType,
    defaultStyle: Style,
    newSize: Size,
    postprocess: boolean
  ) => {
    if (insertCharacterIdRef.current === null) {
      const newLocation = {
        page: 0,
        line: 0,
        lineIndex: 0,
      };

      const newPosition = {
        x: 0,
        y: 0,
      };

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation,
        position: newPosition,
        size: newSize,
        style: defaultStyle,
        type,
        lastLineCharacter: null,
        wordIndex: 0,
        paragraphIndex: 0,
      };

      // add the new character to the master json
      //   const next = [...masterJsonRef.current, newCharacter];
      // splice into logical array position

      const next = spliceMasterJson(newCharacter, 0);
      setMasterJson(next);

      setInsertCharcterId(characterId);
      setInsertCharacterIndex(0);
      // return characterId;
      // window.__canvasRTEInsertCharacterId = characterId;
    } else {
      // PERF: check
      const insertCharacter = masterJsonRef.current.find(
        (char) => char.characterId === insertCharacterIdRef.current
      );
      //   const insertCharacterIndex = masterJsonRef.current.findIndex(
      //     (char) => char.characterId === insertCharacterIdRef.current
      //   );
      if (insertCharacterIndexRef.current === null) {
        return;
      }

      //   const insertCharacter =
      //     masterJsonRef.current[insertCharacterIndexRef.current];

      if (!insertCharacter) {
        return;
      }

      // PERF: setting as static value does not help perf
      const currentLinePrecedingWidth = getCurrentLinePrecedingWidth(
        insertCharacter.location
      );
      const fitsOnLine =
        currentLinePrecedingWidth + newSize.width < mainTextSize.width;

      const newLocation = calculateNextLocation(
        insertCharacter.location,
        newSize, // pass in 0,0 when newline?
        type,
        false,
        fitsOnLine
      );
      const newPosition = calculateNextPosition(
        insertCharacter,
        newLocation.nextLocation,
        insertCharacter.size // TODO: should be newSize? but newSize doesnt do it
      );

      //   console.info("insertCharacter", insertCharacter);

      const newCharacter: Character = {
        characterId,
        character,
        location: newLocation.nextLocation,
        position: newPosition,
        size: newSize,
        style: defaultStyle,
        type,
        lastLineCharacter: null,
        wordIndex: null,
        paragraphIndex: null,
      };

      // add the new character to the master json
      // then calculate the next location and position for all characters after the insert
      //   const next = [...masterJsonRef.current, newCharacter];

      const next = spliceMasterJson(
        newCharacter,
        insertCharacterIndexRef.current
      );

      //   const afterInsert = getAllCharactersAfterInsert(insertCharacter);
      const afterInsert =
        getCharactersBetweenInsertAndParagraphEnd(insertCharacter);
      //   const afterInsert = [];

      // console.info("afterInsert", afterInsert);

      if (afterInsert.length > 0) {
        let useCalculation = true;
        // let precedingChar: any;
        let updated = [] as Character[];
        let nextLineShift = {
          width: 0,
          height: 0,
        };
        let lineIndexShift = 0;
        // PERF: check
        next.forEach((char) => {
          const afterInsertIndex = afterInsert.findIndex(
            (c) => c.characterId === char.characterId
          );

          // if the character is after the insert, calculate new location and position
          if (afterInsertIndex > -1) {
            // const precedingCharacter = afterInsert[afterInsertIndex - 1];
            // const hasPrecedingCharacter =
            //   typeof precedingCharacter !== "undefined";
            // const precedingCharIsPreviousLine =
            //   precedingChar?.location.line === char.location.line - 1;
            const isSameLine =
              char.location.line === insertCharacter.location.line &&
              char.location.page === insertCharacter.location.page;

            let newLocation: Location;
            let newPosition: Position;

            // little perf benefit with running this once per line?
            const currentLinePrecedingWidth = getCurrentLinePrecedingWidth(
              char.location
            );
            const fitsOnLine =
              currentLinePrecedingWidth + nextLineShift.width <
              mainTextSize.width;

            if (char.lastLineCharacter && fitsOnLine) {
              lineIndexShift = 0;
            } else if (char.lastLineCharacter && !fitsOnLine) {
              lineIndexShift = 1;
            }

            let { shouldContinue, nextLocation } = calculateNextLocation(
              char.location,
              newSize, // should be 0,0 for newline
              char.type,
              true,
              fitsOnLine,
              lineIndexShift
            );
            useCalculation = shouldContinue;
            newLocation = nextLocation;

            let setSize = newSize;
            if (!fitsOnLine) {
              nextLineShift = char.size;
            } else if (isSameLine) {
              nextLineShift = newSize;
            }

            newPosition = calculateNextPosition(
              char,
              newLocation,
              nextLineShift,
              true
            );

            const newChar = {
              ...char,
              location: newLocation,
              position: newPosition,
            };

            updated.push(newChar);
          } else {
            // TODO: update only updated portion, rather than pushing every char every time
            updated.push(char);
          }
        });

        if (postprocess) {
          const postProcessed = postProcessMasterJson(updated, afterInsert);
          setMasterJson(postProcessed);
        } else {
          // return updated;
          setMasterJson(updated);
        }
      } else {
        // return next;
        setMasterJson(next);
      }

      setInsertCharcterId(characterId);
      setInsertCharacterIndex(insertCharacterIndexRef.current + 1);
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    e.preventDefault();
    // console.info("keypress", e.key, editorActiveRef.current);

    if (editorActiveRef.current) {
      //   console.info("in", fontDataRef.current?.unitsPerEm);

      if (!fontDataRef.current) {
        return;
      }

      const characterId = uuidv4();

      switch (e.key) {
        case "Enter":
          {
            const character = "";

            // const insertCharacter = masterJsonRef.current.find(
            //   (char) => char.characterId === insertCharacterIdRef.current
            // );
            const insertCharacterIndex = masterJsonRef.current.findIndex(
              (char) => char.characterId === insertCharacterIdRef.current
            );
            const insertCharacter = masterJsonRef.current[insertCharacterIndex];

            if (!insertCharacter) {
              // TODO: enter in empty document?
              return;
            }

            const newlineLocation: Location = {
              page: insertCharacter.location.page,
              line: insertCharacter.location.line + 1,
              lineIndex: 0,
            };

            const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

            const newlineSize: Size = {
              width: 0,
              height: capHeightPx,
            };

            const newlinePosition = calculateNextPosition(
              insertCharacter,
              newlineLocation,
              insertCharacter.size
            );

            const newCharacter: Character = {
              characterId,
              character,
              location: newlineLocation,
              position: newlinePosition,
              size: newlineSize,
              style: defaultStyle,
              type: "newline",
              lastLineCharacter: null,
              wordIndex: null,
              paragraphIndex: null,
            };

            // add the new character to the master json
            // const next = [...masterJsonRef.current, newCharacter];
            const next = spliceMasterJson(newCharacter, insertCharacterIndex);

            setMasterJson(next);

            setInsertCharcterId(characterId);
          }
          break;
        case "Backspace":
          {
          }
          break;
        case "Delete":
          {
          }
          break;
        case "ArrowLeft":
          {
          }
          break;
        case "ArrowRight":
          {
          }
          break;
        case "ArrowUp":
          {
          }
          break;
        case "ArrowDown":
          {
          }
          break;
        case "Escape":
          {
            setEditorActive(false);
            // window.__canvasRTEEditorActive = false;
          }
          break;
        case "Shift":
          {
          }
          break;
        case "Meta":
          {
          }
          break;
        case "Tab":
          {
            console.info("tab");
            const type = "tab";
            const character = "    ";

            const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

            const tabSize: Size = {
              width: 20,
              height: capHeightPx,
            };

            insertCharacter(
              characterId,
              character,
              type,
              defaultStyle,
              tabSize,
              true
            );
          }
          break;
        default:
          {
            // any other character
            const type = "character";
            const character = e.key;

            const boundingBox = getCharacterBoundingBox(
              fontDataRef.current,
              character,
              defaultStyle
            );

            if (!boundingBox) {
              return;
            }

            const newSize = {
              width: boundingBox?.width,
              height: boundingBox?.height,
            };

            insertCharacter(
              characterId,
              character,
              type,
              defaultStyle,
              newSize,
              true
            );
          }
          break;
      }
    }
  };

  useEffect(() => {
    // avert react strictmode double mount
    const loadFontTimer = setTimeout(() => {
      loadFont(setFontData);
    }, 500);

    return () => {
      clearTimeout(loadFontTimer);
    };
  }, []);

  useEffect(() => {
    if (fontData) {
      console.info("welcome!");

      window.addEventListener("keydown", handleKeydown);

      return () => {
        window.removeEventListener("keydown", handleKeydown);
      };
    }
  }, [fontData]);

  useEffect(() => {
    if (initialMarkdown && fontDataRef.current) {
      const initialCharacters = initialMarkdown.split("");
      initialCharacters.forEach((character, i) => {
        // console.info("character", character);
        if (!fontDataRef.current) {
          return;
        }

        // TODO: handle newlines in markdown

        if (character === "\n") {
          const characterId = uuidv4();
          const type = "newline";
          const character = "";

          const capHeightPx = getCapHeightPx(defaultStyle.fontSize);

          const newSize: Size = {
            width: 0,
            height: capHeightPx,
          };

          insertCharacter(
            characterId,
            character,
            type,
            defaultStyle,
            newSize,
            false
          );
          return;
        } else {
          const characterId = uuidv4();
          const type = "character";

          const boundingBox = getCharacterBoundingBox(
            fontDataRef.current,
            character,
            defaultStyle
          );

          if (!boundingBox) {
            return;
          }

          const newSize = {
            width: boundingBox?.width,
            height: boundingBox?.height,
          };

          insertCharacter(
            characterId,
            character,
            type,
            defaultStyle,
            newSize,
            false
          );
        }
      });

      // postprocess after all initial characters added
      const postProcessed = postProcessMasterJson(masterJsonRef.current, null);
      setMasterJson(postProcessed);
    }
  }, [initialMarkdown, fontData]);

  // when no text exists, will calculate at first character
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("canvas click");
    setEditorActive(true);
    // window.__canvasRTEEditorActive = true;
  };

  // set the insert index to this character
  const handleTextClick = (e: KonvaEventObject<MouseEvent>) => {
    console.info("text click");
    const target = e.target;
    const characterId = target.id();
    console.info("characterId", characterId);
    const characterIndex = masterJson.findIndex(
      (char) => char.characterId === characterId
    );
    const character = masterJson[characterIndex];
    setInsertCharcterId(character.characterId);
    setInsertCharacterIndex(characterIndex);
    // window.__canvasRTEInsertCharacterId = character.characterId;
    setEditorActive(true);
    // window.__canvasRTEEditorActive = true;
  };

  // TODO: check performance of this
  const jsonByPage = useMemo(() => {
    const pages = masterJson.reduce(
      (acc, char) => {
        if (!acc[char.location.page]) {
          acc[char.location.page] = [];
        }

        acc[char.location.page].push(char);

        return acc;
      },
      {} as { [key: number]: Character[] }
    );

    return pages;
  }, [masterJson]);

  return {
    masterJson,
    jsonByPage,
    handleCanvasClick,
    handleTextClick,
  };
};
