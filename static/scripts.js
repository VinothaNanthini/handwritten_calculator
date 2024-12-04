const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clear");
const predictBtn = document.getElementById("predict");
const resultDiv = document.getElementById("result");

let drawing = false;

// Initialize canvas with a white background
function initializeCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
initializeCanvas();

// Event listeners for drawing
canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(event) {
  if (!drawing) return; // Stop if not drawing
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(event.offsetX, event.offsetY, 8, 0, 2 * Math.PI);
  ctx.fill();
}

// Clear the canvas and reset results
clearBtn.addEventListener("click", () => {
  initializeCanvas();
  resultDiv.innerText = "";
});

// Predict the digit
predictBtn.addEventListener("click", async () => {
  // Convert the canvas content to an image blob
  const dataURL = canvas.toDataURL("image/png");
  const blob = await fetch(dataURL).then((res) => res.blob());

  // Prepare the form data
  const formData = new FormData();
  formData.append("digit", blob);

  try {
    // Send the image to the server
    const response = await fetch("/predict", { method: "POST", body: formData });
    if (!response.ok) throw new Error("Prediction failed");

    const result = await response.json();
    resultDiv.innerText = `Predicted Digit: ${result.digit}`;
  } catch (error) {
    resultDiv.innerText = "Error: Unable to predict the digit.";
  }
});
