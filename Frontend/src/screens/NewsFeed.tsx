import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewsFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📰 Daily Farming News</Text>
      <Text>- IMD predicts rain in Kerala</Text>
      <Text>- New subsidy announced for paddy farmers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
