import { View, ActivityIndicator } from 'react-native'
import React, { memo, useState } from 'react'
import { useOrientation } from '../../utils/useOrientation'
import ParticipantView from './ParticipantView'
import PauseInvisibleParticipants from './PauseInvisibleParticipant'
import BottomSheet from '../../components/BottomSheet'
import ParticipantStatsViewer from '../components/ParticipantStatsViewer'

const MemoizedParticipant = memo(ParticipantView,
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

            {Array.from({ length: Math.ceil(participantCount / perRow) }, (_, index) => {
                return (
                    <View style={{ flex: 1, flexDirection: orientation === 'PORTRAIT' ? 'row' : 'column' }}>
                        {participantIds
                            .slice(index * perRow, (index + 1) * perRow)
                            .map((participantId) => {
                                return (
                                    <MemoizedParticipant
                                        key={participantId}
                                        participantId={participantId}
                                        quality={quality}
                                        openStatsBottomSheet={openStatsBottomSheet}
                                    />
                                )
                            })
                        }
                    </View>
                )
            })}

            <BottomSheet
                visible={sheetOpen}
                onClose={() => setSheetOpen(false)}
            >
                {participantId
                    ? <ParticipantStatsViewer participantId={participantId} />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                }
            </BottomSheet>
        </>
    )
}

export const MemoizedParticipantGrid = memo(ConfrenceParticipantGrid,
    (
        { participantIds, isPresenting },
        { participantIds: oldParticipantIds, isPresenting: oldIsPresenting }
    ) => { JSON.stringify(participantIds) === JSON.stringify(oldParticipantIds) && isPresenting === oldIsPresenting }
)