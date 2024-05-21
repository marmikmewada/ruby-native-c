import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TextInput, Modal, TouchableOpacity } from 'react-native';
import useStore from './store'; // Adjust path as necessary

const TodoScreen = () => {
  const { todos, getAllTodos, addTodo, updateTodo, deleteTodo, token } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  useEffect(() => {
    // Fetch all todos when component mounts
    getAllTodos();
  }, []);

  const handleAddTodo = async () => {
    try {
      await addTodo({
        title: newTodoTitle,
        description: newTodoDescription,
      }, token);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add todo:', error.message);
    }
  };

  const handleUpdateTodo = async () => {
    try {
      await updateTodo({
        id: editTodoId,
        title: newTodoTitle,
        description: newTodoDescription,
      }, token);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update todo:', error.message);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId, token);
    } catch (error) {
      console.error('Failed to delete todo:', error.message);
    }
  };

  const openEditModal = (todo) => {
    setEditTodoId(todo.id);
    setNewTodoTitle(todo.title);
    setNewTodoDescription(todo.description);
    setShowEditModal(true);
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoTitle}>{item.title}</Text>
      <Text style={styles.todoDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTodo(item.id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <Button title="Add Todo" onPress={() => setShowAddModal(true)} />
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.todoList}
      />

      {/* Add Todo Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Todo</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTodoDescription}
              onChangeText={setNewTodoDescription}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setShowAddModal(false)} />
              <Button title="Add" onPress={handleAddTodo} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Todo</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTodoDescription}
              onChangeText={setNewTodoDescription}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setShowEditModal(false)} />
              <Button title="Update" onPress={handleUpdateTodo} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  todoList: {
    width: '100%',
  },
  todoItem: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  todoDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#add8e6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

export default TodoScreen;
