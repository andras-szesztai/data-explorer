import React from "react"
import { Modal } from "antd"

interface Props {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewSelectorModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  return (
    <Modal
      title="Select a saved view from your list:"
      centered
      visible={isModalOpen}
      okText="Select view"
      okButtonProps={{ disabled: false }}
      onOk={() => {
        console.log("selecting")
      }}
      onCancel={() => {
        setIsModalOpen(false)
      }}
    >
      Hello
    </Modal>
  )
}

export default ViewSelectorModal
