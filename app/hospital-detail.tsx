import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, TextInput, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getHospitalById } from "../constants/hospitalData";

export default function HospitalDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const hospitalId = (params.id as string) || "";
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; age?: string; date?: string }>({});

  const hospital = useMemo(() => getHospitalById(hospitalId), [hospitalId]);

  if (!hospital) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}> 
        <Text style={{ color: "#111827", fontWeight: "700", fontSize: 16 }}>Hospital not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#ef4444", fontWeight: "700" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = async () => {
    const phone = "tel:" + ("phone" in hospital ? (hospital as any).phone || "" : "");
    if (!phone || phone === "tel:") {
      Alert.alert("Unavailable", "Phone number not available");
      return;
    }
    const supported = await Linking.canOpenURL(phone);
    if (supported) {
      Linking.openURL(phone);
    } else {
      Alert.alert("Error", "Unable to open dialer");
    }
  };

  const handleBook = () => {
    const newErrors: { name?: string; phone?: string; age?: string; date?: string } = {};
    if (!patientName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(patientPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    if (!/^\d{1,3}$/.test(patientAge.trim())) newErrors.age = "Enter valid age";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate.trim())) newErrors.date = "Use YYYY-MM-DD";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const uniqueCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    Alert.alert(
      "Booking Confirmed",
      `Hospital: ${hospital.name}\nPatient: ${patientName}\nPhone: ${patientPhone}\nAge: ${patientAge || "-"}\nPreferred Date: ${preferredDate || "-"}\nCode: ${uniqueCode}\n\nShow this code at the reception.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{hospital.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTag}>Healthcare</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image source={require("../assets/default.png")} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.hospitalName} numberOfLines={2}>{hospital.name}</Text>
              <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                <Ionicons name="call" size={14} color="#fff" />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="medkit" size={14} color="#6b7280" />
              <Text style={styles.metaText}>{hospital.specialist}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location" size={14} color="#ef4444" />
              <Text style={styles.metaText}>{hospital.description.split("\n")[1] || ""}</Text>
            </View>
          </View>
        </View>

        {/* About / Specialty */}
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About & Services</Text>
          <Text style={styles.infoText}>{hospital.specialist} – Expert care and patient-first approach.</Text>
          <Text style={styles.infoText}>
            {hospital.description.split("\n")[0]}
          </Text>
        </View>

        {/* Offers */}
        <View style={styles.offersCard}>
          <View style={styles.offersHeader}>
            <Text style={styles.sectionTitle}>Offers & Benefits</Text>
          </View>
          <View style={styles.offerBody}>
            {hospital.normalUserOffer.split("\n").map((line, i) => (
              <View key={i} style={styles.offerRow}>
                <View style={styles.bullet} />
                <Text style={styles.offerText}>{line.trim()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.sectionTitle}>Book OP</Text>
            <View style={styles.modeBadge}><Text style={styles.modeBadgeText}>Normal</Text></View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Patient Name</Text>
            <TextInput
              value={patientName}
              onChangeText={setPatientName}
              placeholder="Enter full name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              value={patientPhone}
              onChangeText={(t) => {
                const digits = t.replace(/\D/g, "");
                if (digits.length <= 10) setPatientPhone(digits);
              }}
              placeholder="10-digit mobile number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              style={styles.input}
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              value={patientAge}
              onChangeText={setPatientAge}
              placeholder="e.g., 28"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              style={styles.input}
            />
            {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Preferred Date</Text>
            <TextInput
              value={preferredDate}
              onChangeText={(t) => {
                const digits = t.replace(/\D/g, "").slice(0, 8);
                let formatted = digits;
                if (digits.length > 4) {
                  formatted = digits.slice(0, 4) + '-' + digits.slice(4);
                }
                if (digits.length > 6) {
                  formatted = digits.slice(0, 4) + '-' + digits.slice(4, 6) + '-' + digits.slice(6, 8);
                }
                setPreferredDate(formatted);
                if (digits.length === 8) {
                  setErrors(prev => ({ ...prev, date: undefined }));
                }
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
            />
            {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Notes (Problem/Details)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Briefly describe the issue"
              placeholderTextColor="#9ca3af"
              multiline
              style={[styles.input, { height: 84, textAlignVertical: "top" }]}
            />
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.bookBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
          <Text style={styles.noteText}>A unique booking code will be generated after confirmation.</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerContainer: { backgroundColor: "#fff", paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center" },
  headerInfo: { flex: 1, marginHorizontal: 16 },
  headerTitle: { color: "#111827", fontSize: 18, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerTag: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  content: { flex: 1 },

  heroCard: { margin: 16, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" },
  heroImage: { width: "100%", height: 160 },
  heroBody: { padding: 16 },
  hospitalName: { fontSize: 18, fontWeight: "700", color: "#111827", flex: 1, paddingRight: 12 },
  heroHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  heroActions: { flexDirection: "row", marginTop: 12 },
  callBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#111827", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  callBtnText: { marginLeft: 6, color: "#fff", fontWeight: "800", fontSize: 12 },

  toggleRow: { flexDirection: "row", marginHorizontal: 16, marginTop: 4, marginBottom: 12 },
  togglePill: { flex: 1, height: 40, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  togglePillActive: { backgroundColor: "#111827", borderColor: "#111827" },
  toggleText: { fontSize: 13, color: "#111827", fontWeight: "700" },
  toggleTextActive: { color: "#fff" },

  offersCard: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16 },
  offersHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  offerBody: { marginTop: 8 },
  offerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10b981", marginRight: 8 },
  offerText: { fontSize: 13, color: "#374151", lineHeight: 18 },

  bookingCard: { backgroundColor: "#ffffff", marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  bookingHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  modeBadge: { backgroundColor: "#f3f4f6", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "#e5e7eb" },
  modeBadgeText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  formRow: { marginTop: 12 },
  inputLabel: { fontSize: 12, color: "#374151", marginBottom: 6, fontWeight: "700" },
  input: { height: 44, backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 12, color: "#111827", fontWeight: "600" },
  bookBtn: { marginTop: 16, height: 48, borderRadius: 12, backgroundColor: "#ef4444", alignItems: "center", justifyContent: "center", flexDirection: "row" },
  bookBtnText: { color: "#fff", fontWeight: "800", marginLeft: 8 },
  noteText: { marginTop: 10, fontSize: 12, color: "#6b7280" },

  infoCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16 },
  infoText: { fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 18 },
  infoNote: { flexDirection: "row", alignItems: "center", backgroundColor: "#e0f2fe", borderWidth: 1, borderColor: "#bae6fd", padding: 10, borderRadius: 12, marginTop: 10 },
  infoNoteText: { marginLeft: 8, color: "#075985", fontSize: 12, fontWeight: "600" },
  aboutCard: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginTop: 4, marginBottom: 12 },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 6, fontWeight: "700" },
  fallbackOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 1000 },
  fallbackBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  fallbackCard: { position: 'absolute', left: 16, right: 16, bottom: 24, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  fallbackBtnSecondary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f3f4f6', marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  fallbackBtnPrimary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#ef4444' },
});


