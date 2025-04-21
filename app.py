import numpy as np
from flask import Flask, request, render_template
import pickle
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

# === Custom Unpickler for backward compatibility ===
class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == 'sklearn.linear_model.logistic':
            module = 'sklearn.linear_model._logistic'
        return super().find_class(module, name)

def load_model(path):
    with open(path, 'rb') as f:
        return CustomUnpickler(f).load()

# === Load models and vectorizer ===
model_dir = os.path.join('Resources', 'model_weights')
vectorizer_path = os.path.join('Resources', 'vectorizer', 'vectorizer.pkl')

model_EI = load_model(os.path.join(model_dir, 'model_EI.pkl'))
model_NS = load_model(os.path.join(model_dir, 'model_NS.pkl'))
model_FT = load_model(os.path.join(model_dir, 'model_FT.pkl'))
model_JP = load_model(os.path.join(model_dir, 'model_JP.pkl'))
vectorizer = load_model(vectorizer_path)

# === Routes ===
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def predict():
    userInput = request.form['text']

    if not userInput.strip():
        return render_template('index.html', prediction_text="Masukkan teks terlebih dahulu.")

    # === Text cleaning ===
    replacements = [
        (r"(http.*?\s)", " "),
        (r"[^\w\s]", " "),
        (r"\_", " "),
        (r"\d+", " ")
    ]
    for old, new in replacements:
        userInput = re.sub(old, new, userInput)
    userInput = [userInput]

    # === Vectorize text ===
    userInput_Vectorized = vectorizer.transform(userInput)

    # === Predict each MBTI axis ===
    prediction_EI = model_EI.predict(userInput_Vectorized)[0]
    prediction_NS = model_NS.predict(userInput_Vectorized)[0]
    prediction_FT = model_FT.predict(userInput_Vectorized)[0]
    prediction_JP = model_JP.predict(userInput_Vectorized)[0]

    # === Convert to MBTI type ===
    output_EI = 'E' if prediction_EI == 0 else 'I'
    output_NS = 'N' if prediction_NS == 0 else 'S'
    output_FT = 'F' if prediction_FT == 0 else 'T'
    output_JP = 'J' if prediction_JP == 0 else 'P'

    result = f"{output_EI}{output_NS}{output_FT}{output_JP}"

    return render_template('index.html', prediction_text=result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
