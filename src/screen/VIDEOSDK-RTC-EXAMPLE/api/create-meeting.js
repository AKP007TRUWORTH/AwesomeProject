import { API_BASE_URL } from "../helper/environment";
import Toast from 'react-native-simple-toast'

// API call to create meeting
export const createMeeting = async ({ token }) => {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        headers: { authorization: `${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
    })

    if (res.status === 400) return Toast.show(`Meeting could't create due to network`);

    const { roomId } = await res.json();
    return roomId;
};


export const validateMeeting = async ({ token, meetingId }) => {
    const res = await fetch(`${API_BASE_URL}/rooms/validate/${meetingId}`, {
        method: "GET",
        headers: { authorization: `${token}`, "Content-Type": "application/json" },
    }).catch((e) => console.log("Error: ", e));

    if (res.status === 400) return Toast.show("Meeting Id not found. Please Enter Correct Meeting Id");

    if (res.status === 200) {
        const { roomId } = await res.json();
        return res ? roomId === meetingId : false
    }
}