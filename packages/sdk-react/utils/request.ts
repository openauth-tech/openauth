interface Params {
  [key: string]: any
}

interface Headers {
  [key: string]: string
}

export const get = async <T>(url: string, params: Params = {}, headers: Headers = {}): Promise<T> => {
  const queryString = new URLSearchParams(params).toString()
  const response = await fetch(`${url}?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const json = await response.json()

  if (json.success === false) {
    throw new Error(json.msg || json.message)
  }

  return json
}

export const post = async <T>(url: string, data: any = {}, headers: Headers = {}): Promise<T> => {
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const json = await response.json()

  if (json.success === false) {
    throw new Error(json.msg || json.message)
  }

  return json
}
