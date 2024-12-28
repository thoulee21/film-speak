import { ExternalLink } from '@/components/ExternalLink';
import { useUpdates } from 'expo-updates';
import { StyleSheet, View } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function TestScreen() {
  const { isUpdateAvailable } = useUpdates();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>
        Update available: {isUpdateAvailable ? 'Yes' : 'No'}
      </Title>
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
