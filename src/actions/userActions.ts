export const LOGIN_USER = "LOGIN_USER"

export const loginUser = () => {
  return { type: LOGIN_USER } as const
}

// export const removeFilter = (questionId: string) => {
//   return { type: REMOVE_FILTER, questionToRemove: questionId } as const
// }