import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Text>This is transactions</Text>
      <Link href={'/'}>Home</Link>
      <Link href={'/inventory'}>Inventory</Link>
    </View>
  )
}