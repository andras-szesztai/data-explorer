import { useEffect } from 'react'

import { db } from '../../firebase'

import { initializeAvailableDatasets } from '../../actions/dataSetActions'

const useInitializeAvailableDataSets = (availableDataSets, updateDataSetState) => {
  useEffect(() => {
    if (!availableDataSets.length) {
      const getDataSets = async () => {
        const datasets = await db.collection('datasets').get()
        let newDataSets = []
        datasets.forEach(d => {
          newDataSets = [...newDataSets, d.data().name]
        })
        initializeAvailableDatasets(updateDataSetState, newDataSets)
      }
      getDataSets()
    }
  })
}

export default useInitializeAvailableDataSets
