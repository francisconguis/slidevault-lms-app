import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import Header from './src/components/Header';
import UploadPptModal from './src/components/UploadPptModal';
import UploadExerciseModal from './src/components/UploadExerciseModal';
import ResourceDetailModal from './src/components/ResourceDetailModal';
import AddCourseModal from './src/components/AddCourseModal';

import {
  loadLmsData,
  saveCourses,
  savePresentations,
  saveExercises,
  resetLmsData,
} from './src/storage/lmsStorage';

export default function App() {
  const [role, setRole] = useState('teacher'); // 'teacher' | 'student'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'ppts' | 'exercises' | 'courses'
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [courses, setCourses] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [exercises, setExercises] = useState([]);

  // Modals
  const [showUploadPpt, setShowUploadPpt] = useState(false);
  const [showUploadExercise, setShowUploadExercise] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null); // { item, type: 'ppt' | 'exercise' }

  useEffect(() => {
    (async () => {
      const data = await loadLmsData();
      setCourses(data.courses);
      setPresentations(data.presentations);
      setExercises(data.exercises);
    })();
  }, []);

  const courseMap = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [courses]);

  const filteredPresentations = useMemo(() => {
    return presentations.filter((ppt) => {
      const matchesCourse =
        selectedCourseFilter === 'ALL' || ppt.courseId === selectedCourseFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ppt.title.toLowerCase().includes(q) ||
        ppt.fileName.toLowerCase().includes(q) ||
        ppt.description.toLowerCase().includes(q);
      return matchesCourse && matchesSearch;
    });
  }, [presentations, selectedCourseFilter, searchQuery]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesCourse =
        selectedCourseFilter === 'ALL' || ex.courseId === selectedCourseFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.title.toLowerCase().includes(q) ||
        ex.fileName.toLowerCase().includes(q) ||
        ex.instructions.toLowerCase().includes(q);
      return matchesCourse && matchesSearch;
    });
  }, [exercises, selectedCourseFilter, searchQuery]);

  const totalSubmissionsCount = useMemo(() => {
    return exercises.reduce(
      (acc, ex) => acc + (ex.submissions ? ex.submissions.length : 0),
      0
    );
  }, [exercises]);

  const handleUploadPpt = async (newPpt) => {
    const updated = [newPpt, ...presentations];
    setPresentations(updated);
    await savePresentations(updated);
    Alert.alert(
      'PPT Uploaded',
      `"${newPpt.fileName}" has been stored in SlideVault LMS.`
    );
  };

  const handleUploadExercise = async (newExercise) => {
    const updated = [newExercise, ...exercises];
    setExercises(updated);
    await saveExercises(updated);
    Alert.alert(
      'Exercise Uploaded',
      `"${newExercise.title}" has been published to the LMS.`
    );
  };

  const handleAddCourse = async (newCourse) => {
    const updated = [...courses, newCourse];
    setCourses(updated);
    await saveCourses(updated);
  };

  const handleDeleteItem = async (id, type) => {
    if (type === 'ppt') {
      const updated = presentations.filter((item) => item.id !== id);
      setPresentations(updated);
      await savePresentations(updated);
    } else {
      const updated = exercises.filter((item) => item.id !== id);
      setExercises(updated);
      await saveExercises(updated);
    }
  };

  const handleAddSubmission = async (exerciseId, submission) => {
    const updated = exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      const updatedSubs = [submission, ...(ex.submissions || [])];
      const updatedEx = { ...ex, submissions: updatedSubs };
      if (detailTarget && detailTarget.item.id === exerciseId) {
        setDetailTarget({ item: updatedEx, type: 'exercise' });
      }
      return updatedEx;
    });
    setExercises(updated);
    await saveExercises(updated);
  };

  const handleResetDemo = async () => {
    const fresh = await resetLmsData();
    setCourses(fresh.courses);
    setPresentations(fresh.presentations);
    setExercises(fresh.exercises);
    setSelectedCourseFilter('ALL');
    setSearchQuery('');
    Alert.alert('Demo Data Restored', 'Sample PPTs and Exercises restored.');
  };

  const renderPptCard = (ppt) => {
    const course = courseMap[ppt.courseId];
    return (
      <TouchableOpacity
        key={ppt.id}
        style={styles.resourceCard}
        activeOpacity={0.85}
        onPress={() => setDetailTarget({ item: ppt, type: 'ppt' })}
      >
        <View style={styles.resourceTopRow}>
          <View style={[styles.fileBadge, { backgroundColor: '#FFEDD5' }]}>
            <Ionicons name="easel" size={20} color="#EA580C" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.badgeLine}>
              <Text
                style={[
                  styles.courseTagText,
                  { color: course?.color || '#4F46E5' },
                ]}
              >
                {course ? `${course.code} • ${course.name}` : 'Course'}
              </Text>
              <View style={styles.pptFormatPill}>
                <Text style={styles.pptFormatText}>PPTX</Text>
              </View>
            </View>
            <Text style={styles.resourceTitle}>{ppt.title}</Text>
          </View>
        </View>

        <Text style={styles.resourceDesc} numberOfLines={2}>
          {ppt.description}
        </Text>

        <View style={styles.resourceFooter}>
          <View style={styles.fileChip}>
            <Ionicons name="document-attach-outline" size={14} color="#64748B" />
            <Text style={styles.fileChipText} numberOfLines={1}>
              {ppt.fileName} ({ppt.fileSize})
            </Text>
          </View>
          <View style={styles.slideCountBadge}>
            <Ionicons name="layers-outline" size={13} color="#EA580C" />
            <Text style={styles.slideCountText}>{ppt.slideCount} slides</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderExerciseCard = (ex) => {
    const course = courseMap[ex.courseId];
    const subCount = ex.submissions ? ex.submissions.length : 0;

    return (
      <TouchableOpacity
        key={ex.id}
        style={styles.resourceCard}
        activeOpacity={0.85}
        onPress={() => setDetailTarget({ item: ex, type: 'exercise' })}
      >
        <View style={styles.resourceTopRow}>
          <View style={[styles.fileBadge, { backgroundColor: '#CCFBF1' }]}>
            <Ionicons name="clipboard" size={20} color="#0D9488" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.badgeLine}>
              <Text
                style={[
                  styles.courseTagText,
                  { color: course?.color || '#0D9488' },
                ]}
              >
                {course ? `${course.code} • ${course.name}` : 'Course'}
              </Text>
              <View style={styles.pointsPill}>
                <Text style={styles.pointsPillText}>{ex.points} pts</Text>
              </View>
            </View>
            <Text style={styles.resourceTitle}>{ex.title}</Text>
          </View>
        </View>

        <Text style={styles.resourceDesc} numberOfLines={2}>
          {ex.instructions}
        </Text>

        <View style={styles.resourceFooter}>
          <View style={styles.fileChip}>
            <Ionicons name="calendar-outline" size={14} color="#B45309" />
            <Text style={[styles.fileChipText, { color: '#B45309' }]}>
              Due: {ex.dueDate}
            </Text>
          </View>
          <View
            style={[
              styles.subCountBadge,
              subCount > 0 && { backgroundColor: '#DCFCE7' },
            ]}
          >
            <Ionicons
              name={subCount > 0 ? 'checkmark-circle' : 'cloud-upload-outline'}
              size={13}
              color={subCount > 0 ? '#15803D' : '#0D9488'}
            />
            <Text
              style={[
                styles.subCountText,
                subCount > 0 && { color: '#15803D' },
              ]}
            >
              {subCount > 0 ? `${subCount} Submitted` : 'Submit Work'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" backgroundColor="#312E81" />

      <Header
        role={role}
        onToggleRole={() =>
          setRole((prev) => (prev === 'teacher' ? 'student' : 'teacher'))
        }
        onOpenAddCourse={() => setShowAddCourse(true)}
      />

      {/* Quick Upload Bar */}
      <View style={styles.actionBanner}>
        <TouchableOpacity
          style={styles.uploadPptBtn}
          onPress={() => setShowUploadPpt(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="easel-outline" size={18} color="#FFFFFF" />
          <Text style={styles.uploadBtnText}>+ Upload PPT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadExerciseBtn}
          onPress={() => setShowUploadExercise(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="clipboard-outline" size={18} color="#FFFFFF" />
          <Text style={styles.uploadBtnText}>+ Upload Exercise</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Course Filter Bar */}
      <View style={styles.searchFilterWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search PPT slides, exercises, or files..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseChipBar}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCourseFilter === 'ALL' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCourseFilter('ALL')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCourseFilter === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              All Courses
            </Text>
          </TouchableOpacity>

          {courses.map((course) => {
            const active = selectedCourseFilter === course.id;
            return (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.filterChip,
                  active && {
                    backgroundColor: course.color,
                    borderColor: course.color,
                  },
                ]}
                onPress={() => setSelectedCourseFilter(course.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {course.code}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.addCourseChip}
            onPress={() => setShowAddCourse(true)}
          >
            <Ionicons name="add" size={15} color="#4F46E5" />
            <Text style={styles.addCourseChipText}>New Course</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'dashboard' && (
          <>
            {/* Storage & LMS Stats Cards */}
            <View style={styles.statsGrid}>
              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: '#EA580C' }]}
                onPress={() => setActiveTab('ppts')}
              >
                <Text style={styles.statValue}>{presentations.length}</Text>
                <Text style={styles.statLabel}>PPT Files Stored</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: '#0D9488' }]}
                onPress={() => setActiveTab('exercises')}
              >
                <Text style={styles.statValue}>{exercises.length}</Text>
                <Text style={styles.statLabel}>Exercises Posted</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: '#4F46E5' }]}
                onPress={() => setActiveTab('courses')}
              >
                <Text style={styles.statValue}>{courses.length}</Text>
                <Text style={styles.statLabel}>Active Courses</Text>
              </TouchableOpacity>
            </View>

            {/* Recent PPT Presentations Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Stored Presentation Files (PPT)
              </Text>
              <TouchableOpacity onPress={() => setActiveTab('ppts')}>
                <Text style={styles.seeAllText}>
                  View All ({filteredPresentations.length})
                </Text>
              </TouchableOpacity>
            </View>

            {filteredPresentations.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="easel-outline" size={32} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No PPT Files Found</Text>
                <Text style={styles.emptySub}>
                  Tap "+ Upload PPT" above to store a PowerPoint presentation.
                </Text>
              </View>
            ) : (
              filteredPresentations.slice(0, 3).map(renderPptCard)
            )}

            {/* Recent Exercises Section */}
            <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
              <Text style={styles.sectionTitle}>Course Exercises & Labs</Text>
              <TouchableOpacity onPress={() => setActiveTab('exercises')}>
                <Text style={styles.seeAllText}>
                  View All ({filteredExercises.length})
                </Text>
              </TouchableOpacity>
            </View>

            {filteredExercises.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="clipboard-outline" size={32} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Exercises Found</Text>
                <Text style={styles.emptySub}>
                  Tap "+ Upload Exercise" above to post a new worksheet or lab.
                </Text>
              </View>
            ) : (
              filteredExercises.slice(0, 3).map(renderExerciseCard)
            )}
          </>
        )}

        {activeTab === 'ppts' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                All Presentation Files ({filteredPresentations.length})
              </Text>
              <TouchableOpacity onPress={() => setShowUploadPpt(true)}>
                <Text style={styles.seeAllText}>+ Upload New PPT</Text>
              </TouchableOpacity>
            </View>
            {filteredPresentations.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="easel-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyTitle}>
                  No Presentations Uploaded Yet
                </Text>
                <Text style={styles.emptySub}>
                  Upload .ppt, .pptx, or .pdf presentation decks for your
                  students.
                </Text>
              </View>
            ) : (
              filteredPresentations.map(renderPptCard)
            )}
          </>
        )}

        {activeTab === 'exercises' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                All Exercises & Worksheets ({filteredExercises.length})
              </Text>
              <TouchableOpacity onPress={() => setShowUploadExercise(true)}>
                <Text style={styles.seeAllText}>+ Upload Exercise</Text>
              </TouchableOpacity>
            </View>
            {filteredExercises.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="clipboard-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Exercises Uploaded Yet</Text>
                <Text style={styles.emptySub}>
                  Upload lab worksheets or exercises for students to complete.
                </Text>
              </View>
            ) : (
              filteredExercises.map(renderExerciseCard)
            )}
          </>
        )}

        {activeTab === 'courses' && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                LMS Course Folders ({courses.length})
              </Text>
              <TouchableOpacity onPress={() => setShowAddCourse(true)}>
                <Text style={styles.seeAllText}>+ Add Course</Text>
              </TouchableOpacity>
            </View>

            {courses.map((course) => {
              const pptCount = presentations.filter(
                (p) => p.courseId === course.id
              ).length;
              const exCount = exercises.filter(
                (e) => e.courseId === course.id
              ).length;

              return (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseFolderCard}
                  onPress={() => {
                    setSelectedCourseFilter(course.id);
                    setActiveTab('dashboard');
                  }}
                >
                  <View
                    style={[
                      styles.courseFolderIcon,
                      { backgroundColor: course.color },
                    ]}
                  >
                    <Ionicons name="folder-open" size={22} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.courseFolderCode}>{course.code}</Text>
                    <Text style={styles.courseFolderName}>{course.name}</Text>
                    <Text style={styles.courseFolderInst}>
                      {course.instructor}
                    </Text>
                  </View>
                  <View style={styles.courseCountsCol}>
                    <Text style={styles.courseCountPill}>
                      {pptCount} PPTs
                    </Text>
                    <Text
                      style={[
                        styles.courseCountPill,
                        { backgroundColor: '#CCFBF1', color: '#0F766E' },
                      ]}
                    >
                      {exCount} Exercises
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={styles.storageSummaryCard}>
              <View style={styles.storageHeader}>
                <Ionicons name="server-outline" size={20} color="#4F46E5" />
                <Text style={styles.storageTitle}>
                  LMS Local Vault Summary
                </Text>
              </View>
              <Text style={styles.storageText}>
                • Total Stored Presentations: {presentations.length} PPT/PPTX
                files
              </Text>
              <Text style={styles.storageText}>
                • Total Exercises & Worksheets: {exercises.length} files
              </Text>
              <Text style={styles.storageText}>
                • Total Student Exercise Submissions: {totalSubmissionsCount}
              </Text>

              <TouchableOpacity
                style={styles.resetDemoBtn}
                onPress={handleResetDemo}
              >
                <Ionicons name="refresh-outline" size={16} color="#475569" />
                <Text style={styles.resetDemoText}>
                  Reset Sample LMS Data
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons
            name={activeTab === 'dashboard' ? 'grid' : 'grid-outline'}
            size={21}
            color={activeTab === 'dashboard' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'dashboard' && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('ppts')}
        >
          <Ionicons
            name={activeTab === 'ppts' ? 'easel' : 'easel-outline'}
            size={21}
            color={activeTab === 'ppts' ? '#EA580C' : '#64748B'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'ppts' && { color: '#EA580C', fontWeight: '700' },
            ]}
          >
            PPT Files
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('exercises')}
        >
          <Ionicons
            name={
              activeTab === 'exercises' ? 'clipboard' : 'clipboard-outline'
            }
            size={21}
            color={activeTab === 'exercises' ? '#0D9488' : '#64748B'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'exercises' && {
                color: '#0D9488',
                fontWeight: '700',
              },
            ]}
          >
            Exercises
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('courses')}
        >
          <Ionicons
            name={activeTab === 'courses' ? 'folder' : 'folder-outline'}
            size={21}
            color={activeTab === 'courses' ? '#4F46E5' : '#64748B'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'courses' && styles.navLabelActive,
            ]}
          >
            Courses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <UploadPptModal
        visible={showUploadPpt}
        onClose={() => setShowUploadPpt(false)}
        courses={courses}
        onUploadPpt={handleUploadPpt}
      />

      <UploadExerciseModal
        visible={showUploadExercise}
        onClose={() => setShowUploadExercise(false)}
        courses={courses}
        onUploadExercise={handleUploadExercise}
      />

      <AddCourseModal
        visible={showAddCourse}
        onClose={() => setShowAddCourse(false)}
        onAddCourse={handleAddCourse}
      />

      <ResourceDetailModal
        visible={!!detailTarget}
        item={detailTarget?.item}
        type={detailTarget?.type}
        course={
          detailTarget?.item ? courseMap[detailTarget.item.courseId] : null
        }
        role={role}
        onClose={() => setDetailTarget(null)}
        onDeleteItem={handleDeleteItem}
        onAddSubmission={handleAddSubmission}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  actionBanner: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    gap: 10,
  },
  uploadPptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    paddingVertical: 11,
    borderRadius: 12,
    marginRight: 6,
    elevation: 2,
  },
  uploadExerciseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D9488',
    paddingVertical: 11,
    borderRadius: 12,
    marginLeft: 6,
    elevation: 2,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  searchFilterWrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    marginLeft: 8,
    paddingVertical: 2,
  },
  courseChipBar: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#312E81',
    borderColor: '#312E81',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  addCourseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginRight: 8,
  },
  addCourseChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    marginLeft: 3,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 3,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resourceTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fileBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  courseTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pptFormatPill: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pptFormatText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2410C',
  },
  pointsPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pointsPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  resourceDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 8,
    lineHeight: 18,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  fileChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 5,
  },
  slideCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slideCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EA580C',
    marginLeft: 4,
  },
  subCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
    marginLeft: 4,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  courseFolderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  courseFolderIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseFolderCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  courseFolderName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  courseFolderInst: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  courseCountsCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  courseCountPill: {
    backgroundColor: '#FFEDD5',
    color: '#C2410C',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  storageSummaryCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#312E81',
    marginLeft: 8,
  },
  storageText: {
    fontSize: 12,
    color: '#3730A3',
    marginBottom: 4,
    fontWeight: '600',
  },
  resetDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 10,
  },
  resetDemoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginLeft: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
});
