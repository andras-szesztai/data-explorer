import { message } from "antd"
import { useEffect } from "react"
import isEmpty from "lodash/isEmpty"

import { db } from "../../firebase"

import { addCurrentUser } from "../../actions/userActions"
import { UserActions } from "../../reducers/userReducer"

import { CurrentUserObject, SavedViewObject, UserState } from "../../types/user"

interface Params {
  userState: UserState
  updateUserState: React.Dispatch<UserActions>
}

const useInitializeUser = ({ userState, updateUserState }: Params) => {
  useEffect(() => {
    const getUserObject = async () => {
      try {
        const doc = db.collection("users").doc(userState.userId)
        const user = await doc.get()
        if (user.exists) {
          const currentUser = user.data()
          if (currentUser) {
            updateUserState(addCurrentUser(currentUser as CurrentUserObject))
          }
        } else {
          const newUser = {
            id: userState.userId,
            samenHier: {
              savedViews: {} as { [title: string]: SavedViewObject },
            },
          }
          doc.set(newUser)
          updateUserState(addCurrentUser(newUser))
        }
      } catch (err) {
        message.error(err.message)
      }
    }
    if (userState.userId && isEmpty(userState.currentUser)) {
      getUserObject()
    }
  }, [userState, updateUserState])
}

export default useInitializeUser
