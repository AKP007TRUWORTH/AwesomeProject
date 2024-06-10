import React from "react";
import { FlatList, View, Text } from "react-native";
import colors from "../../../styles/colors";
import ParticipantListItem from "./ParticipantListItem";

const ParticipantListViewer = ({ participantIds }) => {

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
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          return <ParticipantListItem key={index} participantId={item} />;
        }}
      />
    </View>
  );
}

export default ParticipantListViewer;
