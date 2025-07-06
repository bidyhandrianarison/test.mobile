import { StyleSheet, Platform } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 80,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.06,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inactiveCard: {
    backgroundColor: '#F8F8F8',
    opacity: 0.7,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  stockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f95dc',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendor: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  stock: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveLabel: {
    backgroundColor: '#666',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveText: {
    color: '#999',
  },
  inactivePrice: {
    color: '#999',
  },
  inactiveMeta: {
    color: '#999',
  },
});

export default styles; 