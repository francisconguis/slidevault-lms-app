export const INITIAL_COURSES = [
  {
    id: 'course-1',
    code: 'IT 301',
    name: 'Mobile Application Development',
    instructor: 'Prof. R. Santos',
    color: '#4F46E5',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'course-2',
    code: 'CS 204',
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. A. Reyes',
    color: '#0EA5E9',
    icon: 'git-network-outline',
  },
  {
    id: 'course-3',
    code: 'IT 208',
    name: 'Database Management Systems',
    instructor: 'Prof. M. Cruz',
    color: '#10B981',
    icon: 'server-outline',
  },
];

export const INITIAL_PRESENTATIONS = [
  {
    id: 'ppt-1',
    courseId: 'course-1',
    title: 'Week 1: Introduction to React Native & Expo',
    description:
      'Covers cross-platform mobile architecture, Expo SDK setup, core components (View, Text, ScrollView), and styling with StyleSheet.',
    fileName: 'Week1_Intro_React_Native.pptx',
    fileSize: '4.2 MB',
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    slideCount: 24,
    uploadedBy: 'Prof. R. Santos',
    uploadedAt: '2026-11-01 09:30 AM',
    fileUri: null,
    keyTopics: [
      'Slide 1-5: Native vs Cross-Platform Development',
      'Slide 6-12: Setting up Expo Go & Metro Bundler',
      'Slide 13-19: Core UI Components & Flexbox Layout',
      'Slide 20-24: State & Props in Mobile Screens',
    ],
  },
  {
    id: 'ppt-2',
    courseId: 'course-2',
    title: 'Module 3: Trees, Binary Search Trees & Heaps',
    description:
      'Visual walkthrough of tree traversals (Inorder, Preorder, Postorder), BST insertion/deletion, and Min/Max Heap priority queues.',
    fileName: 'Module3_Trees_and_Heaps.pptx',
    fileSize: '6.8 MB',
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    slideCount: 32,
    uploadedBy: 'Dr. A. Reyes',
    uploadedAt: '2026-11-03 02:15 PM',
    fileUri: null,
    keyTopics: [
      'Slide 1-8: Tree Terminology & Hierarchical Structures',
      'Slide 9-18: Binary Search Tree Operations & Complexity',
      'Slide 19-26: Depth-First vs Breadth-First Traversals',
      'Slide 27-32: Heapify Algorithm & Priority Queues',
    ],
  },
  {
    id: 'ppt-3',
    courseId: 'course-3',
    title: 'Lecture 4: Entity-Relationship (ER) Modeling & Normalization',
    description:
      'Complete slide deck on designing relational schemas, 1NF to 3NF normalization rules, and avoiding data anomalies.',
    fileName: 'Lecture4_ER_Normalization.ppt',
    fileSize: '3.5 MB',
    mimeType: 'application/vnd.ms-powerpoint',
    slideCount: 19,
    uploadedBy: 'Prof. M. Cruz',
    uploadedAt: '2026-11-05 11:00 AM',
    fileUri: null,
    keyTopics: [
      'Slide 1-6: Entities, Attributes, and Cardinality Ratios',
      'Slide 7-13: Functional Dependencies & Keys',
      'Slide 14-19: Step-by-Step 1NF, 2NF, and 3NF Examples',
    ],
  },
];

export const INITIAL_EXERCISES = [
  {
    id: 'ex-1',
    courseId: 'course-1',
    title: 'Laboratory Exercise 1: Build a Profile & File Card UI',
    instructions:
      'Create a responsive mobile screen in React Native displaying a student profile header and a list of uploaded learning materials. Attach your worksheet or source code zip/document.',
    dueDate: 'Nov 12, 2026 • 11:59 PM',
    points: 100,
    fileName: 'Lab_Exercise_1_Instructions.pdf',
    fileSize: '850 KB',
    mimeType: 'application/pdf',
    uploadedBy: 'Prof. R. Santos',
    uploadedAt: '2026-11-02 10:00 AM',
    fileUri: null,
    submissions: [
      {
        id: 'sub-1',
        studentName: 'Juan Dela Cruz',
        fileName: 'DelaCruz_Lab1_Solution.pdf',
        fileSize: '1.1 MB',
        submittedAt: '2026-11-05 04:20 PM',
        notes: 'Completed all required components and tested on Expo Go.',
        status: 'Submitted',
      },
    ],
  },
  {
    id: 'ex-2',
    courseId: 'course-2',
    title: 'Practice Exercise 2: BST Traversal Dry-Run Worksheet',
    instructions:
      'Download the attached worksheet file, trace the Inorder, Preorder, and Postorder outputs for the given 3 binary trees, and upload your completed answer sheet.',
    dueDate: 'Nov 15, 2026 • 05:00 PM',
    points: 50,
    fileName: 'Exercise2_BST_Worksheet.docx',
    fileSize: '540 KB',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedBy: 'Dr. A. Reyes',
    uploadedAt: '2026-11-04 01:45 PM',
    fileUri: null,
    submissions: [],
  },
  {
    id: 'ex-3',
    courseId: 'course-3',
    title: 'Hands-On Exercise 3: Normalize an Enrollment Table to 3NF',
    instructions:
      'Given the unnormalized student enrollment spreadsheet in the attachment, decompose the table into 1NF, 2NF, and 3NF schemas and identify all primary and foreign keys.',
    dueDate: 'Nov 18, 2026 • 11:59 PM',
    points: 75,
    fileName: 'Exercise3_Normalization_Problem.pdf',
    fileSize: '620 KB',
    mimeType: 'application/pdf',
    uploadedBy: 'Prof. M. Cruz',
    uploadedAt: '2026-11-05 03:10 PM',
    fileUri: null,
    submissions: [],
  },
];
