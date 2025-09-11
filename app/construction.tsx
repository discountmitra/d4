import { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import NoDataIllustration from "../assets/no-data.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type CategoryKey = "Cement" | "Steel" | "Bricks" | "Paints" | "RMC" | "Tiles & Stone" | "Interior Services" | "Machinery";

type ConstructionItem = {
  id: string;
  name: string;
  description: string;
  category: CategoryKey;
  icon: keyof typeof Ionicons.glyphMap;
  price?: string;
  details?: string;
  rating: number;
  reviews: number;
  availability: string;
  image?: string;
};

export default function ConstructionScreen() {
  const navigation = useNavigation();
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Cement");
  const [query, setQuery] = useState("");

  const categories: CategoryKey[] = [
    "Cement",
    "Steel",
    "Bricks",
    "Paints",
    "RMC",
    "Tiles & Stone",
    "Interior Services",
    "Machinery",
  ];

  const data = useMemo<ConstructionItem[]>(
    () => [
      // Cement
      {
        id: "ultratech-cement",
        name: "Ultratech Cement",
        description: "Ultratech Cement, Ultratech Cement Super",
        category: "Cement",
        icon: "cube",
        image: "https://images.unsplash.com/photo-1747103068995-e6db935a922b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXRlY2glMjBjZW1lbnQlMjBiYWdzJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc1NjIzMjA5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        reviews: 1200,
        availability: "Available Now",
      },
      {
        id: "birla-cement",
        name: "Birla Cement",
        description: "MP Birla Cement",
        category: "Cement",
        icon: "cube",
        image: "https://images.unsplash.com/photo-1625337905408-7b6fe970e187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJsYSUyMGNlbWVudCUyMGJhZyUyMGNvbnNydWN0aW9uJTIwbWF0ZXJpYWx8ZW58MXx8fHwxNzU2MjMyMDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 820,
        availability: "Available Now",
      },
      {
        id: "ambuja-cement",
        name: "Ambuja Cement",
        description: "Ambuja Cement, Ambuja Plus, Ambuja Kawachi",
        category: "Cement",
        icon: "cube",
        image: "https://images.unsplash.com/photo-1625337905408-7b6fe970e187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJ1amElMjBjZW1lbnQlMjBjb25zdHJ1Y3Rpb24lMjBiYWdzfGVufDF8fHx8MTc1NjIzMjA5OHww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 930,
        availability: "Available Now",
      },
      {
        id: "bangur-cement",
        name: "Bangur Cement",
        description: "Bangur Cement",
        category: "Cement",
        icon: "cube",
        image: "https://images.unsplash.com/photo-1747103068995-e6db935a922b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBiYWdzJTIwY29uc3RydWN0aW9uJTIwc2l0ZXxlbnwxfHx8fDE3NTYyMzIwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.5,
        reviews: 640,
        availability: "Available Now",
      },

      // Steel
      {
        id: "psk-steel",
        name: "PSK Steel",
        description: "PSK TTM 600+ SD",
        category: "Steel",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1626845447936-eb4f45fbbf69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHJvZHMlMjBjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHxlbnwxfHx8fDE3NTYyMzIxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 710,
        availability: "Available Now",
      },
      {
        id: "jindal-steel",
        name: "Jindal Steel",
        description: "Jindal Steel, Jindal Pantha",
        category: "Steel",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1706851133383-3d8bfeccdd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGJhcnMlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc1NjIzMjEwMHww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 980,
        availability: "Available Now",
      },
      {
        id: "tata-steel",
        name: "TATA Steel",
        description: "TATA Steel",
        category: "Steel",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1709244596178-4c2656d02d1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXRhJTIwc3RlZWwlMjBjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHxlbnwxfHx8fDE3NTYyMzIxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 860,
        availability: "Available Now",
      },

      // Bricks
      {
        id: "red-bricks",
        name: "Red Bricks",
        description: "Top Quality Red Bricks",
        category: "Bricks",
        icon: "apps",
        image: "https://images.unsplash.com/photo-1627882204750-c28f0699756e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBicmlja3MlMjBjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHxlbnwxfHx8fDE3NTYyMzIxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 540,
        availability: "Available Now",
      },
      {
        id: "cement-bricks",
        name: "Cement Bricks",
        description: "All Sizes",
        category: "Bricks",
        icon: "apps",
        image: "https://images.unsplash.com/photo-1635789145651-d5770bc33039?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1lbnQlMjBicmlja3MlMjBidWlsZGluZyUyMG1hdGVyaWFsfGVufDF8fHx8MTc1NjIzMjEwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 420,
        availability: "Available Now",
      },

      // Paints
      {
        id: "asian-paints",
        name: "Asian Paints",
        description: "All Ranges (1ltr to 20ltrs)",
        category: "Paints",
        icon: "color-palette",
        image: "https://images.unsplash.com/photo-1597857306105-b23e08328d30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHBhaW50cyUyMGJ1Y2tldCUyMGNvbG9yfGVufDF8fHx8MTc1NjIzMjEwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        reviews: 1120,
        availability: "Available Now",
      },
      {
        id: "nerolac-paints",
        name: "Nerolac Paints",
        description: "All Ranges (1ltr to 20ltrs)",
        category: "Paints",
        icon: "color-palette",
        image: "https://images.unsplash.com/photo-1617707627941-0484ded9e29a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludCUyMGJ1Y2tldHMlMjBjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHxlbnwxfHx8fDE3NTYyMzIxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 760,
        availability: "Available Now",
      },
      {
        id: "berger-paints",
        name: "Berger Paints",
        description: "All Ranges (1ltr to 20ltrs)",
        category: "Paints",
        icon: "color-palette",
        image: "https://images.unsplash.com/photo-1655201820209-9f465f2238bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJnZXIlMjBwYWludHMlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU2MjMyMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 690,
        availability: "Available Now",
      },

      // RMC
      {
        id: "rmc-anytime",
        name: "Ready Mix Concrete – Any Time",
        description: "Professional concrete delivery service",
        category: "RMC",
        icon: "cube",
        image: "https://images.unsplash.com/photo-1621463677998-1a90bcbaca94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFkeSUyMG1peCUyMGNvbmNyZXRlJTIwdHJ1Y2slMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU2MjMyMTA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        reviews: 880,
        availability: "Available Now",
      },

      // Tiles & Stone
      {
        id: "tiles",
        name: "Tiles",
        description: "All Types",
        category: "Tiles & Stone",
        icon: "grid",
        image: "https://images.unsplash.com/photo-1684783777567-1866b5221857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwdGlsZXMlMjBmbG9vcmluZyUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NTYyMzIxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 730,
        availability: "Available Now",
      },
      {
        id: "granite",
        name: "Granite",
        description: "All Types",
        category: "Tiles & Stone",
        icon: "grid",
        image: "https://images.unsplash.com/photo-1674831311475-bafedda32036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuaXRlJTIwc2xhYnMlMjBjb25zdHJ1Y3Rpb24lMjBtYXRlcmlhbHxlbnwxfHx8fDE3NTYyMzIxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 810,
        availability: "Available Now",
      },
      {
        id: "marble",
        name: "Marble",
        description: "All Types",
        category: "Tiles & Stone",
        icon: "grid",
        image: "https://images.unsplash.com/photo-1587527901949-ab0341697c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjBmbG9vcmluZyUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NTYyMzIxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 620,
        availability: "Available Now",
      },

      // Interior Services
      {
        id: "internal-decoration",
        name: "Internal Decoration",
        description: "Fully customized interior decoration",
        category: "Interior Services",
        icon: "home",
        image: "https://images.unsplash.com/photo-1630347254189-468465d1f99b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlY29yYXRpb24lMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzU2MjMyMTA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        reviews: 940,
        availability: "Available Now",
      },
      {
        id: "plumbing-materials",
        name: "Plumbing Materials",
        description: "Top Brands (Ashirvad, Prince, Kisan, Supreme & More)",
        category: "Interior Services",
        icon: "water",
        image: "https://images.unsplash.com/photo-1650246363606-a2402ec42b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmluZyUyMG1hdGVyaWFscyUyMHBpcGVzJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc1NjIzMjEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 780,
        availability: "Available Now",
      },
      {
        id: "waterproofing",
        name: "Waterproofing Services",
        description: "Leakage prevention",
        category: "Interior Services",
        icon: "umbrella",
        image: "https://images.unsplash.com/photo-1702392183172-17fdef8002b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcnByb29maW5nJTIwY29uc3RydWN0aW9uJTIwc2VydmljZXxlbnwxfHx8fDE3NTYyMzIxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        reviews: 560,
        availability: "Available Now",
      },
      {
        id: "false-ceiling-pop",
        name: "False Ceiling & POP Works",
        description: "Professional ceiling installation",
        category: "Interior Services",
        icon: "layers",
        image: "https://images.unsplash.com/photo-1606383446607-64183c287712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWxzZSUyMGNlaWxpbmclMjBjb25zdHJ1Y3Rpb24lMjB3b3JrfGVufDF8fHx8MTc1NjIzMjEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 690,
        availability: "Available Now",
      },

      // Machinery
      {
        id: "jcb",
        name: "JCB",
        description: "On time & professional drivers",
        category: "Machinery",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1684065749640-6b855a5953a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqY2IlMjBleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBtYWNoaW5lfGVufDF8fHx8MTc1NjIzMjEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        reviews: 820,
        availability: "Available Now",
      },
      {
        id: "crane",
        name: "Crane",
        description: "On time & professional drivers",
        category: "Machinery",
        icon: "construct",
        image: "https://images.unsplash.com/photo-1611495897598-4cfcb4767483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFuZSUyMGNvbnN0cnVjdGlvbiUyMG1hY2hpbmV8ZW58MXx8fHwxNzU2MjMyMTA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        reviews: 690,
        availability: "Available Now",
      },
    ],
    []
  );

  const matchesOrdered = (q: string, ...fields: string[]) => {
    const queryStr = q.trim().toLowerCase();
    if (!queryStr) return true;
    const hay = fields.join(" ").toLowerCase();
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
    return byCategory.filter(s => matchesOrdered(query, s.name, s.description));
  }, [data, selectedCategory, query]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Construction</Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search construction..."
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
              <View style={styles.discountRibbon}>
                <Text style={styles.discountText}>Best Price</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.descriptionRow}>
                    <Ionicons name={item.icon} size={14} color="#6b7280" />
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <View style={styles.ratingStars}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Ionicons
                          key={idx}
                          name={idx < Math.floor(item.rating) ? "star" : idx < item.rating ? "star-half" : "star-outline"}
                          size={12}
                          color="#f59e0b"
                          style={{ marginRight: 1 }}
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewsText}>({item.reviews})</Text>
                  </View>
                </View>
              </View>

              {item.price && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  {item.details && (
                    <Text style={styles.detailsText}>{item.details}</Text>
                  )}
                </View>
              )}

              <View style={styles.availabilityRow}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>{item.availability}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {}} style={styles.requestNowBtn}>
                  <Text style={styles.requestNowText}>Request Now</Text>
                </TouchableOpacity>
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
  headerGradient: { backgroundColor: "#111827", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)", marginRight: 12 },
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
  descriptionRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  descriptionText: { marginLeft: 6, fontSize: 12, color: "#6b7280" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ratingStars: { flexDirection: "row", marginRight: 6 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#111827", marginRight: 4 },
  reviewsText: { fontSize: 12, color: "#6b7280" },
  priceRow: { marginTop: 8, marginBottom: 8 },
  priceText: { fontSize: 14, fontWeight: "700", color: "#e91e63" },
  detailsText: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  availabilityRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 },
  availabilityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981", marginRight: 6 },
  availabilityText: { fontSize: 12, color: "#10b981", fontWeight: "600" },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  requestNowBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: "#111827" },
  requestNowText: { fontWeight: "700", color: "#ffffff", fontSize: 14 },
  scrollTopFab: { position: "absolute", right: 16, bottom: 72, width: 44, height: 44, borderRadius: 22, backgroundColor: "#111827", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
});


