import React from 'react'

export const VideoSdkContext = React.createContext()

export const VideoSdkProvider = ({ children }) => {

    return (
        <VideoSdkContext.Provider
            value={{}}
        >
            {children}
        </VideoSdkContext.Provider>
    )
}