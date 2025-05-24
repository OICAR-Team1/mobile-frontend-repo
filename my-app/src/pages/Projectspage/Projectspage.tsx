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

// --- MOCK NAVBAR COMPONENT ---
const NavBar = ({
  activeTab,
  setActivePage,
  user,
  onLogout,
}: {
  activeTab: string;
  setActivePage: (page: string) => void;
  user?: any;
  onLogout?: () => void;
}) => (
  <View style={styles.topNav}>
    <Text style={styles.navTitle}>Projects</Text>
    <View style={styles.navRight}>
      <TouchableOpacity style={styles.profileIcon}>
        <Text style={{ color: '#c1272d', fontWeight: 'bold' }}>
          {user?.name?.[0] || 'U'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProjectsPage({
  setActivePage = () => {},
  activePage = 'projects',
  user = mockUser,
  onLogout = () => {},
}) {
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
      <NavBar
        activeTab={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={onLogout}
      />

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
            <Text style={styles.addButtonText}>Add project</Text>
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
              <Text style={styles.modalTitle}>Add Project</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Project name:</Text>
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
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
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
                <Text style={styles.buttonText}>Add</Text>
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
                <Text style={styles.formLabel}>Projektovo ime:</Text>
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

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0e0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#bb3737',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#bb3737',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    marginRight: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    minHeight: 300,
    elevation: 2,
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  projectName: {
    fontSize: 17,
    color: 'black',
    fontWeight: '500',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 8,
    padding: 6,
  },
  actionIconText: {
    fontSize: 20,
    color: '#c1272d',
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
    paddingBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c1272d',
  },
  closeButton: {
    fontSize: 28,
    color: '#aaa',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modalBody: {
    padding: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
    fontSize: 15,
  },
  formInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#c1272d',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonSecondaryText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
});

