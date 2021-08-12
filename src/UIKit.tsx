import React from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'

export const Row: React.FC = ({children}) => <View style={styles.row}>{children}</View>
export const Button: React.FC<{ onPress: () => void }> = ({children, onPress}) => <Pressable onPress={onPress} >{children}</Pressable>

export const P: React.FC = ({ children }) => <Text style={{ fontSize: 28 }}>{children}</Text>

export const SquareButton: React.FC<{ onPress: () => void, title: string }> = ({ onPress, title }) => (
  <Button onPress={onPress}>
    <View style={styles.sq_buttonWrapper}>
      <Text style={styles.sq_buttonText}>{title}</Text>
    </View>
  </Button>
)

const styles = StyleSheet.create({
  sq_buttonWrapper: { borderRadius: 8, backgroundColor: '#6b48ffff', margin: 16, justifyContent: 'center', alignItems: 'center', height: 48, width: 48 },
  sq_buttonText: {fontSize: 28, color: 'white'},
  row: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
})

