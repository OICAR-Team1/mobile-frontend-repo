import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import styles from './Detailspage.styles';
import { Picker } from '@react-native-picker/picker';

const DetailsPage = () => {
  const route = useRoute();
  const { company } = route.params as { company: any };

  
  const [contacts, setContacts] = useState(company.contacts || []);
  const [notes, setNotes] = useState(company.notes || []);

  // --- Contact Modal State ---
  const [addContactModal, setAddContactModal] = useState(false);
  const [editingContactIdx, setEditingContactIdx] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPosition, setContactPosition] = useState('');

  // --- Note Modal State ---
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [noteYear, setNoteYear] = useState('');
  const [noteProject, setNoteProject] = useState('');
  const [noteText, setNoteText] = useState('');

  // --- Notes Pagination and Year Picker ---
  const years = useMemo(
    () =>
      Array.from(new Set(notes.map((note) => note.year))).sort((a, b) => b.localeCompare(a)),
    [notes]
  );
  const [selectedYear, setSelectedYear] = useState(years[0] || '');
  const [notesPage, setNotesPage] = useState(1);
  const notesPerPage = 3;

  const notesForYear = notes.filter((note) => note.year === selectedYear);
  const totalPages = Math.ceil(notesForYear.length / notesPerPage);
  const paginatedNotes = notesForYear.slice(
    (notesPage - 1) * notesPerPage,
    notesPage * notesPerPage
  );

  // --- Contact Handlers ---
  const handleAddContact = () => {
    if (!contactName.trim()) return;
    const newContact = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      position: contactPosition,
    };
    let updatedContacts;
    if (editingContactIdx !== null) {
      updatedContacts = contacts.map((c, i) => (i === editingContactIdx ? newContact : c));
    } else {
      updatedContacts = [...contacts, newContact];
    }
    setContacts(updatedContacts);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactPosition('');
    setEditingContactIdx(null);
    setAddContactModal(false);
  };

  const handleEditContact = (idx: number) => {
    const contact = contacts[idx];
    setContactName(contact.name);
    setContactEmail(contact.email);
    setContactPhone(contact.phone);
    setContactPosition(contact.position);
    setEditingContactIdx(idx);
    setAddContactModal(true);
  };

  const handleDeleteContact = (idx: number) => {
    setContacts(contacts.filter((_, i) => i !== idx));
  };

  // --- Note Handlers ---
  const handleAddNote = () => {
    if (!noteText.trim() || !noteYear.trim()) return;
    setNotes([...notes, { year: noteYear, project: noteProject, text: noteText }]);
    setNoteYear('');
    setNoteProject('');
    setNoteText('');
    setAddNoteModal(false);
    // If new note is for a new year, update year picker
    if (!years.includes(noteYear)) {
      setSelectedYear(noteYear);
      setNotesPage(1);
    }
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Company Info */}
      <Text style={styles.title}>{company.brandName}</Text>
      <View style={styles.detailsTable}>
        <Text>Pravno ime: {company.legalName}</Text>
        <Text>Crna lista: {company.blacklisted ? 'Da' : 'Ne'}</Text>
        <Text>Projekti: {company.projects.join(', ')}</Text>
      </View>

      {/* Kontakti Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Kontakti</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingContactIdx(null);
            setContactName('');
            setContactEmail('');
            setContactPhone('');
            setContactPosition('');
            setAddContactModal(true);
          }}
        >
          <Text style={styles.addButtonText}>Dodaj kontakt</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contactsList}>
        {contacts.map((contact, idx) => (
          <View key={idx} style={styles.contactRow}>
            <View style={styles.contactInfo}>
              <Text>Ime i prezime: {contact.name}</Text>
              <Text>Email: {contact.email}</Text>
              <Text>Broj mobitela: {contact.phone}</Text>
              <Text>Pozicija: {contact.position}</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity onPress={() => handleEditContact(idx)}>
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteContact(idx)}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

    <Text style={{
  fontWeight: 'bold',
  fontSize: 16,
  marginTop: 24,
  marginBottom: 8,
  color: '#222',
}}>
  Bilješke
</Text>

      {/* Year Picker and Add Note Button */}
     <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
  <View style={{ flex: 1 }}>
    <Picker
      selectedValue={selectedYear}
      style={{ height: 40, backgroundColor: '#eee', borderRadius: 8 }}
      onValueChange={(itemValue) => {
        setSelectedYear(itemValue);
        setNotesPage(1);
      }}
      mode="dropdown"
    >
      {years.map((year) => (
        <Picker.Item key={year} label={year} value={year} />
      ))}
    </Picker>
  </View>
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => setAddNoteModal(true)}
  >
    <Text style={styles.addButtonText}>Dodaj bilješku</Text>
  </TouchableOpacity>
</View>

      {/* Notes List for Selected Year */}
      <ScrollView style={styles.notesList}>
        {paginatedNotes.length === 0 && (
          <Text style={{ color: '#888', textAlign: 'center', marginVertical: 8 }}>Nema bilješki za ovu godinu.</Text>
        )}
        {paginatedNotes.map((note, idx) => (
          <View key={idx} style={styles.noteRow}>
            <Text style={{ fontWeight: 'bold' }}>{note.project}</Text>
            <Text>{note.text}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.pageButton, { opacity: notesPage === 1 ? 0.5 : 1 }]}
            disabled={notesPage === 1}
            onPress={() => setNotesPage(notesPage - 1)}
          >
            <Text style={styles.pageButtonText}>Prev</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 16, alignSelf: 'center' }}>
            {notesPage} / {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.pageButton, { opacity: notesPage === totalPages ? 0.5 : 1 }]}
            disabled={notesPage === totalPages}
            onPress={() => setNotesPage(notesPage + 1)}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add/Edit Contact Modal */}
      <Modal visible={addContactModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContactIdx !== null ? 'Uredi kontakt' : 'Dodaj kontakt partneru'}
              </Text>
              <Pressable onPress={() => setAddContactModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Ime i prezime kontakt osobe"
                value={contactName}
                onChangeText={setContactName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={contactEmail}
                onChangeText={setContactEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Broj mobitela"
                value={contactPhone}
                onChangeText={setContactPhone}
              />
              <TextInput
                style={styles.input}
                placeholder="Unesi poziciju kontakta"
                value={contactPosition}
                onChangeText={setContactPosition}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.submitButton} onPress={handleAddContact}>
                <Text style={styles.submitButtonText}>
                  {editingContactIdx !== null ? 'Spremi promjene' : 'Unesi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Note Modal */}
      <Modal visible={addNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.noteModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dodaj bilješku za partnera</Text>
              <Pressable onPress={() => setAddNoteModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Godina"
                value={noteYear}
                onChangeText={setNoteYear}
              />
              <TextInput
                style={styles.input}
                placeholder="Projekt"
                value={noteProject}
                onChangeText={setNoteProject}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Unesi bilješku"
                value={noteText}
                multiline
                onChangeText={setNoteText}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.submitButton} onPress={handleAddNote}>
                <Text style={styles.submitButtonText}>Unesi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default DetailsPage;
