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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { formatFileSize, formatCurrentTimestamp } from '../storage/lmsStorage';

export default function ResourceDetailModal({
  visible,
  item,
  type, // 'ppt' | 'exercise'
  course,
  role,
  onClose,
  onDeleteItem,
  onAddSubmission,
}) {
  const [studentName, setStudentName] = useState('Student User');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [pickedSubmissionFile, setPickedSubmissionFile] = useState(null);

  if (!item) return null;

  const isPpt = type === 'ppt';

  const handleOpenOrShareFile = async () => {
    try {
      if (item.fileUri) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(item.fileUri);
          return;
        }
      }
      Alert.alert(
        isPpt ? 'Presentation File Ready' : 'Exercise File Ready',
        `File: ${item.fileName} (${item.fileSize})\n\nStored in SlideVault LMS under ${
          course?.code || 'Course'
        }.`
      );
    } catch (error) {
      Alert.alert('File Info', `File Name: ${item.fileName} (${item.fileSize})`);
    }
  };

  const handlePickStudentFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPickedSubmissionFile({
          name: asset.name,
          size: formatFileSize(asset.size),
          uri: asset.uri,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to pick submission file.');
    }
  };

  const handleUseDemoSubmission = () => {
    setPickedSubmissionFile({
      name: `Student_Exercise_Answer_${Date.now().toString().slice(-4)}.pdf`,
      size: '920 KB',
      uri: null,
    });
  };

  const handleSubmitExerciseWork = () => {
    if (!pickedSubmissionFile) {
      Alert.alert(
        'Attach Answer File',
        'Please select your answer file from your device or tap "Attach Sample Answer File".'
      );
      return;
    }

    const newSubmission = {
      id: `sub-${Date.now()}`,
      studentName: studentName.trim() || 'Student User',
      fileName: pickedSubmissionFile.name,
      fileSize: pickedSubmissionFile.size,
      fileUri: pickedSubmissionFile.uri,
      submittedAt: formatCurrentTimestamp(),
      notes: submissionNotes.trim() || 'Submitted via SlideVault LMS Mobile.',
      status: 'Submitted',
    };

    onAddSubmission(item.id, newSubmission);
    setPickedSubmissionFile(null);
    setSubmissionNotes('');
    Alert.alert('Exercise Submitted!', 'Your exercise file has been uploaded.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.typeTag,
                { backgroundColor: isPpt ? '#FFEDD5' : '#CCFBF1' },
              ]}
            >
              <Ionicons
                name={isPpt ? 'easel' : 'clipboard'}
                size={15}
                color={isPpt ? '#EA580C' : '#0D9488'}
              />
              <Text
                style={[
                  styles.typeTagText,
                  { color: isPpt ? '#C2410C' : '#0F766E' },
                ]}
              >
                {isPpt ? 'PPT PRESENTATION' : 'LMS EXERCISE'}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.courseLabel}>
              {course ? `${course.code} • ${course.name}` : 'General Course'}
            </Text>
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Ionicons name="person-outline" size={13} color="#475569" />
                <Text style={styles.metaText}>{item.uploadedBy}</Text>
              </View>
              <View style={styles.metaPill}>
                <Ionicons name="time-outline" size={13} color="#475569" />
                <Text style={styles.metaText}>{item.uploadedAt}</Text>
              </View>
              {isPpt ? (
                <View style={styles.metaPill}>
                  <Ionicons name="layers-outline" size={13} color="#EA580C" />
                  <Text style={[styles.metaText, { color: '#EA580C' }]}>
                    {item.slideCount} Slides
                  </Text>
                </View>
              ) : (
                <View style={styles.metaPill}>
                  <Ionicons name="star-outline" size={13} color="#0D9488" />
                  <Text style={[styles.metaText, { color: '#0D9488' }]}>
                    {item.points} Pts
                  </Text>
                </View>
              )}
            </View>

            {/* Attached File Box */}
            <View style={styles.fileCard}>
              <View
                style={[
                  styles.fileIconBox,
                  { backgroundColor: isPpt ? '#EA580C' : '#0D9488' },
                ]}
              >
                <Ionicons
                  name={isPpt ? 'easel-outline' : 'document-text-outline'}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {item.fileName}
                </Text>
                <Text style={styles.fileSub}>
                  Size: {item.fileSize} • Stored in LMS Vault
                </Text>
              </View>
              <TouchableOpacity
                style={styles.openFileBtn}
                onPress={handleOpenOrShareFile}
              >
                <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                <Text style={styles.openFileBtnText}>Open</Text>
              </TouchableOpacity>
            </View>

            {/* Description or Instructions */}
            <Text style={styles.sectionHeader}>
              {isPpt ? 'Presentation Overview' : 'Exercise Instructions'}
            </Text>
            <Text style={styles.bodyText}>
              {isPpt ? item.description : item.instructions}
            </Text>

            {!isPpt && (
              <View style={styles.dueBox}>
                <Ionicons name="calendar-outline" size={18} color="#B45309" />
                <Text style={styles.dueText}>Due Date: {item.dueDate}</Text>
              </View>
            )}

            {/* PPT Slide Outline */}
            {isPpt && item.keyTopics && item.keyTopics.length > 0 && (
              <View style={styles.topicsContainer}>
                <Text style={styles.sectionHeader}>
                  Slide Deck Contents / Outline
                </Text>
                {item.keyTopics.map((topic, idx) => (
                  <View key={idx} style={styles.topicItem}>
                    <View style={styles.topicBadge}>
                      <Text style={styles.topicBadgeText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.topicText}>{topic}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Exercise Student Submission Section */}
            {!isPpt && (
              <View style={styles.submissionSection}>
                <Text style={styles.sectionHeader}>
                  Upload Exercise Submission ({item.submissions?.length || 0})
                </Text>

                <View style={styles.uploadBox}>
                  <Text style={styles.smallLabel}>Student Name</Text>
                  <TextInput
                    style={styles.input}
                    value={studentName}
                    onChangeText={setStudentName}
                    placeholder="Your Full Name"
                  />

                  <TouchableOpacity
                    style={styles.pickAnswerBtn}
                    onPress={handlePickStudentFile}
                  >
                    <Ionicons
                      name="attach-outline"
                      size={20}
                      color="#4F46E5"
                    />
                    <Text style={styles.pickAnswerText}>
                      {pickedSubmissionFile
                        ? `${pickedSubmissionFile.name} (${pickedSubmissionFile.size})`
                        : 'Select Completed Exercise File from Phone'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickSampleSub}
                    onPress={handleUseDemoSubmission}
                  >
                    <Text style={styles.quickSampleSubText}>
                      + Or Attach Sample Answer File
                    </Text>
                  </TouchableOpacity>

                  <TextInput
                    style={[styles.input, { marginTop: 8 }]}
                    value={submissionNotes}
                    onChangeText={setSubmissionNotes}
                    placeholder="Optional comment or note for instructor..."
                  />

                  <TouchableOpacity
                    style={styles.submitWorkBtn}
                    onPress={handleSubmitExerciseWork}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.submitWorkBtnText}>
                      Submit Exercise File
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Existing Submissions List */}
                {item.submissions && item.submissions.length > 0 && (
                  <View style={{ marginTop: 14 }}>
                    <Text style={styles.subListTitle}>
                      Submitted Exercise Files:
                    </Text>
                    {item.submissions.map((sub) => (
                      <View key={sub.id} style={styles.subCard}>
                        <Ionicons
                          name="document-attach"
                          size={20}
                          color="#0D9488"
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.subFileName}>{sub.fileName}</Text>
                          <Text style={styles.subMeta}>
                            By {sub.studentName} • {sub.fileSize} •{' '}
                            {sub.submittedAt}
                          </Text>
                          {sub.notes ? (
                            <Text style={styles.subNotes}>"{sub.notes}"</Text>
                          ) : null}
                        </View>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusBadgeText}>
                            {sub.status}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Delete option */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                onDeleteItem(item.id, type);
                onClose();
              }}
            >
              <Ionicons name="trash-outline" size={17} color="#DC2626" />
              <Text style={styles.deleteBtnText}>
                Remove {isPpt ? 'Presentation' : 'Exercise'} from Storage
              </Text>
            </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
  },
  closeBtn: {
    padding: 4,
  },
  courseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 25,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 14,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 4,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  fileSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  openFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  openFileBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 6,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 12,
  },
  dueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  dueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8,
  },
  topicsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  topicBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topicBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C2410C',
  },
  topicText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  submissionSection: {
    marginTop: 6,
    marginBottom: 10,
  },
  uploadBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  pickAnswerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 11,
    marginTop: 10,
  },
  pickAnswerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
    marginLeft: 6,
  },
  quickSampleSub: {
    alignSelf: 'center',
    marginTop: 6,
  },
  quickSampleSubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
  submitWorkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D9488',
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 10,
  },
  submitWorkBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  subListTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  subFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  subMeta: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  subNotes: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#0F766E',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 6,
  },
});
