import { View, ActivityIndicator, FlatList } from 'react-native'
import React, { memo, useState } from 'react'
import { useOrientation } from '../../utils/useOrientation'
import ParticipantView from './ParticipantView'
import PauseInvisibleParticipants from './PauseInvisibleParticipant'
import BottomSheet from '../../components/BottomSheet'
import ParticipantStatsViewer from '../components/ParticipantStatsViewer'

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

const ConfrenceParticipantGrid = ({ participantIds = [], isPresenting }) => {
    const orientation = useOrientation()
    const participantCount = participantIds.length
    const perRow = isPresenting ? 2 : participantCount >= 3 ? 2 : 1
    const quality = participantCount > 4 ? 'low' : participantCount > 2 ? 'med' : 'high'

    const [sheetOpen, setSheetOpen] = useState(false)
    const [participantId, setParticipantId] = useState('')

    const openStatsBottomSheet = (pId) => {
        setParticipantId(pId)
        setSheetOpen(true)
    }

    return (
        <>
            <PauseInvisibleParticipants visibleParticipantIds={participantIds} />

            <FlatList
                data={[...participantIds]}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item: participantId }) => (
                    <MemoizedParticipant
                        key={participantId}
                        participantId={participantId}
                        quality={quality}
                        openStatsBottomSheet={openStatsBottomSheet}
                    />
                )}
            />
        </>
    )
}

export const MemoizedParticipantGrid = memo(ConfrenceParticipantGrid,
    (
        { participantIds, isPresenting },
        { participantIds: oldParticipantIds, isPresenting: oldIsPresenting }
    ) => { JSON.stringify(participantIds) === JSON.stringify(oldParticipantIds) && isPresenting === oldIsPresenting }
)