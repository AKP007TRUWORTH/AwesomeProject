require('dotenv').config();

module.exports = ({ config }) => {
    return {
        ...config,
        "extra": {
            "eas": {
                "projectId": "12db7102-c890-41d6-9c32-7b03482a524c"
            }
        },
        "updates": {
            "url": "https://u.expo.dev/12db7102-c890-41d6-9c32-7b03482a524c",
            "requestHeaders": {
                "expo-runtime-version": "2.0.0",
                "expo-channel-name": process.env.CODE_PUSH_ENIVIRONMENT
            },
            "platforms": ["ios", "android"]
        },
        "ios": {
            "bundleIdentifier": "com.akp007.awesomeproject",
        }
    }
}