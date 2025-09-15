import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

type UserType = 'normal' | 'vip';

interface ServicePrice {
  name: string;
  original: number;
  discounted: number;
  discount: number;
}

const serviceCategories = {
  haircuts: [
    { name: "Haircut", original: 130, normal: { discounted: 110, discount: 20 }, vip: { discounted: 99, discount: 31 } },
    { name: "Haircut + Shaving", original: 170, normal: { discounted: 150, discount: 20 }, vip: { discounted: 129, discount: 41 } },
    { name: "Haircut + Shaving + Head Massage", original: 200, normal: { discounted: 180, discount: 20 }, vip: { discounted: 149, discount: 51 } }
  ],
  facial: [
    { name: "Facial", original: 200, normal: { discounted: 180, discount: 20 }, vip: { discounted: 149, discount: 51 } },
    { name: "De-Tan Treatment", original: 300, normal: { discounted: 270, discount: 30 }, vip: { discounted: 249, discount: 51 } },
    { name: "Face Masks & Skin Therapy", original: 500, normal: { discounted: 450, discount: 50 }, vip: { discounted: 399, discount: 101 } }
  ],
  tattoo: [
    { name: "Tattoo Starting Price", original: 499, normal: { discounted: 449, discount: 10 }, vip: { discounted: 399, discount: 20 } }
  ]
};

export default function SalonDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const salon = useMemo(() => ({
    id: (params.id as string) || "",
    name: (params.name as string) || "Hair Zone Makeover",
    address: (params.address as string) || "Near Gandhi Nagar, Subash Nagar Road, Sircilla",
    rating: parseFloat((params.rating as string) || "4.8"),
    reviews: parseInt((params.reviews as string) || "234"),
  }), [params]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userType, setUserType] = useState<UserType>('normal');
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; services?: string; date?: string; time?: string }>({});

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(serviceCategories).forEach(category => {
      category.forEach(service => {
        if (selectedServices.includes(service.name)) {
          total += userType === 'vip' ? service.vip.discounted : service.normal.discounted;
        }
      });
    });
    return total;
  };

  const handleBooking = () => {
    const newErrors: { name?: string; phone?: string; services?: string; date?: string; time?: string } = {};
    if (!userName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(userPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    if (selectedServices.length === 0) newErrors.services = "Select at least one service";
    if (!appointmentDate.trim()) newErrors.date = "Select appointment date";
    if (!appointmentTime.trim()) newErrors.time = "Select appointment time";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const bookingId = Math.random().toString(36).slice(2, 8).toUpperCase();
    const total = calculateTotal();
    Alert.alert(
      "Booking Confirmed",
      `Salon: ${salon.name}
Name: ${userName}
Phone: ${userPhone}
Services: ${selectedServices.join(', ')}
Date: ${appointmentDate}
Time: ${appointmentTime}
Total: ₹${total}
Booking ID: ${bookingId}`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const renderServiceCategory = (title: string, icon: string, services: any[]) => (
    <View key={title} style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Ionicons name={icon as any} size={20} color="#111827" />
        <Text style={styles.categoryTitle}>{title}</Text>
      </View>
      {services.map((service, index) => {
        const isSelected = selectedServices.includes(service.name);
        const pricing = userType === 'vip' ? service.vip : service.normal;
        return (
          <TouchableOpacity 
            key={index} 
            style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
            onPress={() => toggleService(service.name)}
          >
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>{service.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>₹{service.original}</Text>
                <Text style={[styles.discountedPrice, isSelected && styles.discountedPriceSelected]}>₹{pricing.discounted}</Text>
                <Text style={styles.savings}>Save ₹{pricing.discount}</Text>
              </View>
            </View>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{salon.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTag}>Beauty & Salon</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image source={require("../assets/default.png")} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.salonName}>{salon.name}</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>{salon.rating}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{salon.address}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{salon.reviews} reviews</Text>
            </View>
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
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'vip' && styles.userTypeButtonActive]}
              onPress={() => setUserType('vip')}
            >
              <Text style={[styles.userTypeText, userType === 'vip' && styles.userTypeTextActive]}>VIP User</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services */}
        {renderServiceCategory("Haircuts", "cut", serviceCategories.haircuts)}
        {renderServiceCategory("Facial", "flower", serviceCategories.facial)}
        {renderServiceCategory("Tattoo", "brush", serviceCategories.tattoo)}

        {/* Booking Form */}
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>Book Your Appointment</Text>
          
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput 
              value={userName} 
              onChangeText={setUserName} 
              placeholder="Full name" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              value={userPhone} 
              onChangeText={setUserPhone} 
              placeholder="10-digit mobile number" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
              keyboardType="numeric"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Appointment Date</Text>
            <TextInput 
              value={appointmentDate} 
              onChangeText={setAppointmentDate} 
              placeholder="DD/MM/YYYY" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Appointment Time</Text>
            <TextInput 
              value={appointmentTime} 
              onChangeText={setAppointmentTime} 
              placeholder="e.g., 10:00 AM" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>

          {errors.services ? <Text style={styles.errorText}>{errors.services}</Text> : null}

          {selectedServices.length > 0 && (
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
            </View>
          )}

          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={handleBooking} 
            style={[styles.bookButton, selectedServices.length === 0 && styles.bookButtonDisabled]}
          >
            <Text style={styles.bookButtonText}>Pay and Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerContainer: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  headerTop: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6", marginRight: 16 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  headerActions: { marginLeft: 16 },
  headerTag: { backgroundColor: "#b53471", color: "#ffffff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: "600" },
  content: { flex: 1 },
  heroCard: { backgroundColor: "#ffffff", margin: 20, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" },
  heroImage: { width: "100%", height: 200 },
  heroBody: { padding: 20 },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  salonName: { flex: 1, fontSize: 20, fontWeight: "700", color: "#111827", marginRight: 12 },
  ratingPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#fef3c7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { marginLeft: 4, fontSize: 14, fontWeight: "600", color: "#d97706" },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  metaText: { marginLeft: 8, fontSize: 14, color: "#6b7280" },
  userTypeCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 16 },
  userTypeButtons: { flexDirection: "row", gap: 12 },
  userTypeButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", alignItems: "center" },
  userTypeButtonActive: { borderColor: "#b53471", backgroundColor: "#b53471" },
  userTypeText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  userTypeTextActive: { color: "#ffffff" },
  categoryCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  categoryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  categoryTitle: { marginLeft: 12, fontSize: 18, fontWeight: "700", color: "#111827" },
  serviceItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  serviceItemSelected: { borderColor: "#b53471", backgroundColor: "#fdf2f8" },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  serviceNameSelected: { color: "#b53471" },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  originalPrice: { fontSize: 14, color: "#9ca3af", textDecorationLine: "line-through" },
  discountedPrice: { fontSize: 16, fontWeight: "700", color: "#111827" },
  discountedPriceSelected: { color: "#b53471" },
  savings: { fontSize: 12, color: "#16a34a", fontWeight: "600" },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  checkboxSelected: { borderColor: "#b53471", backgroundColor: "#b53471" },
  bookingCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 40, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff" },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  totalCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#f8fafc", borderRadius: 12, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  totalAmount: { fontSize: 20, fontWeight: "700", color: "#b53471" },
  bookButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#b53471" },
  bookButtonDisabled: { backgroundColor: "#d1d5db" },
  bookButtonText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
});