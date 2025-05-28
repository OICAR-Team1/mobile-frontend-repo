import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  detailsTable: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  sectionHeaderText: { fontWeight: 'bold', fontSize: 16 },
  addButton: { backgroundColor: '#c1272d', borderRadius: 5, paddingVertical: 6, paddingHorizontal: 12, marginLeft: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  contactsList: { maxHeight: 200 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 6, padding: 8, marginVertical: 4 },
  contactInfo: { flex: 1 },
  contactActions: { flexDirection: 'row' },
  actionIcon: { fontSize: 18, marginHorizontal: 6 },
  notesList: { maxHeight: 180, marginBottom: 8 },
  noteRow: { backgroundColor: '#f5f5f5', borderRadius: 6, padding: 8, marginVertical: 4 },
  pageButton: { backgroundColor: '#c1272d', borderRadius: 5, paddingVertical: 6, paddingHorizontal: 16, marginHorizontal: 4 },
  pageButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  noteModalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 24, width: '90%' },
  contactModalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 24, width: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#c1272d' },
  closeButton: { fontSize: 28, color: '#aaa', fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2 },
  modalBody: { marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 8, marginVertical: 6, backgroundColor: '#fafafa' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  submitButton: { backgroundColor: '#c1272d', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 24, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
export default styles;