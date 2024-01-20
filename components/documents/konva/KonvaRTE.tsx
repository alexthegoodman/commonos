import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import ContentEditable from "react-contenteditable";
import { HTMLToJSON } from "html-to-json-parser";
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
}) {
  const hiddenContainer = useRef(null);
  const stageRef = useRef(null);

  const [charTexts, setCharTexts] = useState([]);

  function traverseAndWrap(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent;
      // console.info("text content", `"${textContent}"`);

      if (textContent === "\n") {
        return;
      }

      const spannedText = textContent
        .split("")
        .map((char) => `<span class="char">${char}</span>`)
        .join("");
      const spanFragment = document
        .createRange()
        .createContextualFragment(spannedText);
      node.replaceWith(spanFragment);
    } else {
      node.childNodes.forEach((childNode) => traverseAndWrap(childNode));
    }
  }

  const markdownToContentEditable = async (markdown) => {
    const html = converter.makeHtml(markdown);

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(
      `<div>${html}</div>`,
      "text/html"
    );

    // Traverse the parsed HTML and wrap each character in a span
    traverseAndWrap(parsedHtml.body);

    hiddenContainer.current.innerHTML = parsedHtml.body.innerHTML;

    const textNodes = hiddenContainer.current.querySelectorAll(".char");

    markdownToKonva(markdown, textNodes);
  };

  const addToKonvaTexts = (item, textNodes, konvaTexts, nodesDone) => {
    let text = item.content.join("");

    text.split("").forEach((char, i) => {
      const textNode = textNodes[nodesDone];
      const rect = textNode.getBoundingClientRect();
      const currentY = textNode.offsetTop - hiddenContainer.current.offsetTop;
      const currentX = textNode.offsetLeft - hiddenContainer.current.offsetLeft;

      // console.info("char", char, textNode.offsetTop, currentY, currentX);

      konvaTexts.push({
        id: "char-" + Math.random() + "-" + pageId + "-" + nodesDone,
        text: char,
        x: currentX,
        // y: lineY,
        y: currentY,
        width: rect.width,
        height: rect.height,
        fontFamily: "Arial",
        fontSize: 18,
      });

      // currentX += rect.width;
      nodesDone++;
    });

    return nodesDone;
  };

  const markdownToKonva = async (markdown, textNodes) => {
    const html = converter.makeHtml(markdown);
    const jsonString = await HTMLToJSON(`<div>${html}</div>`, true);
    const json = JSON.parse(jsonString);
    // console.info("markdown json", markdown, html, json);

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
      const nodePageId = idParts[2];
      const nodeIndex = idParts[3];

      // console.info("start textNode", textNode, textNodeId);

      setStartPageId(nodePageId);
      setStartIndex(nodeIndex);
    }
  };

  const handleMouseMove = (e) => {
    // if (!isDragging) {
    //   return;
    // }

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
      const nodePageId = idParts[2];
      const nodeIndex = idParts[3];

      // console.info("move textNode", textNode, textNodeId);

      setEndPageId(nodePageId);
      setEndIndex(nodeIndex);
    }
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);

    const position = stageRef.current.getPointerPosition();

    setDragEnd(position);

    // Identify the Konva.Text node
    const textNode = stageRef.current.getIntersection(position);
    const nodeType = textNode.getClassName();

    if (nodeType === "Text") {
      // get text node id
      const textNodeId = textNode.getId();
      const idParts = textNodeId.split("-");
      const nodePageId = idParts[2];
      const nodeIndex = idParts[3];

      // console.info("end textNode", textNode, textNodeId);

      setEndPageId(nodePageId);
      setEndIndex(nodeIndex);
    }
  };

  const pxPerIn = 96;
  const documentSize = {
    width: 8.3 * pxPerIn,
    height: 11.7 * pxPerIn,
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

            return (
              <>
                {isDragging && selectedText && (
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
                  fill="black"
                />
              </>
            );
          })}
        </Layer>
      </Stage>
      <div
        ref={hiddenContainer}
        // style={{ display: "none", position: "absolute" }}
        style={{
          fontFamily: "Arial",
          fontSize: 18,
        }}
      />
    </>
  );
}
