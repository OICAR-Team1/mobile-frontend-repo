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
import { contactService, EActivityService } from '../../services/api.service'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { projectService } from '../../services/api.service'; 

const DetailsPage = () => {
  const route = useRoute();
  const { company } = route.params;

  // Get logged-in user's ID from AsyncStorage
  const [userId, setUserId] = useState<number | null>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Fetched userId from AsyncStorage:', storedUserId);
      setUserId(storedUserId ? Number(storedUserId) : null);
    };
    fetchUserId();
  }, []);


  const [projects, setProjects] = useState([]);
const [projectMap, setProjectMap] = useState({});

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const allProjects = await projectService.getAllProjects();
      setProjects(allProjects);
      // Create a map for quick lookup: { [id]: name }
      const map = {};
      allProjects.forEach(p => { map[p.id] = p.name; });
      setProjectMap(map);
    } catch (err) {
      // Optionally handle error
    }
  };
  fetchProjects();
}, []);

  // --- Contacts from API ---
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  useEffect(() => {
const fetchContacts = async () => {
  try {
    setContactsLoading(true);
    const allContacts = await contactService.getAllContacts();
    console.log('All contacts:', allContacts);
    const partnerContacts = allContacts.filter(
      (contact) => String(contact.ePartnerId) === String(company.id)
    );
    console.log('Filtered contacts for partner', company.id, partnerContacts);
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
      const allActivities = await EActivityService.getAllActivitys();
      console.log('All activities:', allActivities); // <-- LOG: All activities from backend

      const partnerNotes = allActivities.filter(
        (activity) => String(activity.ePartnerId) === String(company.id)
      );
      console.log('Filtered notes for partner', company.id, partnerNotes); // <-- LOG: Filtered notes

      const mapped = partnerNotes.map(activity => ({
        id: activity.id,
        year: activity.timeStamp ? String(new Date(activity.timeStamp).getFullYear()) : '',
        projectId: activity.projectId,
        text: activity.comment,
        userId: activity.userId,
        timeStamp: activity.timeStamp,
        ePartnerId: activity.ePartnerId,
      }));
      console.log('Mapped notes for UI:', mapped); // <-- LOG: What will be set in state

      setNotes(mapped);
      setNotesError(null);
    } catch (err) {
      console.error('Error fetching notes:', err); // <-- LOG: Any fetch error
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
  const [deleteContactIdx, setDeleteContactIdx] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactSurname, setContactSurname] = useState('');
  const [contactEmail, setContactEmail] = useState('');


  // --- Note Modal State ---
const [addNoteModal, setAddNoteModal] = useState(false);
  const [editingNoteIdx, setEditingNoteIdx] = useState<number | null>(null);
  const [deleteNoteIdx, setDeleteNoteIdx] = useState<number | null>(null);
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
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
  // Open add modal
  const handleAddContactOpen = () => {
    setEditingContactIdx(null);
    setContactName('');
    setContactSurname('');
    setContactEmail('');
    setAddContactModal(true);
  };

  // Open edit modal
  const handleEditContact = (idx: number) => {
    const contact = contacts[idx];
    setContactName(contact.name);
    setContactSurname(contact.surname);
    setContactEmail(contact.email);
    setEditingContactIdx(idx);
    setAddContactModal(true);
  };

  // Add or edit contact
    const handleAddOrEditContact = async () => {
    if (!contactName.trim() || !contactSurname.trim() || !contactEmail.trim()) return;
    const newContact = {
      name: contactName,
      surname: contactSurname,
      email: contactEmail,
      ePartnerId: company.id,
    };
    try {
      if (editingContactIdx !== null) {
        // Use uniqueId for update!
        await contactService.updateContact(contacts[editingContactIdx].uniqueId, newContact);
      } else {
        await contactService.createContact(newContact);
      }
     // Refresh contacts
      const allContacts = await contactService.getAllContacts();
      const partnerContacts = allContacts.filter(
        (contact) => String(contact.ePartnerId) === String(company.id)
      );
      setContacts(partnerContacts);
    } catch (err) {
      // Optionally show error
    }
    setContactName('');
    setContactEmail('');
    setContactSurname('');
    setEditingContactIdx(null);
    setAddContactModal(false);
  };

  const handleDeleteContactOpen = (idx: number) => {
    setDeleteContactIdx(idx);
  };

  const handleDeleteContact = async () => {
    if (deleteContactIdx === null) return;
    try {
      // Use uniqueId for delete!
      await contactService.deleteContact(contacts[deleteContactIdx].uniqueId);
       // Refresh contacts
      const allContacts = await contactService.getAllContacts();
      const partnerContacts = allContacts.filter(
        (contact) => String(contact.ePartnerId) === String(company.id)
      );
      setContacts(partnerContacts);
    } catch (err) {
      // Optionally show error
    }
    setDeleteContactIdx(null);
  };



  // --- Note Handlers (API) ---
 const handleAddNote = async () => {
    if (!noteText.trim() || !userId) return;
    const newNote = {
      userId: userId,
      comment: noteText,
      projectId: Number(noteProject) || 0,
      ePartnerId: company.id,
      // Do NOT send timeStamp; backend will set it
    };
    console.log('Adding note:', newNote);
    try {
      await EActivityService.createActivity(newNote);
      await refreshNotes();
    } catch (err) {
      console.error('Error adding note:', err);
    }
    setNoteText('');
    setNoteProject('');
    setAddNoteModal(false);
    setEditingNoteIdx(null);
  };

  const openAddNoteModal = () => {
    setEditingNoteIdx(null);
    setNoteProject('');
    setNoteText('');
    setAddNoteModal(true);
  };

  const handleEditNoteOpen = (idx: number) => {
    const note = notesForYear[idx];
    setNoteProject(note.projectId ? String(note.projectId) : '');
    setNoteText(note.text);
    setEditingNoteIdx(idx);
    setAddNoteModal(true);
  };

  const handleEditNote = async () => {
    if (editingNoteIdx === null || !userId) return;
    const noteToEdit = notesForYear[editingNoteIdx];
    const updatedNote = {
      userId: userId,
      comment: noteText,
      projectId: Number(noteProject) || 0,
      ePartnerId: company.id,
      // Do NOT send timeStamp; backend will set it
    };
    console.log('Editing note id:', noteToEdit.id, 'with:', updatedNote);
    try {
      await EActivityService.updateActivity(noteToEdit.id, updatedNote);
      await refreshNotes();
    } catch (err) {
      console.error('Error editing note:', err);
    }
    setNoteText('');
    setNoteProject('');
    setEditingNoteIdx(null);
    setAddNoteModal(false);
  };

  const handleDeleteNoteOpen = (idx: number) => {
    setDeleteNoteIdx(idx);
    setDeleteNoteModal(true);
  };

  const handleDeleteNote = async () => {
    if (deleteNoteIdx === null) return;
    try {
      await EActivityService.deleteActivity(notesForYear[deleteNoteIdx].id);
      await refreshNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
    setDeleteNoteIdx(null);
    setDeleteNoteModal(false);
  };

  // Helper to refresh notes after CRUD
  const refreshNotes = async () => {
    try {
      setNotesLoading(true);
      const allActivities = await EActivityService.getAllActivitys();
      const partnerNotes = allActivities.filter(
        (activity) => String(activity.ePartnerId) === String(company.id)
      );
      const mapped = partnerNotes.map(activity => ({
        id: activity.id,
        year: activity.timeStamp ? String(new Date(activity.timeStamp).getFullYear()) : '',
        projectId: activity.projectId,
        text: activity.comment,
        userId: activity.userId,
        timeStamp: activity.timeStamp,
        ePartnerId: activity.ePartnerId,
      }));
      setNotes(mapped);
      setNotesError(null);
    } catch (err) {
      setNotesError('Greška prilikom dohvaćanja bilješki.');
    } finally {
      setNotesLoading(false);
    }
  };


  return (
     <View style={styles.container}>
      {/* Company Info */}
      <Text style={styles.title}>{company.brandName}</Text>
      <View style={styles.detailsTable}>
        <Text>Pravno ime: {company.legalName}</Text>
        <Text>Crna lista: {company.blacklisted ? 'Da' : 'Ne'}</Text>
        <Text>Adresa: {company.address}</Text>
    <Text>
  Projekti: {company.projectIds && company.projectIds.length > 0
    ? company.projectIds.map(pid => projectMap[pid] || `ID: ${pid}`).join(', ')
    : 'Nema projekata'}
</Text>

      </View>

    {/* Kontakti Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Kontakti</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddContactOpen}>
          <Text style={styles.addButtonText}>Dodaj kontakt</Text>
        </TouchableOpacity>
      </View>
      {contactsLoading ? (
        <ActivityIndicator style={{ marginVertical: 20 }} />
      ) : contactsError ? (
        <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{contactsError}</Text>
      ) : (
        <ScrollView style={styles.contactsList}>
          {contacts.map((contact, idx) => (
            <View key={contact.id || idx} style={styles.contactRow}>
              <View style={styles.contactInfo}>
                <Text>Ime: {contact.name}</Text>
                <Text>Prezime: {contact.surname}</Text>
                <Text>Email: {contact.email}</Text>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity onPress={() => handleEditContact(idx)}>
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteContactOpen(idx)}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}


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
            style={{ height: 60, backgroundColor: '#eee', borderRadius: 8 }}
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
          onPress={openAddNoteModal}
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
            <Text style={{ color: '#888', textAlign: 'center', marginVertical: 8 }}>Nema biljeski za ovu godinu.</Text>
          )}
        {paginatedNotes.map((note, idx) => (
  <View key={note.id} style={styles.noteRow}>
    <Text style={{ fontWeight: 'bold' }}>
  {note.projectId
    ? `Projekt: ${projectMap[note.projectId] || `ID: ${note.projectId}`}`
    : ''}
</Text>
    <Text>{note.text}</Text>
    <Text>Godina: {note.year}</Text>
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
      <TouchableOpacity onPress={() => handleEditNoteOpen(idx)}>
        <Text style={styles.actionIcon}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteNoteOpen(idx)}>
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

      {/* Add/Edit Contact Modal */}
      <Modal visible={addContactModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContactIdx !== null ? 'Uredi kontakt' : 'Dodaj kontakt partneru'}
              </Text>
              <Pressable onPress={() => { setAddContactModal(false); setEditingContactIdx(null); }}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Ime"
                value={contactName}
                onChangeText={setContactName}
              />
              <TextInput
                style={styles.input}
                placeholder="Prezime"
                value={contactSurname}
                onChangeText={setContactSurname}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={contactEmail}
                onChangeText={setContactEmail}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.submitButton} onPress={handleAddOrEditContact}>
                <Text style={styles.submitButtonText}>
                  {editingContactIdx !== null ? 'Spremi promjene' : 'Unesi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Contact Modal */}
      <Modal visible={deleteContactIdx !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Obriši kontakt</Text>
              <Pressable onPress={() => setDeleteContactIdx(null)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Text>
                Jeste li sigurni da želite obrisati kontakt{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {deleteContactIdx !== null ? contacts[deleteContactIdx]?.name : ''}
                </Text>
                ?
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: '#ccc' }]}
                onPress={() => setDeleteContactIdx(null)}
              >
                <Text style={styles.submitButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleDeleteContact}
              >
                <Text style={styles.submitButtonText}>Obriši</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


     {/* Add/Edit Note Modal */}
     <Modal visible={addNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.noteModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNoteIdx !== null ? 'Uredi bilješku' : 'Dodaj bilješku za partnera'}
              </Text>
              <Pressable onPress={() => {
                setAddNoteModal(false);
                setEditingNoteIdx(null);
              }}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Picker
  selectedValue={noteProject}
  style={styles.input}
  onValueChange={(itemValue) => setNoteProject(itemValue)}
>
  <Picker.Item label="Odaberi projekt" value="" />
  {projects.map((project) => (
    <Picker.Item key={project.id} label={project.name} value={String(project.id)} />
  ))}
</Picker>

              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Unesi bilješku"
                value={noteText}
                multiline
                onChangeText={setNoteText}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={editingNoteIdx !== null ? handleEditNote : handleAddNote}
              >
                <Text style={styles.submitButtonText}>
                  {editingNoteIdx !== null ? 'Spremi promjene' : 'Unesi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Note Modal */}
      <Modal visible={deleteNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.noteModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Obriši bilješku</Text>
              <Pressable onPress={() => setDeleteNoteModal(false)}>
                <Text style={styles.closeButton}>&times;</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Text>
                Jeste li sigurni da želite obrisati bilješku?
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: '#ccc' }]}
                onPress={() => setDeleteNoteModal(false)}
              >
                <Text style={styles.submitButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleDeleteNote}
              >
                <Text style={styles.submitButtonText}>Obriši</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>




    </View>



      
    
  );
};



export default DetailsPage;
