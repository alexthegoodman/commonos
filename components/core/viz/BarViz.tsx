"use client";

import React from "react";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear, scaleBand } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { maxBy } from "lodash";

// TODO: optmize garbage collection
// TODO: complete types

// graph dimensions and margins
const graphWidthInPixels = 350;
const graphHeightInPixels = 300;
const graphMarginInPixels = { top: 0, bottom: 25, left: 25, right: 0 };

const accentColor = "#ff4040";
const accentColorDark = "#8446ff";

// graph bounds
const boundsWidthInPixels =
  graphWidthInPixels - graphMarginInPixels.left - graphMarginInPixels.right;
const boundsHeightInPixels =
  graphHeightInPixels - graphMarginInPixels.top - graphMarginInPixels.bottom;

// analysisData entity data selectors
const getXDataEntity = (entity: any) => entity.label;
const getYDataEntity = (entity: any) => entity.value;

const BarViz = ({ analysisData = null }) => {
  const maxMetricEntity = maxBy(analysisData, getYDataEntity);
  const metricOptions = analysisData.map((dataPoint: any) => {
    return dataPoint.label;
  });
  const maxMetricYTotal = getYDataEntity(maxMetricEntity);

  // console.info("totals", metricOptions, maxMetricEntity, maxMetricYTotal);

  const xAxis = scaleBand({
    range: [0, boundsWidthInPixels], // for barcharts, this is the width
    // domain: data.map(getXDataEntity), // provide data via filter function
    domain: metricOptions,
    padding: 0.4, // spacing between bars
  });

  const yAxis = scaleLinear({
    range: [boundsHeightInPixels, 0],
    // domain: [0, data.length],
    // domain: analysisData.metricB.totals.map(getYDataEntity),
    domain: [0, maxMetricYTotal],
  });

  // const yAxis = scaleBand({
  //   range: [boundsHeightInPixels, 0],
  //   domain: data.map(getYDataEntity),
  // });

  const composePositionGetter =
    (scaleValue: any, getValue: any) =>
    (
      entity: any // entity passed in via getXEntityPosition(scaleData)
    ) =>
      scaleValue(getValue(entity)); // create functions which integrate scales with data and get positions
  const getXEntityPosition = composePositionGetter(xAxis, getXDataEntity); // a function to get position of entity on the x axis
  const getYEntityPosition = composePositionGetter(yAxis, getYDataEntity); // a function to get position of entity on the y axis

  return (
    <section className="barViz">
      <div className="barVizInner">
        <svg
          width={graphWidthInPixels}
          height={graphHeightInPixels}
          style={{
            overflow: "visible",
            paddingLeft: graphMarginInPixels.left,
            // minWidth: graphWidthInPixels,
            // width: "100%",
          }}
        >
          <LinearGradient
            id="bar-gradient"
            from={accentColor}
            to={accentColorDark}
            // toOpacity={0.1}
          />
          {analysisData ? (
            <>
              {/** Viz Data */}
              <g>
                {analysisData.map((entity: any, index: number) => {
                  const barHeight =
                    boundsHeightInPixels - getYEntityPosition(entity);
                  const barWidth = xAxis.bandwidth();

                  // console.info(
                  //   "entity",
                  //   entity,
                  //   barHeight,
                  //   barWidth,
                  //   getYDataEntity(entity)
                  // );

                  return (
                    <Group key={`bar-${index}`}>
                      <Bar
                        x={getXEntityPosition(entity)}
                        y={getYEntityPosition(entity)}
                        height={barHeight}
                        width={barWidth}
                        fill="url(#bar-gradient)"
                      />
                    </Group>
                  );
                })}
              </g>

              {/** Viz Outline */}
              <g>
                <AxisLeft
                  scale={yAxis}
                  orientation="left"
                  tickClassName="tick leftTick"
                />
                <AxisBottom
                  scale={xAxis}
                  orientation="bottom"
                  top={boundsHeightInPixels}
                  tickClassName="tick bottomTick"
                />
              </g>
            </>
          ) : (
            <></>
          )}
        </svg>
      </div>
    </section>
  );
};

export default BarViz;
