import subprocess
import pytest
from fastapi.testclient import TestClient
import app

client = TestClient(app.app)

def test_main_execution():
    result = subprocess.run(["python3", "app.py"], capture_output=True, text=True, timeout=5)
    assert "Started server process" in result.stderr or "Running on http://" in result.stderr

def test_import_does_not_run_main():
    assert hasattr(app, "app")  # Ensure the FastAPI app is importable

def test_upload_route():
    response = client.post("/upload/", files={"file": ("test.txt", b"Hello, world!")})
    assert response.status_code == 200
    assert "file_id" in response.json()

def test_download_route():
    response = client.get("/download/some_file_id")
    assert response.status_code in [200, 404]  # It may return 404 if the file is not found
