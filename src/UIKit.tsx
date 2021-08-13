import React from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'

export const Row: React.FC = ({children}) => <View style={styles.row}>{children}</View>
export const Button: React.FC<{ onPress: () => void, style?: any }> = ({children, onPress, style}) => <Pressable style={style ? style : {borderRadius: 8, overflow: 'hidden', backgroundColor: '#6b48ffff'}} android_ripple={{ color: 'black', borderless: false  }} onPress={onPress} >{children}</Pressable>

export const P: React.FC = ({ children }) => <Text style={{ fontSize: 28 }}>{children}</Text>

export const BottomButton: React.FC<{ onPress: () => void, title: string }> = ({ onPress, title }) => (
    <Button style={{ backgroundColor: '#6b48ffff' }} onPress={onPress}>
      <View style={{ padding: 24, alignSelf: 'stretch' }}>
        <Text style={styles.sq_buttonText}>{title}</Text>
      </View>
    </Button>
)

export const SquareButton: React.FC<{ onPress: () => void, title: string, }> = ({ onPress, title }) => (
  <View style={{ overflow: 'hidden', borderRadius: 8, width: 64, height: 64 }}>
    <Button onPress={onPress}>
      <View style={styles.sq_buttonWrapper}>
        <Text style={styles.sq_buttonText}>{title}</Text>
      </View>
    </Button>
  </View>
)

const styles = StyleSheet.create({
  sq_buttonWrapper: { justifyContent: 'center', alignItems: 'center', height: 64, width: 64 },
  sq_buttonText: {fontSize: 28, color: 'white'},
  row: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
})

