import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Text>This is inventory</Text>
      <Link href={'/'}>Home</Link>
      <Link href={'/transactions'}>Transactions</Link>
    </View>
  )
}