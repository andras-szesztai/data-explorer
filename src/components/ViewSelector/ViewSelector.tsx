import { Button, Card } from "antd"
import React from "react"
import styled from "styled-components"
import { UserStateContext } from "../../App"

const MainContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-column-gap: 8px;
`

const ElementContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

interface Props {
  setActiveViewName: React.Dispatch<React.SetStateAction<string>>
  activeViewName: string
  activeDataSetName: string
}

const ViewSelector = ({
  setActiveViewName,
  activeViewName,
  activeDataSetName,
}: Props) => {
  const { currentUser } = React.useContext(UserStateContext)

  console.log("ViewSelector -> currentUser", currentUser)

  return (
    <Card
      style={{
        height: "100%",
      }}
      bodyStyle={{
        height: "100%",
        padding: 12,
      }}
    >
      <MainContainer>
        <ElementContainer>Your most recently active view:</ElementContainer>
        <ElementContainer>
          {activeViewName ? (
            <Button
              block
              type="primary"
              // onClick={() => isNewView && setModalIsOpen(true)}
            >
              {activeViewName}
            </Button>
          ) : (
            "You haven't yet saved views for this dataset"
          )}
        </ElementContainer>
        <ElementContainer>More views</ElementContainer>
      </MainContainer>
    </Card>
  )
}

export default ViewSelector
