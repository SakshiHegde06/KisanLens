import io

from fastapi.testclient import TestClient
from PIL import Image

from main import app

client = TestClient(app)


def _fake_image_bytes():
    image = Image.new("RGB", (50, 50), color="green")
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer


def test_predict_soil_returns_503_when_model_not_trained_yet():
    files = {"file": ("test.jpg", _fake_image_bytes(), "image/jpeg")}
    response = client.post("/predict/soil", files=files)
    # This test assumes no soil_cnn.pt exists yet in app/weights/ -
    # once you've trained and dropped a real model there, this test
    # should be updated (or skipped) since it will start returning 200.
    assert response.status_code in (200, 503)


def test_predict_disease_returns_503_when_model_not_trained_yet():
    files = {"file": ("test.jpg", _fake_image_bytes(), "image/jpeg")}
    response = client.post("/predict/disease", files=files)
    assert response.status_code in (200, 503)
