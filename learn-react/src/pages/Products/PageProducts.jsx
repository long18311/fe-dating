import  {  useState } from 'react';
import jsQR from 'jsqr';

export  default function  PageProduct (){

    const [scanResult, setScanResult] = useState('');

    const handleImageUpload = (event) => {
        const image = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;

            imgElement.onload = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                context.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    setScanResult(code.data);
                } else {
                    setScanResult("No QR code found.");
                }
            };
        };

        reader.readAsDataURL(image);
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            <p>Scanned QR Code: {scanResult}</p>
        </div>
    );
}