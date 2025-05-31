import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TaskItem({ task }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.titulo}</Text>
      <Text>{task.info}</Text>
      {task.fechaEntrega && <Text>Fecha entrega: {task.fechaEntrega}</Text>}
      {task.puntuacion && <Text>Puntuación: {task.puntuacion}</Text>}
      {task.descripcion && <Text>Descripción: {task.descripcion}</Text>}

      {task.documentos && task.documentos.length > 0 && (
        <>
          <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Documentos:</Text>
          <ScrollView horizontal>
            {task.documentos.map((doc, i) => (
              <Text
                key={i}
                style={styles.link}
                onPress={() => Linking.openURL(doc.enlace)}
              >
                {doc.nombre}
              </Text>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:15,
    marginBottom:15,
    backgroundColor:'#fff',
    elevation:2,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginRight: 10,
  },
});
