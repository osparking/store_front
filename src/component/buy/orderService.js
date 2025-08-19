import { api } from "../util/api";

export async function getSoapShapes() {
  try {
    const result = await api.get('/soap/shapes');
    return result.data;
  } catch (err) {
    throw err;
  }
}