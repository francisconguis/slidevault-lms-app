import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ role, onToggleRole, onOpenAddCourse }) {
  const isTeacher = role === 'teacher';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <Ionicons name="easel" size={22} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>SlideVault LMS</Text>
          <Text style={styles.appSubtitle}>
            Presentation (PPT) & Exercise Storage
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.roleBadge,
            isTeacher ? styles.roleTeacher : styles.roleStudent,
          ]}
          onPress={onToggleRole}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isTeacher ? 'school' : 'person'}
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.roleText}>
            {isTeacher ? 'Instructor' : 'Student'}
          </Text>
          <Ionicons name="swap-horizontal" size={13} color="#E0E7FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#312E81',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  appTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  roleTeacher: {
    backgroundColor: '#4F46E5',
    borderWidth: 1,
    borderColor: '#818CF8',
  },
  roleStudent: {
    backgroundColor: '#059669',
    borderWidth: 1,
    borderColor: '#34D399',
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 4,
  },
});
