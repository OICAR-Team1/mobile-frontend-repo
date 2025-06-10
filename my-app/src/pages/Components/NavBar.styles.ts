import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#c1272d',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: '#c1272d',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  logoutButton: {
  marginLeft: 15,
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: '#E53935',  
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
},

logoutButtonText: {
  color: '#FFFFFF',           
  fontWeight: 'bold',
  fontSize: 14,
},
});
export default styles;