const canvas = document.getElementById('jarvisCanvas');
const ctx = canvas.getContext('2d');

// Ajustar el tamaño del canvas
canvas.width = 600;
canvas.height = 600;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const baseColor = 'rgba(0, 200, 255, 0.8)'; // Azul cian para el estilo J.A.R.V.I.S.

let animationFrameId;

// --- Parámetros de las animaciones (puedes ajustar estos valores) ---
let outerRingRotation = 0;
let innerRingScale = 1;
let innerRingOpacity = 1;
let barGraphValue = 0; // Para el gráfico de barras
let numericTextValue = 0; // Para el texto numérico
let pulseEffect = 0; // Para un efecto de pulso en el círculo central


// Función para dibujar un arco con un grosor específico
function drawArc(x, y, radius, startAngle, endAngle, lineWidth, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Función para dibujar un círculo sólido (relleno)
function drawFilledCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

// Función para dibujar una línea
function drawLine(x1, y1, x2, y2, lineWidth, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Función para dibujar texto
function drawText(text, x, y, font, color, align = 'center', baseline = 'middle') {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
}

// Función para dibujar el "gráfico de barras" radial
function drawRadialBars(x, y, innerRadius, outerRadius, numBars, value, color) {
    const barWidth = 2; // Ancho de cada barra
    const gap = 1; // Espacio entre barras
    const totalAngle = Math.PI * 1.5; // Ángulo total del semicírculo de barras
    const startAngleOffset = Math.PI * 0.75; // Desplazamiento para centrar el semicírculo

    for (let i = 0; i < numBars; i++) {
        const angle = startAngleOffset + (i / numBars) * totalAngle;
        const currentBarHeight = innerRadius + (outerRadius - innerRadius) * (i / numBars) * value;

        const x1 = x + Math.cos(angle) * innerRadius;
        const y1 = y + Math.sin(angle) * innerRadius;
        const x2 = x + Math.cos(angle) * currentBarHeight;
        const y2 = y + Math.sin(angle) * currentBarHeight;

        drawLine(x1, y1, x2, y2, barWidth, color);
    }
}


// Función principal de dibujo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas en cada frame

    // --- Círculo exterior (animación de rotación) ---
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(outerRingRotation);
    drawArc(0, 0, 280, 0, Math.PI * 2, 2, baseColor); // Anillo exterior grande
    // Pequeñas marcas en el anillo exterior
    for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const x1 = Math.cos(angle) * 270;
        const y1 = Math.sin(angle) * 270;
        const x2 = Math.cos(angle) * 280;
        const y2 = Math.sin(angle) * 280;
        drawLine(x1, y1, x2, y2, 1, baseColor);
    }
    ctx.restore();


    // --- Anillos interiores concéntricos (animación de escala/opacidad) ---
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(innerRingScale, innerRingScale);
    ctx.globalAlpha = innerRingOpacity;

    drawArc(0, 0, 100, 0, Math.PI * 2, 2, baseColor); // Anillo más interno
    drawArc(0, 0, 150, 0, Math.PI * 2, 1, baseColor); // Anillo intermedio
    drawArc(0, 0, 200, 0, Math.PI * 2, 1, baseColor); // Anillo más externo

    ctx.restore();


    // --- Texto "J.A.R.V.I.S." ---
    drawText('J.A.R.V.I.S.', centerX, centerY, '30px Arial', baseColor);


    // --- Elementos de medidor (números y guiones) ---
    // Simular los números "00000000"
    const numRadius = 220; // Radio para los números
    const numOffsetAngle = Math.PI / 4; // Ajuste para posicionar los números
    for (let i = 0; i < 9; i++) {
        const angle = Math.PI * 0.7 + (i * (Math.PI / 8)); // Posición angular
        const x = centerX + Math.cos(angle) * numRadius;
        const y = centerY + Math.sin(angle) * numRadius;
        drawText('0', x, y, '14px Monospace', baseColor, 'center', 'middle');
    }
    for (let i = 0; i < 9; i++) {
        const angle = Math.PI * 1.7 + (i * (Math.PI / 8)); // Posición angular
        const x = centerX + Math.cos(angle) * numRadius;
        const y = centerY + Math.sin(angle) * numRadius;
        drawText('0', x, y, '14px Monospace', baseColor, 'center', 'middle');
    }

    // Dibujar las líneas pequeñas entre los números
    const lineRadiusOuter = 230;
    const lineRadiusInner = 225;
    for (let i = 0; i < 36; i++) { // Más líneas para rellenar
        const angle = (i * (Math.PI * 2 / 36));
        const x1 = centerX + Math.cos(angle) * lineRadiusOuter;
        const y1 = centerY + Math.sin(angle) * lineRadiusOuter;
        const x2 = centerX + Math.cos(angle) * lineRadiusInner;
        const y2 = centerY + Math.sin(angle) * lineRadiusInner;
        drawLine(x1, y1, x2, y2, 1, baseColor);
    }


    // --- Gráfico de barras radial izquierdo (animación de valor) ---
    ctx.save();
    ctx.translate(centerX, centerY);
    // Rotar para colocarlo a la izquierda
    ctx.rotate(Math.PI * 0.5); // Rotar 90 grados para que el "inicio" esté a la izquierda
    drawRadialBars(0, 0, 105, 145, 20, barGraphValue, baseColor); // 20 barras
    ctx.restore();


    // --- Cuadrados punteados en el anillo interior ---
    const dottedSquareRadius = 130;
    const numDottedSquares = 12; // Número de cuadrados
    for (let i = 0; i < numDottedSquares; i++) {
        const angle = (i / numDottedSquares) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * dottedSquareRadius;
        const y = centerY + Math.sin(angle) * dottedSquareRadius;

        // Dibujar un pequeño cuadrado (simulando un punto grueso)
        ctx.fillStyle = baseColor;
        ctx.fillRect(x - 2, y - 2, 4, 4); // Cuadrado de 4x4
    }

    // --- Efecto de pulso en el círculo central ---
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(1 + pulseEffect * 0.05, 1 + pulseEffect * 0.05); // Escala para el pulso
    ctx.globalAlpha = 0.5 - pulseEffect * 0.5; // Opacidad inversamente proporcional
    drawFilledCircle(0, 0, 80, baseColor); // Círculo central que pulsa
    ctx.restore();

}

// --- Función de animación ---
function animate() {
    // Actualizar parámetros de animación
    outerRingRotation += 0.005; // Velocidad de rotación del anillo exterior

    innerRingScale = 1 + Math.sin(performance.now() * 0.002) * 0.02; // Pulso sutil
    innerRingOpacity = 0.8 + Math.sin(performance.now() * 0.003) * 0.2; // Parpadeo sutil

    barGraphValue = (Math.sin(performance.now() * 0.005) + 1) / 2; // Oscila entre 0 y 1

    pulseEffect = (Math.sin(performance.now() * 0.008) + 1) / 2; // Oscila entre 0 y 1 para el pulso


    draw(); // Volver a dibujar con los nuevos parámetros

    animationFrameId = requestAnimationFrame(animate); // Solicitar el siguiente frame
}

// Iniciar la animación
animate();