import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  specialty: string;
  image: any;
  cashback: string;
  discount: string;
  rating: number;
  reviews: number;
  distance: string;
  prepTime: string;
  phone: string;
  openTime: string;
  area?: string;
  savePercent?: number;
  priceForTwo?: string;
  opensIn?: string;
};

export default function FoodScreen() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const data = useMemo<Restaurant[]>(
    () => [
      {
        id: "1",
        name: "ICE HOUSE",
        cuisine: "Pizza, Burgers, Ice Creams",
        specialty: "Pizza, Burgers, Ice Creams, French Fries, Mocktails, Thickshakes",
        image: require("../assets/default.png"),
        cashback: "Up to 7% Cashback",
        discount: "Online Payment",
        rating: 4.5,
        reviews: 250,
        distance: "6km",
        prepTime: "25-30 mins",
        phone: "+91 98765 43210",
        openTime: "10:00 AM - 11:00 PM",
        area: "Gandi Maisa...",
        savePercent: 20,
        priceForTwo: "₹300 for two",
        opensIn: "Open Now",
      },
      {
        id: "2",
        name: "Shankar Chat",
        cuisine: "Street Food, Chaat",
        specialty: "Pani Puri & Chaat",
        image: require("../assets/default.png"),
        cashback: "Up to 10% Cashback",
        discount: "Online Payment",
        rating: 4.8,
        reviews: 180,
        distance: "9km",
        prepTime: "17 mins",
        phone: "+91 98765 43211",
        openTime: "11:00 AM - 10:00 PM",
        area: "Kompally",
        savePercent: 66,
        priceForTwo: "₹700 for two",
        opensIn: "Opens in 17 mins",
      },
      {
        id: "3",
        name: "Indian Fast Food",
        cuisine: "Chinese, Indian",
        specialty: "Rice, Noodles & Manchurian (Veg, Non-Veg & Egg)",
        image: require("../assets/default.png"),
        cashback: "Up to 10% Cashback",
        discount: "Online Payment",
        rating: 4.6,
        reviews: 320,
        distance: "9km",
        prepTime: "17 mins",
        phone: "+91 98765 43212",
        openTime: "12:00 PM - 11:00 PM",
        area: "Pet Basheera...",
        savePercent: 56,
        priceForTwo: "₹500 for two",
        opensIn: "Opens in 17 mins",
      },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food & Restaurants</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search restaurants, cuisines..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.filterButton}>
            <Ionicons name="filter" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const y = e.nativeEvent.contentOffset.y;
          if (!showScrollTop && y > 300) setShowScrollTop(true);
          if (showScrollTop && y <= 300) setShowScrollTop(false);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.card}>
            <View style={{ position: "relative" }}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
              <View style={styles.homeDeliveryPill}>
                <Ionicons name="bicycle-outline" size={14} color="#111827" />
                <Text style={styles.homeDeliveryText}>home delivery</Text>
              </View>
              {typeof item.savePercent === "number" && (
                <View style={styles.saveRibbon}>
                  <Text style={styles.saveText}>Save</Text>
                  <Text style={styles.savePercent}>{item.savePercent}%</Text>
                </View>
              )}
              <View style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={18} color="#ef4444" />
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.subtitle}>{item.cuisine}</Text>
                  <View style={styles.ratingStarsRow}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Ionicons
                        key={idx}
                        name={idx < Math.floor(item.rating) ? "star" : idx < item.rating ? "star-half" : "star-outline"}
                        size={14}
                        color="#f59e0b"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                  <Text style={styles.subtitle}>{item.distance}, {item.area}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewsText}>({item.reviews})</Text>
                </View>
              </View>



              <View style={styles.footerRow}>
                <Text style={styles.openLabel}>Open: <Text style={styles.openTime}>{item.openTime}</Text></Text>
                <View style={styles.ctaRow}>
                  <Text style={styles.ctaText}>Tap to view menu & order</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  topBanner: {
    backgroundColor: "#ffe9b3",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#b45309",
  },
  quickFilters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerGradient: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginLeft: 12,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  homeDeliveryPill: {
    position: "absolute",
    left: 12,
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
  },
  homeDeliveryText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    textTransform: "lowercase",
  },
  saveRibbon: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomLeftRadius: 14,
  },
  saveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  savePercent: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 2,
  },
  ratingStarsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  specialty: {
    fontSize: 12,
    color: "#2563eb",
    marginTop: 6,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  reviewsText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  metaColumn: {
    marginTop: 8,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 4,
  },
  opensText: {
    fontSize: 13,
    color: "#111827",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  openLabel: {
    fontSize: 12,
    color: "#374151",
  },
  openTime: {
    color: "#16a34a",
    fontWeight: "600",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaText: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 4,
  },
  loadMore: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreText: {
    color: "#111827",
    fontWeight: "600",
  },
  scrollTopFab: {
    position: "absolute",
    right: 16,
    bottom: 72,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomButtonText: {
    marginLeft: 8,
    fontWeight: "700",
    color: "#111827",
  },
  bottomDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e5e7eb",
  },
});

function FilterChip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={chipStyles.chip}>
      <Ionicons name={icon} size={14} color="#111827" />
      <Text style={chipStyles.chipText}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  chipText: {
    marginLeft: 6,
    fontWeight: "700",
    color: "#111827",
    fontSize: 12,
  },
});


