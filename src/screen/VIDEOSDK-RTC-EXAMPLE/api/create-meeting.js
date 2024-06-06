import { API_BASE_URL } from "../helper/environment";

// API call to create meeting
export const createMeeting = async ({ token }) => {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        headers: { authorization: `${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
    })

    const { roomId } = await res.json();
    return roomId;
};


export const validateMeeting = async ({ token, meetingId }) => {

    const res = await fetch(`${API_BASE_URL}/rooms/validate/${meetingId}`, {
        method: "GET",
        headers: { authorization: `${token}`, "Content-Type": "application/json" },
    })

    return res ? res.roomId === meetingId : false;
}