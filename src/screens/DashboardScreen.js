import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';
// import { AuthContext } from '../../context/AuthContext';

// Datos simulados (mock)
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
    score: 'No tiene puntuación',
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
    description:
      'El liderazgo es la capacidad de influir en un grupo de personas para que trabajen juntos y alcancen un objetivo común.',
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
    score: '2 puntos',
  },
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

      <Text style={styles.professorText}>Prof. {task.professor}</Text>
      <Text style={styles.dueDate}>Fecha de entrega: {formatDate(task.dueDate)}</Text>
    </View>
  );
};

export default function DashboardScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user.user_metadata.nombre_completo.toLowerCase().split(' ')[0]);
    };
    getUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* <TouchableOpacity onPress={() => logout()}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity> */}

      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Bienvenido</Text>
        <Text style={styles.headerTitle}>{user}</Text>
      </View>

      <View style={styles.mainContainer}>
      <Text style={styles.homeWorkTitle}>Mis Tareas</Text>
        {/* <Text style={styles.headerSubtitle}>
          {MOCK_TASKS.length} tareas pendientes
        </Text> */}
      <ScrollView

        style={styles.tasksContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tasksContent}
        >
        {MOCK_TASKS.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollView>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 30,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  homeWorkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight:500,
    textTransform: 'capitalize',
  },
  mainContainer: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  tasksContainer: {
    flex: 1,
  },
  tasksContent: {
    // padding: 16,
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
    marginBottom: 12,
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subjectIconText: {
    fontSize: 20,
  },
  taskHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectContainer: {
    flex: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    color: '#888',
  },
  scoreContainer: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  scoreText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  professorText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 13,
    color: '#999',
  },
});
