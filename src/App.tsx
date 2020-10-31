import React from "react"
import {
  Select,
  Space,
  Card,
  Radio,
  Collapse,
  Badge,
  Tooltip,
  Row,
  Col,
  Statistic,
} from "antd"
import styled from "styled-components"
import { useMeasure, usePrevious } from "react-use"
import isEqual from "lodash/isEqual"
import numeral from "numeral"

import FilterCheckBoxGroup from "./components/FilterCheckBoxGroup/FilterCheckBoxGroup"
import DataSetSelector from "./components/DataSetSelector/DataSetSelector"

import { addFilter } from "./actions/filtersActions"
import { updateFilteredDataSet } from "./actions/dataSetActions"
import { dataSetReducer, initialDataSetState } from "./reducers/dataSetReducer"
import { filtersReducer, initialFiltersState } from "./reducers/filtersReducer"

import { useInitializeAvailableDataSets } from "./hooks"
import { COLORS } from "./constants/colors"
import { CHART_AREA_HEIGHT } from "./constants/dimensions"
import { AvailableQuestion } from "./types/dataSets"

import "./styles/App.css"

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
  user-select: none;
`

const App = () => {
  const [dataSetState, updateDataSetState] = React.useReducer(
    dataSetReducer,
    initialDataSetState
  )
  const prevDataSetState = usePrevious(dataSetState)
  const [filterState, updateFilterState] = React.useReducer(
    filtersReducer,
    initialFiltersState
  )
  const prevFilterState = usePrevious(filterState)

  const [questionSearchRef, { height: questionSearchRefHeight }] = useMeasure<
    HTMLDivElement
  >()

  useInitializeAvailableDataSets(
    dataSetState.availableDataSets,
    updateDataSetState
  )

  // TODO: Hook
  React.useEffect(() => {
    if (prevFilterState && !isEqual(filterState, prevFilterState)) {
      updateFilteredDataSet(
        updateDataSetState,
        dataSetState.activeDataSet,
        filterState.filterQuestions,
        dataSetState.availableGroups
      )
    }
  }, [filterState, prevFilterState])

  const [currentGroup, setCurrentGroup] = React.useState("")
  React.useEffect(() => {
    if (
      prevDataSetState &&
      !isEqual(prevDataSetState.availableGroups, dataSetState.availableGroups)
    ) {
      setCurrentGroup(dataSetState.availableGroups[0])
    }
  })

  return (
    <MainContainer>
      <Row gutter={[16, 16]}>
        <Col className="gutter-row" span={6}>
          <DataSetSelector
            dataSetState={dataSetState}
            updateDataSetState={updateDataSetState}
            updateFilterState={updateFilterState}
          />
        </Col>
        <Col className="gutter-row" span={18}>
          <Card
            style={{
              height: "100%",
              paddingTop: 12,
            }}
          >
            <Row gutter={8}>
              <Col span={1} />
              {!!dataSetState.activeDataSetStatistics.length &&
                dataSetState.activeDataSetStatistics.map(
                  (type: { label: string; value: number }, i: number) => {
                    const filtered = dataSetState.filteredDataSetStatistics[i]
                    const percentage = filtered.value / type.value
                    return (
                      <React.Fragment key={type.label}>
                        <Col span={5}>
                          <Statistic
                            title={`${type.label} Total`}
                            value={type.value}
                          />
                        </Col>
                        <Col span={5}>
                          <Statistic
                            title="Filtered"
                            value={`${filtered.value} (${numeral(
                              percentage
                            ).format(
                              percentage === 1
                                ? "0%"
                                : percentage < 0.1
                                ? "0.00%"
                                : "0.0%"
                            )})`}
                          />
                        </Col>
                        {i === 0 && <Col span={2} />}
                      </React.Fragment>
                    )
                  }
                )}
              <Col span={1} />
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col className="gutter-row" span={6}>
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
                {currentGroup && (
                  <Radio.Group
                    options={dataSetState.availableGroups.map(
                      (type: string) => ({ value: type, label: type })
                    )}
                    onChange={(e) => setCurrentGroup(e.target.value)}
                    value={currentGroup}
                    optionType="button"
                    buttonStyle="solid"
                  />
                )}
                <Select
                  onChange={(value) => {
                    const selectedQuestion = dataSetState.availableQuestions.find(
                      (q: AvailableQuestion) => q.question === value
                    )
                    updateFilterState(addFilter(selectedQuestion))
                  }}
                  disabled={!dataSetState.availableQuestions.length}
                  style={{ width: "100%" }}
                  showSearch
                  showArrow={false}
                  placeholder="Add a question as filter"
                  value={filterState.filterQuestions.length ? "" : undefined}
                >
                  {dataSetState.availableQuestions.length &&
                    dataSetState.availableQuestions
                      .filter((question: AvailableQuestion) =>
                        dataSetState.availableGroups.length > 1
                          ? question.group === currentGroup
                          : true
                      )
                      .filter((question: AvailableQuestion) =>
                        filterState.filterQuestions.length
                          ? !filterState.filterQuestions.find(
                              (q) => q.id === question.id
                            )
                          : true
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
                </Select>
              </Space>
            </div>
            {!!filterState.filterQuestions.length && (
              <Collapse
                style={{
                  maxHeight: CHART_AREA_HEIGHT - questionSearchRefHeight - 48,
                  overflowY: "scroll",
                  overflowX: "hidden",
                  marginBottom: 8,
                }}
              >
                {filterState.filterQuestions.map((question) => {
                  return (
                    <Collapse.Panel
                      key={question.id}
                      header={
                        <>
                          <Badge
                            count={question.group}
                            style={{ backgroundColor: COLORS.primary }}
                          />{" "}
                          {question.question}{" "}
                          {question.options.length !==
                            question.checkedOptions.length && (
                            <Tooltip
                              placement="topLeft"
                              title="This question is actively filtering the dataset"
                            >
                              <Badge count="Active" />
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
        </Col>
        <Col className="gutter-row" span={18}>
          <Card
            style={{
              height: "100%",
              position: "relative",
            }}
          ></Card>
        </Col>
      </Row>
    </MainContainer>
  )
}

export default App
