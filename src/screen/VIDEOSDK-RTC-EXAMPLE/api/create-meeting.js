import { request } from "../helper/Network";
import Toast from 'react-native-simple-toast';

// API call to create a meeting
export const createMeeting = async ({ token }) => {
    try {
        const response = await request({
            url: '/rooms',
            method: 'POST',
            headers: { 
                "authorization": token, 
                "Content-Type": "application/json" 
            }
        });
        return response.data.roomId;
    } catch (error) {
        // Handle error more robustly
        const errorMessage = error?.response?.data?.error || 'An error occurred while creating the meeting.';
        Toast.show(errorMessage);
        return null; // Return null or an appropriate value in case of error
    }
};

// API call to validate a meeting
export const validateMeeting = async ({ token, meetingId }) => {
    console.log(token);
    try {
        const response = await request({
            url: `/rooms/validate/${meetingId}`,
            method: 'GET',
            headers: { 
                "authorization": token, 
                "Content-Type": "application/json" 
            }
        });
        // Return true if the meetingId matches, false otherwise
        return response.data.roomId === meetingId;
    } catch (error) {
        // Handle error more robustly
        const errorMessage = error?.response?.data?.error || 'An error occurred while validating the meeting.';
        Toast.show(errorMessage);
        return false; // Return false or an appropriate value in case of error
    }
};
