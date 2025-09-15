import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AutomobileDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const service = useMemo(() => ({
    id: (params.id as string) || "",
    name: (params.name as string) || "Service",
    specialist: (params.specialist as string) || "",
    description: (params.description as string) || "",
    buttonType: (params.buttonType as string) || "request",
  }), [params]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [issueNotes, setIssueNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string; time?: string }>({});

  const handleRequest = () => {
    const newErrors: { name?: string; phone?: string; address?: string; time?: string } = {};
    if (!userName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(userPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    if (address.trim().length < 6) newErrors.address = "Enter full address";
    if (!preferredTime.trim()) newErrors.time = "Preferred time is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const requestId = Math.random().toString(36).slice(2, 8).toUpperCase();
    Alert.alert(
      "Request Submitted",
      `Service: ${service.name}
Name: ${userName}
Phone: ${userPhone}
Address: ${address}
Preferred: ${preferredTime}
Request ID: ${requestId}`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const getButtonText = () => {
    return service.buttonType === 'request' ? 'Request Now' : 'Pay Now';
  };

  const getButtonColor = () => {
    return service.buttonType === 'request' ? '#059669' : '#dc2626';
  };

  const formatSpecialistText = (text: string) => {
    return text.replace(/\\n/g, '\n');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{service.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTag}>Automobiles</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image source={require("../assets/default.png")} style={styles.heroImage} />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{getButtonText()}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="car-sport" size={14} color="#059669" />
              <Text style={styles.metaText}>Automobile Services</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="checkmark-circle" size={14} color="#6b7280" />
              <Text style={styles.metaText}>Verified & Trusted Provider</Text>
            </View>
          </View>
        </View>

        {/* Service Description */}
        <View style={styles.descriptionCard}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.sectionTitle}>Service Details</Text>
          </View>
          
          {service.specialist && (
            <View style={styles.specialistSection}>
              <Text style={styles.specialistTitle}>Specialization</Text>
              <Text style={styles.specialistText}>{formatSpecialistText(service.specialist)}</Text>
            </View>
          )}

          {service.description && (
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalTitle}>Additional Information</Text>
              <Text style={styles.additionalText}>{service.description}</Text>
            </View>
          )}
        </View>

        {/* Request Form */}
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.sectionTitle}>Request This Service</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Professional Service</Text>
            </View>
          </View>
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
            <Text style={styles.inputLabel}>Phone</Text>
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
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput 
              value={address} 
              onChangeText={setAddress} 
              placeholder="Full address with landmarks" 
              placeholderTextColor="#9ca3af" 
              style={styles.textArea} 
              multiline 
              numberOfLines={3}
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Preferred Time</Text>
            <TextInput 
              value={preferredTime} 
              onChangeText={setPreferredTime} 
              placeholder="e.g., Tomorrow 10 AM or Next week" 
              placeholderTextColor="#9ca3af" 
              style={styles.input} 
            />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
            <TextInput 
              value={issueNotes} 
              onChangeText={setIssueNotes} 
              placeholder="Any specific requirements or notes" 
              placeholderTextColor="#9ca3af" 
              style={styles.textArea} 
              multiline 
              numberOfLines={3}
            />
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={handleRequest} style={[styles.submitButton, { backgroundColor: getButtonColor() }]}>
            <Text style={styles.submitText}>{getButtonText()}</Text>
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
  headerTag: { backgroundColor: "#059669", color: "#ffffff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: "600" },
  content: { flex: 1 },
  heroCard: { backgroundColor: "#ffffff", margin: 20, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb" },
  heroImage: { width: "100%", height: 200 },
  heroBody: { padding: 20 },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  serviceName: { flex: 1, fontSize: 20, fontWeight: "700", color: "#111827", marginRight: 12 },
  badgePill: { backgroundColor: "#dcfce7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#16a34a" },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  metaText: { marginLeft: 8, fontSize: 14, color: "#6b7280" },
  descriptionCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  descriptionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  specialistSection: { marginBottom: 16 },
  specialistTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 8 },
  specialistText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  additionalInfo: { borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 16 },
  additionalTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 8 },
  additionalText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  requestCard: { backgroundColor: "#ffffff", marginHorizontal: 20, marginBottom: 40, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  badge: { backgroundColor: "#eff6ff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  formRow: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff" },
  textArea: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827", backgroundColor: "#ffffff", textAlignVertical: "top" },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  submitButton: { marginTop: 8, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  submitText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
});