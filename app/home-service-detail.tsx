import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from "react-native";
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

   faqCard: { backgroundColor: '#ffffff', marginHorizontal: 20, marginBottom: 20, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  faqList: { gap: 12 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12, marginBottom: 12 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 12 },
  faqAnswerContainer: { paddingTop: 12, paddingLeft: 4 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
});


