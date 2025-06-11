import React, { useState, useEffect } from 'react';
import {
    View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import styles from './Projectpage.styles';
import NavBar from '../Components/NavBar';
import { projectService } from '../../services/api.service';


export default function ProjectsPage({ navigation, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
   // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      // Normalize to {id, projectname}
      const normalized = data.map((p: any) => ({
        id: p.id,
        projectname: p.name || p.projectname,
      }));
      setProjects(normalized);
      setError(null);
    } catch (err) {
      setError('Greška prilikom dohvaćanja projekata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtering
  const filteredProjects = projects.filter((p) =>
    p.projectname.toLowerCase().includes(search.toLowerCase())
  );

  // Add Project (API)
  const addProject = async () => {
    if (newProjectName.trim()) {
      try {
        setLoading(true);
        await projectService.createProject({ name: newProjectName });
        setShowAddModal(false);
        setNewProjectName('');
        await fetchProjects();
      } catch (err) {
        setError('Greška prilikom dodavanja projekta.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Edit Project (API)
  const saveEdit = async () => {
    if (!selectedProject) return;
    try {
      setLoading(true);
      await projectService.updateProject(selectedProject.id, { name: editName });
      setEditModal(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (err) {
      setError('Greška prilikom uređivanja projekta.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Project (API)
  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      setLoading(true);
      await projectService.deleteProject(selectedProject.id);
      setDeleteModal(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (err) {
      setError('Greška prilikom brisanja projekta.');
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setEditName(project.projectname);
    setEditModal(true);
  };

  const handleDelete = (project: any) => {
    setSelectedProject(project);
    setDeleteModal(true);
  };


  return (
   <View style={styles.appContainer}>
      {/* Top Navigation Bar */}
      <NavBar currentScreen="Projects" navigation={navigation} onLogout={onLogout} />

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
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : error ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>{error}</Text>
          ) : (
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
          )}
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
                onPress={addProject}
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


