import axios, { HttpStatusCode } from "axios";
import { api } from "../util/api";
import { callWithToken } from "../util/api";

const prefix = "http://localhost:9193/api/s1";

export async function deleteStoredIngre(ingId) {
  try {
    var url = `/store_ingred/${ingId}/delete`;
    const result = await callWithToken("delete", url);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllPackUnits() {
  try {
    const result = await callWithToken("get", "/store_ingred/get_packunits");
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllBuyLinks() {
  try {
    const result = await callWithToken("get", "/store_ingred/get_buy_places");
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllIngreNames() {
  try {
    const result = await callWithToken("get", "/store_ingred/get_all_names");
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getIngredientList() {
  try {
    const result = await callWithToken("get", "/store_ingred/get_all");
    return result ? result.data : result;
  } catch (err) {
    throw err;
  }
}

export async function sendStoIngInfo(ingredient) {
  try {
    var url = "/store_ingred/add";
    const result = await callWithToken("post", url, ingredient);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getAllDept() {
  try {
    const result = await api.get("/worker/get_all_dept");
    return result.data;
  } catch (err) {
    throw err;
  }
}
