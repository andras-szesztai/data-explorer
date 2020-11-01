import React from "react"
import { Card, Select } from "antd"
import { usePrevious } from "react-use"
import isEqual from "lodash/isEqual"
import isEmpty from "lodash/isEmpty"

import { ChartActions } from "../../reducers/chartsReducer"
import {
  addChartQuestion,
  removeChartQuestion,
} from "../../actions/chartsActions"

import { QUESTION_TYPES } from "../../constants/filterValues"
import { AvailableQuestion, DataSetStatistics } from "../../types/dataSets"
import { CHART_DOMAINS } from "../../constants/chartDomains"
import { getUniqIdsLength } from "../../utils/filterHelpers"
import { ChartDataObject } from "../../types/charts"
import useUpdateChartData from "../../hooks/useUpdateChartData/useUpdateChartData"

interface Props {
  dataSetState: any
  chart: AvailableQuestion
  chartKey: number
  chartState: { [key: number]: AvailableQuestion }
  updateChartState: React.Dispatch<ChartActions>
}

const ChartCard = ({
  dataSetState: {
    availableQuestions,
    availableGroups,
    filteredDataSet,
    filteredDataSetStatistics,
  },
  chart,
  chartKey,
  chartState,
  updateChartState,
}: Props) => {
  const currSelectedQuestions = Object.values(chartState).map((d) => d.question)
  const prevChart = usePrevious(chart)
  const prevFilteredDataSet = usePrevious(filteredDataSet)

  const chartData = useUpdateChartData({
    filteredDataSetStatistics,
    chart,
    prevChart,
    filteredDataSet,
    prevFilteredDataSet,
  })

  console.log("chartData", chartData)
  const isDisabled = !availableQuestions.length
  return (
    <Card
      title={
        <Select
          style={{
            width: "100%",
          }}
          showSearch
          allowClear
          placeholder={
            isDisabled ? "Select a dataset to start" : "Add a question as chart"
          }
          disabled={isDisabled}
          onClear={() => updateChartState(removeChartQuestion(chartKey))}
          onSelect={(e) => {
            updateChartState(
              addChartQuestion(
                availableQuestions.find(
                  (q: AvailableQuestion) => q.question === e
                ),
                chartKey
              )
            )
          }}
        >
          {availableGroups.map((group: string) => {
            return (
              <Select.OptGroup label={group} key={`${group}-chart-q`}>
                {availableQuestions
                  .filter((q: AvailableQuestion) => q.group === group && q.type)
                  .sort((a: AvailableQuestion, b: AvailableQuestion) =>
                    a.question.localeCompare(b.question)
                  )
                  .map((q: AvailableQuestion) => (
                    <Select.Option key={`${q.id}-chart`} value={q.question}>
                      {q.question}
                    </Select.Option>
                  ))}
              </Select.OptGroup>
            )
          })}
        </Select>
      }
    />
  )
}

export default ChartCard
