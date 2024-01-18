import  { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
    const [responseData, setResponseData] = useState(null);

    const fetchData = async () => {
        const data = JSON.stringify({
            "legalId": "8589715960",
            "legalName": "NGUYEN MINH KHANH"
        });

        const config = {
            method: 'post',
            url: 'https://api.vietqr.io/v2/citizen',
            headers: {
                'x-client-id': 'c0c753da-4980-4c7b-9f74-10b9c54e106b',
                'x-api-key': '1ce1f35e-2b7f-4f12-8382-72f90be9e507',
                'Content-Type': 'application/json',
            },
            data: data
        };

        try {
            const response = await axios(config);
            setResponseData(JSON.stringify(response.data));
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
            // Handle error
        }
    };

    return (
        <div>
            <button onClick={fetchData}>Fetch Data</button>
            <div>Response Data: {responseData}</div>
        </div>
    );
};

export default MyComponent;
