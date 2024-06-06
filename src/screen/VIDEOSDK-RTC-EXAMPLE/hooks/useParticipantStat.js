import { useParticipant } from "@videosdk.live/react-native-sdk"
import { useEffect, useRef, useState } from "react"

export default ({ participantId }) => {
    const { webcamStream, micStream, getVideoStats, getAudioStats, getShareStats, isPresenting, displayName } = useParticipant(participantId)

    const [score, setScore] = useState({})
    const [audioStats, setAudioStats] = useState({})
    const [videoStats, setVideoStats] = useState({})

    const statsIntervalRef = useRef()

    useEffect(() => {
        if (webcamStream || micStream) {
            updateStats()

            if (statsIntervalRef.current) {
                clearInterval(statsIntervalRef.current)
            }

            statsIntervalRef.current = setInterval(updateStats, 500)
        } else {
            if (statsIntervalRef.current) {
                clearInterval(statsIntervalRef.current)
                statsIntervalRef.current = null
            }
        }

        return () => {
            if (statsIntervalRef.current) {
                clearInterval(statsIntervalRef.current)
            }
        }
    }, [webcamStream, micStream])

    const updateStats = async () => {
        let stats = []
        let audioStats = []
        let videoStats = []

        if (isPresenting) {
            stats = await getShareStats()
        } else if (webcamStream) {
            stats = await getVideoStats()
        } else if (micStream) {
            stats = await getAudioStats()
        }

        if (webcamStream || micStream || isPresenting) {
            videoStats = isPresenting ? await getShareStats() : await getVideoStats()
            audioStats = isPresenting ? [] : await getAudioStats()
        }

        let score = stats
            ? stats.length > 0
                ? getQualityScore(stats[0])
                : 100
            : 100

        setScore(score)
        setAudioStats(audioStats)
        setVideoStats(videoStats)

    }

    return { score, audioStats, videoStats, displayName }
}

const getQualityScore = (state) => {
    const packetLossPercent = state.packetLost / state.totalPackets || 0
    const jitter = state.jitter
    const rtt = state.rtt
    let score = 100
    score -= packetLossPercent * 50 > 50 ? 50 : packetLossPercent * 50
    score -= ((jitter / 30) * 25 > 25 ? 25 : (jitter / 30) * 25) || 0
    score -= ((rtt / 300) * 25 > 25 ? 25 : (rtt / 300) * 25) || 0

    return score / 10
}