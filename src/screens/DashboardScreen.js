import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Mock data for static display
const MOCK_TASKS = [
  {
    id: '1',
    subject: 'PROBABILIDAD Y ESTADISTICA',
    professor: 'JOSE MIGUEL RODRIGUEZ HERNANDEZ',
    section: '0310',
    title: 'TAREA 2',
    dueDate: '2024-05-06',
    type: 'homework',
    status: 'pending',
    score: 'No tiene puntuación'
  },
  {
    id: '2',
    subject: 'LIDERAZGO Y DESEMPEÑO',
    professor: 'JUANA MERIDA HERASME ORTIZ',
    section: '0810',
    title: 'TEMA 1: LIDERAZGO Y GERENCIA DEL TALENTO',
    dueDate: '2024-02-06',
    type: 'assignment',
    status: 'pending',
    score: '2 puntos',
    description: 'El liderazgo es la capacidad de influir en un grupo de personas para que trabajen juntos y alcancen un objetivo común.'
  },
  {
    id: '3',
    subject: 'LIDERAZGO Y DESEMPEÑO',
    professor: 'JUANA MERIDA HERASME ORTIZ',
    section: '0810',
    title: 'TEMA 2: ANÁLISIS Y DISEÑO DESCRIPTORES DE PUESTOS',
    dueDate: '2024-09-06',
    type: 'assignment',
    status: 'pending',
    score: '2 puntos'
  }
];

const SubjectIcon = ({ subject }) => {
  const getIconStyle = () => {
    switch (subject) {
      case 'PROBABILIDAD Y ESTADISTICA':
        return { icon: '📊', backgroundColor: '#E8F5FE' };
      case 'LIDERAZGO Y DESEMPEÑO':
        return { icon: '👥', backgroundColor: '#F0F4FF' };
      default:
        return { icon: '📚', backgroundColor: '#F5F5F5' };
    }
  };

  const { icon, backgroundColor } = getIconStyle();

  return (
    <View style={[styles.subjectIconContainer, { backgroundColor }]}>
      <Text style={styles.subjectIconText}>{icon}</Text>
    </View>
  );
};

const TaskCard = ({ task }) => {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <SubjectIcon subject={task.subject} />
        <View style={styles.taskHeaderContent}>
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>{task.subject}</Text>
            <Text style={styles.sectionText}>Sección {task.section}</Text>
          </View>
          {task.score && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{task.score}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.taskTitle}>{task.title}</Text>

      {task.description && (
        <Text style={styles.taskDescription}>{task.description}</Text>
      )}

      <Text style={styles.professorText}>
        Prof. {task.professor}
      </Text>

      <Text style={styles.dueDate}>
        Fecha de entrega: {formatDate(task.dueDate)}
      </Text>
    </View>
  );
};

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Tareas</Text>
        <Text style={styles.headerSubtitle}>
          {MOCK_TASKS.length} tareas pendientes
        </Text>
      </View>

      <ScrollView
        style={styles.tasksContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tasksContent}
      >
        {MOCK_TASKS.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  tasksContainer: {
    flex: 1,
  },
  tasksContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  taskHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  subjectIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectIconText: {
    fontSize: 24,
  },
  taskHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subjectContainer: {
    flex: 1,
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  scoreText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    lineHeight: 24,
  },
  taskDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  professorText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
});
