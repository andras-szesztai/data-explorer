import React from "react"
import { Button, Card } from "antd"
import styled from "styled-components"
import { EyeFilled } from "@ant-design/icons"

import { UserDispatchContext, UserStateContext } from "../../App"
import { updateAllFilters } from "../../actions/filtersActions"
import { updateViewLastActive } from "../../actions/userActions"
import { updateAllCharts } from "../../actions/chartsActions"
import { FilterActions } from "../../reducers/filtersReducer"
import { ChartActions } from "../../reducers/chartsReducer"

import { SavedViewObject } from "../../types/user"
import ViewSelectorModal from "../ViewSelectorModal/ViewSelectorModal"

const MainContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 32%);
  grid-column-gap: 2%;
`

const ElementContainer = styled.div`
  display: flex;
  justify-content: ${(props: { justify?: string }) =>
    props.justify || "center"};
  align-items: center;
`

interface Props {
  setActiveViewName: React.Dispatch<React.SetStateAction<string>>
  activeViewName: string
  prevActiveViewName?: string
  activeDataSetName: string
  prevActiveDataSetName?: string
  updateFilterState: React.Dispatch<FilterActions>
  updateChartState: React.Dispatch<ChartActions>
}

const projectAccessor = "samenHier"

const ViewSelector = ({
  setActiveViewName,
  activeViewName,
  activeDataSetName,
  prevActiveDataSetName,
  updateFilterState,
  prevActiveViewName,
  updateChartState
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)
  const updateUserState = React.useContext(UserDispatchContext)

  const [dataSetViews, setDataSetViews] = React.useState([] as string[])
  React.useEffect(() => {
    if (
      (activeDataSetName && activeDataSetName !== prevActiveDataSetName) ||
      (activeViewName && activeViewName !== prevActiveViewName)
    ) {
      const allViews = Object.values(currentUser[projectAccessor].savedViews)
      const dataSetFilteredViews = allViews.filter(
        (v) => v && v.dataSet === activeDataSetName
      )
      const lastActiveSorted = dataSetFilteredViews.length
        ? dataSetFilteredViews
            .sort((a: any, b: any) => {
              let aValue =
                a.lastActive instanceof Date
                  ? a.lastActive
                  : a.lastActive.toDate()
              let bValue =
                b.lastActive instanceof Date
                  ? b.lastActive
                  : b.lastActive.toDate()
              return bValue - aValue
            })
            .map((v: SavedViewObject) => v.title)
        : []
      setDataSetViews(lastActiveSorted)
    }
    if (prevActiveDataSetName && !activeDataSetName) {
      setDataSetViews([])
    }
  }, [
    activeDataSetName,
    prevActiveDataSetName,
    currentUser,
    activeViewName,
    prevActiveViewName,
  ])

  const getQuickSelectorValue = () =>
    activeViewName && dataSetViews.length > 1
      ? dataSetViews.find((d) => d !== activeViewName)
      : activeViewName || dataSetViews[0]

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <Card
      style={{
        height: "100%",
      }}
      bodyStyle={{
        height: "100%",
        padding: "12px 24px",
      }}
    >
      <MainContainer>
        <ElementContainer>Your most recently active view:</ElementContainer>
        <ElementContainer
          justify={
            activeViewName || dataSetViews.length > 1 ? "flex-start" : ""
          }
        >
          {activeViewName || dataSetViews.length > 1 ? (
            <Button
              icon={<EyeFilled />}
              onClick={() => {
                const value = getQuickSelectorValue()
                if (value) {
                  const view =
                    currentUser[projectAccessor].savedViews[
                      `${activeDataSetName} - ${value}`
                    ]
                  const viewFilters = JSON.parse(view.filters)
                  const viewCharts = JSON.parse(view.charts)
                  updateFilterState(updateAllFilters(viewFilters))
                  updateChartState(updateAllCharts(viewCharts))
                  setActiveViewName(value)
                  updateUserState(
                    updateViewLastActive(
                      `${activeDataSetName} - ${value}`,
                      projectAccessor
                    )
                  )
                }
              }}
            >
              {getQuickSelectorValue()}
            </Button>
          ) : !activeDataSetName ? (
            "Select a dataset or saved view first"
          ) : (
            "You haven't yet saved views for this dataset"
          )}
        </ElementContainer>
        <ElementContainer>
          <Button
            type="primary"
            block
            icon={<EyeFilled />}
            disabled={!dataSetViews.length}
            onClick={() => !!dataSetViews.length && setIsModalOpen(true)}
          >
            Show all saved views
          </Button>
        </ElementContainer>
        <ViewSelectorModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </MainContainer>
    </Card>
  )
}

export default ViewSelector
