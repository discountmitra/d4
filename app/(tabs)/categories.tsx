import { View, FlatList, StyleSheet, TextInput } from "react-native";
import CategoryCard from "@/components/home/CategoryCard";
import { Spacing } from "@/theme";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const categories = [
  { id: "1", title: "Food", subtitle: "Restaurants & Takeaway", icon: "fast-food", color: "#FF6B6B" },
  { id: "2", title: "Healthcare", subtitle: "Hospitals & Clinics", icon: "medkit", color: "#4ECDC4" },
  { id: "3", title: "Travel", subtitle: "Hotels & Booking", icon: "airplane", color: "#45B7D1" },
  { id: "4", title: "Home Services", subtitle: "Repair & Maintenance", icon: "build", color: "#FFA502" },
  { id: "5", title: "Automobiles", subtitle: "Car & Bike Services", icon: "car-sport", color: "#3742FA" },
  { id: "6", title: "Beauty & Salon", subtitle: "Hair & Beauty Care", icon: "color-palette", color: "#B53471" },
  { id: "7", title: "Bar", subtitle: "Drinks & Nightlife", icon: "wine", color: "#8E44AD" },
  { id: "8", title: "Events", subtitle: "Event Management", icon: "calendar", color: "#27AE60" },
  { id: "9", title: "Financial Services", subtitle: "Banking & Insurance", icon: "cash", color: "#16A085" },
  { id: "10", title: "Education", subtitle: "Schools & Coaching", icon: "school", color: "#E67E22" },
  { id: "11", title: "Electronics", subtitle: "Tech & Gadgets", icon: "phone-portrait", color: "#2C3E50" },
  { id: "12", title: "Clothing", subtitle: "Fashion & Style", icon: "shirt", color: "#C0392B" },
  { id: "13", title: "Construction", subtitle: "Building & Materials", icon: "construct", color: "#EAB308" }
];


export default function CategoriesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header
  }, [navigation]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { paddingTop: insets.top + 20 }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search categories..."
            style={styles.searchInput}
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={({ item }) => {
          const handlePress = () => {
            if (item.title === "Food") {
              router.push("/food");
            } else if (item.title === "Healthcare") {
              router.push("/healthcare");
            } else if (item.title === "Home Services") {
              router.push("/home-services");
            } else if (item.title === "Automobiles") {
              router.push("/automobiles");
            } else if (item.title === "Travel") {
              router.push("/coming-soon");
            } else if (item.title === "Events") {
              router.push("/events");
            } else if (item.title === "Financial Services") {
              router.push("/financial-services");
            } else if (item.title === "Education") {
              router.push("/education");
            } else if (item.title === "Beauty & Salon") {
              router.push("/beauty-salon");
            } else if (item.title === "Construction") {
              router.push("/construction");
            } else if (item.title === "Bar" || item.title === "Electronics" || item.title === "Clothing") {
              router.push("/coming-soon");
            }
          };

          return (
            <View style={{ width: "50%" }}>
              <CategoryCard
                icon={item.icon as any}
                title={item.title}
                color={item.color}
                onPress={handlePress}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  list: {
    padding: Spacing.md,
  },
});
