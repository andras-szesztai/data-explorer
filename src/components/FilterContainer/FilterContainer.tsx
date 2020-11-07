import React from "react"
import { Select, Space, Card, Collapse, Badge, Tooltip } from "antd"
import { useMeasure } from "react-use"

import FilterCheckBoxGroup from "../FilterCheckBoxGroup/FilterCheckBoxGroup"

import { addFilter } from "../../actions/filtersActions"
import { FilterActions } from "../../reducers/filtersReducer"

import { FilterQuestion } from "../../types/filters"
import { AvailableQuestion } from "../../types/dataSets"
import { COLORS } from "../../constants/colors"
import { CHART_AREA_HEIGHT } from "../../constants/dimensions"

interface Props {
  availableQuestions: AvailableQuestion[]
  filterQuestions: FilterQuestion[]
  updateFilterState: React.Dispatch<FilterActions>
  availableGroups: string[]
}

const FilterContainer = ({
  availableQuestions,
  filterQuestions,
  updateFilterState,
  availableGroups,
}: Props) => {
  const [questionSearchRef, { height: questionSearchRefHeight }] = useMeasure<
    HTMLDivElement
  >()

  return (
    <Card
      style={{
        height: CHART_AREA_HEIGHT,
      }}
    >
      <div ref={questionSearchRef}>
        <Space
          direction="vertical"
          style={{
            width: "100%",
            marginBottom: 8,
          }}
        >
          <Select
            onChange={(value) => {
              const selectedQuestion = availableQuestions.find(
                (q: AvailableQuestion) => q.question === value
              )
              if (selectedQuestion) {
                updateFilterState(addFilter(selectedQuestion))
              }
            }}
            disabled={!availableQuestions.length}
            style={{ width: "100%" }}
            showSearch
            showArrow={false}
            placeholder={
              !availableQuestions.length
                ? "Select a dataset to start"
                : "Add a question as filter"
            }
            value={filterQuestions.length ? "" : undefined}
          >
            {availableGroups.map((group: string) => {
              return (
                <Select.OptGroup label={group} key={`${group}-chart-q`}>
                  {availableQuestions
                    .filter(
                      (question: AvailableQuestion) => question.group === group
                    )
                    .filter((question: AvailableQuestion) =>
                      filterQuestions.length
                        ? !filterQuestions.find((q) => q.id === question.id)
                        : true
                    )
                    .sort((a: AvailableQuestion, b: AvailableQuestion) =>
                      a.question.localeCompare(b.question)
                    )
                    .map((question: AvailableQuestion) => {
                      return (
                        <Select.Option
                          key={question.id}
                          value={question.question}
                        >
                          {question.question}
                        </Select.Option>
                      )
                    })}
                </Select.OptGroup>
              )
            })}
          </Select>
        </Space>
      </div>
      {!!filterQuestions.length && (
        <Collapse
          style={{
            maxHeight: CHART_AREA_HEIGHT - questionSearchRefHeight - 48,
            overflowY: "scroll",
            overflowX: "hidden",
            marginBottom: 8,
          }}
        >
          {filterQuestions.map((question) => {
            return (
              <Collapse.Panel
                key={question.id}
                header={
                  <>
                    <Badge
                      count={question.group}
                      style={{ backgroundColor: COLORS.primaryBlue }}
                    />{" "}
                    {question.question}{" "}
                    {question.options.length !==
                      question.checkedOptions.length && (
                      <Tooltip
                        placement="topLeft"
                        title="This question is actively filtering the dataset"
                      >
                        <Badge
                          count="Active"
                          style={{
                            backgroundColor: COLORS.secondaryOrange,
                          }}
                        />
                      </Tooltip>
                    )}
                  </>
                }
              >
                <FilterCheckBoxGroup
                  updateFilterState={updateFilterState}
                  question={question}
                />
              </Collapse.Panel>
            )
          })}
        </Collapse>
      )}
    </Card>
  )
}

export default FilterContainer
