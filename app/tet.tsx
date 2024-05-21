import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

interface Note {
  id: string;
  text: string;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const notesData = await AsyncStorage.getItem('notes');
      if (notesData) {
        setNotes(JSON.parse(notesData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveNote = async () => {
    if (newNoteText.trim() === '') {
      Alert.alert('Error', 'Note cannot be empty');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      text: newNoteText,
    };

    try {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNewNoteText('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new note"
          value={newNoteText}
          onChangeText={setNewNoteText}
        />
        <Button title="Save" onPress={saveNote} />
      </View>
      <View style={styles.notesContainer}>
        {notes.map((note) => (
          <View key={note.id} style={styles.note}>
            <Text style={styles.noteText}>{note.text}</Text>
            <Button title="Delete" onPress={() => deleteNote(note.id)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  notesContainer: {
    flex: 1,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteText: {
    flex: 1,
    fontSize: 18,
    marginRight: 10,
  },
});