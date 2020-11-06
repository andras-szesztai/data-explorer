export const LOGIN_USER = "LOGIN_USER"

export const loginUser = (id: string) => {
  return { type: LOGIN_USER, payload: id } as const
}

// export const removeFilter = (questionId: string) => {
//   return { type: REMOVE_FILTER, questionToRemove: questionId } as const
// }