import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

type UserType = 'normal' | 'vip';

interface EventData {
  Category: string;
  'Sub-Category': string;
  Name: string;
  description: string;
  'NORMAL USER': string;
  'VIP USER': string;
  Button: string;
  reaction: string;
}

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { eventId } = params;
  
  const [userType, setUserType] = useState<UserType>('normal');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [venue, setVenue] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; date?: string; time?: string }>({});

  const eventData: EventData[] = [
    {
      "Category": "Events",
      "Sub-Category": "Decoration",
      "Name": "Birthday Decoration",
      "description": "We offer birthday decoration services for all age groups at affordable prices, starting from ₹1999. Get up to 25% discount on your special day!",
      "NORMAL USER": "10% DISCOUNT",
      "VIP USER": "GET UPTO 25% DISCOUNT",
      "Button": "Request Now",
      "reaction": "Thanks for booking! Our team will contact you in 10 mins"
    },
    {
      "Category": "Events",
      "Sub-Category": "Decoration",
      "Name": "Wedding Decoration",
      "description": "We offer wedding decoration services for all types of weddings at affordable prices, starting from ₹9999. Get up to 25% discount on your special day!",
      "NORMAL USER": "10% DISCOUNT",
      "VIP USER": "GET UPTO 25% DISCOUNT",
      "Button": "Request Now",
      "reaction": "Thanks for booking! Our team will contact you in 10 mins"
    },
    {
      "Category": "Events",
      "Sub-Category": "Function Hall",
      "Name": "VASAVI KALYANAMANDAPAM A/C",
      "description": "Weddings, Functions & Meetings\nCapacity: 400–600 People\nAddress: Gandhi Nagar, Sircilla\nBudget-Friendly Prices Starting at just ₹29,999/-\n\nమీ డేట్ కి హాల్ అందుబాటులో ఉందో లేదో తెలుసుకోవడానికి Book Now నొక్కండి.\n\nPrices may vary depending on the dates, but don't worry – we promise you the Lowest Price Guarantee!",
      "NORMAL USER": "10% DISCOUNT",
      "VIP USER": "GET UPTO 25% DISCOUNT",
      "Button": "Request Now",
      "reaction": "Thanks for booking! Our team will contact you in 10 mins"
    },
    {
      "Category": "Events",
      "Sub-Category": "Catering",
      "Name": "Vinayaka Catering",
      "description": "We offer catering services for weddings and functions at affordable prices, starting from ₹99 per person for a minimum of 200 guests. Both vegetarian and non-vegetarian menus are available, with trained staff support.",
      "NORMAL USER": "10% DISCOUNT",
      "VIP USER": "GET UPTO 25% DISCOUNT",
      "Button": "Request Now",
      "reaction": "Thanks for booking! Our team will contact you in 10 mins"
    },
    {
      "Category": "Events",
      "Sub-Category": "Mehandi art",
      "Name": "Mehendi Art",
      "description": "We offer mehendi art services for weddings and functions in affordable prices, starting from ₹299 for a basic design. Our professional mehendi artists will add a touch of elegance to your special day. Book now and get up to 25% discount!",
      "NORMAL USER": "10% DISCOUNT",
      "VIP USER": "GET UPTO 25% DISCOUNT",
      "Button": "Request Now",
      "reaction": "thanks for booking! Our team will contact you in 10 mins"
    }
  ];

  // Find the specific event data (fallback to first item if not found)
  const currentEvent = eventData.find(event => 
    event.Name.toLowerCase().replace(/\s+/g, '-') === eventId
  ) || eventData[0];

  const handleBooking = () => {
    const newErrors: { name?: string; phone?: string; date?: string; time?: string } = {};
    if (!customerName.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(phoneNumber.trim())) newErrors.phone = 'Enter valid 10-digit phone';
    if (!eventDate.trim()) newErrors.date = 'Event date is required';
    if (!eventTime.trim()) newErrors.time = 'Event time is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const bookingId = Math.random().toString(36).slice(2, 8).toUpperCase();
    Alert.alert(
      'Booking Confirmed',
      `Event: ${currentEvent.Name}
Name: ${customerName}
Phone: ${phoneNumber}
Date: ${eventDate}
Time: ${eventTime}
Booking ID: ${bookingId}

${currentEvent.reaction}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const event = useMemo(() => ({
    id: eventId as string || '',
    name: currentEvent.Name,
    category: currentEvent['Sub-Category'],
    description: currentEvent.description.replace(/[^\w\s\u0C00-\u0C7F₹/-]/g, '').trim(),
    rating: 4.8,
    reviews: 234,
  }), [currentEvent, eventId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{event.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTag}>Events</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image source={require('../assets/default.png')} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.eventName}>{event.name}</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>{event.rating}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="apps" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{event.category}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{event.reviews} reviews</Text>
            </View>
            {event.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* User Type Selection */}
        <View style={styles.userTypeCard}>
          <Text style={styles.sectionTitle}>Select Plan</Text>
          <View style={styles.userTypeButtons}>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'normal' && styles.userTypeButtonActive]}
              onPress={() => setUserType('normal')}
            >
              <Text style={[styles.userTypeText, userType === 'normal' && styles.userTypeTextActive]}>Normal User</Text>
              <Text style={[styles.discountText, userType === 'normal' && styles.discountTextActive]}>{currentEvent['NORMAL USER']}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'vip' && styles.userTypeButtonActive]}
              onPress={() => setUserType('vip')}
            >
              <Text style={[styles.userTypeText, userType === 'vip' && styles.userTypeTextActive]}>VIP User</Text>
              <Text style={[styles.discountText, userType === 'vip' && styles.discountTextActive]}>{currentEvent['VIP USER']}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Booking Form */}
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>Book Your Event</Text>
          
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput 
              value={customerName} 
              onChangeText={setCustomerName} 
              placeholder="Full name" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
              placeholder="10-digit mobile number" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="numeric"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Event Date</Text>
            <TextInput 
              value={eventDate} 
              onChangeText={setEventDate} 
              placeholder="DD/MM/YYYY" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Event Time</Text>
            <TextInput 
              value={eventTime} 
              onChangeText={setEventTime} 
              placeholder="e.g., 10:00 AM" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Number of Guests</Text>
            <TextInput 
              value={guestCount} 
              onChangeText={setGuestCount} 
              placeholder="Expected number of guests" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Venue/Address</Text>
            <TextInput 
              value={venue} 
              onChangeText={setVenue} 
              placeholder="Event venue or address" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Special Requirements</Text>
            <TextInput 
              value={specialRequirements} 
              onChangeText={setSpecialRequirements} 
              placeholder="Any special requirements or notes..." 
              placeholderTextColor="#9ca3af" 
              style={[styles.input, styles.textArea]} 
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={handleBooking} 
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>{currentEvent.Button}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerContainer: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', marginRight: 16 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerActions: { marginLeft: 16 },
  headerTag: { backgroundColor: '#e91e63', color: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: '600' },
  content: { flex: 1 },
  heroCard: { backgroundColor: '#ffffff', margin: 20, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  heroImage: { width: '100%', height: 200 },
  heroBody: { padding: 20 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  eventName: { flex: 1, fontSize: 20, fontWeight: '700', color: '#111827', marginRight: 12 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { marginLeft: 4, fontSize: 14, fontWeight: '600', color: '#d97706' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  metaText: { marginLeft: 8, fontSize: 14, color: '#6b7280' },
  descriptionContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  descriptionText: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  userTypeCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  userTypeButtons: { flexDirection: 'row', gap: 12 },
  userTypeButton: { flex: 1, paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', alignItems: 'center' },
  userTypeButtonActive: { borderColor: '#e91e63', backgroundColor: '#e91e63' },
  userTypeText: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 6 },
  userTypeTextActive: { color: '#ffffff' },
  discountText: { fontSize: 11, color: '#059669', fontWeight: '700', textAlign: 'center', lineHeight: 14 },
  discountTextActive: { color: '#ffffff', opacity: 0.9 },
  bookingCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 40, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff' },
  textArea: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: '#dc2626', marginTop: 4 },
  bookButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e91e63' },
  bookButtonText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
});