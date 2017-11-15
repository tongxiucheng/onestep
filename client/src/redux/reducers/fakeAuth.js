import isEmpty from 'lodash/fp/isEmpty'

const initialState = {
  isAuthenticated: false,
  currentUser: {}
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'AUTH_USER':
      return {
        isAuthenticated: !isEmpty(action.userInfo),
        currentUser: action.userInfo
      }
    case 'SIGN_UP':
      return {
        isAuthenticated: !isEmpty(action.userInfo),
        currentUser: action.userInfo
      }
    case 'LOG_OUT':
      return {
        isAuthenticated: false,
        currentUser: {}
      }
    case 'FAKE_WECHATCODE_LOGIN':
      return {
        isAuthenticated: !isEmpty(action.userInfo),
        currentUser: action.userInfo
      }
    case 'TOKEN_IS_VALID':
      return {
        ...state,
        isAuthenticated: action.success
      }
    case 'TOKEN_IS_INVALID':
      return {
        ...state,
        isAuthenticated: false
      }
    default:
      return state
  }
}