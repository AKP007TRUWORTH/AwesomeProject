import {
    MeetingProvider
} from "@videosdk.live/react-native-sdk";
import React, { useState } from "react";
import { createMeeting, token } from "../../api/create-meeting";
import JoinScreen from './JoinScreen';
import MeetingView from './components/MeetingView';

const HomeScreen = () => {
    const [meetingId, setMeetingId] = useState(null);

    const getMeetingId = async (id) => {
        const meetingId = id == null ? await createMeeting({ token }) : id;
        setMeetingId(meetingId);
    };

    if (!meetingId) {
        return <JoinScreen getMeetingId={getMeetingId} />
    }

    return (
        <MeetingProvider
            config={{
                meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: "Participant Name",
                notification: {
                    title: "Code Sample",
                    message: "Meeting is running.",
                },
                multiStream: true,
                mode: "CONFERENCE", // "CONFERENCE" || "VIEWER"
                defaultCamera: "back"  // "front" || "back"    // default : "front"
            }}
            token={token}
            joinWithoutUserInteraction
        >
            <MeetingView />
        </MeetingProvider>
    )
}

export default HomeScreen