"use client";

import * as React from "react";

import { v4 as uuidv4 } from "uuid";
import {
  Track,
  TrackRow,
  useSoundsContext,
} from "../../../context/SoundsContext";
import TrackItem from "./TrackItem";
import { motion } from "framer-motion";
import { useElementSize } from "usehooks-ts";
import { styled } from "@mui/material";
import { TracksContainer } from "./TracksContainer";

const Tracks = ({ positions = null, originalDuration = null }) => {
  const [{ trackRows, selectedTrack }, dispatch] = useSoundsContext();

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
    if (originalDuration && !trackRows) {
      const testTracks: TrackRow[] = [
        {
          id: uuidv4(),
          name: "Row 1",
          tracks: [
            {
              id: uuidv4(),
              name: "Track 1",
              start: 5000,
              end: 12000,
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Row 2",
          tracks: [
            {
              id: uuidv4(),
              name: "Track 2",
              start: 16000,
              end: 25000,
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Row 3",
          tracks: [
            {
              id: uuidv4(),
              name: "Track 3",
              start: 1000,
              end: 3000,
            },
            {
              id: uuidv4(),
              name: "Track 4",
              start: 5000,
              end: 8000,
            },
          ],
        },
        {
          id: uuidv4(),
          name: "Row 4",
          tracks: [
            {
              id: uuidv4(),
              name: "Track 5",
              start: 1000,
              end: 3000,
            },
          ],
        },
      ];

      dispatch({ type: "trackRows", payload: testTracks });
    }
  }, [originalDuration]);

  const handleTrackClick = (id) => {
    dispatch({ type: "selectedTrack", payload: id });
  };

  const updateZoomTrack = (rowId, trackId, key, value, batch = false) => {
    console.info("updateZoomTrack", rowId, trackId, key, value, batch);
    const updatedZoomTracks = trackRows.map((trackRow) => {
      if (trackRow.id === rowId) {
        return {
          ...trackRow,
          tracks: trackRow.tracks.map((track) => {
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
          }),
        };
      }
      return trackRow;
    });
    console.info("updatedZoomTracks...", updatedZoomTracks);
    dispatch({ type: "trackRows", payload: updatedZoomTracks });
  };

  const handleTrackAdd = (rowId) => {
    const newTrack: Track = {
      id: uuidv4(),
      name: "New Track",
      start: 0,
      end: 3000,
    };

    let newTrackRows = trackRows.map((trackRow) => {
      if (trackRow.id === rowId) {
        return { ...trackRow, tracks: [...trackRow.tracks, newTrack] };
      }
      return trackRow;
    });

    dispatch({ type: "trackRows", payload: newTrackRows });
  };

  return (
    <TracksContainer>
      <div className={"tracksInner"} ref={trackRef}>
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
        {/* <div className={`track videoTrack`} id="videoTrackWrapper">
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
        </div> */}
        {trackRows?.map((trackRow) => {
          return (
            <>
              <div className={`track zoomTrack`}>
                <motion.div className={"trackInner"} ref={constraintsRef}>
                  {trackWidth &&
                    trackHeight &&
                    trackRow.tracks?.map((track) => {
                      return (
                        <TrackItem
                          key={track.id}
                          rowId={trackRow.id}
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
            </>
          );
        })}
      </div>
    </TracksContainer>
  );
};

export default Tracks;
