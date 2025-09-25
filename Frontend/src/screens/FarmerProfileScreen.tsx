import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function FarmerProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Farmer Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />

      <Text style={styles.label}>Main Crop:</Text>
      <TextInput style={styles.input} value={crop} onChangeText={setCrop} placeholder="Enter crop" />

      <Button title="Save Profile" onPress={() => navigation.navigate('ActivityLog')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginTop: 5 },
});
