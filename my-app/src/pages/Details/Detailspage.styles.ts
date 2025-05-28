import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ...your styles here (reuse from CompanyPage if you wish)
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  detailsTable: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  sectionHeaderText: { fontWeight: 'bold', fontSize: 16 },
  addButton: { backgroundColor: '#c1272d', borderRadius: 5, paddingVertical: 6, paddingHorizontal: 12 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  contactsList: { maxHeight: 200 },
  contactRow: { backgroundColor: '#f5f5f5', borderRadius: 6, padding: 8, marginVertical: 4 },
  addNoteButton: { backgroundColor: '#c1272d', borderRadius: 5, paddingVertical: 8, paddingHorizontal: 12, marginTop: 10, alignSelf: 'flex-end' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  noteModalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 24, maxHeight: '90%' },
  contactModalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 24, maxHeight: '90%' },
});
export default styles;