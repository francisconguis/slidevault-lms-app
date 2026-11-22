import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COURSE_COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#D97706', '#E11D48', '#7C3AED'];

export default function AddCourseModal({ visible, onClose, onAddCourse }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [selectedColor, setSelectedColor] = useState(COURSE_COLORS[0]);

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      Alert.alert('Missing Info', 'Please enter both Course Code and Course Name.');
      return;
    }

    onAddCourse({
      id: `course-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      instructor: instructor.trim() || 'Course Instructor',
      color: selectedColor,
      icon: 'book-outline',
    });

    setCode('');
    setName('');
    setInstructor('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Create New LMS Course</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Course Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., CS 302"
            placeholderTextColor="#94A3B8"
            value={code}
            onChangeText={setCode}
          />

          <Text style={styles.label}>Course / Subject Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Software Engineering"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Instructor Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Prof. L. Mendoza"
            placeholderTextColor="#94A3B8"
            value={instructor}
            onChangeText={setInstructor}
          />

          <Text style={styles.label}>Folder Theme Color</Text>
          <View style={styles.colorRow}>
            {COURSE_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorDotSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Add Course Folder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 18,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
