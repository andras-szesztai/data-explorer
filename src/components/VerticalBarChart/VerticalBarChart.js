import React from "react"
import styled from "styled-components"
import uniq from "lodash/uniq"
import { scaleBand, scaleLinear } from "d3-scale"
import { stack } from "d3-shape"
import { axisBottom } from "d3-axis"
import "d3-transition"
import { useMeasure, usePrevious } from "react-use"

import { QUESTION_TYPES } from "../../constants/filterValues.ts"

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  border: 1px solid black;
`

const ChartSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
`
const margin = {
  top: 10,
  right: 0,
  bottom: 16,
  left: 0,
}

const VerticalBarChart = ({ data, question }) => {
  const [divRef, { width }] = useMeasure()
  const prevWidth = usePrevious(width)

  const getXScale = () =>
    scaleBand()
      .domain(uniq(data.map((d) => d.labelGroup)))
      .range([margin.left, width - margin.right])
      .padding(0.1)

  const isInitialized = React.useRef(false)
  React.useEffect(() => {
    if (!isInitialized.current && width && data) {
      const xScale = getXScale()
      const xDomain = xScale.domain()
      let formattedData = []
      xDomain.forEach((group) => {
        let labelObj = {}
        const filtered = data.filter((d) => d.labelGroup === group)
        filtered.forEach((d) => {
          labelObj = { ...labelObj, [d.label]: d.value }
        })
        formattedData = [...formattedData, { group: group, ...labelObj }]
      })
      const stackGen = stack().keys(QUESTION_TYPES[question.type])
      const stackedData = stackGen(formattedData)
      console.log("VerticalBarChart -> stackedData", stackedData)
    }
  }, [width, data])

  return (
    <ChartContainer ref={divRef}>
      <ChartSvg />
    </ChartContainer>
  )
}

export default VerticalBarChart
