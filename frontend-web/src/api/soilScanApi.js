import client from "./client";

// Expected backend contract (matches SoilScanController):
// POST /scans/soil  multipart form: image, latitude, longitude
//   -> { id, soilType, confidence, weather: {...}, crops: [{ name, score }] }
// GET  /scans/soil        -> list of past soil scans for the logged-in user
// GET  /scans/soil/{id}   -> a single soil scan by id

export async function submitSoilScan(imageFile, latitude, longitude) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  const { data } = await client.post("/scans/soil", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getSoilScanHistory() {
  const { data } = await client.get("/scans/soil");
  return data;
}

export async function getSoilScanById(id) {
  const { data } = await client.get(`/scans/soil/${id}`);
  return data;
}
