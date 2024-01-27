"use client";

import * as React from "react";
import { AreaClosed } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { maxBy } from "lodash";
import { max, extent, bisector } from "d3-array";
import { DateTime } from "luxon";

// TODO: optmize garbage collection
// TODO: complete types

// graph dimensions and margins
const graphWidthInPixels = 350;
const graphHeightInPixels = 300;
const graphMarginInPixels = { top: 0, bottom: 25, left: 25, right: 0 };

const background = "#3b6978";
const background2 = "#204051";
const accentColor = "#ff4040";
const accentColorDark = "#8446ff";

// graph bounds
const boundsWidthInPixels =
  graphWidthInPixels - graphMarginInPixels.left - graphMarginInPixels.right;
const boundsHeightInPixels =
  graphHeightInPixels - graphMarginInPixels.top - graphMarginInPixels.bottom;

// analysisData entity data selectors
const getXDataEntity = (entity: any) => new Date(entity.date);
const getYDataEntity = (entity: any) => entity.value;

const LineViz = ({ title = "", analysisData = null }) => {
  const maxMetricEntity = maxBy(analysisData, getYDataEntity);
  // const metricOptions = analysisData.map((dataPoint, i) => {
  //   return dataPoint.title;
  // });
  const maxMetricYTotal = getYDataEntity(maxMetricEntity);

  // console.info("totals", metricOptions, maxMetricEntity, maxMetricYTotal);

  const xAxis = scaleTime({
    range: [0, boundsWidthInPixels],
    // domain: metricOptions,
    domain: extent(analysisData, getXDataEntity) as [Date, Date],
  });

  const yAxis = scaleLinear({
    range: [boundsHeightInPixels, 0],
    domain: [0, maxMetricYTotal],
  });

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
      <div className="barVizInformation">
        <h5>{title}</h5>
      </div>
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
          {analysisData ? (
            <>
              <LinearGradient
                id="area-background-gradient"
                from={background}
                to={background2}
              />
              <LinearGradient
                id="area-gradient"
                from={accentColor}
                to={accentColorDark}
                // toOpacity={0.1}
              />

              {/** Viz Data */}
              <AreaClosed
                data={analysisData}
                x={getXEntityPosition}
                y={getYEntityPosition}
                yScale={yAxis}
                stroke="url(#area-gradient)"
                fill="url(#area-gradient)"
              />

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
                  tickFormat={(date, i) => {
                    return DateTime.fromJSDate(date as Date).toFormat("LL/dd");
                  }}
                  numTicks={analysisData.length}
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

export default LineViz;
