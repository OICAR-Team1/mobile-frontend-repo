import React, { useState, useMemo, useEffect } from 'react';
import {
 View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import styles from './Detailspage.styles';
import { Picker } from '@react-native-picker/picker';
import { contactService } from '../../services/api.service'; 

const DetailsPage = () => {
  const route = useRoute();
  const { company } = route.params as { company: any };

  // --- Contacts from API ---
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  useEffect(() => {
  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const allContacts = await contactService.getAllContacts();
      const partnerContacts = allContacts.filter(
        (contact) => contact.partnerId === company.id
      );
      setContacts(partnerContacts);
      setContactsError(null);
    } catch (err) {
      setContactsError('Greška prilikom dohvaćanja kontakata.');
    } finally {
      setContactsLoading(false);
    }
  };
  fetchContacts();
}, [company.id]);


  // --- Notes (Activities) from API ---
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setNotesLoading(true);
        const data = await EActivityService.getActivityByPartnerId(company.id);
        setNotes(data);
        setNotesError(null);
      } catch (err) {
        setNotesError('Greška prilikom dohvaćanja bilješki.');
      } finally {
        setNotesLoading(false);
      }
    };
    fetchNotes();
  }, [company.id]);

  // --- Contact Modal State ---
  const [addContactModal, setAddContactModal] = useState(false);
  const [editingContactIdx, setEditingContactIdx] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPosition, setContactPosition] = useState('');

  // --- Note Modal State ---
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [editingNoteIdx, setEditingNoteIdx] = useState<number | null>(null);
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

  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
      setNotesPage(1);
    }
  }, [years]);

  const notesForYear = notes.filter((note) => note.year === selectedYear);
  const totalPages = Math.ceil(notesForYear.length / notesPerPage);
  const paginatedNotes = notesForYear.slice(
    (notesPage - 1) * notesPerPage,
    notesPage * notesPerPage
  );

  // --- Contact Handlers (API) ---
  const handleAddContact = async () => {
    if (!contactName.trim()) return;
    const newContact = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      position: contactPosition,
      partnerId: company.id,
    };
    try {
      let updatedContacts;
      if (editingContactIdx !== null) {
        const updated = await contactService.updateContact(contacts[editingContactIdx].id, newContact);
        updatedContacts = contacts.map((c, i) => (i === editingContactIdx ? updated : c));
      } else {
        const saved = await contactService.createContact(newContact);
        updatedContacts = [...contacts, saved];
      }
      setContacts(updatedContacts);
    } catch (err) {
      // Optionally show error
    }
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

  const handleDeleteContact = async (idx: number) => {
    try {
      await contactService.deleteContact(contacts[idx].id);
      setContacts(contacts.filter((_, i) => i !== idx));
    } catch (err) {
      // Optionally show error
    }
  };

  // --- Note Handlers (API) ---
  const handleAddNote = async () => {
    if (!noteText.trim() || !noteYear.trim()) return;
    const newNote = {
      year: noteYear,
      project: noteProject,
      text: noteText,
      partnerId: company.id,
    };
    try {
      if (editingNoteIdx !== null) {
        const updated = await EActivityService.updateActivity(notes[editingNoteIdx].id, newNote);
        setNotes(notes.map((n, i) => (i === editingNoteIdx ? updated : n)));
      } else {
        const saved = await EActivityService.createActivity(newNote);
        setNotes([...notes, saved]);
      }
    } catch (err) {
      // Optionally show error
    }
    setNoteYear('');
    setNoteProject('');
    setNoteText('');
    setEditingNoteIdx(null);
    setAddNoteModal(false);
  };

  const handleEditNote = (idx: number) => {
    const note = notesForYear[idx];
    setNoteYear(note.year);
    setNoteProject(note.project);
    setNoteText(note.text);
    setEditingNoteIdx(idx);
    setAddNoteModal(true);
  };

  const handleDeleteNote = async (idx: number) => {
    try {
      await EActivityService.deleteContact(notesForYear[idx].id);
      setNotes(notes.filter((n, i) => n.id !== notesForYear[idx].id));
    } catch (err) {
      // Optionally show error
    }
  };

  
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
      {/* ... (same as before, see your code) ... */}

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
          onPress={() => {
            setEditingNoteIdx(null);
            setNoteYear('');
            setNoteProject('');
            setNoteText('');
            setAddNoteModal(true);
          }}
        >
          <Text style={styles.addButtonText}>Dodaj bilješku</Text>
        </TouchableOpacity>
      </View>

      {/* Notes List for Selected Year */}
      {notesLoading ? (
        <ActivityIndicator style={{ marginVertical: 20 }} />
      ) : notesError ? (
        <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{notesError}</Text>
      ) : (
        <ScrollView style={styles.notesList}>
          {paginatedNotes.length === 0 && (
            <Text style={{ color: '#888', textAlign: 'center', marginVertical: 8 }}>Nema bilješki za ovu godinu.</Text>
          )}
          {paginatedNotes.map((note, idx) => (
            <View key={note.id} style={styles.noteRow}>
              <Text style={{ fontWeight: 'bold' }}>{note.project}</Text>
              <Text>{note.text}</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <TouchableOpacity onPress={() => handleEditNote(idx)}>
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(idx)}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.pageButton, { opacity: notesPage === 1 ? 0.5 : 1 }]}
            disabled={notesPage === 1}
            onPress={() => setNotesPage(notesPage - 1)}
          >
            <Text style={styles.pageButtonText}>Prethodna</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 16, alignSelf: 'center' }}>
            {notesPage} / {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.pageButton, { opacity: notesPage === totalPages ? 0.5 : 1 }]}
            disabled={notesPage === totalPages}
            onPress={() => setNotesPage(notesPage + 1)}
          >
            <Text style={styles.pageButtonText}>Sljedeće</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add/Edit Note Modal */}
      <Modal visible={addNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.noteModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNoteIdx !== null ? 'Uredi bilješku' : 'Dodaj bilješku za partnera'}
              </Text>
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
                <Text style={styles.submitButtonText}>
                  {editingNoteIdx !== null ? 'Spremi promjene' : 'Unesi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default DetailsPage;
