from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image
import io

# Load the trained model
model = tf.keras.models.load_model('digit_classifier.h5')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the image data from the request
    image_data = request.files['digit'].read()
    image = Image.open(io.BytesIO(image_data)).convert('L')  # Convert to grayscale
    image = image.resize((28, 28))  # Resize to 28x28
    image = np.array(image) / 255.0  # Normalize
    image = image.reshape(1, 28, 28, 1)  # Add batch dimension

    # Predict the digit
    prediction = model.predict(image)
    predicted_label = int(np.argmax(prediction))

    return jsonify({'digit': predicted_label})

if __name__ == '__main__':
    app.run(debug=True)
