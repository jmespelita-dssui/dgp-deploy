import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  asideShow: false,
  theme: 'default',
  notifications: [],
  notifCount: 0,
}

const changeState = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

const store = createStore(changeState)

export default store
