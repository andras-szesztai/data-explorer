import React from "react"
import { Button, Card } from "antd"
import styled from "styled-components"
import { EyeFilled } from "@ant-design/icons"

import { UserStateContext } from "../../App"

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
  activeDataSetName: string
  prevActiveDataSetName?: string
}

const projectAccessor = "samenHier"

const ViewSelector = ({
  setActiveViewName,
  activeViewName,
  activeDataSetName,
  prevActiveDataSetName,
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)

  const [dataSetViews, setDataSetViews] = React.useState([] as string[])
  React.useEffect(() => {
    if (activeDataSetName && activeDataSetName !== prevActiveDataSetName) {
      const allViews = Object.values(currentUser[projectAccessor].savedViews)
      const dataSetFilteredViews = allViews.filter(
        (v) => v && v.dataSet === activeDataSetName
      )
      const lastActiveSorted = dataSetFilteredViews.length
        ? dataSetFilteredViews
            .sort(
              (a: any, b: any) => b.lastActive.toDate() - a.lastActive.toDate()
            )
            .map((v: SavedViewObject) => v.title)
        : []
      setDataSetViews(lastActiveSorted)
    }
  }, [activeDataSetName, prevActiveDataSetName, currentUser])
  console.log("dataSetViews", dataSetViews)

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
        <ElementContainer justify="flex-start">
          {activeViewName || dataSetViews.length > 1 ? (
            <Button
              icon={<EyeFilled />}
              // onClick={() => isNewView && setModalIsOpen(true)}
            >
              {activeViewName && dataSetViews.length > 1
                ? dataSetViews[1]
                : activeViewName || dataSetViews[0]}
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
