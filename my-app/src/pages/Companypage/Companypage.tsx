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
import styles from './Companypage.styles';
import NavBar from '../Components/NavBar';

// --- MOCK DATA ---
const initialCompanies = [
  {
    id: 1,
    legalName: 'ABC Technology Ltd.',
    brandName: 'TechPro',
    projects: ['Website Redesign', 'Mobile App'],
    blacklisted: false,
    contacts: [
      {
        name: 'John Smith',
        email: 'john.smith@techpro.com',
        phone: '+385 91 123 4567',
        position: 'Project Manager',
      },
      {
        name: 'Ana Novak',
        email: 'ana.novak@techpro.com',
        phone: '+385 91 555 1234',
        position: 'Lead Developer',
      },
     
    ],
    notes: [
      { year: '2023', project: 'Website Redesign', text: 'Great client, fast feedback.' },
      { year: '2023', project: 'Mobile App', text: 'Requested extra features.' },
      { year: '2024', project: 'Mobile App', text: 'Repeat business, satisfied.' },
      { year: '2024', project: 'Mobile App', text: 'Paid on time.' },
      { year: '2024', project: 'Mobile App', text: 'Paid on time.' },
      { year: '2024', project: 'Mobile App', text: 'Paid on time.' },
    ],
  },
  {
    id: 2,
    legalName: 'Global Marketing Group',
    brandName: 'GMG Digital',
    projects: ['SEO Campaign'],
    blacklisted: false,
     contacts: [
      {
        name: 'Ivan Horvat',
        email: 'ivan.horvat@gmg.com',
        phone: '+385 91 222 3333',
        position: 'Marketing Director',
      },
    ],
  },
  {
    id: 3,
    legalName: 'Nexus Innovations Inc.',
    brandName: 'Nexus',
    projects: ['Database Migration', 'Cloud Integration', 'API Development'],
    blacklisted: true,
    contacts: [
      {
        name: 'Petra Kovačić',
        email: 'petra.kovacic@nexus.com',
        phone: '+385 91 987 6543',
        position: 'CTO',
      },
      {
        name: 'Marko Babić',
        email: 'marko.babic@nexus.com',
        phone: '+385 91 654 3210',
        position: 'System Architect',
      },
    ],
  },
];



export default function CompanyPage({ navigation }) {
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
  const [detailsModal, setDetailsModal] = useState(false);
 

  const filteredCompanies = companies.filter((c) =>
    c.legalName.toLowerCase().includes(search.toLowerCase()) ||
    c.brandName.toLowerCase().includes(search.toLowerCase())
  );

  
  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setEditLegalName(company.legalName);
    setEditModal(true);
  };


  const handleDelete = (company: any) => {
    setSelectedCompany(company);
    setDeleteModal(true);
  };

const handleDetails = (company: any) => {
  navigation.navigate('Details', { company });
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
          contacts: [], 
   
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
      <NavBar currentScreen="Company" navigation={navigation} />

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
            <Text style={styles.addButtonText}>Add partner</Text>
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
                    onPress={() => handleDetails(company)}
                  >
                    <Text style={styles.actionIconText}>📋</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleEdit(company)}
                  >
                    <Text style={styles.actionIconText}>✏️</Text>
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
                style={[styles.button, styles.deleteButton]}
                onPress={() => {
                  setEditModal(false);
                  setDeleteModal(true);
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              {/* Cancel Button (center) */}
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              {/* Save Button (right) */}
              <TouchableOpacity style={styles.button} onPress={saveEdit}>
                <Text style={styles.buttonText}>Save </Text>
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

