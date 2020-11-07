import React from "react"
import { Button, Card } from "antd"
import styled from "styled-components"
import { EyeFilled } from "@ant-design/icons"

import { UserStateContext } from "../../App"
import { updateAllFilters } from "../../actions/filtersActions"
import { FilterActions } from "../../reducers/filtersReducer"

import { SavedViewObject } from "../../types/user"

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
}

const projectAccessor = "samenHier"

const ViewSelector = ({
  setActiveViewName,
  activeViewName,
  activeDataSetName,
  prevActiveDataSetName,
  updateFilterState,
  prevActiveViewName
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)

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
            .sort((a: any, b: any) =>
              a.lastActive instanceof Date
                ? b.lastActive - a.lastActive
                : b.lastActive.toDate() - a.lastActive.toDate()
            )
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
  console.log("activeViewName", activeViewName)
  console.log("getQuickSelectorValue", getQuickSelectorValue())
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
                  // update current user obj
                  updateFilterState(updateAllFilters(viewFilters))
                  setActiveViewName(value)
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
            disabled={!activeDataSetName}
            // onClick={() => isNewView && setModalIsOpen(true)}
          >
            Show all saved views
          </Button>
        </ElementContainer>
      </MainContainer>
    </Card>
  )
}

export default ViewSelector
