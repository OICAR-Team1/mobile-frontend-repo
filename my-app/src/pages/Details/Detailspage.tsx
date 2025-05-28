import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './Detailspage.styles';

const DetailsPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { company } = route.params as { company: any };

  // Local state for modals
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [addContactModal, setAddContactModal] = useState(false);

  // Add your note/contact state here
  const [noteYear, setNoteYear] = useState('');
  const [noteProject, setNoteProject] = useState('');
  const [noteText, setNoteText] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPosition, setContactPosition] = useState('');

  // Example: render details
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{company.brandName}</Text>
      <View style={styles.detailsTable}>
        <Text>Pravno ime: {company.legalName}</Text>
        <Text>Crna lista: {company.blacklisted ? 'Da' : 'Ne'}</Text>
        <Text>Projekti: {company.projects.join(', ')}</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Kontakti</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddContactModal(true)}>
          <Text style={styles.addButtonText}>Dodaj kontakt</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contactsList}>
        {company.contacts?.map((contact, idx) => (
          <View key={idx} style={styles.contactRow}>
            <Text>Ime i prezime: {contact.name}</Text>
            <Text>Email: {contact.email}</Text>
            <Text>Broj mobitela: {contact.phone}</Text>
            <Text>Pozicija: {contact.position}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addNoteButton} onPress={() => setAddNoteModal(true)}>
        <Text style={styles.addButtonText}>Dodaj bilješku za partnera</Text>
      </TouchableOpacity>

      {/* Add Note Modal */}
      <Modal visible={addNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.noteModalContent}>
            {/* ...note modal content as before... */}
            <TouchableOpacity onPress={() => setAddNoteModal(false)}>
              <Text>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Contact Modal */}
      <Modal visible={addContactModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalContent}>
            {/* ...contact modal content as before... */}
            <TouchableOpacity onPress={() => setAddContactModal(false)}>
              <Text>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default DetailsPage;
