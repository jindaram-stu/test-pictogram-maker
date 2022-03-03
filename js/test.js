
const testCanvasWidth = 400
const testCanvasHeight = 300

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const testCanvasElement = document.getElementsByClassName('test_canvas')[0];
const testCanvasCtx = testCanvasElement.getContext('2d');
const canvasCtx = canvasElement.getContext('2d');
let stat = document.getElementById("status");
stat.innerText = "Loading..";



function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
 
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      testCanvasCtx.clearRect(0,0,640,480);
      // big finger
      drawLine(landmarks[4].x,landmarks[4].y,landmarks[3].x,landmarks[3].y)
      drawLine(landmarks[3].x,landmarks[3].y,landmarks[2].x,landmarks[2].y)
      drawLine(landmarks[2].x,landmarks[2].y,landmarks[1].x,landmarks[1].y)

      // index finger
      drawLine(landmarks[8].x,landmarks[8].y,landmarks[7].x,landmarks[7].y)
      drawLine(landmarks[7].x,landmarks[7].y,landmarks[6].x,landmarks[6].y)
      drawLine(landmarks[6].x,landmarks[6].y,landmarks[5].x,landmarks[5].y)

      // middle finger
      drawLine(landmarks[12].x,landmarks[12].y,landmarks[11].x,landmarks[11].y)
      drawLine(landmarks[11].x,landmarks[11].y,landmarks[10].x,landmarks[10].y)
      drawLine(landmarks[10].x,landmarks[10].y,landmarks[9].x,landmarks[9].y)

      // ring finger
      drawLine(landmarks[16].x,landmarks[16].y,landmarks[15].x,landmarks[15].y)
      drawLine(landmarks[15].x,landmarks[15].y,landmarks[14].x,landmarks[14].y)
      drawLine(landmarks[14].x,landmarks[14].y,landmarks[13].x,landmarks[13].y)

      // little finger
      drawLine(landmarks[20].x,landmarks[20].y,landmarks[19].x,landmarks[19].y)
      drawLine(landmarks[19].x,landmarks[19].y,landmarks[18].x,landmarks[18].y)
      drawLine(landmarks[18].x,landmarks[18].y,landmarks[17].x,landmarks[17].y)

      // draw Palm
      testCanvasCtx.beginPath();
      testCanvasCtx.moveTo(drawPositionX(landmarks[5].x),drawPositionY(landmarks[5].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[9].x),drawPositionY(landmarks[9].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[13].x),drawPositionY(landmarks[13].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[17].x),drawPositionY(landmarks[17].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[0].x),drawPositionY(landmarks[0].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[1].x),drawPositionY(landmarks[1].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[2].x),drawPositionY(landmarks[2].y));
      testCanvasCtx.closePath();
      testCanvasCtx.fillStyle = '#ff0000';
      testCanvasCtx.fill();

      testCanvasCtx.beginPath();
      testCanvasCtx.moveTo(drawPositionX(landmarks[1].x),drawPositionY(landmarks[1].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[0].x),drawPositionY(landmarks[0].y));
      testCanvasCtx.lineTo(drawPositionX(landmarks[17].x),drawPositionY(landmarks[17].y));
      testCanvasCtx.strokeStyle = '#ff0000';
      testCanvasCtx.lineCap = "round";
      testCanvasCtx.lineWidth = 20;
      testCanvasCtx.stroke();
      
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
      stat.innerText = "Loading Success";
    }
  }
  canvasCtx.restore();
}

function drawLine(startX,startY,endX,endY) {
  
  let convertStartX = (Math.round(testCanvasWidth * startX) / 10) * 10; 
  let convertStartY = Math.round(testCanvasHeight * startY); 
  let convertEndX = Math.round(testCanvasWidth * endX); 
  let convertEndY = Math.round(testCanvasHeight * endY); 

  testCanvasCtx.strokeStyle = '#ff0000';
  testCanvasCtx.lineCap = "round";
  testCanvasCtx.lineWidth = 20;
  testCanvasCtx.beginPath();
  testCanvasCtx.moveTo(convertStartX,convertStartY);
  testCanvasCtx.lineTo(convertEndX,convertEndY);
  testCanvasCtx.stroke();
}

function drawPositionX(position) {
  return Math.round(position * testCanvasWidth)
}

function drawPositionY(position) {
  return Math.round(position * testCanvasHeight)
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
  width: 400,
  height: 300
});


camera.start();
