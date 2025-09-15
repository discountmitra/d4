import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function HomeServiceDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const service = useMemo(() => ({
    id: (params.id as string) || "",
    name: (params.name as string) || "Service",
    desc: (params.desc as string) || "",
    category: (params.category as string) || "",
    price: (params.price as string) || "",
    discount: (params.discount as string) || "",
  }), [params]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [issueNotes, setIssueNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string; time?: string }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [reqId, setReqId] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const faqData = [
    {
      question: "How quickly can a technician arrive?",
      answer: "Our verified technicians can typically reach your location within 2-4 hours for urgent requests, or you can schedule a convenient time slot."
    },
    {
      question: "What if the technician cannot fix the issue?",
      answer: "If the problem cannot be resolved, you won't be charged for the service. We also provide free re-visits if the same issue occurs within 7 days."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, UPI, credit/debit cards, and digital wallets. Payment is required only after the service is completed to your satisfaction."
    },
    {
      question: "Do you provide warranty on repairs?",
      answer: "Yes, we offer a 30-day service warranty on all repairs and replacements. Original manufacturer warranty applies to new parts and installations."
    }
  ];

  const handleRequest = () => {
    const newErrors: { name?: string; phone?: string; address?: string; time?: string } = {};
    if (!userName.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(userPhone.trim())) newErrors.phone = "Enter valid 10-digit phone";
    if (address.trim().length < 6) newErrors.address = "Enter full address";
    if (!preferredTime.trim()) newErrors.time = "Preferred time is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setShowConfirm(true);
  };

  const confirmRequest = () => {
    setShowConfirm(false);
    setShowProcessing(true);
    setTimeout(() => {
      setReqId(Math.random().toString(36).slice(2, 8).toUpperCase());
      setShowProcessing(false);
      setShowDone(true);
    }, 1500);
  };
  const closeDone = () => { setShowDone(false); router.back(); };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
            <Text style={styles.headerTag}>Home Services</Text>
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
              <View style={styles.pricePill}><Text style={styles.priceText}>{service.price}</Text></View>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="pricetag" size={14} color="#10b981" />
              <Text style={styles.metaText}>{service.discount} • {service.category}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time" size={14} color="#6b7280" />
              <Text style={styles.metaText}>On-time verified professionals</Text>
            </View>
          </View>
        </View>

        {/* Services Carousel */}
        <View style={styles.carouselCard}>
          <View style={styles.carouselHeader}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            <Text style={styles.carouselHint}>Swipe to explore</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
            {getSlidesFor(service.id, service.name).map((slide, idx) => (
              <View key={idx} style={styles.slideCard}>
                <View style={styles.slideIconWrap}>
                  <Ionicons name={slide.icon} size={18} color={slide.color} />
                </View>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideText}>{slide.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Request Form */}
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.sectionTitle}>Request This Service</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>Lowest Price Guarantee</Text></View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput value={userName} onChangeText={setUserName} placeholder="Full name" placeholderTextColor="#9ca3af" style={styles.input} />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput value={userPhone} onChangeText={(t) => { const d = t.replace(/\D/g, ""); if (d.length <= 10) setUserPhone(d); }} placeholder="10-digit mobile" placeholderTextColor="#9ca3af" keyboardType="number-pad" style={styles.input} />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput value={address} onChangeText={setAddress} placeholder="House no, street, area" placeholderTextColor="#9ca3af" style={[styles.input, { height: 64 }]} multiline />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Preferred Time</Text>
            <TextInput value={preferredTime} onChangeText={setPreferredTime} placeholder="e.g., Today 5-7 PM" placeholderTextColor="#9ca3af" style={styles.input} />
            {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
          </View>
          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Issue Notes (Optional)</Text>
            <TextInput value={issueNotes} onChangeText={setIssueNotes} placeholder="Describe the problem briefly" placeholderTextColor="#9ca3af" style={[styles.input, { height: 84 }]} multiline />
          </View>
          <TouchableOpacity style={styles.requestBtn} onPress={handleRequest}>
            <Ionicons name="send" size={16} color="#fff" />
            <Text style={styles.requestBtnText}>Request Now</Text>
          </TouchableOpacity>
          <Text style={styles.noteText}>You will receive a confirmation with a request ID after submission.</Text>
        </View>

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

      {/* Two-step modals - match Healthcare styling, use Home Service data */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="help-circle" size={32} color="#ef4444" />
              </View>
            </View>
            <Text style={styles.modalTitle}>Confirm Request</Text>
            <Text style={styles.modalSubtitle}>Please confirm your details before submitting</Text>
            <View style={styles.bookingDetailsCard}>
              <View style={styles.detailRow}><Ionicons name="construct" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Service:</Text><Text style={styles.detailValue}>{service.name}</Text></View>
              <View style={styles.detailRow}><Ionicons name="person" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Name:</Text><Text style={styles.detailValue}>{userName}</Text></View>
              <View style={styles.detailRow}><Ionicons name="call" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Phone:</Text><Text style={styles.detailValue}>{userPhone}</Text></View>
              <View style={styles.detailRow}><Ionicons name="home" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Address:</Text><Text style={styles.detailValue}>{address}</Text></View>
              <View style={styles.detailRow}><Ionicons name="time" size={16} color="#6b7280" /><Text style={styles.detailLabel}>Preferred:</Text><Text style={styles.detailValue}>{preferredTime}</Text></View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirm(false)} activeOpacity={0.8}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={confirmRequest} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showProcessing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.loadingText}>Submitting your request...</Text>
            <Text style={styles.loadingSubtext}>Please wait a moment</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showDone} transparent animationType="fade" onRequestClose={closeDone}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.modalIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            </View>
            <Text style={styles.successModalTitle}>Request Submitted!</Text>
            <View style={styles.successDetailsCard}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Request ID</Text>
                <Text style={styles.bookingCodeValue}>{reqId}</Text>
                <Text style={styles.bookingCodeNote}>Keep this code for reference</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.successButton} onPress={closeDone} activeOpacity={0.8}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getSlidesFor(id: string, name: string): Array<{ title: string; text: string; icon: keyof typeof Ionicons.glyphMap; color: string }> {
  switch (id) {
    case "plumber-services":
      return [
        { title: "Leak Fix & Sealing", text: "Tap, faucet, and pipeline leakage fixing with durable sealants.", icon: "water", color: "#06b6d4" },
        { title: "Pipe Installation", text: "New line setup and replacement with quality fittings.", icon: "construct", color: "#f59e0b" },
        { title: "Bathroom Fittings", text: "Geyser, shower, and sanitary installations handled safely.", icon: "build", color: "#10b981" },
      ];
    case "electrician-services":
      return [
        { title: "Wiring & MCB", text: "New wiring, MCB upgrades, and short-circuit fixes.", icon: "flash", color: "#f59e0b" },
        { title: "Appliance Repair", text: "Fan, mixer, and small appliance servicing.", icon: "cog", color: "#3b82f6" },
        { title: "Switch & Socket", text: "Replacement and installation with proper earthing.", icon: "power", color: "#10b981" },
      ];
    case "ac-fridge-repair":
      return [
        { title: "AC Service", text: "Gas refill, cooling check, and filter cleaning.", icon: "snow", color: "#60a5fa" },
        { title: "Fridge Repair", text: "Compressor, thermostat, and cooling coil fixes.", icon: "cube", color: "#10b981" },
        { title: "Installation", text: "Split/Window AC installation with brackets.", icon: "construct", color: "#f59e0b" },
      ];
    case "ro-water-purifier":
      return [
        { title: "Filter Change", text: "RO membrane and sediment filter replacement.", icon: "water", color: "#06b6d4" },
        { title: "Leak Fix", text: "Pipe and valve leak sealing for RO systems.", icon: "color-wand", color: "#f59e0b" },
        { title: "Full Service", text: "Sanitization and performance check.", icon: "refresh", color: "#10b981" },
      ];
    case "tv-installation":
      return [
        { title: "Wall Mounting", text: "Secure TV wall mounting with cable management.", icon: "tv", color: "#3b82f6" },
        { title: "Setup & Tuning", text: "DTH/AV setup and channel tuning.", icon: "settings", color: "#10b981" },
        { title: "Repair", text: "Display, speaker, and port issues fixed.", icon: "hammer", color: "#f59e0b" },
      ];
    case "washing-machine-repair":
      return [
        { title: "Motor & Belt", text: "Motor, belt, and drum related issues.", icon: "sync", color: "#60a5fa" },
        { title: "Inlet/Outlet", text: "Water inlet/outlet and valve problems.", icon: "water", color: "#06b6d4" },
        { title: "Installation", text: "Front/top-load installation and demo.", icon: "construct", color: "#f59e0b" },
      ];
    case "microwave-oven-repair":
      return [
        { title: "Heating Issues", text: "Magnetron and heating element fixes.", icon: "flame", color: "#ef4444" },
        { title: "Door & Panel", text: "Door switch and touch panel problems.", icon: "apps", color: "#3b82f6" },
        { title: "General Service", text: "Cleaning and performance check.", icon: "sparkles", color: "#10b981" },
      ];
    case "water-heater-installation":
      return [
        { title: "Mounting", text: "Geyser wall mounting with anchors.", icon: "construct", color: "#f59e0b" },
        { title: "Pipe & Valve", text: "Inlet/outlet pipe and safety valve setup.", icon: "water", color: "#06b6d4" },
        { title: "Demo", text: "Usage and safety demonstration.", icon: "information-circle", color: "#10b981" },
      ];
    case "home-deep-cleaning":
      return [
        { title: "Full Home", text: "Bedroom, hall, and balcony deep clean.", icon: "home", color: "#3b82f6" },
        { title: "Sanitization", text: "High-touch area sanitization.", icon: "medkit", color: "#10b981" },
        { title: "Add-ons", text: "Fridge/oven internal cleaning.", icon: "add-circle", color: "#f59e0b" },
      ];
    case "sofa-carpet-cleaning":
      return [
        { title: "Sofa Shampoo", text: "Fabric/Leather shampooing and vacuum.", icon: "cube", color: "#60a5fa" },
        { title: "Carpet Wash", text: "Stain removal and drying.", icon: "color-fill", color: "#10b981" },
        { title: "Deodorize", text: "Odor treatment and freshening.", icon: "leaf", color: "#f59e0b" },
      ];
    case "bathroom-kitchen-cleaning":
      return [
        { title: "Bathroom", text: "Tiles, fittings, and mirrors deep clean.", icon: "water", color: "#06b6d4" },
        { title: "Kitchen", text: "Chimney, hob, and cabinets degreasing.", icon: "restaurant", color: "#ef4444" },
        { title: "Sanitize", text: "Disinfection of high-touch points.", icon: "sparkles", color: "#10b981" },
      ];
    case "pest-control":
      return [
        { title: "Cockroach", text: "Gel treatment and residual spray.", icon: "bug", color: "#ef4444" },
        { title: "Termite", text: "Drilling and injection treatment.", icon: "alert-circle", color: "#f59e0b" },
        { title: "Mosquito", text: "Fogging and larvicide application.", icon: "leaf", color: "#10b981" },
      ];
    case "house-painting":
      return [
        { title: "Interior", text: "Putty, primer, and two-coat paint.", icon: "brush", color: "#3b82f6" },
        { title: "Exterior", text: "Weather-proof paint and sealing.", icon: "color-palette", color: "#10b981" },
        { title: "Consultation", text: "Color and finish selection help.", icon: "chatbubbles", color: "#f59e0b" },
      ];
    case "false-ceiling-pop":
      return [
        { title: "Design", text: "POP/Gypsum layout and lighting.", icon: "planet", color: "#3b82f6" },
        { title: "Install", text: "Frame and board installation.", icon: "construct", color: "#f59e0b" },
        { title: "Finish", text: "Putty and paint finishing.", icon: "color-fill", color: "#10b981" },
      ];
    case "wallpaper-texture":
      return [
        { title: "Wallpaper", text: "Pattern selection and application.", icon: "images", color: "#3b82f6" },
        { title: "Texture", text: "Designer texture painting.", icon: "color-wand", color: "#f59e0b" },
        { title: "Repair", text: "Patch and re-application.", icon: "build", color: "#10b981" },
      ];
    case "modular-kitchen":
      return [
        { title: "Design", text: "3D layout and material selection.", icon: "cube", color: "#60a5fa" },
        { title: "Fabrication", text: "Cabinet making and edge banding.", icon: "construct", color: "#f59e0b" },
        { title: "Install", text: "Site installation and finishing.", icon: "hammer", color: "#10b981" },
      ];
    case "cctv-installation":
      return [
        { title: "Site Survey", text: "Camera placement and coverage planning.", icon: "map", color: "#3b82f6" },
        { title: "Install", text: "DVR/NVR setup and wiring.", icon: "videocam", color: "#ef4444" },
        { title: "Maintenance", text: "Health check and storage tuning.", icon: "construct", color: "#10b981" },
      ];
    default:
      return [
        { title: name, text: "Professional service with verified technicians and fair pricing.", icon: "information-circle", color: "#6b7280" },
      ];
  }
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
  heroHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  serviceName: { fontSize: 18, fontWeight: "700", color: "#111827", flex: 1, paddingRight: 12 },
  pricePill: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#111827", borderRadius: 12 },
  priceText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },

  carouselCard: { backgroundColor: "#fff", marginHorizontal: 0, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#e5e7eb", paddingVertical: 12, marginBottom: 8 },
  carouselHeader: { paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  carouselHint: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  slideCard: { width: 220, marginRight: 12, backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb', padding: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 2 },
  slideIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', marginBottom: 8 },
  slideTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 6 },
  slideText: { fontSize: 12, color: '#374151', lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  infoText: { fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 18 },
  benefitsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  benefitItem: { flexDirection: "row", alignItems: "center", width: "48%", marginBottom: 8 },
  benefitText: { marginLeft: 6, color: "#374151", fontSize: 12, fontWeight: "600" },

  // Request form styles
  requestCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 8, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  requestHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  badge: { backgroundColor: "#f3f4f6", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "#e5e7eb" },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  formRow: { marginTop: 12 },
  inputLabel: { fontSize: 12, color: "#374151", marginBottom: 6, fontWeight: "700" },
  input: { height: 44, backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 12, color: "#111827", fontWeight: "600" },
  requestBtn: { marginTop: 16, height: 48, borderRadius: 12, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center", flexDirection: "row" },
  requestBtnText: { color: "#fff", fontWeight: "800", marginLeft: 8 },
  noteText: { marginTop: 10, fontSize: 12, color: "#6b7280" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 6, fontWeight: "700" },

  // (previous request styles were commented out; consolidated above)
  // modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  // modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, width: '100%', maxWidth: 360 },
  // modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
  // modalBody: { fontSize: 13, color: '#374151', lineHeight: 18, textAlign: 'center' },
  // modalActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  // modalSecondary: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  // modalSecondaryText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  // modalPrimary: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#3b82f6', alignItems: 'center' },
  // modalPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },

   faqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  
  // Confirmation Modal - Simplified
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
  
  // Loading Modal - Simplified
  loadingModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, textAlign: 'center' },
  loadingSubtext: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },
  
  // Success Modal - Simplified
  successModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  successIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  successModalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  successModalSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  successDetailsCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 20 },
  bookingCodeContainer: { alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  bookingCodeLabel: { fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: '600' },
  bookingCodeValue: { fontSize: 24, fontWeight: '700', color: '#ef4444', letterSpacing: 1, marginBottom: 6 },
  bookingCodeNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
  contactInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10 },
  contactInfoText: { fontSize: 13, color: '#15803d', marginLeft: 10, flex: 1, fontWeight: '500' },
  successButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  successButtonText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});


