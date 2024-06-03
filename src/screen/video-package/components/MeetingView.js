import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { RTCView, useMeeting, useParticipant } from '@videosdk.live/react-native-sdk';
import { useNavigation } from '@react-navigation/native';

const MeetingView = () => {
    const { join, leave, toggleWebcam, toggleMic, meetingId, participants } = useMeeting({});
    const participantsArrId = [...participants.keys()];

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
            <ParticipantList participants={participantsArrId} />
            <ControlsContainer
                join={join}
                leave={leave}
                toggleWebcam={toggleWebcam}
                toggleMic={toggleMic}
            />
        </View>
    );
}

const ParticipantList = ({ participants }) => {


    if (!participants) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F6F6FF",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{ fontSize: 20 }}>Press Join button to enter meeting.</Text>
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

    return (
        <FlatList
            data={participants}
            renderItem={({ item }) => {
                return <ParticipantView participantId={item} />;
            }}
        />
    )
}

const ControlsContainer = ({ join, leave, toggleWebcam, toggleMic }) => {

    const Button = ({ onPress, buttonText, backgroundColor }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    backgroundColor: backgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 4,
                }}
            >
                <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={{
                padding: 24,
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
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
                }}
                buttonText={"Toggle Webcam"}
                backgroundColor={"#1178F8"}
            />
            <Button
                onPress={() => {
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

export default MeetingView