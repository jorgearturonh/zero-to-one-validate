import axios from "axios"

export default async function makeSerperRequest(query) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://google.serper.dev/search",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      q: query,
    }),
  }
  try {
    const response = await axios.request(config)
    return response.data.organic
  } catch (error) {
    console.log(error)
  }
}
