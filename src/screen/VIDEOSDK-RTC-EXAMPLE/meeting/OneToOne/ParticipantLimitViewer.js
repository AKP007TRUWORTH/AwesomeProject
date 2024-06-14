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
                When you choose the One to One meeting type, only a maximum two participants can join. If you wish to add more members, please contact to host & change your meeting type.
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
