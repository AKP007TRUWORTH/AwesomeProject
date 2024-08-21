import { Text, TouchableOpacity } from 'react-native'

export const Button = ({ text, onPress, apperence, containerStyle, textStyle }) => {

  const apperenceStyle = {
    'outline': {
      containerStyle: {
        marginHorizontal: 16, padding: 12, backgroundColor: '#f2f4ff',
        borderWidth: 1, borderColor: '#3466fe', borderRadius: 4,
      },
      textStyle: {
        color: '#3466fe', textAlign: 'center', lineHeight: 20
      }
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        padding: 16, marginVertical: 8, alignItems: 'center',
        backgroundColor: '#4890E0', borderRadius: 12, ...apperenceStyle[apperence]?.containerStyle,
        ...containerStyle
      }}
      onPress={onPress}
    >
      <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', ...apperenceStyle[apperence]?.textStyle, ...textStyle }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}