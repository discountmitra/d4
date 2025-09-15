import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { restaurantData, Restaurant } from "../constants/restaurantData";

export default function DineOutScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [billAmount, setBillAmount] = useState('');

  // Get restaurant data from params
  const restaurant: Restaurant = useMemo(() => {
    const restaurantId = params.restaurantId as string;
    return restaurantData.find(r => r.id === restaurantId) || restaurantData[0];
  }, [params.restaurantId]);

  const discountPercentage = 20; // 20% discount for dine out
  const finalAmount = useMemo(() => {
    const amount = parseFloat(billAmount) || 0;
    const discount = (amount * discountPercentage) / 100;
    return amount - discount;
  }, [billAmount]);

  const handlePayment = () => {
    if (!billAmount || parseFloat(billAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid bill amount');
      return;
    }
    Alert.alert(
      'Payment Successful',
      `Bill Amount: ₹${billAmount}\nDiscount: ${discountPercentage}%\nFinal Amount: ₹${finalAmount.toFixed(2)}\n\nShow this confirmation to the restaurant.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Single Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{restaurant.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerDineOut}>Dine Out</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>


        {/* Bill Payment Card */}
        <View style={styles.payBillCard}>
          <View style={styles.payBillHeader}>
            <View style={styles.payBillTitleRow}>
              <View style={styles.payBillIconContainer}>
                <Ionicons name="receipt" size={24} color="#fff" />
              </View>
              <View style={styles.payBillTitleContainer}>
                <Text style={styles.payBillTitle}>Pay your bill</Text>
                <Text style={styles.payBillSubtitle}>Get instant discount on your dining bill</Text>
              </View>
            </View>
            <View style={styles.discountBadge}>
              <Ionicons name="flash" size={12} color="#7c3aed" />
              <Text style={styles.discountBadgeText}>Save 20%</Text>
            </View>
          </View>
          
          <View style={styles.billInputSection}>
            <Text style={styles.billInputLabel}>Enter your bill amount</Text>
            <View style={styles.billInputRow}>
              <View style={styles.currencySymbol}>
                <Text style={styles.currencyText}>₹</Text>
              </View>
              <TextInput
                style={styles.billInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={billAmount}
                onChangeText={setBillAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Ionicons name="arrow-forward" size={16} color="#7c3aed" />
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {billAmount && parseFloat(billAmount) > 0 && (
            <View style={styles.billSummary}>
              <View style={styles.billSummaryHeader}>
                <Text style={styles.billSummaryTitle}>Bill Breakdown</Text>
                <Ionicons name="calculator" size={16} color="rgba(255,255,255,0.8)" />
              </View>
              <View style={styles.billSummaryContent}>
                <View style={styles.billSummaryRow}>
                  <Text style={styles.billSummaryLabel}>Bill Amount</Text>
                  <Text style={styles.billSummaryValue}>₹{billAmount}</Text>
                </View>
                <View style={styles.billSummaryRow}>
                  <Text style={styles.billSummaryLabel}>Discount ({discountPercentage}%)</Text>
                  <Text style={styles.billSummaryDiscount}>-₹{((parseFloat(billAmount) * discountPercentage) / 100).toFixed(2)}</Text>
                </View>
                <View style={styles.billSummaryDivider} />
                <View style={styles.billSummaryRow}>
                  <Text style={styles.finalAmountLabel}>You Pay</Text>
                  <Text style={styles.finalAmountValue}>₹{finalAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.savingsHighlight}>
                  <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                  <Text style={styles.savingsText}>You save ₹{((parseFloat(billAmount) * discountPercentage) / 100).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}
          </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>Instant 20% discount</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>Secure payment</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>No hidden charges</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.benefitText}>Instant confirmation</Text>
            </View>
          </View>
        </View>

        {/* Thank You Message */}
        <View style={styles.thankYouContainer}>
          <View style={styles.thankYouIcon}>
            <Ionicons name="heart" size={24} color="#ef4444" />
          </View>
          <Text style={styles.thankYouTitle}>Thank you for visiting!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
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
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerDineOut: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 2,
  },
  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  callText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 6,
  },
  payBillCard: {
    backgroundColor: "#1f2937",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1f2937",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  payBillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  payBillTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  payBillIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  payBillTitleContainer: {
    flex: 1,
  },
  payBillTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  payBillSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c3aed",
    marginLeft: 4,
  },
  billInputSection: {
    marginBottom: 20,
  },
  billInputLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    fontWeight: "500",
  },
  billInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  currencySymbol: {
    marginRight: 8,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  billInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7c3aed",
    marginLeft: 4,
  },
  billSummary: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  billSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  billSummaryTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  billSummaryContent: {
    padding: 20,
  },
  billSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  billSummaryLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  billSummaryValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  billSummaryDiscount: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  billSummaryDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 12,
  },
  finalAmountLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  finalAmountValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  savingsHighlight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  savingsText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
    marginLeft: 6,
  },
  extraOfferContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  extraOfferIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(245,158,11,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  extraOfferText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    lineHeight: 16,
  },
  copyCodeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(245,158,11,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  benefitsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 6,
    fontWeight: "500",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  quickInfoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  quickInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quickInfoText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
    fontWeight: "500",
  },
  offersContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  offersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  offersTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7c3aed",
    marginRight: 4,
  },
  offersScroll: {
    paddingRight: 16,
  },
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 16,
    width: 300,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  offerCardPrimary: {
    backgroundColor: "#7c3aed",
  },
  offerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 12,
  },
  offerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  offerIconSecondary: {
    backgroundColor: "#f0fdf4",
  },
  offerIconTertiary: {
    backgroundColor: "#fffbeb",
  },
  offerBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerBadgeSecondary: {
    backgroundColor: "#10b981",
  },
  offerBadgeTertiary: {
    backgroundColor: "#f59e0b",
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  offerBadgeTextSecondary: {
    color: "#fff",
  },
  offerBadgeTextTertiary: {
    color: "#fff",
  },
  offerContent: {
    padding: 20,
    paddingTop: 0,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  offerDescription: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7c3aed",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuresContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    fontWeight: "500",
  },
  thankYouContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  thankYouIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  thankYouMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
