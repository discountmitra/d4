import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
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
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const faqData = [
    {
      question: "How far in advance should I book my event?",
      answer: "We recommend booking 2-4 weeks in advance for regular events and 6-8 weeks for wedding seasons or peak times to ensure availability."
    },
    {
      question: "What happens if I need to postpone my event?",
      answer: "Events can be rescheduled up to 7 days before the event date without extra charges. Cancellations after this period may incur fees."
    },
    {
      question: "What is included in the event package?",
      answer: "Our standard packages include venue decoration, basic lighting, sound system, and coordination. Additional services like catering and photography are available."
    }
  ];

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
    setShowConfirmModal(true);
  };
  const confirmBooking = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setBookingId(Math.random().toString(36).slice(2, 8).toUpperCase());
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };
  const closeSuccess = () => { setShowSuccessModal(false); router.back(); };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const confirmDateSelection = () => {
    // Format date as DD-MM-YYYY to avoid timezone issues
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setEventDate(formattedDate);
    setErrors(prev => ({ ...prev, date: undefined }));
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;
      
      days.push({ day, date, isToday, isSelected, isPast });
    }
    
    return days;
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
            <TouchableOpacity onPress={openDatePicker} style={styles.dateInputContainer}>
              <TextInput 
                value={eventDate} 
                placeholder="Select date" 
                placeholderTextColor="#9ca3af" 
                style={styles.dateInput}
                editable={false}
                pointerEvents="none"
              />
              <Ionicons name="calendar-outline" size={20} color="#6b7280" style={styles.calendarIcon} />
            </TouchableOpacity>
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

        {/* FAQ Section */}
        <View style={styles.faqCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
                {expandedFAQ === index && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />

      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.modalIconCircle}><Ionicons name="help-circle" size={32} color="#e91e63" /></View></View>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before booking</Text>
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="pricetag" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Event:</Text><Text style={styles.detailValue}>{event.name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{customerName}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{phoneNumber}</Text></View>
              <View style={styles.detailRow}><Ionicons name="calendar" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Date:</Text><Text style={styles.detailValue}>{eventDate}</Text></View>
              <View style={styles.detailRow}><Ionicons name="time" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Time:</Text><Text style={styles.detailValue}>{eventTime}</Text></View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirmModal(false)} activeOpacity={0.8}><Text style={styles.modalButtonSecondaryText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonPrimary, { backgroundColor: '#e91e63' }]} onPress={confirmBooking} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}><View style={styles.loadingModalCard}><ActivityIndicator size="large" color="#e91e63" /><Text style={styles.loadingText}>Submitting your booking...</Text><Text style={styles.loadingSubtext}>Please wait a moment</Text></View></View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}><View style={styles.successIconCircle}><Ionicons name="checkmark-circle" size={48} color="#10b981" /></View></View>
            <Text style={styles.successModalTitle}>Booking Submitted</Text>
            <View style={styles.successDetailsCard}><Text style={styles.bookingCodeLabel}>Booking ID</Text><Text style={styles.bookingCodeValue}>{bookingId}</Text><Text style={styles.bookingCodeNote}>We’ll contact you shortly to finalize details</Text></View>
            <TouchableOpacity style={[styles.successButton, { backgroundColor: '#e91e63' }]} onPress={closeSuccess} activeOpacity={0.8}><Text style={styles.successButtonText}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    dayData?.isToday && styles.todayDay,
                    dayData?.isSelected && styles.selectedDay,
                    dayData?.isPast && styles.pastDay,
                    !dayData && styles.emptyDay
                  ]}
                  onPress={() => dayData && !dayData.isPast && selectDate(dayData.date)}
                  disabled={!dayData || dayData.isPast}
                >
                  <Text style={[
                    styles.calendarDayText,
                    dayData?.isToday && styles.todayText,
                    dayData?.isSelected && styles.selectedText,
                    dayData?.isPast && styles.pastText
                  ]}>
                    {dayData?.day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.calendarButtonContainer}>
              <TouchableOpacity
                style={styles.calendarCancelButton}
                onPress={cancelDateSelection}
              >
                <Text style={styles.calendarCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calendarConfirmButton}
                onPress={confirmDateSelection}
              >
                <Text style={styles.calendarConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  faqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  dateInputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', backgroundColor: '#ffffff', paddingRight: 45 },
  calendarIcon: { position: 'absolute', right: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { backgroundColor: '#ffffff', borderRadius: 16, margin: 20, padding: 20, maxWidth: 350, width: '90%' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navButton: { padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  monthYear: { fontSize: 18, fontWeight: '600', color: '#111827' },
  weekDays: { flexDirection: 'row', marginBottom: 10 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7280', paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: 1 },
  emptyDay: { backgroundColor: 'transparent' },
  todayDay: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#3b82f6' },
  selectedDay: { backgroundColor: '#e91e63' },
  pastDay: { opacity: 0.3 },
  calendarDayText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  todayText: { color: '#3b82f6', fontWeight: '600' },
  selectedText: { color: '#ffffff', fontWeight: '600' },
  pastText: { color: '#9ca3af' },
  closeCalendarButton: { marginTop: 20, paddingVertical: 12, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center' },
  closeCalendarText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  
  // Calendar Button Container
  calendarButtonContainer: { flexDirection: 'row', gap: 10, marginTop: 20 },
  calendarCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  calendarConfirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#e91e63', alignItems: 'center' },
  calendarConfirmText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  // Modals (aligned to healthcare)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  confirmModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  modalIconContainer: { alignItems: 'center', marginBottom: 16 },
  modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  bookingDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailLabel: { fontSize: 13, color: '#6b7280', marginLeft: 6, marginRight: 8, minWidth: 65 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButtonSecondary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modalButtonSecondaryText: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  modalButtonPrimary: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#ef4444', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center' },
  bookingCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  bookingCodeValue: { fontSize: 24, fontWeight: '700', color: '#e91e63', letterSpacing: 1, marginBottom: 6 },
  bookingCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  successButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});