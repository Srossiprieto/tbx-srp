const API_BASE = process.env.API_URL || 'http://localhost:3000'

function buildUrl (path, params = {}) {
  const url = new URL(path, API_BASE)
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value)
  })
  return url.toString()
}

export async function fetchFilesData (fileName) {
  const res = await fetch(buildUrl('/files/data', { fileName }))
  if (!res.ok) throw new Error(`Error ${res.status} al obtener los datos`)
  return res.json()
}

export async function fetchFilesList () {
  const res = await fetch(buildUrl('/files/list'))
  if (!res.ok) throw new Error(`Error ${res.status} al obtener la lista`)
  const data = await res.json()
  return data.files || []
}
