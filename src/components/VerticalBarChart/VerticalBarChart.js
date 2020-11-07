import React from "react"
import styled from "styled-components"
import numeral from "numeral"
import groupBy from "lodash/groupBy"
import isEqual from "lodash/isEqual"
import sumBy from "lodash/sumBy"
import maxBy from "lodash/maxBy"
import { scaleBand, scaleLinear } from "d3-scale"
import { stack } from "d3-shape"
import { select } from "d3-selection"
import { easeCubicInOut } from "d3-ease"
import "d3-transition"
import { useMeasure, usePrevious } from "react-use"
import { Badge, Typography } from "antd"

import { CHART_DOMAINS } from "../../constants/chartDomains.ts"
import { CHART_COLORS } from "../../constants/colors.ts"
import { COLORS } from "../../constants/colors"
import { DURATION_MILLISECOND } from "../../constants/animations"

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

const ChartSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
`

const TooltipContainer = styled.div`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 100;
  pointer-events: none;
  background: #fff;
  border: 1px solid ${(props) => props.color};
  border-radius: 4px;
  padding: 4px 8px;
  color: ${(props) => props.color};

  :after {
    left: 100%;
    top: 50%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-left-color: ${(props) => props.color};
    border-width: 8px;
    margin-top: -8px;
  }
`

const margin = {
  top: 16,
  right: 0,
  bottom: 16,
  left: 0,
}

const VerticalBarChart = ({ data, question, total }) => {
  const [divRef, { width, height }] = useMeasure()
  const [
    tooltipRef,
    { width: tooltipWidth, height: tooltipHeight },
  ] = useMeasure()
  const prevWidth = usePrevious(width)
  const prevData = usePrevious(data)

  const [hovered, setHovered] = React.useState(undefined)

  const createUpdateElements = () => {
    const xScale = scaleBand()
      .domain(Object.keys(CHART_DOMAINS[question.type]))
      .range([margin.left, width - margin.right])
      .paddingInner(0.4)
      .paddingOuter(0.25)
    const yValues = Object.values(groupBy(data, "labelGroup"))
      .map((d) => {
        return {
          labelGroup: d[0]?.labelGroup,
          value: sumBy(d, "value"),
        }
      })
      .filter((d) => d.labelGroup)
    const yScale = scaleLinear()
      .domain([0, maxBy(yValues, "value")?.value || 1])
      .range([height - margin.bottom, margin.top])

    let combinedStackedData = []
    xScale.domain().forEach((val) => {
      const stackGen = stack().keys(CHART_DOMAINS[question.type][val])
      const groupFiltered = data.filter((d) => d.labelGroup === val)
      let dataObj = { group: val }
      groupFiltered.forEach((d) => {
        dataObj = { ...dataObj, [d.label]: d.value }
      })
      combinedStackedData = [...combinedStackedData, stackGen([dataObj])]
    })

    const addMouseOver = (g) =>
      g.on("mouseover", (_, d) =>
        setHovered({
          yPosition: yScale(d[0][1]),
          xPosition: xScale(d[0].data.group),
          label: d.key,
          value: d[0].data[d.key],
        })
      )

    const chartArea = select(chartAreaRef.current)

    const t = chartArea
      .transition()
      .duration(DURATION_MILLISECOND.sm)
      .ease(easeCubicInOut)

    chartArea
      .selectAll(".rect-group")
      .data(combinedStackedData)
      .enter()
      .append("g")
      .attr("class", "rect-group")

    chartArea
      .selectAll(".rect-group")
      .selectAll(".label-rect")
      .data(
        (d) => d,
        (d) => d.key + question.question
      )
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "label-rect")
            .attr("fill", (d) => CHART_COLORS[question.type][d.key])
            .attr("x", (d) => xScale(d[0].data.group))
            .attr("width", xScale.bandwidth())
            .attr("y", (d) => yScale(d[0][1]))
            .attr("height", (d) => yScale(d[0][0]) - yScale(d[0][1]))
            .call(addMouseOver)
            .on("mouseout", () => setHovered(undefined))
            .call((enter) => enter),
        (update) =>
          update.call(addMouseOver).call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xScale(d[0].data.group))
              .attr("width", xScale.bandwidth())
              .attr("y", (d) => yScale(d[0][1] || 0))
              .attr("height", (d) => yScale(d[0][0]) - yScale(d[0][1] || 0))
          ),
        (exit) => exit.remove()
      )

    chartArea
      .selectAll(".bar-text")
      .data(yValues, (d) => d.labelGroup + question.question)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("class", "bar-text")
            .attr("fill", COLORS.primaryBlack)
            .attr("x", (d) => xScale(d.labelGroup) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d.value))
            .attr("dy", -5)
            .attr("text-anchor", "middle")
            .text((d) => numeral(d.value).format("0.0%")),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xScale(d.labelGroup) + xScale.bandwidth() / 2)
              .attr("y", (d) => yScale(d.value || 0))
              .text((d) => numeral(d.value || 0).format("0.0%"))
          ),
        (exit) => exit.remove()
      )

    chartArea
      .selectAll(".axis-text")
      .data(xScale.domain(), (d) => d + question.question)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("class", "axis-text")
            .attr("fill", COLORS.primaryBlack)
            .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
            .attr("y", height - 2.5)
            .attr("text-anchor", "middle")
            .text((d) => d),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
              .attr("y", height - 2.5)
              .text((d) => d)
          ),
        (exit) => exit.remove()
      )
  }

  const isInitialized = React.useRef(false)
  React.useEffect(() => {
    if (
      !isInitialized.current
        ? width && data
        : width !== prevWidth || !isEqual(data, prevData)
    ) {
      isInitialized.current = true
      createUpdateElements()
    }
  })

  const chartAreaRef = React.useRef()
  return (
    <ChartContainer ref={divRef}>
      <div
        style={{
          position: "absolute",
          left: -8,
          top: -10,
        }}
      >
        <Badge
          count={question.group}
          style={{
            backgroundColor: COLORS.primaryBlue,
          }}
        />
      </div>
      {hovered && (
        <TooltipContainer
          ref={tooltipRef}
          top={hovered.yPosition - tooltipHeight / 2 - 5}
          left={hovered.xPosition - tooltipWidth - (16 + 10)}
          color={CHART_COLORS[question.type][hovered.label]}
        >
          {hovered.label}:{" "}
          <Typography.Text
            style={{
              color: CHART_COLORS[question.type][hovered.label],
            }}
            strong
          >
            {numeral(hovered.value).format("0.00%")}
          </Typography.Text>{" "}
          <Typography.Text
            style={{
              color: CHART_COLORS[question.type][hovered.label],
            }}
          >
            ({numeral(hovered.value * total).format("0,0")})
          </Typography.Text>
        </TooltipContainer>
      )}
      <ChartSvg>
        <g ref={chartAreaRef} />
        <line
          x1={0}
          x2={width}
          y1={height - margin.bottom}
          y2={height - margin.bottom}
          strokeWidth={1}
          stroke={COLORS.primaryBlack}
        />
      </ChartSvg>
    </ChartContainer>
  )
}

export default VerticalBarChart
