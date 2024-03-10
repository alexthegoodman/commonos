"use client";

import * as React from "react";
import Pie, { ProvidedProps, PieArcDatum } from "@visx/shape/lib/shapes/Pie";
import { animated, useTransition, interpolate } from "@react-spring/web";
import { scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";

const accentColor = "#ff4040";
const accentColorDark = "#8446ff";

// const letters: LetterFrequency[] = letterFrequency.slice(0, 4);

// console.info("letters", letters);

// accessor functions
const frequency = (d: any) => d.value;

const PieViz = ({ analysisData = null }) => {
  const width = 300;
  const height = 300;
  const innerWidth = width;
  const innerHeight = height;
  const radius = Math.min(innerWidth, innerHeight) - 100;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 50;

  // color scales
  const getLetterFrequencyColor = scaleOrdinal({
    domain: analysisData.map((l: any) => l.label),
    range: [
      "rgba(93,30,91,1)",
      "rgba(93,30,91,0.8)",
      "rgba(93,30,91,0.6)",
      "rgba(93,30,91,0.4)",
    ],
  });

  return (
    <svg width={width} height={height}>
      <LinearGradient
        id="pie-gradient"
        from={accentColor}
        to={accentColorDark}
        // toOpacity={0.1}
      />
      <circle
        cx={width / 2}
        cy={width / 2}
        r={width / 2}
        fill="url('#pie-gradient')"
      />
      <Group top={centerY} left={centerX}>
        <Pie
          data={analysisData}
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              animate={false}
              getKey={({ data: { label } }) => label}
              getColor={({ data: { label } }) => getLetterFrequencyColor(label)}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
};

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  delay?: number;
};

const AnimatedPie = ({
  animate,
  arcs,
  path,
  getKey,
  getColor,
}: AnimatedPieProps<any>) => {
  const transitions = useTransition<PieArcDatum<any>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });

  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
};

export default PieViz;
