import { useDocumentsContext } from "@/context/DocumentsContext";
import { simpleUpload } from "@/fetchers/drawing";
import { updateDocumentMutation } from "@/gql/document";
import { Box, Button } from "@mui/material";
import { initializeMultiPageRTE } from "common-rte/dist";
import {
  defaultStyle,
  // DocumentSize,
  loadFont,
  MultiPageEditor,
} from "common-rte/dist";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
// import testJson from "./src/testJson.json";

const pxPerIn = 96;
const marginSizeIn = { x: 1, y: 0.5 };
const documentSizeIn = {
  width: 8.3,
  height: 11.7,
};

const marginSize = {
  x: marginSizeIn.x * pxPerIn,
  y: marginSizeIn.y * pxPerIn,
};

const documentSize = {
  width: documentSizeIn.width * pxPerIn,
  height: documentSizeIn.height * pxPerIn,
};

const mainTextSize = {
  width: (documentSizeIn.width - marginSizeIn.x * 2) * pxPerIn,
  height: (documentSizeIn.height - marginSizeIn.y * 2) * pxPerIn,
};

let rteMounted = 0;

export default function CommonRTE({
  markdown = "",
  documentId,
  documentData,
  refetch,
}) {
  const [state, dispatch] = useDocumentsContext();

  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const startEditor = () => {
    const debounceCallback = (masterContent, masterJson, masterVisuals) => {
      console.info("save editor data", documentId, masterJson, masterVisuals);

      dispatch({
        type: "commonJson",
        payload: {
          masterContent,
          masterJson,
          masterVisuals,
        },
      });
    };

    const uploadFileHandler = async (
      fileName,
      fileSize,
      fileType,
      fileData
    ) => {
      console.info("handling upload file");

      const blob = await simpleUpload(
        token,
        fileName,
        fileSize,
        fileType,
        fileData
      );

      console.info("uploaded", blob);

      return blob.url;
    };

    console.info(
      "starting editor",
      markdown.length,
      documentData?.masterJson?.length,
      documentData?.masterVisuals?.length
    );

    const detachHandlers = initializeMultiPageRTE(
      markdown,
      documentData?.masterJson ?? null, // initial json
      documentData?.masterVisuals ?? [], // initial visuals
      mainTextSize,
      documentSize,
      marginSize,
      debounceCallback,
      [
        {
          name: "Inter",
          url: "/fonts/Inter-Regular.ttf",
        },
        {
          name: "Oswald",
          url: "/fonts/Oswald[wght].ttf",
        },
        {
          name: "Playfair",
          url: "/fonts/Playfair[opsz,wdth,wght].ttf",
        },
        {
          name: "Raleway",
          url: "/fonts/Raleway[wght].ttf",
        },
        {
          name: "PT Sans",
          url: "/fonts/PT_Sans-Web-Regular.ttf",
        },
        {
          name: "PT Serif",
          url: "/fonts/PT_Serif-Web-Regular.ttf",
        },
        {
          name: "Permanent Marker",
          url: "/fonts/PermanentMarker-Regular.ttf",
        },
        {
          name: "DM Serif Display",
          url: "/fonts/DMSerifDisplay-Regular.ttf",
        },
      ],
      uploadFileHandler
    );

    return detachHandlers;
  };

  useEffect(() => {
    rteMounted++;

    if (
      (process.env.NODE_ENV === "development" && rteMounted === 2) ||
      (process.env.NODE_ENV === "production" && rteMounted === 1)
    ) {
      console.info("start editor", process.env.NODE_ENV);

      const detachHandlers = startEditor();

      return () => {
        rteMounted = 0;
        detachHandlers();
      };
    }
  }, []);

  return (
    <>
      <div id="cmnToolbarPrimary" className="toolbar">
        <label>Alter Text:</label>
        <select id="cmnFontFamily">
          <option value="Inter" style={{ fontFamily: "Inter" }}>
            Inter
          </option>
          <option value="Playfair" style={{ fontFamily: "Playfair" }}>
            Playfair
          </option>
          <option value="Oswald" style={{ fontFamily: "Oswald" }}>
            Oswald
          </option>
          <option value="Raleway" style={{ fontFamily: "Raleway" }}>
            Raleway
          </option>
          <option value="PT Sans" style={{ fontFamily: "PT Sans" }}>
            PT Sans
          </option>
          <option value="PT Serif" style={{ fontFamily: "PT Serif" }}>
            PT Serif
          </option>
          <option
            value="Permanent Marker"
            style={{ fontFamily: "Permanent Marker" }}
          >
            Permanent Marker
          </option>
          <option
            value="DM Serif Display"
            style={{ fontFamily: "DM Serif Display" }}
          >
            DM Serif Display
          </option>
        </select>
        <Button size="small" id="cmnColor">
          Color
        </Button>
        <select id="cmnFontSize">
          <option value="10">10</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="24">24</option>
          <option value="36">36</option>
          <option value="48">48</option>
        </select>
        <Button size="small" id="cmnBold">
          Bold
        </Button>
        <Button size="small" id="cmnItalic">
          Italic
        </Button>
        <Button size="small" id="cmnUnderline">
          Underline
        </Button>
        <label>Add Visuals:</label>
        <Button size="small" id="cmnCircle">
          Circle
        </Button>
        <Button size="small" id="cmnRectangle">
          Rectangle
        </Button>
        <Button size="small" id="cmnImageButton">
          Image
        </Button>
        <input id="cmnImageFile" type="file" className="hidden" />
        <Box display="none">
          <span>Last Saved:</span>
          <span id="cmnLastSaved"></span>
        </Box>
      </div>
      <div id="cmnToolbarShape" className="toolbar">
        <label>Shape Properties:</label>
        <label>Width</label>
        <input id="cmnShapeWidth" type="text" name="width" />
        <label>Height</label>
        <input id="cmnShapeHeight" type="text" name="height" />
        <button id="cmnShapeColor">Color</button>
      </div>
      <div id="cmnContainer"></div>
      <style>
        {`@font-face {
              font-family: "Inter";
              src: url("/fonts/Inter-Regular.ttf");
              font-weight: normal;
              font-style: normal;
            }
              @font-face {
              font-family: "Playfair";
              src: url("/fonts/Playfair[opsz\,wdth\,wght].ttf");
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: "Oswald";
              src: url("/fonts/Oswald[wght].ttf");
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: "Raleway";
              src: url("/fonts/Raleway[wght].ttf");
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: "PT Sans";
              src: url("/fonts/PT_Sans-Web-Regular.ttf");
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: "PT Serif";
              src: url("/fonts/PT_Serif-Web-Regular.ttf");
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: "Permanent Marker";
              src: url("/fonts/PermanentMarker-Regular.ttf");
              font-weight: normal;
              font-style: normal;
            }
            @font-face {
              font-family: "DM Serif Display";
              src: url("/fonts/DMSerifDisplay-Regular.ttf");
              font-weight: normal;
              font-style: normal;
            }
            .toolbar {
              display: flex;
              flex-direction: row;
              gap: 5px;
              z-index: 2;
            }
              .toolbar button, .toolbar a {
              height: 40px; 
              min-width: 20px;
              width: auto;
              }
            .hidden {
              display: none;
            }
              #cmnContainer {
              display: flex;
    justify-content: center;
    }
            `}
      </style>
      <div className="preloadFont" style={{ fontFamily: "Inter" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "Playfair" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "Oswald" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "Raleway" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "PT Sans" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "PT Serif" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "Permanent Marker" }}>
        .
      </div>
      <div className="preloadFont" style={{ fontFamily: "DM Serif Display" }}>
        .
      </div>
    </>
  );
}
