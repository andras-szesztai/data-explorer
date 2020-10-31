import React, { useState, useEffect } from 'react'
import { CheckCircleFilled } from '@ant-design/icons'
import { notification } from 'antd'
import { usePrevious } from 'react-use'

import { db } from  '../../firebase'

import { updateActiveDataSet } from '../../actions/dataSetActions'
import { removeAllFilters } from '../../actions/filtersActions.ts'

import { COLORS } from '../../constants/colors.ts'
import { DURATION_SECOND } from '../../constants/animations.ts'

const useFetchActiveDataSet = (updateDataSetState, updateFilterState) => {
  const datasetUpdatedNotification = () => {
    const args = {
      message: 'Dataset has been updated!',
      duration: DURATION_SECOND.lg,
      icon: <CheckCircleFilled style={{ color: COLORS.primary }} />
    }
    notification.open(args)
  }

  const [activeDataSetName, setActiveDataSetName] = useState('')
  const prevActiveDataSetName = usePrevious(activeDataSetName)
  useEffect(() => {
    if (activeDataSetName && prevActiveDataSetName !== activeDataSetName) {
      const getActiveDataSet = async () => {
        const collection = await db
          .collection('datasets')
          .doc(activeDataSetName)
          .collection(activeDataSetName)
          .get()
        const document = await db
          .collection('datasets')
          .doc(activeDataSetName)
          .get()
        let newDataSet = []
        collection.forEach(d => {
          newDataSet = [...newDataSet, d.data()]
        })
        updateActiveDataSet(updateDataSetState, newDataSet, document.data().groups)
        updateFilterState(removeAllFilters())
        datasetUpdatedNotification()
      }
      getActiveDataSet()
    }
  }, [activeDataSetName])

  return setActiveDataSetName
}

export default useFetchActiveDataSet
