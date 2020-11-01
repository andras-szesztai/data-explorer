import React from "react"
import { Card, Select } from "antd"

import { ChartActions } from "../../reducers/chartsReducer"

import { AvailableQuestion } from "../../types/dataSets"
import {
  addChartQuestion,
  removeChartQuestion,
} from "../../actions/chartsActions"

interface Props {
  dataSetState: any
  chart: AvailableQuestion
  chartKey: number
  chartState: { [key: number]: AvailableQuestion }
  updateChartState: React.Dispatch<ChartActions>
}

const ChartCard = ({
  dataSetState: { availableQuestions, availableGroups, filteredDataSet },
  chart,
  chartKey,
  chartState,
  updateChartState,
}: Props) => {
  const currSelectedQuestions = Object.values(chartState).map((d) => d.question)

  const [ chartData, setChartData ] = React.useState([])

  // prepare dataset values, domain for chart
  
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
