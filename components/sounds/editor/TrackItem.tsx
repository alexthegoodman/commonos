"use client";

import * as React from "react";

import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { useSoundsContext } from "../../../context/SoundsContext";

let listenerAttached = 0;

const TrackItem = ({
  constraintsRef = null,
  rowId = null,
  track = null,
  trackWidth = 1,
  trackHeight = 1,
  originalDuration = 1,
  handleClick = () => console.info("handleClick"),
  updateTrack = () => console.info("updateTrack"),
}) => {
  const [{ trackRows, selectedTrack }, dispatch] = useSoundsContext();

  const { id, start, end, zoomFactor } = track;

  const [translating, setTranslating] = React.useState(false);
  const [resizingLeft, setResizingLeft] = React.useState(false);
  const [resizingRight, setResizingRight] = React.useState(false);
  const [withinLeft, setWithinLeft] = React.useState(false);

  //   const [liveStart, setLiveStart] = React.useState(start);
  //   const [liveEnd, setLiveEnd] = React.useState(end);

  const width = ((end - start) / originalDuration) * 100;
  const widthPx = trackWidth * (width / 100);
  const leftPerc = (start / originalDuration) * 100;
  const left = trackWidth * (leftPerc / 100);
  const msPerPixel = originalDuration / trackWidth;

  console.info("width", track, trackRows, width, widthPx);

  // TODO: esc key should cancel any dragging

  // React.useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     const { clientX, clientY } = e;
  //     const wrapper = document.getElementById("videoTrackWrapper");
  //     const targetTrackItem = document.getElementById(id);
  //     const clickAreaOffset = 200;

  //     //   console.info("mouse  move", targetTrackItem, translating);

  //     if (!targetTrackItem) return;

  //     //   console.info("targetTrackItem", targetTrackItem);

  //     const wrapperRect = wrapper.getBoundingClientRect();
  //     const targetTrackItemRect = targetTrackItem.getBoundingClientRect();
  //     const { left, right, width } = targetTrackItemRect;
  //     const {
  //       left: wrapperLeft,
  //       right: wrapperRight,
  //       width: wrapperWidth,
  //     } = wrapperRect;

  //     const pixelPerMs = originalDuration / wrapperWidth;
  //     const msPerPixel = wrapperWidth / originalDuration;
  //     const baseX = clientX - 200; // -200 to account for offset
  //     const totalX = left + (clientX - left);

  //     if (resizingLeft) {
  //       const newWidth = width - (clientX - left);
  //       const newLeft = left + (clientX - left);
  //       // targetTrackItem.style.width = `${newWidth}px`;
  //       // targetTrackItem.style.left = `${newLeft}px`;
  //       const newStart = Math.floor(newLeft * msPerPixel);
  //       // console.info("newStart", newStart, newLeft, msPerPixel);
  //       updateTrack(rowId, track.id, "start", newStart - clickAreaOffset);
  //     }
  //     if (resizingRight) {
  //       const newWidth = width + (clientX - right);
  //       // targetTrackItem.style.width = `${newWidth}px`;
  //       const leftSpace = left + newWidth;
  //       const newEnd = Math.floor(leftSpace * msPerPixel);
  //       updateTrack(rowId, track.id, "end", newEnd + clickAreaOffset);
  //     }
  //   };

  //   listenerAttached++;
  //   console.info("attach mousemove listener", listenerAttached);
  //   document.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     listenerAttached--;
  //     console.info("detaching mousemove listener");
  //     document.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, [translating, resizingLeft, resizingRight]);

  const leftHandleDown = (e) => {
    console.info("leftHandleDown");
    setResizingLeft(true);
  };

  const leftHandleUp = () => {
    console.info("leftHandleUp");
    setResizingLeft(false);
  };

  const leftHandleEnter = () => {
    console.info("leftHandleEnter");
    setWithinLeft(true);
  };

  const leftHandleLeave = () => {
    console.info("leftHandleLeave");
    setWithinLeft(false);
    setResizingLeft(false);
  };

  const itemHandleDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.info("itemHandleDown");
    setTranslating(true);
  };

  const itemHandleUp = () => {
    console.info("itemHandleUp");
    setTranslating(false);
  };

  const itemHandleEnter = () => {
    console.info("itemHandleEnter");
  };

  const itemHandleLeave = () => {
    console.info("itemHandleLeave");
    setTranslating(false);
  };

  const rightHandleDown = () => {
    console.info("rightHandleDown");
    setResizingRight(true);
  };

  const rightHandleUp = () => {
    console.info("rightHandleUp");
    setResizingRight(false);
  };

  const onDrag = (e, data) => {
    // set live start and end
    const { node, x, deltaX, lastX } = data;

    console.info("ondragstop", x, msPerPixel);

    const newStart = Math.floor(x * msPerPixel);

    const newEnd = Math.floor((x + widthPx) * msPerPixel);

    updateTrack(
      rowId,
      track.id,
      "",
      [
        { key: "start", value: newStart },
        { key: "end", value: newEnd },
      ],
      true
    );
  };

  const onResize = (e, side, ref, d) => {
    const { width, height } = ref.style;
    const newWidth = parseInt(width);
    const direction = e.movementX > 0 ? "right" : "left";

    console.info("side", side, direction);

    if (side === "left") {
      if (direction === "right") {
        const newStart = Math.floor(
          (left + Math.abs(e.movementX)) * msPerPixel
        );
        updateTrack(rowId, track.id, "start", newStart);
      } else {
        const newStart = Math.floor((left + e.movementX) * msPerPixel);
        updateTrack(rowId, track.id, "start", newStart);
      }
      // set to match glitch from resizable so bug doesnt bubble up
      // but it should not shorten from right side
      // const newEnd = Math.floor((left + newWidth) * msPerPixel);
      // updateTrack(track.id, "end", newEnd);
    } else if (side === "right") {
      const newEnd = Math.floor((left + newWidth) * msPerPixel);
      updateTrack(rowId, track.id, "end", newEnd);
    }
  };

  const handleTrackDelete = () => {
    console.info("handleTrackDelete", rowId, track.id);

    // const newTracks = tracks.filter((t) => t.id !== track.id);
    const newTrackRows = trackRows.map((trackRow) => {
      if (trackRow.id === rowId) {
        return {
          ...trackRow,
          tracks: trackRow.tracks.filter((t) => t.id !== track.id),
        };
      }
      return trackRow;
    });
    dispatch({ type: "trackRows", payload: newTrackRows });
    dispatch({ type: "selectedTrack", payload: null });
  };

  const staticTrackHeight = 100;

  return (
    <Draggable
      axis="x"
      handle=".itemHandle"
      // defaultPosition={{ x: left, y: 0 }}
      position={{ x: left, y: 0 }}
      // disabled={true}
      grid={[25, 25]}
      scale={1}
      // onStart={this.handleStart}
      // onDrag={this.handleDrag}
      // onStop={this.handleStop}
      //   drag={resizingLeft || resizingRight ? false : "x"}
      //   dragConstraints={constraintsRef}
      //   onDragEnd={itemDragEnd}
      key={id}
      //   id={id}
      defaultClassName={"item"}
      onMouseDown={() => handleClick(id)}
      onDrag={onDrag}
      // onStop={onDragStop}
    >
      <Resizable
        style={{ position: "absolute" }}
        grid={[25, 25]}
        defaultSize={{
          width: widthPx,
          height: staticTrackHeight,
        }}
        minHeight={staticTrackHeight}
        maxHeight={staticTrackHeight}
        minWidth={5}
        maxWidth={trackWidth}
        onResize={onResize}
        // onResizeStop={onResizeStop}
      >
        <div
          style={
            {
              // left: `${left}%`, // conflicts with drag?
              // width: `${width}%`,
            }
          }
        >
          <div
            className="leftHandle"
            onMouseDown={leftHandleDown}
            onMouseUp={leftHandleUp}
            // onMouseEnter={leftHandleEnter}
            // onMouseLeave={leftHandleLeave}
          ></div>
          <div
            className="itemHandle"
            //   onMouseDown={itemHandleDown}
            //   onMouseUp={itemHandleUp}
            //   onMouseEnter={itemHandleEnter}
            //   onMouseLeave={itemHandleLeave}
          >
            <span className="name">{track.name}</span>
          </div>
          <div className="ctrls">
            <button onClick={handleTrackDelete} title="Remove Zoom Track">
              <i className="ph ph-x"></i>
            </button>
          </div>
          <div
            className="rightHandle"
            onMouseDown={rightHandleDown}
            onMouseUp={rightHandleUp}
          ></div>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default TrackItem;
