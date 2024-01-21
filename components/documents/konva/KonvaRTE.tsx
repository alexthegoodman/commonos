import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import ContentEditable from "react-contenteditable";
import { HTMLToJSON } from "html-to-json-parser";
import { getPreText } from "@/helpers/rte";
var showdown = require("showdown");

const converter = new showdown.Converter();

export default function KonvaRTE({
  pageId,
  completeMarkdown,
  markdown,
  dispatch,
  setIsDragging,
  setDragStart,
  setDragEnd,
  setStartPageId,
  setStartIndex,
  setEndPageId,
  setEndIndex,
  isDragging,
  startPageId,
  startIndex,
  endPageId,
  endIndex,
  setTextIsSelected,
  textIsSelected,
  insertSpot,
  setInsertSpot,
  insertPageId,
  setInsertPageId,
}) {
  const hiddenContainer = useRef(null);
  const stageRef = useRef(null);

  const [charTexts, setCharTexts] = useState([]);

  const replaceNode = (node: HTMLElement) => {
    const textContent = node.textContent;
    console.info(
      "text content",
      node,
      node.nodeName,
      node.nodeType,
      `"${textContent}"`
    );

    if (textContent === "\n") {
      return;
    }

    const spannedText = textContent
      .split("")
      .map(
        (char) => `<span class="char" style="
        font-family: Arial;
        font-size: 18px;
        font-weight: ${node.nodeName === "STRONG" ? "bold" : "normal"}; 
      ">${char}</span>`
      )
      .join("");
    const spanFragment = document
      .createRange()
      .createContextualFragment(spannedText);
    node.replaceWith(spanFragment);
  };

  function traverseAndWrap(node: Text) {
    console.info("node.attr", node.nodeType, node.constructor.name);
    if (node.nodeType === Node.TEXT_NODE) {
      replaceNode(node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName === "STRONG"
    ) {
      console.info("strong-node", node);
      replaceNode(node);
    } else {
      [...node.childNodes].forEach((childNode) => {
        console.info("child-node", childNode);
        traverseAndWrap(childNode);
      });

      if (node.textContent) {
        console.info("special content", node.textContent, node.childNodes);
      }
    }
  }

  const markdownToContentEditable = async (markdown) => {
    const html = converter.makeHtml(markdown);

    console.info("the html", html);

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(
      `<div>${html}</div>`,
      "text/html"
    );

    console.info("parsedHtml.body", parsedHtml.body);

    // Traverse the parsed HTML and wrap each character in a span
    traverseAndWrap(parsedHtml.body);

    hiddenContainer.current.innerHTML = parsedHtml.body.innerHTML;

    const textNodes = hiddenContainer.current.querySelectorAll(".char");

    markdownToKonva(markdown, textNodes);
  };

  const addToKonvaTexts = (item, textNodes, konvaTexts, nodesDone) => {
    // console.info("textNodes", textNodes);

    item.content.forEach((subItem) => {
      if (typeof subItem === "string") {
        subItem.split("").forEach((char, i) => {
          const textNode = textNodes[nodesDone];
          const rect = textNode.getBoundingClientRect();
          const currentY =
            textNode.offsetTop - hiddenContainer.current.offsetTop - 9999;
          const currentX =
            textNode.offsetLeft - hiddenContainer.current.offsetLeft - 9999;

          // console.info("char", char, textNode.offsetTop, currentY, currentX);

          // console.info(
          //   "style",
          //   textNode.style.fontFamily,
          //   textNode.style.fontSize,
          //   textNode.style.fontStyle
          // );

          konvaTexts.push({
            id: "char-" + Math.random() + "-" + pageId + "-" + nodesDone,
            text: char,
            x: currentX,
            // y: lineY,
            y: currentY,
            width: rect.width,
            height: rect.height,
            fontFamily: textNode.style.fontFamily,
            fontSize: parseInt(textNode.style.fontSize.split("px")[0]),
            fontStyle: textNode.style.fontWeight,
          });

          // currentX += rect.width;
          nodesDone++;
        });
      } else if (subItem.type === "strong") {
        nodesDone = addToKonvaTexts(subItem, textNodes, konvaTexts, nodesDone);
      }
    });

    return nodesDone;
  };

  const markdownToKonva = async (markdown, textNodes) => {
    const html = converter.makeHtml(markdown);
    const jsonString = await HTMLToJSON(`<div>${html}</div>`, true);
    const json = JSON.parse(jsonString);
    console.info("markdown json", json);

    /**
     * Example json:
     * {"type":"div","content":[{"type":"p","content":["CommonOS Commitment to West Michigan"]},"\n",{"type":"p","content":["At CommonOS, we are committed to the development and growth of the West Michigan economy. We understand the importance of investing in our local community and are dedicated to keeping our headquarters right here in West Michigan. Our mission is to not only support the economy but also create a positive impact on the lives of the people in this region."]},"\n",{"type":"p","content":["Our mission in West Michigan involves:"]},"\n",{"type":"ul","content":["\n",{"type":"li","content":["Creating job opportunities: We aim to provide employment opportunities for the local community, thereby contributing to a reduction in unemployment rates and fostering economic stability."]},"\n",{"type":"li","content":["Supporting local businesses: By sourcing goods and services from local businesses, we actively support and strengthen the local economy."]},"\n"]},"\n",{"type":"p","content":["To invest in West Michigan's economy, CommonOS will:"]},"\n",{"type":"ul","content":["\n",{"type":"li","content":["Offer education and skill development programs: By investing in education and skills training, we can empower the local workforce and improve their job prospects, thereby contributing to the growth of the region's economy."]},"\n",{"type":"li","content":["Support small businesses and startups: We believe in helping local entrepreneurs succeed by providing resources and support for their growth and development."]},"\n"]},"\n",{"type":"p","content":["In order to achieve our economic goals in West Michigan, strategic partnerships with various stakeholders are essential. These include:"]},"\n",{"type":"ul","content":["\n",{"type":"li","content":["Local universities and research institutions: Collaborating with these institutions can lead to innovation and advancements that benefit both CommonOS and the"]},"\n"]}]}
     */

    const konvaTexts = [];
    // let currentX = 0;
    // let lastY = 0;
    // let lineY = 0;
    let nodesDone = 0;
    json.content.forEach((item, x) => {
      if (item.type === "p") {
        nodesDone = addToKonvaTexts(item, textNodes, konvaTexts, nodesDone);
      }
      if (item.type === "ul") {
        // konvaTexts.push({
        //   text: item.content.map((item) => item.content.join("")).join("\n"),
        // });

        item.content.forEach((subItem) => {
          if (subItem.type === "li") {
            nodesDone = addToKonvaTexts(
              subItem,
              textNodes,
              konvaTexts,
              nodesDone
            );
          }
        });
      }
    });

    // console.info("konva texts", konvaTexts);

    setCharTexts([...konvaTexts]);
  };

  useEffect(() => {
    if (markdown) {
      // markdownToKonva(markdown);
      markdownToContentEditable(markdown);
    }
  }, [markdown]);

  const handleMouseDown = (e) => {
    // console.info("mouse down", textIsSelected);

    if (textIsSelected) {
      setTextIsSelected(false);
      return;
    }

    setIsDragging(true);

    const position = stageRef.current.getPointerPosition();

    setDragStart(position);

    // Identify the Konva.Text node
    const textNode = stageRef.current.getIntersection(position);
    const nodeType = textNode.getClassName();

    if (nodeType === "Text") {
      // get text node id
      const textNodeId = textNode.getId();
      const idParts = textNodeId.split("-");
      const nodePageId = parseInt(idParts[2]);
      const nodeIndex = parseInt(idParts[3]);

      // console.info("start textNode", textNode, textNodeId);

      setStartPageId(nodePageId);
      setStartIndex(nodeIndex);
    }
  };

  const handleMouseMove = (e) => {
    // console.info("mouse move", textIsSelected);

    if (textIsSelected) {
      return;
    }

    const position = stageRef.current.getPointerPosition();

    setDragEnd(position);

    // Identify the Konva.Text node
    const textNode = stageRef.current.getIntersection(position);

    // determine node type
    const nodeType = textNode.getClassName();

    if (nodeType === "Text") {
      // get text node id
      const textNodeId = textNode.getId();
      const idParts = textNodeId.split("-");
      const nodePageId = parseInt(idParts[2]);
      const nodeIndex = parseInt(idParts[3]);

      // console.info("move textNode", textNode, textNodeId);

      setEndPageId(nodePageId);
      setEndIndex(nodeIndex);
    }
  };

  const handleMouseUp = (e) => {
    // console.info("mouse up", textIsSelected);

    // if (!textIsSelected) {
    //   return;
    // }

    if (startPageId === endPageId && startIndex === endIndex) {
      // console.info("set insert spot, no selection", startIndex + 1);
      setInsertSpot(startIndex);
      setInsertPageId(startPageId);
    } else {
      if (isDragging) {
        setTextIsSelected(true);
      }
    }

    setIsDragging(false);

    // const position = stageRef.current.getPointerPosition();

    // // setDragEnd(position);

    // // Identify the Konva.Text node
    // const textNode = stageRef.current.getIntersection(position);
    // const nodeType = textNode.getClassName();

    // if (nodeType === "Text") {
    //   // get text node id
    //   const textNodeId = textNode.getId();
    //   const idParts = textNodeId.split("-");
    //   const nodePageId = idParts[2];
    //   const nodeIndex = idParts[3];

    //   // console.info("end textNode", textNode, textNodeId);

    //   // setEndPageId(nodePageId);
    //   // setEndIndex(nodeIndex);
    // }
  };

  const handleKeyDown = (e) => {
    // console.info("keydown", e.key, e.keyCode);

    if (e.keyCode === 8) {
      // backspace
      e.preventDefault();

      if (textIsSelected) {
        // console.info("delete selected text", startIndex, endIndex);

        const newText =
          completeMarkdown.slice(0, startIndex) +
          completeMarkdown.slice(endIndex);
        dispatch({ type: "markdown", payload: newText });
        // markdownToContentEditable(newText);
      } else {
        // console.info("delete single character", insertSpot);

        const preText1 = completeMarkdown.slice(0, insertSpot - 1);
        const numPreNewlines = preText1.split("\n").length - 2;
        const numPreDashes = preText1.split("-").length - 1;
        const preText = completeMarkdown.slice(
          0,
          numPreNewlines * 2 + numPreDashes * 2 + (insertSpot - 1)
        );

        const newText = preText + completeMarkdown.slice(preText.length);
        dispatch({ type: "markdown", payload: newText });
        // markdownToContentEditable(newText);
        setInsertSpot(insertSpot - 1);
      }
    } else if (e.keyCode === 13) {
      // enter
      e.preventDefault();

      // console.info("enter", insertSpot);

      const newText =
        completeMarkdown.slice(0, insertSpot) +
        "\n" +
        completeMarkdown.slice(insertSpot);
      dispatch({ type: "markdown", payload: newText });
      // markdownToContentEditable(newText);
      setInsertSpot(insertSpot + 1);
    } else if (e.keyCode === 37) {
      // left arrow
      e.preventDefault();

      // console.info("left arrow", insertSpot);

      setInsertSpot(insertSpot - 1);
    } else if (e.keyCode === 39) {
      // right arrow
      e.preventDefault();

      // console.info("right arrow", insertSpot);

      setInsertSpot(insertSpot + 1);
    } else if (e.keyCode === 16) {
      // shift
      // console.info("shift", insertSpot);
      e.preventDefault();
    } else if (e.keyCode === 17) {
      // ctrl
      // console.info("ctrl", insertSpot);
      e.preventDefault();
    } else if (e.keyCode === 18) {
      // alt
      // console.info("alt", insertSpot);
      e.preventDefault();
    } else if (e.keyCode === 91 || e.keyCode === 92) {
      // meta
      // console.info("meta", insertSpot);
      e.preventDefault();
    } else {
      // other keys
      // console.info("key", e.key);
      e.preventDefault();

      if (textIsSelected) {
        // console.info("delete selected text", startIndex, endIndex);

        const newText =
          completeMarkdown.slice(0, startIndex) +
          completeMarkdown.slice(endIndex);
        dispatch({ type: "markdown", payload: newText });
        // markdownToContentEditable(newText);
      } else {
        const preText = getPreText(completeMarkdown, insertSpot);
        const afterText = completeMarkdown.slice(preText.length);

        // console.info(
        //   "insert single character",
        //   preText1.match(/\n- /g),
        //   preText1.match(/\n/g),
        //   // completeMarkdown,
        //   insertSpot,
        //   preText1,
        //   numPreNewlines,
        //   numPreDashes,
        //   preText
        // );

        const newText = preText + e.key + afterText;
        dispatch({ type: "markdown", payload: newText });
        setInsertSpot(insertSpot + 1);
      }
    }
  };

  useEffect(() => {
    // set onkeydown
    document.onkeydown = handleKeyDown;

    return () => {
      document.onkeydown = null;
    };
  }, [insertSpot]);

  const pxPerIn = 96;
  const marginSize = {
    x: 1 * 2,
    y: 0.5 * 2,
  };
  const documentSize = {
    width: 8.3 * pxPerIn,
    height: 11.7 * pxPerIn,
  };
  const mainTextSize = {
    width: (8.3 - marginSize.x) * pxPerIn,
    height: (11.7 - marginSize.y) * pxPerIn,
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={documentSize.width}
        height={documentSize.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={documentSize.width}
            height={documentSize.height}
            fill="white"
          />
        </Layer>
        <Layer>
          {charTexts.map((charText, i) => {
            const selectedText =
              (i >= startIndex && i <= endIndex) ||
              (i >= endIndex && i <= startIndex);

            const insertText = i == insertSpot && pageId == insertPageId;

            return (
              <>
                {(textIsSelected || isDragging) && selectedText && (
                  <Rect
                    key={`${pageId}-${charText}-${i}-rect`}
                    x={charText.x}
                    y={charText.y}
                    width={charText.width}
                    height={charText.height}
                    fill="green"
                  />
                )}
                <Text
                  key={`${pageId}-${charText}-${i}`}
                  id={charText.id}
                  x={charText.x}
                  y={charText.y}
                  text={charText.text}
                  fontSize={charText.fontSize}
                  fontFamily={charText.fontFamily}
                  fontStyle={charText.fontStyle}
                  fill="black"
                />
                {insertText && (
                  <Rect
                    key={`${pageId}-${charText}-${i}-insert`}
                    x={charText.x}
                    y={charText.y}
                    width={2}
                    height={20}
                    fill="black"
                  />
                )}
              </>
            );
          })}
        </Layer>
      </Stage>
      <div
        ref={hiddenContainer}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: mainTextSize.width,
          height: mainTextSize.height,
          fontFamily: "Arial",
          fontSize: 18,
          padding: "0.5in 1in",
        }}
      />
    </>
  );
}
