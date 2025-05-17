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
  Switch,
} from 'react-native';

// --- MOCK DATA ---
const initialCompanies = [
  {
    id: 1,
    legalName: 'ABC Technology Ltd.',
    brandName: 'TechPro',
    projects: ['Website Redesign', 'Mobile App'],
    blacklisted: false,
  },
  {
    id: 2,
    legalName: 'Global Marketing Group',
    brandName: 'GMG Digital',
    projects: ['SEO Campaign'],
    blacklisted: false,
  },
  {
    id: 3,
    legalName: 'Nexus Innovations Inc.',
    brandName: 'Nexus',
    projects: ['Database Migration', 'Cloud Integration', 'API Development'],
    blacklisted: true,
  },
];

// --- MOCK NAVBAR COMPONENT ---
const NavBar = ({
  title = 'Companies',
  user = { name: 'Ana' },
  onLogout = () => {},
}) => (
  <View style={styles.topNav}>
    <Text style={styles.navTitle}>{title}</Text>
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

export default function CompanyPage() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [editLegalName, setEditLegalName] = useState('');
  const [newCompanyLegalName, setNewCompanyLegalName] = useState('');
  const [newCompanyBrandName, setNewCompanyBrandName] = useState('');
  const [newCompanyProjects, setNewCompanyProjects] = useState('');
  const [newCompanyBlacklisted, setNewCompanyBlacklisted] = useState(false);

  // Filtering
  const filteredCompanies = companies.filter((c) =>
    c.legalName.toLowerCase().includes(search.toLowerCase()) ||
    c.brandName.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setEditLegalName(company.legalName);
    setEditModal(true);
  };

  const handleDelete = (company: any) => {
    setSelectedCompany(company);
    setDeleteModal(true);
  };

  const saveEdit = () => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompany.id ? { ...c, legalName: editLegalName } : c
      )
    );
    setEditModal(false);
    setSelectedCompany(null);
  };

  const confirmDelete = () => {
    setCompanies((prev) => prev.filter((c) => c.id !== selectedCompany.id));
    setDeleteModal(false);
    setSelectedCompany(null);
  };

  const addCompany = () => {
    if (newCompanyLegalName.trim() && newCompanyBrandName.trim()) {
      setCompanies([
        ...companies,
        {
          id: Date.now(),
          legalName: newCompanyLegalName,
          brandName: newCompanyBrandName,
          projects: newCompanyProjects
            ? newCompanyProjects.split(',').map((p) => p.trim())
            : [],
          blacklisted: newCompanyBlacklisted,
        },
      ]);
      setNewCompanyLegalName('');
      setNewCompanyBrandName('');
      setNewCompanyProjects('');
      setNewCompanyBlacklisted(false);
      setShowAddModal(false);
    }
  };

  const toggleBlacklist = (id: number) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, blacklisted: !c.blacklisted } : c
      )
    );
  };

  return (
    <View style={styles.appContainer}>
      {/* Top Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.actionBar}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search company"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>Add company</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          <ScrollView>
            {filteredCompanies.length === 0 && (
              <Text style={styles.noResults}>No results.</Text>
            )}
            {filteredCompanies.map((company) => (
              <View key={company.id} style={styles.companyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.legalName}>{company.legalName}</Text>
                  <Text style={styles.brandName}>{company.brandName}</Text>
                  <Text style={styles.projects}>
                    {company.projects.join(', ')}
                  </Text>
                </View>
                <View style={styles.rowActions}>
                  <Switch
                    value={company.blacklisted}
                    onValueChange={() => toggleBlacklist(company.id)}
                  />
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleEdit(company)}
                  >
                    <Text style={styles.actionIconText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDelete(company)}
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
              <Text style={styles.modalTitle}>Add Company</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Legal name:</Text>
                <TextInput
                  style={styles.formInput}
                  value={newCompanyLegalName}
                  onChangeText={setNewCompanyLegalName}
                  placeholder="Enter legal name"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Brand name:</Text>
                <TextInput
                  style={styles.formInput}
                  value={newCompanyBrandName}
                  onChangeText={setNewCompanyBrandName}
                  placeholder="Enter brand name"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Projects (comma-separated):</Text>
                <TextInput
                  style={styles.formInput}
                  value={newCompanyProjects}
                  onChangeText={setNewCompanyProjects}
                  placeholder="e.g. Website, Mobile App"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroupRow}>
                <Text style={styles.formLabel}>Blacklisted:</Text>
                <Switch
                  value={newCompanyBlacklisted}
                  onValueChange={setNewCompanyBlacklisted}
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
              <TouchableOpacity style={styles.button} onPress={addCompany}>
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
              <Text style={styles.modalTitle}>Edit Legal Name</Text>
              <Pressable onPress={() => setEditModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Legal name:</Text>
                <TextInput
                  style={styles.formInput}
                  value={editLegalName}
                  onChangeText={setEditLegalName}
                  placeholder="Legal name"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={saveEdit}>
                <Text style={styles.buttonText}>Save</Text>
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
              <Text style={styles.modalTitle}>Delete Company</Text>
              <Pressable onPress={() => setDeleteModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Text>
                Are you sure you want to delete{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {selectedCompany?.legalName}
                </Text>
                ?
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Delete</Text>
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
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  legalName: {
    fontSize: 17,
    color: 'black',
    fontWeight: '500',
  },
  brandName: {
    color: '#555',
    fontSize: 13,
  },
  projects: {
    color: '#888',
    fontSize: 12,
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
  formGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  formLabel: {
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
    fontSize: 15,
    marginRight: 10,
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
