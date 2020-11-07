import { isEmpty, isEqual } from "lodash"
import React from "react"
import { usePrevious } from "react-use"

import { db } from "../../firebase"

import { UserState } from "../../types/user"

const useSyncSavedViews = (userState: UserState) => {
  const prevUserState = usePrevious(userState)
  React.useEffect(() => {
    if (
      prevUserState &&
      !isEmpty(prevUserState.currentUser) &&
      !isEqual(prevUserState.currentUser, userState.currentUser)
    ) {
      db.collection("users").doc(userState.userId).set(userState.currentUser)
    }
  }, [userState, prevUserState])
}

export default useSyncSavedViews
