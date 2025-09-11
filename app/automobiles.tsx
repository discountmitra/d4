import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type CategoryKey = "Showrooms" | "Batteries" | "Car Wash" | "Engine Services" | "Spare Parts" | "Tyres" | "Oils & Lubricants";

type AutomobileService = {
  id: string;
  name: string;
  specialist?: string;
  location?: string;
  description: string;
  offers?: string;
  pricing?: Array<{
    service: string;
    price: number;
    cashback?: number;
  }>;
  features?: string[];
  cashback?: string;
  voucher?: string;
  buttonType: 'request' | 'pay';
  category: CategoryKey;
  rating: number;
  reviews: number;
  availability: string;
};

export default function AutomobilesScreen() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Showrooms");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Showrooms",
    "Batteries",
    "Car Wash",
    "Engine Services",
    "Spare Parts",
    "Tyres",
    "Oils & Lubricants",
  ];

  const data = useMemo<AutomobileService[]>(
    () => [
      // Showrooms
      {
        id: "car-showroom",
        name: "Car Showroom",
        specialist: "New & Used Cars",
        location: "Main Road, Sircilla - 505301",
        description: "Want to Buy a Car? Call Us Today! No Bargaining Needed, Lowest Price Guarantee",
        offers: "15% Off",
        buttonType: "request",
        category: "Showrooms",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
      },
      {
        id: "bike-showroom",
        name: "Bike Showroom",
        specialist: "Motorcycles & Scooters",
        location: "Highway Road, Sircilla - 505301",
        description: "Want to Buy a Bike? Call Us Today! No Bargaining Needed, Lowest Price Guarantee",
        offers: "12% Off",
        buttonType: "request",
        category: "Showrooms",
        rating: 4.7,
        reviews: 980,
        availability: "Available Now",
      },
      // Batteries
      {
        id: "amaron-battery",
        name: "Amaron Battery",
        specialist: "Battery Specialist",
        location: "Auto Market, Sircilla - 505301",
        description: "Amaron Batteries - Bike, Auto & Car Batteries. Door Delivery Available",
        offers: "35% Off",
        features: ["Door Delivery Available"],
        buttonType: "request",
        category: "Batteries",
        rating: 4.6,
        reviews: 750,
        availability: "Available Now",
      },
      // Car Wash Services
      {
        id: "sri-manjunatha-hydraulic",
        name: "Sri Manjunatha Hydraulic Water Servicing Center",
        specialist: "Hydraulic Services",
        location: "Karimnagar Road, Srinagar Colony, Beside Common",
        description: "Professional car and bike washing services with hydraulic equipment",
        offers: "20% Off",
        cashback: "Up to ₹100",
        pricing: [
          { service: "Bike Wash", price: 100 },
          { service: "Car Wash (Swift, Dzire, Ford, Ertiga, Creta, Brezza)", price: 500 },
          { service: "Car Wash (Innova, Fortuner, Bolero, Carnival)", price: 600 }
        ],
        buttonType: "pay",
        category: "Car Wash",
        rating: 4.9,
        reviews: 1500,
        availability: "Available Now",
      },
      // Carbon Cleaning Services
      {
        id: "a1-engine-carbon-cleaning",
        name: "A1 Engine Carbon Cleaning Services",
        specialist: "Engine Specialist",
        location: "Next to Adarsh Motor Showroom, Shantinagar Road, Sircilla",
        description: "Professional engine carbon cleaning services for improved performance",
        offers: "30% Off",
        cashback: "Up to ₹500",
        pricing: [
          { service: "Bike Carbon Cleaning", price: 400, cashback: 100 },
          { service: "Car Carbon Cleaning - Basic", price: 999, cashback: 200 },
          { service: "Car Carbon Cleaning - High-End", price: 1999, cashback: 300 },
          { service: "Auto Carbon Cleaning - Mini", price: 599, cashback: 100 },
          { service: "Auto Carbon Cleaning - Big", price: 799, cashback: 150 }
        ],
        buttonType: "pay",
        category: "Engine Services",
        rating: 4.8,
        reviews: 1100,
        availability: "Available Now",
      },
      // Spare Parts
      {
        id: "vasavi-automobiles",
        name: "Vasavi Automobiles",
        specialist: "Car & Bike Spare Parts, Auto Care",
        location: "Karimnagar Road, Sircilla - 505301",
        description: "Complete range of car and bike spare parts with auto care services. Call 9876543222",
        offers: "18% Off",
        voucher: "Pay ₹950, get ₹1000 Voucher",
        buttonType: "pay",
        category: "Spare Parts",
        rating: 4.7,
        reviews: 890,
        availability: "Available Now",
      },
      // Tyres
      {
        id: "mrf-tyres",
        name: "MRF Tyres",
        specialist: "Tyre Specialist",
        location: "Tyre Market, Sircilla - 505301",
        description: "All Types of MRF Tyres Available",
        offers: "10% Off",
        buttonType: "request",
        category: "Tyres",
        rating: 4.5,
        reviews: 650,
        availability: "Available Now",
      },
      {
        id: "apollo-tyres",
        name: "Apollo Tyres",
        specialist: "Tyre Dealer",
        location: "Highway Road, Sircilla - 505301",
        description: "All Types of Apollo Tyres Available",
        offers: "10% Off",
        buttonType: "request",
        category: "Tyres",
        rating: 4.6,
        reviews: 720,
        availability: "Available Now",
      },
      {
        id: "normal-tyres",
        name: "Normal Tyres",
        specialist: "All Brand Tyres",
        location: "Auto Market, Sircilla - 505301",
        description: "All Types of Tyres Available",
        offers: "20% Off",
        buttonType: "request",
        category: "Tyres",
        rating: 4.4,
        reviews: 580,
        availability: "Available Now",
      },
      // Oil Services
      {
        id: "oil-shop",
        name: "Oil Shop",
        specialist: "Lubricant Specialist",
        location: "Service Road, Sircilla - 505301",
        description: "All Brands of Oils Available",
        offers: "25% Off",
        buttonType: "request",
        category: "Oils & Lubricants",
        rating: 4.5,
        reviews: 620,
        availability: "Available Now",
      },
    ],
    []
  );

  const matchesOrdered = (q: string, ...fields: Array<string | undefined>) => {
    const queryStr = q.trim().toLowerCase();
    if (!queryStr) return true;
    const hay = fields.filter(Boolean).join(" ").toLowerCase();
    const tokens = queryStr.split(/\s+/);
    let pos = 0;
    for (const token of tokens) {
      const idx = hay.indexOf(token, pos);
      if (idx === -1) return false;
      pos = idx + token.length;
    }
    return true;
  };

  const filtered = useMemo(() => {
    const byCategory = data.filter(s => s.category === selectedCategory);
    if (!query.trim()) return byCategory;
    return byCategory.filter(s => matchesOrdered(query, s.name, s.specialist, s.location, s.description));
  }, [data, selectedCategory, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Automobiles</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search automobile services..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category chips outside of the header */}
      <View style={styles.categoryChipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChipsOuter}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} activeOpacity={0.9}>
              <View style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}>
                <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustrationWrapper}>
              <NoDataIllustration width="100%" height="100%" />
            </View>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>Try a different search query.</Text>
          </View>
        )}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          if (!showScrollTop && y > 300) setShowScrollTop(true);
          if (showScrollTop && y <= 300) setShowScrollTop(false);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.card}>
            <View style={{ position: "relative" }}>
              <Image source={require("../assets/default.png")} style={styles.image} resizeMode="cover" />
              {item.offers && (
                <View style={styles.discountRibbon}>
                  <Text style={styles.discountText}>{item.offers}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  {item.specialist && (
                    <Text style={styles.subtitle}>{item.specialist}</Text>
                  )}
                  {item.location && (
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={14} color="#6b7280" />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewsText}>({item.reviews})</Text>
                </View>
              </View>

              {/* {(item.cashback || item.voucher) && (
                <View style={styles.offerInfo}>
                  {item.cashback && (
                    <Text style={styles.cashbackText}>{item.cashback}</Text>
                  )}
                  {item.voucher && (
                    <Text style={styles.voucherText}>{item.voucher}</Text>
                  )}
                </View>
              )} */}

              <View style={styles.footerRow}>
                <View style={styles.availabilityRow}>
                  <View style={styles.availabilityDot} />
                  <Text style={styles.availabilityText}>{item.availability}</Text>
                </View>
                <View style={styles.ctaRow}>
                  <Text style={styles.ctaText}>
                    {item.buttonType === 'request' ? 'Tap to request quote' : 'Tap to view details'}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (<View style={{ height: 88 }} />)}
      />

      {showScrollTop && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          style={styles.scrollTopFab}
        >
          <Ionicons name="arrow-up" size={20} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  headerGradient: { backgroundColor: "#059669", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  filterButton: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", marginLeft: 12 },
  categoryChipsContainer: { backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  categoryChipsOuter: { paddingHorizontal: 16, paddingVertical: 12 },
  catChip: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#ffffff", paddingHorizontal: 14, height: 40, borderRadius: 20, marginRight: 12, alignItems: "center", justifyContent: "center" },
  catChipActive: { backgroundColor: "#111827", borderColor: "#111827" },
  catChipText: { fontWeight: "700", color: "#111827", fontSize: 12 },
  catChipTextActive: { color: "#ffffff" },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
  emptyContainer: { padding: 24, alignItems: "center", justifyContent: "center" },
  emptyIllustrationWrapper: { width: "100%", aspectRatio: 1.2, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", textAlign: "center", marginTop: 4 },
  emptySubtitle: { fontSize: 14, color: "#475569", textAlign: "center", marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 3 },
  image: { width: "100%", height: 160 },
  discountRibbon: { position: "absolute", right: 0, top: 0, backgroundColor: "#ef4444", paddingHorizontal: 14, paddingVertical: 8, borderBottomLeftRadius: 14 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardBody: { padding: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#4b5563", marginTop: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingStarsRow: { flexDirection: "row", marginTop: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontSize: 12, fontWeight: "700", color: "#111827" },
  reviewsText: { marginLeft: 4, fontSize: 12, color: "#6b7280" },
  offerInfo: { marginTop: 8, marginBottom: 8 },
  cashbackText: { fontSize: 12, color: "#16a34a", fontWeight: "600", marginBottom: 2 },
  voucherText: { fontSize: 12, color: "#dc2626", fontWeight: "600" },
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  availabilityRow: { flexDirection: "row", alignItems: "center" },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  ctaRow: { flexDirection: "row", alignItems: "center" },
  ctaText: { fontSize: 12, color: "#6b7280", marginRight: 4 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
});
