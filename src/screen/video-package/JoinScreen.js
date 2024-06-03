import { Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Layout, Input } from '@ui-kitten/components';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';
import { isIphoneX } from '../../helpers/iPhoneX';

const JoinScreen = (props) => {
    const [meetingVal, setMeetingVal] = useState("");

    return (
        <Layout style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <CustomKeyboardAvoidingView
                behavior={Platform.OS == "ios" ? 'padding' : null}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => props.getMeetingId()}
                        style={{ backgroundColor: "#1178F8", padding: 12, borderRadius: 6, marginVertical: 16 }}
                    >
                        <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
                            Create Meeting
                        </Text>
                    </TouchableOpacity>

                    <Input
                        value={meetingVal}
                        onChangeText={setMeetingVal}
                        placeholder={"Enter Your Meeting ID"}
                        style={{ borderWidth: 1, borderRadius: 6 }}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#1178F8",
                            padding: 12,
                            marginTop: 14,
                            borderRadius: 6,
                        }}
                        onPress={() => {
                            props.getMeetingId(meetingVal);
                        }}
                    >
                        <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
                            Join Meeting
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </CustomKeyboardAvoidingView>
        </Layout>
    );
}

export default JoinScreen