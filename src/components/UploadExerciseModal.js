import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { formatFileSize, formatCurrentTimestamp } from '../storage/lmsStorage';

export default function UploadExerciseModal({
  visible,
  onClose,
  courses,
  onUploadExercise,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(
    courses[0]?.id || 'course-1'
  );
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('Nov 20, 2026 • 11:59 PM');
  const [points, setPoints] = useState('100');
  const [pickedFile, setPickedFile] = useState(null);

  useEffect(() => {
    if (courses.length > 0 && !courses.some((c) => c.id === selectedCourseId)) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPickedFile({
          name: asset.name,
          size: formatFileSize(asset.size),
          uri: asset.uri,
          mimeType: asset.mimeType || 'application/pdf',
        });
        if (!title.trim()) {
          const cleanName = asset.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setTitle(cleanName);
        }
      }
    } catch (error) {
      Alert.alert('File Picker Error', 'Could not select exercise file.');
    }
  };

  const handleUseSampleWorksheet = () => {
    const num = Math.floor(Math.random() * 8) + 2;
    setPickedFile({
      name: `Lab_Exercise_${num}_Worksheet.pdf`,
      size: '740 KB',
      uri: null,
      mimeType: 'application/pdf',
    });
    if (!title.trim()) {
      setTitle(`Laboratory Exercise ${num}: Hands-On Coding & Analysis`);
    }
    if (!instructions.trim()) {
      setInstructions(
        'Complete all items in the attached exercise worksheet and upload your answer sheet or project file before the deadline.'
      );
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter an exercise title.');
      return;
    }
    if (!pickedFile) {
      Alert.alert(
        'Missing Exercise File',
        'Please attach an exercise worksheet/file or tap "Attach Sample Worksheet".'
      );
      return;
    }

    const newExercise = {
      id: `ex-${Date.now()}`,
      courseId: selectedCourseId || courses[0]?.id,
      title: title.trim(),
      instructions:
        instructions.trim() ||
        'Follow the instructions in the attached exercise file and submit your completed work.',
      dueDate: dueDate.trim() || 'Nov 25, 2026 • 11:59 PM',
      points: parseInt(points, 10) || 100,
      fileName: pickedFile.name,
      fileSize: pickedFile.size,
      mimeType: pickedFile.mimeType,
      fileUri: pickedFile.uri,
      uploadedBy: 'Instructor',
      uploadedAt: formatCurrentTimestamp(),
      submissions: [],
    };

    onUploadExercise(newExercise);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setInstructions('');
    setDueDate('Nov 20, 2026 • 11:59 PM');
    setPoints('100');
    setPickedFile(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="clipboard" size={20} color="#0D9488" />
              </View>
              <View>
                <Text style={styles.sheetTitle}>Upload Exercise / Activity</Text>
                <Text style={styles.sheetSub}>
                  Post worksheets, lab exercises & instructions
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>1. Select Course / Subject</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.courseSelector}
            >
              {courses.map((course) => {
                const active = selectedCourseId === course.id;
                return (
                  <TouchableOpacity
                    key={course.id}
                    style={[
                      styles.courseChip,
                      active && {
                        backgroundColor: course.color,
                        borderColor: course.color,
                      },
                    ]}
                    onPress={() => setSelectedCourseId(course.id)}
                  >
                    <Text
                      style={[
                        styles.courseChipText,
                        active && { color: '#FFFFFF' },
                      ]}
                    >
                      {course.code} - {course.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>
              2. Exercise File (.pdf, .docx, .pptx, .zip)
            </Text>
            <TouchableOpacity
              style={[
                styles.fileDropzone,
                pickedFile && styles.fileDropzoneActive,
              ]}
              onPress={handlePickFile}
              activeOpacity={0.8}
            >
              <Ionicons
                name={pickedFile ? 'document-text' : 'cloud-upload-outline'}
                size={32}
                color={pickedFile ? '#0D9488' : '#4F46E5'}
              />
              {pickedFile ? (
                <View style={styles.pickedFileInfo}>
                  <Text style={styles.pickedFileName}>{pickedFile.name}</Text>
                  <Text style={styles.pickedFileSize}>
                    Size: {pickedFile.size} • Ready to upload
                  </Text>
                </View>
              ) : (
                <View style={styles.pickedFileInfo}>
                  <Text style={styles.dropzoneTitle}>
                    Tap to Attach Exercise File from Device
                  </Text>
                  <Text style={styles.dropzoneHint}>
                    PDF, Word (.docx), PPTX, or ZIP activity package
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleBtn}
              onPress={handleUseSampleWorksheet}
            >
              <Ionicons name="sparkles-outline" size={15} color="#0D9488" />
              <Text style={styles.sampleBtnText}>
                Quick Test: Attach Sample Exercise Worksheet
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>3. Exercise Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Lab Exercise 4: CRUD Storage Implementation"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 2, marginRight: 8 }}>
                <Text style={styles.label}>Due Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nov 20, 2026 • 11:59 PM"
                  placeholderTextColor="#94A3B8"
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Max Points</Text>
                <TextInput
                  style={styles.input}
                  placeholder="100"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={points}
                  onChangeText={setPoints}
                />
              </View>
            </View>

            <Text style={styles.label}>4. Exercise Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Step-by-step instructions and grading criteria for students..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={instructions}
              onChangeText={setInstructions}
            />

            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Upload Exercise</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSub: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  formScroll: {
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  courseSelector: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  courseChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    marginRight: 8,
  },
  courseChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  fileDropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5EEAD4',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDropzoneActive: {
    borderColor: '#0D9488',
    backgroundColor: '#CCFBF1',
  },
  pickedFileInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  pickedFileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#115E59',
    textAlign: 'center',
  },
  pickedFileSize: {
    fontSize: 12,
    color: '#0F766E',
    marginTop: 2,
  },
  dropzoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
    textAlign: 'center',
  },
  dropzoneHint: {
    fontSize: 12,
    color: '#14B8A6',
    marginTop: 2,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  sampleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
    marginLeft: 6,
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
  rowInputs: {
    flexDirection: 'row',
  },
  textArea: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#0D9488',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
