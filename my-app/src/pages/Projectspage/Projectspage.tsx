import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import styles from './Projectpage.styles';
import NavBar from '../Components/NavBar';

// --- MOCK DATA ---
const mockUser = { name: 'Ana' };

const initialProjects = [
  { id: 1, projectname: 'DEVELOP' },
  { id: 2, projectname: 'PW' },
  { id: 3, projectname: 'CSD' },
  { id: 4, projectname: 'Marketing App' },
  { id: 5, projectname: 'E-Learning Platform' },
  { id: 6, projectname: 'Mobile Wallet' },
];



export default function ProjectsPage({ navigation }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Filtering
  const filteredProjects = projects.filter((p) =>
    p.projectname.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setEditName(project.projectname);
    setEditModal(true);
  };

  const handleDelete = (project: any) => {
    setSelectedProject(project);
    setDeleteModal(true);
  };

  const saveEdit = () => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id ? { ...p, projectname: editName } : p
      )
    );
    setEditModal(false);
    setSelectedProject(null);
  };

  const confirmDelete = () => {
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setDeleteModal(false);
    setSelectedProject(null);
  };

  return (
    <View style={styles.appContainer}>
      {/* Top Navigation Bar */}
     <NavBar currentScreen="Projects" navigation={navigation} />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.actionBar}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pretraži projekt"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>Dodaj projekt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          <ScrollView>
            {filteredProjects.length === 0 && (
              <Text style={styles.noResults}>Nema rezultata.</Text>
            )}
            {filteredProjects.map((project) => (
              <View key={project.id} style={styles.projectRow}>
                <Text style={styles.projectName}>{project.projectname}</Text>
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleEdit(project)}
                  >
                    <Text style={styles.actionIconText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDelete(project)}
                  >
                    <Text style={styles.actionIconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Add Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dodaj Projekt</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Naziv projekta:</Text>
                <TextInput
                  style={styles.formInput}
                  value={newProjectName}
                  onChangeText={setNewProjectName}
                  placeholder="Enter project name"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (newProjectName.trim()) {
                    setProjects([
                      ...projects,
                      { id: Date.now(), projectname: newProjectName },
                    ]);
                    setNewProjectName('');
                    setShowAddModal(false);
                  }
                }}
              >
                <Text style={styles.buttonText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Uredi projekt</Text>
              <Pressable onPress={() => setEditModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Naziv projekta:</Text>
                <TextInput
                  style={styles.formInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Ime projekta"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={saveEdit}>
                <Text style={styles.buttonText}>Spremi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Obriši projekt</Text>
              <Pressable onPress={() => setDeleteModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Text>
                Jeste li sigurni da želite obrisati{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {selectedProject?.projectname}
                </Text>
                ?
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Obriši</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


