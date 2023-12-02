"use client";

import * as React from "react";

import { v4 as uuidv4 } from "uuid";
import { Track, useSoundsContext } from "../../../context/SoundsContext";
import TrackItem from "./TrackItem";
import { motion } from "framer-motion";
import { useElementSize } from "usehooks-ts";
import { styled } from "@mui/material";
import { TracksContainer } from "./TracksContainer";

const Tracks = ({ positions = null, originalDuration = null }) => {
  const [{ tracks, selectedTrack }, dispatch] = useSoundsContext();

  const [trackRef, { width: trackWidth, height: trackHeight }] =
    useElementSize();

  console.info("trackWidth", trackWidth, trackHeight);

  const constraintsRef = React.useRef(null);

  const nearestSecond = Math.ceil(originalDuration / 1000) * 1000;
  const seconds = nearestSecond / 1000;
  const numTicks = 10;
  const tickSpace = seconds / numTicks;

  // for testing only
  React.useEffect(() => {
    if (originalDuration && !tracks) {
      const testTracks: Track[] = [
        {
          id: uuidv4(),
          name: "Track 1",
          start: 5000,
          end: 12000,
        },
        {
          id: uuidv4(),
          name: "Track 2",
          start: 16000,
          end: 25000,
        },
      ];

      dispatch({ type: "tracks", payload: testTracks });
    }
  }, [originalDuration]);

  const handleTrackClick = (id) => {
    dispatch({ type: "selectedTrack", payload: id });
  };

  const updateZoomTrack = (trackId, key, value, batch = false) => {
    const updatedZoomTracks = tracks.map((track) => {
      if (track.id === trackId) {
        if (batch) {
          let newTrack = { ...track };
          value.forEach((v) => {
            newTrack = { ...newTrack, [v.key]: v.value };
          });
          return newTrack;
        } else {
          return { ...track, [key]: value };
        }
      }
      return track;
    });
    dispatch({ type: "tracks", payload: updatedZoomTracks });
  };

  const handleTrackAdd = () => {
    const newTrack: Track = {
      id: uuidv4(),
      name: "New Track",
      start: 0,
      end: 3000,
    };

    dispatch({ type: "tracks", payload: [...tracks, newTrack] });
  };

  return (
    <TracksContainer>
      <div className={"tracksInner"}>
        <div className={"ticks"}>
          <span className="trackLength">
            {Math.round(originalDuration / 1000)}s
          </span>
          {new Array(numTicks).fill(0).map((x, i) => {
            return (
              <div className={"tick"}>
                <span>{Math.round(tickSpace * (i + 1))}</span>
              </div>
            );
          })}
        </div>
        <div className={`track videoTrack`} id="videoTrackWrapper">
          <div className={"trackInner"}>
            <div
              id="videoTrack"
              className={"item"}
              style={{ left: 5 }}
              //   onClick={() => handleTrackClick(videoTrack.id)}
            >
              <span className="name">None</span>
            </div>
          </div>
        </div>
        <div className={`track zoomTrack`} ref={trackRef}>
          <motion.div className={"trackInner"} ref={constraintsRef}>
            {trackWidth &&
              trackHeight &&
              tracks?.map((track) => {
                return (
                  <TrackItem
                    updateTrack={updateZoomTrack}
                    constraintsRef={constraintsRef}
                    track={track}
                    trackWidth={trackWidth}
                    trackHeight={trackHeight}
                    originalDuration={originalDuration}
                    handleClick={handleTrackClick}
                  />
                );
              })}
          </motion.div>
          <div className="trackCtrls">
            <button onClick={handleTrackAdd} title="Add Zoom Track">
              <i className="ph ph-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </TracksContainer>
  );
};

export default Tracks;
