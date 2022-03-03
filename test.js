
const testCanvasWidth = 640
const testCanvasHeight = 480

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const testCanvasElement = document.getElementsByClassName('test_canvas')[0];
const testCanvasCtx = testCanvasElement.getContext('2d');
const canvasCtx = canvasElement.getContext('2d');

console.log("dd")
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
 
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      testCanvasCtx.clearRect(0,0,640,480);
      drawLine(landmarks[8].x,landmarks[8].y,landmarks[7].x,landmarks[7].y)
      drawLine(landmarks[7].x,landmarks[7].y,landmarks[6].x,landmarks[6].y)
      drawLine(landmarks[6].x,landmarks[6].y,landmarks[5].x,landmarks[5].y)

      drawLine(landmarks[12].x,landmarks[12].y,landmarks[11].x,landmarks[11].y)
      drawLine(landmarks[11].x,landmarks[11].y,landmarks[10].x,landmarks[10].y)
      drawLine(landmarks[10].x,landmarks[10].y,landmarks[9].x,landmarks[9].y)
      
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

function drawLine(startX,startY,endX,endY) {
  
  let convertStartX = (Math.round(testCanvasWidth * startX) / 10) * 10; 
  let convertStartY = Math.round(testCanvasHeight * startY); 
  let convertEndX = Math.round(testCanvasWidth * endX); 
  let convertEndY = Math.round(testCanvasHeight * endY); 
  console.log(convertStartX);

  testCanvasCtx.strokeStyle = '#ff0000';
  testCanvasCtx.lineCap = "round";
  testCanvasCtx.lineWidth = 20;
  testCanvasCtx.beginPath();
  testCanvasCtx.moveTo(convertStartX,convertStartY);
  testCanvasCtx.lineTo(convertEndX,convertEndY);
  testCanvasCtx.stroke();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.9
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});

camera.start();
