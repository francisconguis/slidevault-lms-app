import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { formatFileSize, formatCurrentTimestamp } from '../storage/lmsStorage';

export default function UploadPptModal({
  visible,
  onClose,
  courses,
  onUploadPpt,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(
    courses[0]?.id || 'course-1'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slideCount, setSlideCount] = useState('20');
  const [keyTopicsText, setKeyTopicsText] = useState('');
  const [pickedFile, setPickedFile] = useState(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/pdf',
          '*/*',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPickedFile({
          name: asset.name,
          size: formatFileSize(asset.size),
          uri: asset.uri,
          mimeType:
            asset.mimeType ||
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        });
        if (!title.trim()) {
          const cleanName = asset.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setTitle(cleanName);
        }
      }
    } catch (error) {
      Alert.alert('File Picker Error', 'Could not pick the presentation file.');
    }
  };

  const handleUseDemoPpt = () => {
    const sampleNumber = Math.floor(Math.random() * 9) + 2;
    const sampleFileName = `Lecture_Module_${sampleNumber}_Presentation.pptx`;
    setPickedFile({
      name: sampleFileName,
      size: '5.4 MB',
      uri: null,
      mimeType:
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    if (!title.trim()) {
      setTitle(`Module ${sampleNumber}: Advanced Concepts & Architecture`);
    }
    if (!description.trim()) {
      setDescription(
        'Presentation slide deck covering core lecture topics, diagrams, and review questions.'
      );
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a presentation title.');
      return;
    }
    if (!pickedFile) {
      Alert.alert(
        'Missing PPT File',
        'Please select a PPT/PPTX file from your device or tap "Attach Sample .PPTX" to test.'
      );
      return;
    }

    const parsedTopics = keyTopicsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const newPpt = {
      id: `ppt-${Date.now()}`,
      courseId: selectedCourseId || courses[0]?.id,
      title: title.trim(),
      description:
        description.trim() ||
        'Uploaded lecture presentation deck for student review.',
      fileName: pickedFile.name,
      fileSize: pickedFile.size,
      mimeType: pickedFile.mimeType,
      fileUri: pickedFile.uri,
      slideCount: parseInt(slideCount, 10) || 15,
      uploadedBy: 'Instructor',
      uploadedAt: formatCurrentTimestamp(),
      keyTopics:
        parsedTopics.length > 0
          ? parsedTopics
          : [
              'Slide 1-5: Topic Overview & Learning Objectives',
              'Slide 6-12: Core Concepts & Diagrams',
              'Slide 13-18: Practical Examples & Summary',
            ],
    };

    onUploadPpt(newPpt);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSlideCount('20');
    setKeyTopicsText('');
    setPickedFile(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="easel" size={20} color="#EA580C" />
              </View>
              <View>
                <Text style={styles.sheetTitle}>Upload Presentation (PPT)</Text>
                <Text style={styles.sheetSub}>
                  Store .ppt, .pptx, or .pdf lecture slides in LMS
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

            <Text style={styles.label}>2. Presentation File (.ppt / .pptx)</Text>
            <TouchableOpacity
              style={[
                styles.fileDropzone,
                pickedFile && styles.fileDropzoneActive,
              ]}
              onPress={handlePickDocument}
              activeOpacity={0.8}
            >
              <Ionicons
                name={pickedFile ? 'document-attach' : 'cloud-upload-outline'}
                size={32}
                color={pickedFile ? '#EA580C' : '#6366F1'}
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
                    Tap to Browse Device for PPT / PPTX File
                  </Text>
                  <Text style={styles.dropzoneHint}>
                    Supports PowerPoint (.ppt, .pptx) & PDF slides
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleBtn}
              onPress={handleUseDemoPpt}
            >
              <Ionicons name="sparkles-outline" size={15} color="#4F46E5" />
              <Text style={styles.sampleBtnText}>
                Quick Test: Attach Sample .PPTX File
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>3. Presentation Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Week 5: UI/UX Navigation Patterns"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Estimated Slides</Text>
                <TextInput
                  style={styles.input}
                  placeholder="20"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={slideCount}
                  onChangeText={setSlideCount}
                />
              </View>
            </View>

            <Text style={styles.label}>4. Description / Lecture Summary</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write a brief overview of what this presentation covers..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>
              5. Slide Outline / Key Topics (Optional, 1 per line)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={
                'Slide 1-5: Introduction\nSlide 6-15: Core Architecture'
              }
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={keyTopicsText}
              onChangeText={setKeyTopicsText}
            />

            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Save & Upload PPT</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
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
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
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
    borderColor: '#818CF8',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDropzoneActive: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  pickedFileInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  pickedFileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412',
    textAlign: 'center',
  },
  pickedFileSize: {
    fontSize: 12,
    color: '#C2410C',
    marginTop: 2,
  },
  dropzoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3730A3',
    textAlign: 'center',
  },
  dropzoneHint: {
    fontSize: 12,
    color: '#6366F1',
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
    color: '#4F46E5',
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
    gap: 10,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
    gap: 10,
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
    backgroundColor: '#EA580C',
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
