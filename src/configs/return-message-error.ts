//just for register contest - (axios - strapi)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HandleReturnMessgaeErrorAxios = (error: any) => {
  if (error.response) {
    const { data } = error.response
    if (data.error.message == 'Username') {
      return 'username'
    }
    if (data.error.message == 'Email') {
      return 'email'
    }
    if (data.error.message == 'unknown') {
      return 'unknown'
    }
    return 'Account is already taken'
  } else if (error.request) {
    return 'Cannot connect to server'
  } else {
    return 'Unknown error'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HandleReturnMessgaeErrorLogin = (error: any) => {
  if (error.response) {
    const { data } = error.response
    if (!!data.error.message) {
      console.log(data.error.message)
      return data.error.message.toString()
    }
    return data.error.message.toString()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if (error.request) {
    return 'Cannot connect to server'
  } else {
    return 'Unknown error'
  }
}
