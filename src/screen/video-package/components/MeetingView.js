import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import { isEmpty } from 'lodash';

const MeetingView = () => {
    const { meetingId } = useMeeting({});


    return (
        <View style={{ flex: 1 }}>
            {meetingId
                ?
                <Text style={{ fontSize: 18, padding: 12 }}>
                    Meeting Id :{meetingId}
                </Text>
                :
                null
            }
            <ParticipantList />
            <ControlsContainer />
        </View>
    );
}

const ParticipantList = () => {
    const { participants } = useMeeting({});
    const participantsArrId = [...participants.keys()];

    if (isEmpty(participants)) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F6F6FF",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ fontSize: 20, color: 'black' }}>
                    Press Join button to enter meeting.
                </Text>
            </View>
        )
    }

    return (
        <FlatList
            data={participantsArrId}
            renderItem={({ item }) => <ParticipantView participantId={item} />}
        />
    )
}

const ControlsContainer = () => {
    const { join, leave, toggleWebcam, toggleMic, changeWebcam, getWebcams } = useMeeting({})

    const Button = ({ onPress, buttonText, backgroundColor }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={{
                    backgroundColor: backgroundColor, borderRadius: 4,
                    justifyContent: "center", alignItems: "center", padding: 12,
                }}
            >
                <Text style={{ color: "white", fontSize: 12 }}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ padding: 24, flexDirection: "row", justifyContent: "space-between" }} >
            <Button
                onPress={() => {
                    join();
                }}
                buttonText={"Join"}
                backgroundColor={"#1178F8"}
            />
            <Button
                onPress={() => {
                    toggleWebcam();

                    //Change Webcam in Meeting
                    // const webcams = await getWebcams();

                    // console.log(webcams);

                    // const { deviceId, label } = webcams[1]

                    // changeWebcam(deviceId)
                }}
                buttonText={"Toggle Webcam"}
                backgroundColor={"#1178F8"}
            />
            <Button
                onPress={async () => {
                    toggleMic();
                }}
                buttonText={"Toggle Mic"}
                backgroundColor={"#1178F8"}
            />
            <Button
                onPress={() => {
                    leave();
                }}
                buttonText={"Leave"}
                backgroundColor={"#FF0000"}
            />
        </View>
    )
}

const ParticipantView = ({ participantId }) => {
    const { webcamStream, webcamOn } = useParticipant(participantId);

    if (!webcamStream || !webcamOn) {
        return (
            <View
                style={{
                    backgroundColor: "grey",
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
            </View>
        )
    }

    return (
        <RTCView
            streamURL={new MediaStream([webcamStream.track]).toURL()}
            objectFit={"cover"}
            style={{
                height: 300,
                marginVertical: 8,
                marginHorizontal: 8,
            }}
        />
    )
}

export default MeetingView