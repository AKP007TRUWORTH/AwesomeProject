import React, { memo } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import { MicOff, MicOn, VideoOff, VideoOn, Person, Chat, } from "../../assets/icons";
import { useParticipant } from "@videosdk.live/react-native-sdk";
import _ from 'lodash'

const ParticipantListViewer = ({ participantIds, onPressChatIcon }) => {

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, backgroundColor: "#2B3034" }}>
      <View style={{ height: 42, marginTop: 6, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, color: colors.primary[100] }}>
          Participants ({participantIds.length})
        </Text>
      </View>
      <FlatList
        data={participantIds}
        keyExtractor={(item) => `${item}_participant`}
        style={{ marginBottom: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return <ParticipantListItem key={index} participantId={item} onPressChatIcon={onPressChatIcon} />;
        }}
      />
    </View>
  );
}

const ParticipantListItem = memo(({ participantId, onPressChatIcon }) => {
  const { displayName, webcamOn, micOn, isLocal } = useParticipant(participantId);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: colors.primary[600],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            aspectRatio: 1,
            borderRadius: 20,
            backgroundColor: colors.primary[500],
          }}
        >
          <Person />
        </View>

        <View style={{ marginLeft: 8, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: colors.primary[100] }}>
            {isLocal ? "You" : _.startCase(displayName) || ""}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            alignItems: 'center', justifyContent: 'center',
            padding: 18, height: 26, aspectRatio: 1,
            backgroundColor: colors.primary[500], borderRadius: 40
          }}
          onPress={() => onPressChatIcon(participantId)}
        >
          <Chat height={18} width={18} fill={"#FFFFFF"} />
        </TouchableOpacity >

        <IconContainer
          style={{
            borderWidth: micOn ? 1 : 0,
            backgroundColor: micOn ? "transparent" : "#FF5D5D",
          }}
          Icon={() => {
            return micOn ? (
              <MicOn width={18} height={18} />
            ) : (
              <MicOff width={20} height={20} fill={colors.primary[100]} />
            );
          }}
        />

        <IconContainer
          style={{
            borderWidth: webcamOn ? 1 : 0,
            backgroundColor: webcamOn ? "transparent" : "#FF5D5D",
          }}
          Icon={() => {
            return webcamOn ? (
              <VideoOn height={16} width={16} fill={colors.primary[100]} />
            ) : (
              <VideoOff width={24} height={24} fill={colors.primary[100]} />
            );
          }}
        />
      </View>
    </View >
  );
})

const IconContainer = ({ Icon, style }) => {
  return (
    <View style={{
      height: 36, aspectRatio: 1, justifyContent: "center",
      alignItems: "center", marginLeft: 8, borderColor: "rgba(245,245,245, 0.2)",
      borderRadius: 20, ...style,
    }}>
      <Icon />
    </View>
  );
};

export default ParticipantListViewer;
