import { Readable } from "stream"

const isStream = !!process.env.STREAM_MODE_ENABLED

export const updateStream = (stream, data) => {
  if (!isStream) return
  stream.push(JSON.stringify(data))
  return
}

export const endStream = stream => {
  if (!isStream) return
  stream.push(null)
  return
}

export const initStream = res => {
  if (!isStream) return

  const stream = new Readable({
    read() {},
  })
  stream.pipe(res)
  return stream
}
