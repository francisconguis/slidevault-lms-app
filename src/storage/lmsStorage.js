import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_COURSES,
  INITIAL_PRESENTATIONS,
  INITIAL_EXERCISES,
} from '../data/initialData';

const STORAGE_KEYS = {
  COURSES: '@slidevault_courses_v1',
  PRESENTATIONS: '@slidevault_presentations_v1',
  EXERCISES: '@slidevault_exercises_v1',
};

export async function loadLmsData() {
  try {
    const [coursesRaw, presentationsRaw, exercisesRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.COURSES),
      AsyncStorage.getItem(STORAGE_KEYS.PRESENTATIONS),
      AsyncStorage.getItem(STORAGE_KEYS.EXERCISES),
    ]);

    const courses = coursesRaw ? JSON.parse(coursesRaw) : INITIAL_COURSES;
    const presentations = presentationsRaw
      ? JSON.parse(presentationsRaw)
      : INITIAL_PRESENTATIONS;
    const exercises = exercisesRaw
      ? JSON.parse(exercisesRaw)
      : INITIAL_EXERCISES;

    if (!coursesRaw) {
      await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    }
    if (!presentationsRaw) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRESENTATIONS,
        JSON.stringify(presentations)
      );
    }
    if (!exercisesRaw) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EXERCISES,
        JSON.stringify(exercises)
      );
    }

    return { courses, presentations, exercises };
  } catch (error) {
    console.warn('Failed to load LMS data from storage, using defaults:', error);
    return {
      courses: INITIAL_COURSES,
      presentations: INITIAL_PRESENTATIONS,
      exercises: INITIAL_EXERCISES,
    };
  }
}

export async function saveCourses(courses) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (error) {
    console.warn('Error saving courses:', error);
  }
}

export async function savePresentations(presentations) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PRESENTATIONS,
      JSON.stringify(presentations)
    );
  } catch (error) {
    console.warn('Error saving presentations:', error);
  }
}

export async function saveExercises(exercises) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.EXERCISES,
      JSON.stringify(exercises)
    );
  } catch (error) {
    console.warn('Error saving exercises:', error);
  }
}

export async function resetLmsData() {
  try {
    await Promise.all([
      AsyncStorage.setItem(
        STORAGE_KEYS.COURSES,
        JSON.stringify(INITIAL_COURSES)
      ),
      AsyncStorage.setItem(
        STORAGE_KEYS.PRESENTATIONS,
        JSON.stringify(INITIAL_PRESENTATIONS)
      ),
      AsyncStorage.setItem(
        STORAGE_KEYS.EXERCISES,
        JSON.stringify(INITIAL_EXERCISES)
      ),
    ]);
    return {
      courses: INITIAL_COURSES,
      presentations: INITIAL_PRESENTATIONS,
      exercises: INITIAL_EXERCISES,
    };
  } catch (error) {
    console.warn('Error resetting LMS data:', error);
    return {
      courses: INITIAL_COURSES,
      presentations: INITIAL_PRESENTATIONS,
      exercises: INITIAL_EXERCISES,
    };
  }
}

export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.8 MB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function formatCurrentTimestamp() {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${datePart} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}
