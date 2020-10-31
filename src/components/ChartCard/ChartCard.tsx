import React from "react"
import { Card, Select } from "antd"

import { ChartValueObject } from "../../types/charts"
import { AvailableQuestion } from "../../types/dataSets"

interface Props {
  dataSetState: any
  chart: ChartValueObject
}

const ChartCard = ({ dataSetState, chart }: Props) => {
  console.log(chart)

  const isDisabled = !dataSetState.availableQuestions.length
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
          {dataSetState.availableGroups.map((group: string) => {
            return (
              <Select.OptGroup label={group} key={`${group}-chart-q`}>
                {dataSetState.availableQuestions
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
