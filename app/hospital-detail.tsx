import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Linking,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getHospitalById } from "../constants/hospitalData";
import { useState, useMemo } from "react";

export default function HospitalDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const hospitalId = (params.id as string) || "";
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    age?: string;
    date?: string;
  }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const hospital = useMemo(() => getHospitalById(hospitalId), [hospitalId]);

  if (!hospital) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text style={{ color: "#111827", fontWeight: "700", fontSize: 16 }}>
          Hospital not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#ef4444", fontWeight: "700" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = async () => {
    const phone =
      "tel:" + ("phone" in hospital ? (hospital as any).phone || "" : "");
    if (!phone || phone === "tel:") {
      return;
    }
    const supported = await Linking.canOpenURL(phone);
    if (supported) {
      Linking.openURL(phone);
    }
  };

  const handleBook = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      age?: string;
      date?: string;
    } = {};
    if (!patientName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(patientPhone.trim()))
      newErrors.phone = "Enter valid 10-digit phone";
    if (!/^\d{1,3}$/.test(patientAge.trim())) newErrors.age = "Enter valid age";
    if (!/^\d{2}-\d{2}-\d{4}$/.test(preferredDate.trim()))
      newErrors.date = "Use DD-MM-YYYY";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    // Simulate API call with 2 second delay
    setTimeout(() => {
      const uniqueCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      setBookingCode(uniqueCode);
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Clear form
    setPatientName("");
    setPatientPhone("");
    setPatientAge("");
    setPreferredDate("");
    setNotes("");
    setErrors({});
    router.back();
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setPreferredDate(formattedDate);
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isPast = date < today && !isToday;

      days.push({ day, date, isToday, isSelected, isPast });
    }

    return days;
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const confirmDateSelection = () => {
    // Format date as DD-MM-YYYY to avoid timezone issues
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setPreferredDate(formattedDate);
    setErrors((prev) => ({ ...prev, date: undefined }));
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {hospital.name}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerTag}>Healthcare</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Image
            source={require("../assets/default.png")}
            style={styles.heroImage}
          />
          <View style={styles.heroBody}>
            <View style={styles.heroHeader}>
              <Text style={styles.hospitalName} numberOfLines={2}>
                {hospital.name}
              </Text>
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
              <Text style={styles.metaText}>
                {hospital.description.split("\n")[1] || ""}
              </Text>
            </View>
          </View>
        </View>

        {/* About / Specialty */}
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About & Services</Text>
          <Text style={styles.infoText}>
            {hospital.specialist} – Expert care and patient-first approach.
          </Text>
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
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>Normal</Text>
            </View>
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
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
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
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
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
            {errors.age ? (
              <Text style={styles.errorText}>{errors.age}</Text>
            ) : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Preferred Date</Text>
            <TouchableOpacity onPress={openDatePicker} activeOpacity={0.8} style={styles.dateInputContainer}>
              <TextInput
                value={preferredDate}
                placeholder="Select date"
                placeholderTextColor="#9ca3af"
                style={styles.dateInput}
                editable={false}
                pointerEvents="none"
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#6b7280"
                style={styles.calendarIcon}
              />
            </TouchableOpacity>
            {errors.date ? (
              <Text style={styles.errorText}>{errors.date}</Text>
            ) : null}
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
          <Text style={styles.noteText}>
            A unique booking code will be generated after confirmation.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#ef4444" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to book this appointment?
            </Text>

            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="business" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Hospital:</Text>
                <Text style={styles.detailValue}>{hospital.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Patient:</Text>
                <Text style={styles.detailValue}>{patientName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{patientPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{preferredDate}</Text>
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={confirmBooking}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Yes, Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ef4444" />
              <Text style={styles.loadingText}>Processing your booking...</Text>
              <Text style={styles.loadingSubtext}>
                Please wait while we confirm your appointment
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            </View>

            <Text style={styles.successModalTitle}>Booking Confirmed!</Text>
            <Text style={styles.successModalSubtitle}>
              Your appointment has been successfully booked
            </Text>

            <View style={styles.successDetailsCard}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Booking Code</Text>
                <Text style={styles.bookingCodeValue}>{bookingCode}</Text>
                <Text style={styles.bookingCodeNote}>
                  Show this code at the reception
                </Text>
              </View>

              <View style={styles.contactInfoCard}>
                <Ionicons name="time" size={20} color="#10b981" />
                <Text style={styles.contactInfoText}>
                  Our team will contact you soon to confirm the appointment time
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successButton}
              onPress={closeSuccessModal}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => navigateMonth("prev")}
                style={styles.monthNavButton}
              >
                <Ionicons name="chevron-back" size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity
                onPress={() => navigateMonth("next")}
                style={styles.monthNavButton}
              >
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysContainer}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => {
                if (!dayData) {
                  return <View key={index} style={styles.emptyDay} />;
                }

                const { day, date, isToday, isSelected, isPast } = dayData;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      isToday && styles.todayDay,
                      isSelected && styles.selectedDay,
                      isPast && styles.pastDay,
                    ]}
                    onPress={() => !isPast && selectDate(date)}
                    disabled={isPast}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        isSelected && styles.selectedText,
                        isPast && styles.pastText,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1, marginHorizontal: 16 },
  headerTitle: { color: "#111827", fontSize: 18, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerTag: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  content: { flex: 1 },

  heroCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  heroImage: { width: "100%", height: 160 },
  heroBody: { padding: 16 },
  hospitalName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    paddingRight: 12,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  heroActions: { flexDirection: "row", marginTop: 12 },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  callBtnText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  toggleRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  togglePill: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  togglePillActive: { backgroundColor: "#111827", borderColor: "#111827" },
  toggleText: { fontSize: 13, color: "#111827", fontWeight: "700" },
  toggleTextActive: { color: "#fff" },

  offersCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  offersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  offerBody: { marginTop: 8 },
  offerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 8,
  },
  offerText: { fontSize: 13, color: "#374151", lineHeight: 18 },

  bookingCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modeBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modeBadgeText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  formRow: { marginTop: 12 },
  inputLabel: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "700",
  },
  input: {
    height: 44,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#111827",
    fontWeight: "600",
  },
  dateInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    height: 44,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    paddingRight: 40,
  },
  calendarIcon: { position: "absolute", right: 12 },
  bookBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  bookBtnText: { color: "#fff", fontWeight: "800", marginLeft: 8 },
  noteText: { marginTop: 10, fontSize: 12, color: "#6b7280" },

  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  infoText: { fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 18 },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#bae6fd",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  infoNoteText: {
    marginLeft: 8,
    color: "#075985",
    fontSize: 12,
    fontWeight: "600",
  },
  aboutCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "700",
  },
  fallbackOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  fallbackBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  fallbackCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fallbackBtnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fallbackBtnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ef4444",
  },

  // Modal Styles - Enhanced Simple & Professional
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  // Confirmation Modal - Simplified
  confirmModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconContainer: { alignItems: "center", marginBottom: 16 },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  bookingDetailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  detailLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginLeft: 6,
    marginRight: 8,
    minWidth: 65,
  },
  detailValue: { fontSize: 13, fontWeight: "600", color: "#111827", flex: 1 },
  modalButtonContainer: { flexDirection: "row", gap: 10 },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  modalButtonPrimaryText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Loading Modal - Simplified
  loadingModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingContainer: { alignItems: "center" },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
  },

  // Success Modal - Simplified
  successModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  successModalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
  },
  successDetailsCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  bookingCodeContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  bookingCodeLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  bookingCodeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ef4444",
    letterSpacing: 1,
    marginBottom: 6,
  },
  bookingCodeNote: { fontSize: 11, color: "#9ca3af", textAlign: "center" },
  contactInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 10,
  },
  contactInfoText: {
    fontSize: 13,
    color: "#15803d",
    marginLeft: 10,
    flex: 1,
    fontWeight: "500",
  },
  successButton: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  successButtonText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Calendar Modal
  calendarModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthNavButton: { padding: 8, borderRadius: 8, backgroundColor: "#f3f4f6" },
  monthYearText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  weekDaysContainer: { flexDirection: "row", marginBottom: 10 },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    paddingVertical: 8,
  },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  emptyDay: { width: "14.285%", height: 40 },
  calendarDay: {
    width: "14.285%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  todayDay: { backgroundColor: "#fef2f2" },
  selectedDay: { backgroundColor: "#ef4444" },
  pastDay: { opacity: 0.3 },
  dayText: { fontSize: 14, fontWeight: "500", color: "#111827" },
  todayText: { color: "#ef4444", fontWeight: "700" },
  selectedText: { color: "#ffffff", fontWeight: "700" },
  pastText: { color: "#9ca3af" },
  calendarButtonContainer: { flexDirection: "row", gap: 10 },
  calendarCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  calendarCancelText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  calendarConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  calendarConfirmText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
});
