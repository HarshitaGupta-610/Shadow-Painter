const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const light = document.getElementById("light");

canvas.width = 600;
canvas.height = 400;

const objects = []; // Store objects (circles & squares)
let draggingObject = null; // Track dragged object
let isDraggingLight = false; // Track light dragging

// Function to draw objects & shadows
function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lightX = light.offsetLeft + 15; // Light center X
    const lightY = light.offsetTop + 15; // Light center Y

    objects.forEach(obj => {
        const dx = obj.x - lightX;
        const dy = obj.y - lightY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate shadow direction
        const shadowX = obj.x + dx * 0.3;
        const shadowY = obj.y + dy * 0.3;

        // Draw shadow (Darker for white background)
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.9, 100 / distance)})`; 
        if (obj.shape === "circle") {
            ctx.beginPath();
            ctx.arc(shadowX, shadowY, obj.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(shadowX - obj.size / 2, shadowY - obj.size / 2, obj.size, obj.size);
        }

        // Draw object (Black for visibility on white background)
        ctx.fillStyle = "black"; 
        if (obj.shape === "circle") {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(obj.x - obj.size / 2, obj.y - obj.size / 2, obj.size, obj.size);
        }
    });
}

// Add new circle
document.getElementById("addCircle").addEventListener("click", () => {
    objects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20,
        shape: "circle",
        color: "black" // Changed to black for visibility
    });
    drawObjects();
});

// Add new square
document.getElementById("addSquare").addEventListener("click", () => {
    objects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30,
        shape: "square",
        color: "black" // Changed to black for visibility
    });
    drawObjects();
});

// Clear canvas
document.getElementById("clearCanvas").addEventListener("click", () => {
    objects.length = 0;
    drawObjects();
});

// Drag objects
canvas.addEventListener("mousedown", (e) => {
    objects.forEach(obj => {
        const dist = Math.sqrt((e.offsetX - obj.x) ** 2 + (e.offsetY - obj.y) ** 2);
        if (dist < obj.size) {
            draggingObject = obj;
        }
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (draggingObject) {
        draggingObject.x = e.offsetX;
        draggingObject.y = e.offsetY;
        drawObjects();
    }
});

canvas.addEventListener("mouseup", () => {
    draggingObject = null;
});

// Light source dragging
light.addEventListener("mousedown", () => {
    isDraggingLight = true;
});

window.addEventListener("mousemove", (e) => {
    if (isDraggingLight) {
        light.style.left = `${e.clientX - 15}px`; // Adjust for center
        light.style.top = `${e.clientY - 15}px`;
        drawObjects(); // Update shadows dynamically
    }
});

window.addEventListener("mouseup", () => {
    isDraggingLight = false;
});

// Save as image
document.getElementById("saveImage").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "shadow-painting.png";
    link.href = canvas.toDataURL();
    link.click();
});

// Update shadows when moving the light
window.addEventListener("mousemove", drawObjects);



