import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import {APP_ID, SERVER_SECRET} from "../../constants/index.js";
import HeaderDefaultLayout from "../../components/defaultlayout/HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "../../components/defaultlayout/FooterDefaultLayout.jsx";


function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(
    url = window.location.href
) {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

export default function Meet() {
    const roomID = getUrlParams().get('roomID') || randomID(5);


    let myMeeting = async (element) => {
        // generate Kit Token
        const appID = APP_ID;
        const serverSecret = SERVER_SECRET;
        const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, "anhbanthien",  randomID(5),  "Tên của bạn ?");


        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Tham gia trò chuyện',
                    url:
                         window.location.host + window.location.pathname +'?roomID=' +roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },

        });



    };

    return (
         <div>
             <div
                 ref={myMeeting}
                 className="w-screen h-screen "
             >
             </div>

         </div>
    );
}