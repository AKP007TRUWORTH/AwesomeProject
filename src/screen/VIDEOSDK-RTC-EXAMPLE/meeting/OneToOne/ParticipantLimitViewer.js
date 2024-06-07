import React from "react";
import { Button } from "@ui-kitten/components";
import { useMeeting } from "@videosdk.live/react-native-sdk";
import { Text, View } from "react-native";

const ParticipantLimitViewer = () => {
    const { leave } = useMeeting({});

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
            <Text style={{ fontSize: 24, color: 'black', fontWeight: '500', }}>
                OOPS !!
            </Text>

            <Text style={{ fontSize: 14, color: 'black', fontWeight: '500', textAlign: "center", marginTop: 8, lineHeight: 24 }}>
                Maximun 2 participants can join in this meeting. Please try again later ...
            </Text>

            <Button
                onPress={leave}
                style={{ paddingHorizontal: 30, marginTop: 20, backgroundColor: 'red', borderWidth: 0 }}
            >
                OK
            </Button>
        </View>
    );
}

export default ParticipantLimitViewer;
