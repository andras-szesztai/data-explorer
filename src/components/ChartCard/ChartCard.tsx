import React from "react"
import { Card, Select } from "antd"

import { AvailableQuestion } from "../../types/dataSets"

interface Props {
  dataSetState: any
  chart: AvailableQuestion
  chartState: { [key: number]: AvailableQuestion }
}

const ChartCard = ({
  dataSetState: { availableQuestions, availableGroups },
  chart,
  chartState
}: Props) => {
  const currSelectedQuestions = Object.values(chartState).map(d => d.question)

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
          onClear={() => console.log("clear")}
          onSelect={(e) => console.log(e)}
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
