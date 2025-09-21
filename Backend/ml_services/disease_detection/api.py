from fastapi import FastAPI, UploadFile
from .predictor import predict_disease

app = FastAPI()

@app.post("/predict/")
async def predict(file: UploadFile):
    result = predict_disease(file.file)
    return result
