import React from "react"
import { Card, Select } from "antd"
import { usePrevious } from "react-use"

import VerticalBarChart from "../VerticalBarChart/VerticalBarChart"

import { ChartActions } from "../../reducers/chartsReducer"
import {
  addChartQuestion,
  removeChartQuestion,
} from "../../actions/chartsActions"

import useUpdateChartData from "../../hooks/useUpdateChartData/useUpdateChartData"

import { AvailableQuestion, DataSetStatistics } from "../../types/dataSets"

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

  const chartData = useUpdateChartData({
    filteredDataSetStatistics,
    chart,
    prevChart,
    filteredDataSet,
  })

  const totalResp = filteredDataSetStatistics.find(
    (d: DataSetStatistics) => d.label === chart.group
  )?.value

  const isDisabled = !availableQuestions.length
  return (
    <Card
      bodyStyle={{
        height: "calc(100% - 64px)",
        padding: 12,
      }}
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
          value={chart.question}
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
                  .filter(
                    (q: AvailableQuestion) =>
                      !currSelectedQuestions.includes(q.question)
                  )
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
    >
      {!!chartData.length && (
        <VerticalBarChart data={chartData} question={chart} total={totalResp} />
      )}
    </Card>
  )
}

export default ChartCard
