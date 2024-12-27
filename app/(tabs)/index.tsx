import { ExternalLink } from '@/components/ExternalLink';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <ExternalLink href="https://docs.expo.dev">
        <Button>
          Read the Expo documentation
        </Button>
      </ExternalLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
