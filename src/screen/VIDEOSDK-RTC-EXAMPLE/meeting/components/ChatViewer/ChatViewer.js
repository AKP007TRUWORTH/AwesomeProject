import { useMeeting, usePubSub } from "@videosdk.live/react-native-sdk";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Linking, Text, View } from "react-native";
import Hyperlink from "react-native-hyperlink";
import colors from "../../../styles/colors";
import { ROBOTO_FONTS } from "../../../styles/fonts";
import { convertRFValue } from "../../../styles/spacing";
import TextInputContainer from "./TextInput";

const ChatViewer = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { publish, messages, } = usePubSub("CHAT", {
    onMessageReceived: (message) => {
      // console.log("message", message);
    },
    onOldMessagesReceived: (messages) => {
      // console.log("messages", messages);
    }
  });

  const mMeeting = useMeeting({});
  const flatListRef = useRef();

  const localParticipantId = mMeeting?.localParticipant?.id;

  const handleSendMessage = () => {
    publish(message, { persist: true });
    setMessage("");
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  };

  const scrollToBottom = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={messages.filter(m => !m?.payload?.isPrivateMessage)}
        style={{ marginVertical: 5, flex: 1 }}
        keyExtractor={(_, index) => `${index}_message_list`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const { message, senderId, timestamp, senderName } = item;
          const localSender = localParticipantId === senderId;
          const time = moment(timestamp).format("hh:mm a");

          return (
            <View
              key={index}
              style={{
                backgroundColor: colors.primary[600],
                paddingVertical: 8, paddingHorizontal: 10, marginVertical: 6,
                borderRadius: 4, borderRadius: 10, marginHorizontal: 12,
                alignSelf: localSender ? "flex-end" : "flex-start",
              }}
            >
              <Text style={{ fontSize: convertRFValue(12), fontFamily: ROBOTO_FONTS.Roboto, color: "#9A9FA5", fontWeight: "bold" }} >
                {localSender ? "You" : senderName}
              </Text>
              <Hyperlink
                linkDefault={true}
                onPress={(url) => Linking.openURL(url)}
                linkStyle={{ color: "blue" }}
              >
                <Text style={{ fontSize: convertRFValue(14), color: "white", fontFamily: ROBOTO_FONTS.RobotoMedium }}>
                  {message}
                </Text>
              </Hyperlink>
              <Text style={{ color: "grey", fontSize: convertRFValue(10), fontFamily: ROBOTO_FONTS.Roboto, alignSelf: "flex-end", marginTop: 4 }}>
                {time}
              </Text>
            </View>
          );
        }}
      />

      <TextInputContainer
        message={message}
        setMessage={setMessage}
        isSending={isSending}
        sendMessage={handleSendMessage}
      />
    </>
  );
};
export default ChatViewer;
