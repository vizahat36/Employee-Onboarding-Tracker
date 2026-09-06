export function getApiErrorMessage(error) {
  if (!error) {
    return 'Something went wrong.'
  }

  if (!error.response) {
    return error.request
      ? 'Unable to reach the server. Please try again.'
      : error.message || 'Something went wrong.'
  }

  const { status, data } = error.response

  if (status === 401) {
    return 'Your session has expired. Please log in again.'
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }
  if (status === 404) {
    return 'The requested resource was not found.'
  }

  if (data && typeof data === 'object') {
    const messages = []

    Object.entries(data).forEach(([field, value]) => {
      const text = Array.isArray(value) ? value.join(' ') : value
      if (field === 'non_field_errors') {
        messages.push(String(text))
      } else {
        messages.push(`${field}: ${text}`)
      }
    })

    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  if (typeof data === 'string' && data) {
    return data
  }

  return 'The request could not be completed. Please try again.'
}