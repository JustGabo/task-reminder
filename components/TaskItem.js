import React from 'react';
import { Text, View } from 'react-native';

export default function TaskItem({ tarea }) {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: 'bold' }}>{tarea.nombre}</Text>
      <Text>Vence: {tarea.fecha_entrega}</Text>
    </View>
  );
}
