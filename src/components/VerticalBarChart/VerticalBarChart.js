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

import { CHART_DOMAINS } from "../../constants/chartDomains.ts"
import { CHART_COLORS } from "../../constants/colors.ts"
import { COLORS } from "../../constants/colors"
import { DURATION_MILLISECOND } from "../../constants/animations"
import { exit } from "process"
import { Badge } from "antd"

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
const margin = {
  top: 16,
  right: 0,
  bottom: 16,
  left: 0,
}

const VerticalBarChart = ({ data, question }) => {
  const [divRef, { width, height }] = useMeasure()
  const prevWidth = usePrevious(width)
  const prevData = usePrevious(data)

  const [hovered, setHovered] = React.useState(undefined)
  console.log(hovered)

  const createUpdateElements = () => {
    // TODO: chop it up
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
    select(chartAreaRef.current)
      .selectAll(".rect-group")
      .data(combinedStackedData)
      .enter()
      .append("g")
      .attr("class", "rect-group")
    select(chartAreaRef.current)
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
            .on("mouseover", (_, d) => console.log(yScale(d[0][1])))
            .on("mouseout", () => setHovered(undefined))
            .call((enter) => enter),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(DURATION_MILLISECOND.sm)
              .attr("x", (d) => xScale(d[0].data.group))
              .attr("width", xScale.bandwidth())
              .attr("y", (d) => yScale(d[0][1] || 0))
              .attr("height", (d) => yScale(d[0][0]) - yScale(d[0][1] || 0))
          ),
        (exit) => exit.remove()
      )
    select(chartAreaRef.current)
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
              .transition()
              .duration(DURATION_MILLISECOND.sm)
              .ease(easeCubicInOut)
              .attr("x", (d) => xScale(d.labelGroup) + xScale.bandwidth() / 2)
              .attr("y", (d) => yScale(d.value || 0))
              .text((d) => numeral(d.value || 0).format("0.0%"))
          ),
        (exit) => exit.remove()
      )
    select(chartAreaRef.current)
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
              .transition()
              .duration(DURATION_MILLISECOND.sm)
              .ease(easeCubicInOut)
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
          top: -8,
        }}
      >
        <Badge
          count={question.group}
          style={{
            backgroundColor: COLORS.primaryBlue,
          }}
        />
      </div>
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
