import React from "react"
import styled from "styled-components"
import uniq from "lodash/uniq"
import groupBy from "lodash/groupBy"
import sumBy from "lodash/sumBy"
import max from "lodash/max"
import { scaleBand, scaleLinear } from "d3-scale"
import { stack } from "d3-shape"
import { axisBottom } from "d3-axis"
import { select } from "d3-selection"
import "d3-transition"
import { useMeasure, usePrevious } from "react-use"

import { QUESTION_TYPES } from "../../constants/filterValues.ts"
import { CHART_DOMAINS } from "../../constants/chartDomains.ts"
import { CHART_COLORS } from "../../constants/colors.ts"
import { COLORS } from "../../constants/colors"

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

  const getXScale = () =>
    scaleBand()
      .domain(Object.keys(CHART_DOMAINS[question.type]))
      .range([margin.left, width - margin.right])
      .paddingInner(0.3)
      .paddingOuter(0.2)

  const isInitialized = React.useRef(false)
  React.useEffect(() => {
    if (!isInitialized.current && width && data) {
      isInitialized.current = true
      const xScale = getXScale()
      const yValues = Object.values(groupBy(data, "labelGroup")).map((d) =>
        sumBy(d, "value")
      )
      const yScale = scaleLinear()
        .domain([0, max(yValues)])
        .range([height - margin.bottom, margin.top])
      const xDomain = xScale.domain()
      let combinedStackedData = []
      xDomain.forEach((val) => {
        const stackGen = stack().keys(CHART_DOMAINS[question.type][val])
        const groupFiltered = data.filter((d) => d.labelGroup === val)
        let dataObj = { group: val }
        groupFiltered.forEach((d) => {
          dataObj = { ...dataObj, [d.label]: d.value }
        })
        combinedStackedData = [...combinedStackedData, stackGen([dataObj])]
      })
      select(chartAreaRef.current)
        .selectAll("g")
        .data(combinedStackedData, (d) => d.labelGroup)
        .enter()
        .append("g")
      select(chartAreaRef.current)
        .selectAll("g")
        .selectAll("rect")
        .data(
          (d) => d,
          (d) => d.label
        )
        .join((enter) =>
          enter
            .append("rect")
            .each((d) => console.log(d[0], yScale(d[0][0]), yScale(d[0][1])))
            .attr("fill", (d) => CHART_COLORS[question.type][d.key])
            .attr("x", (d) => xScale(d[0].data.group))
            .attr("width", xScale.bandwidth())
            .attr("y", (d) => yScale(d[0][1]))
            .attr("height", 10)
            .attr("height", (d) => yScale(d[0][0]) - yScale(d[0][1]))
            .call((enter) => enter)
        )
        select(chartAreaRef.current)
        .selectAll("text")
        .data(xDomain)
        .enter()
        .append("text")
        .attr("fill", COLORS.primaryGray)
        .attr("x", d => xScale(d) + xScale.bandwidth()/2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .text(d => d)
    }
  })

  const chartAreaRef = React.useRef()
  return (
    <ChartContainer ref={divRef}>
      <ChartSvg>
        <g
          ref={chartAreaRef}
        />
        <line
          x1={0}
          x2={width}
          y1={height-margin.bottom}
          y2={height-margin.bottom}
          strokeWidth={1}
          stroke={COLORS.primaryGray}
        />
      </ChartSvg>
    </ChartContainer>
  )
}

export default VerticalBarChart
