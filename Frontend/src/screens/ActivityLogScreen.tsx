import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function ActivityLogScreen({ navigation }) {
  const [activity, setActivity] = useState('');
  const [logs, setLogs] = useState([]);

  const addActivity = () => {
    if (activity.trim()) {
      setLogs([...logs, { id: Date.now().toString(), text: activity }]);
      setActivity('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Activities</Text>
      <TextInput
        style={styles.input}
        value={activity}
        onChangeText={setActivity}
        placeholder="Log activity (e.g., sowing paddy)"
      />
      <Button title="Add" onPress={addActivity} />

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.log}>{item.text}</Text>}
      />

      <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  log: { fontSize: 16, padding: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
