import { useEffect, useRef, useState } from "react";

export default function CameraRoute() {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState('environment');
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      // Detect if the device is mobile
      setIsMobileDevice(/Mobi|Android/i.test(navigator.userAgent));
    }, []);
  
    useEffect(() => {
      // Get the user's camera stream based on facingMode (front or back)
      if (isMobileDevice) {
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
            console.error('Error accessing camera:', err);
          });
      }
    }, [isMobileDevice, cameraFacingMode]);
  
    const toggleCamera = () => {
      // Toggle between front and back camera
      setCameraFacingMode((prev) =>
        prev === 'environment' ? 'user' : 'environment'
      );
    };
  
    return (
      <div>
        {isMobileDevice ? (
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
            <button onClick={toggleCamera}>Flip Camera</button>
          </div>
        ) : (
          <p>This feature is only available on mobile devices.</p>
        )}
      </div>
    );
  }
  
  














//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
//   const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
//   const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);

//   // Start the camera with the specified device ID
//   async function startCamera(deviceId?: string) {
//     try {
//       // Stop the current stream if it exists
//       if (videoRef.current && videoRef.current.srcObject) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach((track) => track.stop());
//       }

//       // Start the new stream
//       const constraints: MediaStreamConstraints = {
//         video: deviceId ? { deviceId: { exact: deviceId } } : true,
//       };
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//     }
//   }

//   // Enumerate available cameras
//   async function enumerateCameras() {
//     try {
//       // Request camera access first
//       await navigator.mediaDevices.getUserMedia({ video: true });

//       // Enumerate devices
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const videoDevices = devices.filter((device) => device.kind === "videoinput");
//       setDevices(videoDevices);

//       if (videoDevices.length > 0) {
//         setCurrentDeviceId(videoDevices[0].deviceId);
//         setIsFrontCamera(videoDevices[0].label.toLowerCase().includes("front"));
//         startCamera(videoDevices[0].deviceId);
//       }
//     } catch (error) {
//       console.error("Error enumerating cameras:", error);
//     }
//   }

//   const flipCamera = () => {

//     if (devices.length > 1) {
//       const currentIndex = devices.findIndex((device) => device.deviceId === currentDeviceId);
//       const nextDevice = devices[(currentIndex + 1) % devices.length];
//       setCurrentDeviceId(nextDevice.deviceId);
//       setIsFrontCamera(nextDevice.label.toLowerCase().includes("front"));
//       startCamera(nextDevice.deviceId);
//     }
//   };

//   useEffect(() => {
//     enumerateCameras();
//   }, []);

//   return (
//     <div>
//       <h1>Camera</h1>
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         style={{
//           transform: isFrontCamera ? "none" : "none",
//         }}
//       />
//       <button onClick={flipCamera}>Flip Camera</button>
//     </div>
//   );

//  }
//  export default CameraComponent;
