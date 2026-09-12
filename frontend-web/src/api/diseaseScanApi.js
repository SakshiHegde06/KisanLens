import client from "./client";

// Expected backend contract (matches DiseaseScanController):
// POST /scans/disease  multipart form: image
//   -> { id, disease, confidence, severity, treatment: { precautions: [], dosage: [], notes } }
// GET  /scans/disease        -> list of past disease scans for the logged-in user
// GET  /scans/disease/{id}   -> a single disease scan by id

export async function submitDiseaseScan(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await client.post("/scans/disease", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getDiseaseScanHistory() {
  const { data } = await client.get("/scans/disease");
  return data;
}

export async function getDiseaseScanById(id) {
  const { data } = await client.get(`/scans/disease/${id}`);
  return data;
}
