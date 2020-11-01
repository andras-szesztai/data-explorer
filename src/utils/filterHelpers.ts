import uniq from 'lodash/uniq'

export const getQuestionType = (answerOptions: string) => {
  const lowercaseOptions = answerOptions.toLowerCase()
  if (lowercaseOptions.includes('inaccurate')) {
    return 'accuracy'
  }
  if (lowercaseOptions.includes('dissatisfied')) {
    return 'satisfaction'
  }
  if (lowercaseOptions.includes('disagree')) {
    return 'agree'
  }
  if (lowercaseOptions.includes('selected')) {
    return 'selection'
  }
  if (lowercaseOptions.includes('fluent)')) {
    return 'language'
  }
  if (lowercaseOptions.includes('female')) {
    return 'sex'
  }
  if (lowercaseOptions.includes('yes')) {
    return 'boolean'
  }
  return false
}

export const getUniqIdsLength = (data: any[], type: string) => {
  return uniq(data.map(d => d[`Respondent ID - ${type}`])).filter(Boolean).length
}

export const getStatistics = (availableGroups: string[], dataSet: any[]) => {
  const statistics = availableGroups.map(type => ({
    label: type,
    value: getUniqIdsLength(dataSet, type)
  }))
  return statistics
}
