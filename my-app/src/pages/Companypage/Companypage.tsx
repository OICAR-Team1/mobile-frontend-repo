import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import styles from './Companypage.styles';
import NavBar from '../Components/NavBar';
import { ePartnerService, projectService } from '../../services/api.service';
import { Picker } from '@react-native-picker/picker';

export default function CompanyPage({ navigation, onLogout }) {
  const [companies, setCompanies] = useState([]);
   const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states and form states (add/edit/delete)
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editLegalName, setEditLegalName] = useState('');
  const [newCompanyLegalName, setNewCompanyLegalName] = useState('');
  const [newCompanyAddress, setNewCompanyAddress] = useState('');
  const [newCompanyBrandName, setNewCompanyBrandName] = useState('');
  const [newCompanyProjects, setNewCompanyProjects] = useState('');
  const [newCompanyBlacklisted, setNewCompanyBlacklisted] = useState(false);
 const [newCompanyProjectId, setNewCompanyProjectId] = useState('');

// Fetch companies and projects from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const [partnersData, projectsData] = await Promise.all([
        ePartnerService.getAllPartners(),
        projectService.getAllProjects(),
      ]);
      const processedPartners = partnersData.map((partner) => ({
        id: partner.id,
        legalName: partner.name,
        brandName: partner.oib,
        address: partner.address,
        blacklisted: partner.blacklist,
        projectIds: partner.projectIds || [],
        contacts: partner.contacts || [],
        notes: partner.notes || [],
      }));
      setCompanies(processedPartners);
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Failed to load partners and projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies by search term
  const filteredCompanies = companies.filter(
    (c) =>
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.brandName.toLowerCase().includes(search.toLowerCase())
  );

  // --- CRUD Handlers using API ---

  // Add Company
  const addCompany = async () => {
    if (newCompanyLegalName.trim() && newCompanyBrandName.trim()) {
      try {
        setLoading(true);
        await ePartnerService.createPartner({
          name: newCompanyLegalName,
          oib: newCompanyBrandName,
          blacklist: newCompanyBlacklisted,
          address: newCompanyAddress,
          projectIds: newCompanyProjectId ? [Number(newCompanyProjectId)] : [],
        });
        setShowAddModal(false);
        setNewCompanyLegalName('');
        setNewCompanyBrandName('');
        setNewCompanyProjectId('');
        setNewCompanyAddress('');
        setNewCompanyBlacklisted(false);
        await fetchCompanies();
      } catch (err) {
        setError('Greška prilikom dodavanja partnera.');
      } finally {
        setLoading(false);
      }
    }
  };


  // Edit Company
  const saveEdit = async () => {
    if (!selectedCompany) return;
    try {
      setLoading(true);
      await ePartnerService.updatePartner(selectedCompany.id, {
        id: selectedCompany.id,
        name: editLegalName,
        oib: selectedCompany.brandName,
        address: selectedCompany.address,
        blacklist: selectedCompany.blacklisted,
        projectIds: selectedCompany.projectIds || [],
      });
      setEditModal(false);
      setSelectedCompany(null);
      await fetchCompanies();
    } catch (err) {
      setError('Greška prilikom uređivanja partnera.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Company
  const confirmDelete = async () => {
    if (!selectedCompany) return;
    try {
      setLoading(true);
      await ePartnerService.deletePartner(selectedCompany.id);
      setDeleteModal(false);
      setSelectedCompany(null);
      await fetchCompanies();
    } catch (err) {
      setError('Greška prilikom brisanja partnera.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Blacklist (optional: connect to API)
  const toggleBlacklist = async (id) => {
    const company = companies.find((c) => c.id === id);
    if (!company) return;
    try {
      setLoading(true);
      await ePartnerService.updatePartner(id, {
        name: company.legalName,
        oib: company.brandName,
        blacklist: !company.blacklisted,
        address: company.address,
      });
      await fetchCompanies();
    } catch (err) {
      setError('Greška prilikom ažuriranja crne liste.');
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditLegalName(company.legalName);
    setEditModal(true);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setDeleteModal(true);
  };

  const handleDetails = (company) => {
    navigation.navigate('Details', { company });
  };

  // Helper to get project names by IDs
  const getProjectNames = (ids) =>
    ids.map((id) => {
      const proj = projects.find((p) => p.id === id);
      return proj ? proj.name : `ID: ${id}`;
    }).join(', ');

  return (
    <View style={styles.appContainer}>
      <NavBar currentScreen="Company" navigation={navigation} onLogout={onLogout} />

      <View style={styles.mainContent}>
        <View style={styles.actionBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pretraži Partnere"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>Dodaj partnera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : error ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>
              {error}
            </Text>
          ) : filteredCompanies.length === 0 ? (
            <Text style={styles.noResults}>Nema rezultata.</Text>
          ) : (
            <ScrollView>
              {filteredCompanies.map((company) => (
                <View key={company.id} style={styles.companyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.legalName}>{company.legalName}</Text>
                    <Text style={styles.brandName}>{company.brandName}</Text>
                    <Text style={styles.projects}>
                      {company.projects}
                    </Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Switch
                      value={company.blacklisted}
                      onValueChange={() => toggleBlacklist(company.id)}
                     disabled={true}
                     trackColor={{
    false: '#ffaaaa', // custom color for OFF
    true: '#008000',   // custom color for ON
  }}
  thumbColor={company.blacklisted ? '#008000' : '#ffaaaa'}
  // You can also set a custom color for when disabled:
  style={company.blacklisted ? { opacity: 0.7 } : { opacity: 0.5 }}
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
          )}
        </View>
      </View>

      {/* Add Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj partnera</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Naziv"
              value={newCompanyLegalName}
              onChangeText={setNewCompanyLegalName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="OIB"
              value={newCompanyBrandName}
              onChangeText={setNewCompanyBrandName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Adresa"
              value={newCompanyAddress}
              onChangeText={setNewCompanyAddress}
            />
           <Picker
              selectedValue={newCompanyProjectId}
              style={styles.modalInput}
              onValueChange={(itemValue) => setNewCompanyProjectId(itemValue)}
            >
              <Picker.Item label="Odaberi projekt" value="" />
              {projects.map((project) => (
                <Picker.Item key={project.id} label={project.name} value={String(project.id)} />
              ))}
            </Picker>
            <View style={styles.switchRow}>
              <Text>Blacklist:</Text>
              <Switch
                value={newCompanyBlacklisted}
                onValueChange={setNewCompanyBlacklisted}
              />
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text>Otkaži</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={addCompany}
              >
                <Text>Spremi</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Uredi partnera</Text>
            <TextInput
              style={styles.modalInput}
              value={editLegalName}
              onChangeText={setEditLegalName}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModal(false)}
              >
                <Text>Otkaži</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Text>Spremi</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={deleteModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Jeste li sigurni da želite obrisati partnera?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}
              >
                <Text>Ne</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text>Da</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

