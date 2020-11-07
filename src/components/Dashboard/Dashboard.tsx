import React from "react"
import { Select, Space, Card, Collapse, Badge, Tooltip, Row, Col } from "antd"
import styled from "styled-components"
import { useMeasure, usePrevious } from "react-use"

import FilterCheckBoxGroup from "../FilterCheckBoxGroup/FilterCheckBoxGroup"
import DataSetSelector from "../DataSetSelector/DataSetSelector"
import ChartCard from "../ChartCard/ChartCard"
import ViewSelector from "../ViewSelector/ViewSelector"
import SaveView from "../SaveView/SaveView"
import StatisticsContainer from "../StatisticsContainer/StatisticsContainer"

import { addFilter } from "../../actions/filtersActions"
import {
  dataSetReducer,
  initialDataSetState,
} from "../../reducers/dataSetReducer"
import {
  filtersReducer,
  initialFiltersState,
} from "../../reducers/filtersReducer"
import { chartsReducer, initialChartsState } from "../../reducers/chartsReducer"

import {
  useInitializeAvailableDataSets,
  useUpdateFilteredDataSet,
} from "../../hooks"
import { COLORS } from "../../constants/colors"
import { CHART_AREA_HEIGHT } from "../../constants/dimensions"
import { AvailableQuestion } from "../../types/dataSets"

import "../../styles/App.less"
import useEmptyActiveViewName from "../../hooks/useEmptyActiveViewName/useEmptyActiveViewName"

const ChartsMainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 32%);
  grid-column-gap: 2%;
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 8px;
`

const Dashboard = () => {
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
  const [chartState, updateChartState] = React.useReducer(
    chartsReducer,
    initialChartsState
  )
  const prevChartState = usePrevious(chartState)
  const [activeViewName, setActiveViewName] = React.useState("")
  const prevActiveViewName = usePrevious(activeViewName)

  const [questionSearchRef, { height: questionSearchRefHeight }] = useMeasure<
    HTMLDivElement
  >()

  useInitializeAvailableDataSets(
    dataSetState.availableDataSets,
    updateDataSetState
  )
  useUpdateFilteredDataSet({
    prevFilterState,
    updateDataSetState,
    filterState,
    activeDataSet: dataSetState.activeDataSet,
    filterQuestions: filterState.filterQuestions,
    availableGroups: dataSetState.availableGroups,
  })
  useEmptyActiveViewName({
    activeViewName,
    setActiveViewName,
    prevActiveViewName,
    prevChartState,
    chartState,
  })

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <DataSetSelector
            dataSetState={dataSetState}
            updateDataSetState={updateDataSetState}
            updateFilterState={updateFilterState}
            updateChartState={updateChartState}
          />
        </Col>
        <Col span={18}>
          <StatisticsContainer
            activeDataSetStatistics={dataSetState.activeDataSetStatistics}
            filteredDataSetStatistics={dataSetState.filteredDataSetStatistics}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
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
                    const selectedQuestion = dataSetState.availableQuestions.find(
                      (q: AvailableQuestion) => q.question === value
                    )
                    updateFilterState(addFilter(selectedQuestion))
                  }}
                  disabled={!dataSetState.availableQuestions.length}
                  style={{ width: "100%" }}
                  showSearch
                  showArrow={false}
                  placeholder={
                    !dataSetState.availableQuestions.length
                      ? "Select a dataset to start"
                      : "Add a question as filter"
                  }
                  value={filterState.filterQuestions.length ? "" : undefined}
                >
                  {dataSetState.availableGroups.map((group: string) => {
                    return (
                      <Select.OptGroup label={group} key={`${group}-chart-q`}>
                        {dataSetState.availableQuestions
                          .filter(
                            (question: AvailableQuestion) =>
                              question.group === group
                          )
                          .filter((question: AvailableQuestion) =>
                            filterState.filterQuestions.length
                              ? !filterState.filterQuestions.find(
                                  (q) => q.id === question.id
                                )
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
        </Col>
        <Col span={18}>
          <Card
            style={{
              height: "100%",
            }}
            bodyStyle={{
              height: "100%",
            }}
          >
            <ChartsMainContainer>
              {Object.values(chartState).map((chart, i: number) => {
                return (
                  <ChartCard
                    key={i}
                    chartKey={i + 1}
                    chart={chart}
                    dataSetState={dataSetState}
                    chartState={chartState}
                    updateChartState={updateChartState}
                  />
                )
              })}
            </ChartsMainContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <SaveView
            dataSetState={dataSetState}
            prevDataSetState={prevDataSetState}
            chartState={chartState}
            prevChartState={prevChartState}
            filterState={filterState}
            prevFilterState={prevFilterState}
            setActiveViewName={setActiveViewName}
            activeViewName={activeViewName}
          />
        </Col>
        <Col span={18}>
          <ViewSelector
            setActiveViewName={setActiveViewName}
            activeViewName={activeViewName}
            prevActiveViewName={prevActiveViewName}
            activeDataSetName={dataSetState.activeDataSetName}
            prevActiveDataSetName={prevDataSetState?.activeDataSetName}
            updateFilterState={updateFilterState}
            updateChartState={updateChartState}
          />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
