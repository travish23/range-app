import { useEffect, useRef, useState } from "react";

export default function CameraRoute() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);

  // Start the camera with the specified device ID
  async function startCamera(deviceId?: string) {
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  }

  // Enumerate available cameras
  async function enumerateCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    setDevices(videoDevices);
    if (videoDevices.length > 0) {
      setCurrentDeviceId(videoDevices[0].deviceId);
      setIsFrontCamera(videoDevices[0].label.toLowerCase().includes("front"));
      startCamera(videoDevices[0].deviceId);
    }
  }

  // Flip the camera
  const flipCamera = () => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex((device) => device.deviceId === currentDeviceId);
      const nextDevice = devices[(currentIndex + 1) % devices.length];
      setCurrentDeviceId(nextDevice.deviceId);
      setIsFrontCamera(nextDevice.label.toLowerCase().includes("front"));
      startCamera(nextDevice.deviceId);
    }
  };

  // Initialize the camera when the component mounts
  useEffect(() => {
    enumerateCameras();
  }, []);

  return (
    <div>
      <h1>Camera</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          transform: isFrontCamera ? "scaleX(-1)" : "none", // Flip horizontally for front camera
        }}
      />
      <button onClick={flipCamera}>Flip Camera</button>
    </div>
  );
}