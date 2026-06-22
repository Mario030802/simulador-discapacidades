import axios from "axios";

export async function fetchPage(url: string) {
  const response = await axios.get(url);

  return response.data;
}