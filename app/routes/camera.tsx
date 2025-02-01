import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

export default function CameraRoute() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detect if the device is mobile
  useEffect(() => {
    setIsMobileDevice(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // Load the Coco-SSD model when the component mounts
  useEffect(() => {
    // Load TensorFlow.js and the Coco-SSD model
    const loadModel = async () => {
      await tf.ready(); // Wait for TensorFlow.js to load
      const model = await cocoSsd.load();
      console.log("Coco-SSD model loaded.");
      detectObjects(model);
    };

    loadModel();
  }, []);

  // Function to start the video stream and detect objects
  const detectObjects = async (model: any) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set up the video stream
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: cameraFacingMode },
        })
        .then((stream: any) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });

      // Set the canvas size to match the video dimensions
      video.addEventListener("play", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Detect objects on each frame
        const detectFrame = async () => {
          // Run object detection on the current frame
          const predictions = await model.detect(video);
          console.log(predictions)
          // Clear the canvas and draw the frame and detections
          context?.clearRect(0, 0, canvas.width, canvas.height);
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Draw bounding boxes around detected objects
          predictions.forEach((prediction: any) => {
            context?.beginPath();
            context?.rect(
              prediction.bbox[0],
              prediction.bbox[1],
              prediction.bbox[2],
              prediction.bbox[3]
            );
            if (!context) return;
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.stroke();
            context.fillStyle = "red";
            context.fillText(
              `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
              prediction.bbox[0],
              prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
            );
          });

          // Call detectFrame again to keep detecting in a loop
          requestAnimationFrame(detectFrame);
        };

        detectFrame(); // Start the detection loop
      });
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };

  return (
    <div>
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "auto",
              transform: cameraFacingMode === "user" ? "scaleX(-1)" : "none", // Flip video if front camera
            }}
          />
          <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
          <button onClick={toggleCamera}>Flip Camera</button>
        </div>
    </div>
  );
}
