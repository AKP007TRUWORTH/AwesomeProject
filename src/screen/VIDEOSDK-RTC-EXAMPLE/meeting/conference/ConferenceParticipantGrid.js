import { FlatList } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
// import { useOrientation } from '../../utils/useOrientation'

import ParticipantView from './ParticipantView'
// import PauseInvisibleParticipants from './PauseInvisibleParticipants'
import { heightPercentageToDP, widthPercentageToDP } from '../../../../helpers/Responsive'

const ConferenceParticipantGrid = ({ participantIds = [], isPresenting }) => {
    // const orientation = useOrientation()
    // const perRow = isPresenting ? 2 : participantCount >= 3 ? 2 : 1

    const [numCols, setColumnNo] = useState(0);

    const participantCount = participantIds.length
    const quality = participantCount > 4 ? 'low' : participantCount > 2 ? 'med' : 'high'

    // const [sheetOpen, setSheetOpen] = useState(false)
    // const [participantId, setParticipantId] = useState('')


    useEffect(() => {
        if (participantIds.length > 3) {
            return setColumnNo(2)
        }
        setColumnNo(0)
    }, [participantIds.length])

    // const openStatsBottomSheet = (pId) => {
    //     setParticipantId(pId)
    //     setSheetOpen(true)
    // }

    return (
        <>
            {/* <PauseInvisibleParticipants visibleParticipantIds={participantIds} /> */}

            <FlatList
                key={numCols}
                data={[...participantIds]}
                numColumns={numCols}
                scrollEnabled={false}
                keyExtractor={(item) => `${item}_participant`}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={numCols !== 0 ? { gap: 8, } : undefined}
                contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}
                renderItem={({ item: participantId }) =>
                    <ParticipantView
                        key={participantId}
                        participantId={participantId}
                        quality={quality}
                        containerStyle={
                            participantCount == 3
                                ? { width: widthPercentageToDP(91), height: heightPercentageToDP(25), overflow: 'hidden', borderRadius: 16 }
                                : { width: widthPercentageToDP(44), height: heightPercentageToDP(25), overflow: 'hidden', borderRadius: 16 }
                        }
                    // openStatsBottomSheet={openStatsBottomSheet}
                    />
                }
            />
        </>
    )
}

export const MemoizedParticipant = memo(ParticipantView,
    (
        { participantId, quality, key, openStatsBottomSheet },
        {
            participantId: oldParticipantId,
            quality: oldQuality,
            key: oldKey,
            openStatsBottomSheet: oldOpenStatsBottomSheet
        }
    ) => {
        participantId === oldParticipantId && quality === oldQuality && key === oldKey && openStatsBottomSheet === oldOpenStatsBottomSheet
    }
)

export const MemoizedParticipantGrid = memo(ConferenceParticipantGrid,
    (
        { participantIds, isPresenting },
        { participantIds: oldParticipantIds, isPresenting: oldIsPresenting }
    ) => { JSON.stringify(participantIds) === JSON.stringify(oldParticipantIds) && isPresenting === oldIsPresenting }
)