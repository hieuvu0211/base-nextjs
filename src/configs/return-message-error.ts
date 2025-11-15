/* eslint-disable @typescript-eslint/no-explicit-any */
//just for register contest - (axios - strapi)
export const HandleReturnMessgaeErrorAxios = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: { message?: string } } } }
    const { data } = axiosError.response || {}
    if (data?.error?.message == 'Username') {
      return 'username'
    }
    if (data?.error?.message == 'Email') {
      return 'email'
    }
    if (data?.error?.message == 'unknown') {
      return 'unknown'
    }
    return 'Account is already taken'
  } else if ((error as any)?.request) {
    return 'Cannot connect to server'
  } else {
    return 'Unknown error'
  }
}

export const HandleReturnMessgaeErrorLogin = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: { message?: string } } } }
    const { data } = axiosError.response || {}
    if (data?.error?.message) {
      console.log(data.error.message)
      return data.error.message.toString()
    }
    return data?.error?.message?.toString() || 'Unknown error'
  } else if ((error as any)?.request) {
    return 'Cannot connect to server'
  } else {
    return 'Unknown error'
  }
}
