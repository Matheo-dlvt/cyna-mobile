import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseButton from "../../components/BaseButton";

interface Subscription {
  id: number;
  status: string;
  createdAt: string;
  recurrence: number;
  lastInvoiceUrl: string;
  subscriptionItemStripeId: string;
  items: {
    id: number;
    stripeItemId: string;
    orderItem: {
      product: {
        name: string;
      };
    };
  }[];
}

const SubscriptionsScreen: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] =
    useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const access = await AsyncStorage.getItem("access");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/subscriptions/my?status=active`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      if (res.status === 404) {
        setSubscriptions([]);
        return;
      }

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      console.log("data", data);
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de récupérer les abonnements.");
    }
  };

  const cancelSubscription = async () => {
    if (!subscriptionToCancel) return;

    const access = await AsyncStorage.getItem("access");
    const body = {
      subscriptionId: subscriptionToCancel.id,
      subscriptionItemStripeId: subscriptionToCancel.items[0].stripeItemId,
    };

    const res = await fetch(`http://localhost:8000/api/subscriptions/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModalVisible(false);
      setSubscriptionToCancel(null);
      fetchSubscriptions();
    } else {
      Alert.alert("Erreur", "Échec de l’annulation de l’abonnement.");
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRecurrenceLabel = (r: number) => (r === 1 ? "Mensuel" : "Annuel");

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "canceled":
        return "Annulé";
      case "incomplete":
        return "Incomplet";
      case "incomplete_expired":
        return "Incomplet expiré";
      case "past_due":
        return "Paiement en retard";
      case "paused":
        return "En pause";
      case "trialing":
        return "Période d’essai";
      case "unpaid":
        return "Non payé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#22c55e";
      case "canceled":
        return "#ef4444";
      case "incomplete":
      case "incomplete_expired":
        return "#f59e0b";
      case "past_due":
        return "#eab308";
      case "paused":
        return "#3b82f6";
      case "trialing":
        return "#8b5cf6";
      case "unpaid":
        return "#dc2626";
      default:
        return "#ccc";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Mes abonnements</Text>

      {subscriptions.length === 0 && (
        <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
          Aucun abonnement en cours pour le moment.
        </Text>
      )}

      {subscriptions.map((sub) => {
        const productName =
          sub.items.length > 0
            ? sub.items[0].orderItem.product.name
            : "Produit inconnu";

        return (
          <View key={sub.id} style={styles.card}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.text}>
              Récurrence : {getRecurrenceLabel(sub.recurrence)}
            </Text>
            <Text style={[styles.text, { color: getStatusColor(sub.status) }]}>
              Statut : {getStatusLabel(sub.status)}
            </Text>
            <Text style={styles.text}>
              Souscrit le : {formatDate(sub.createdAt)}
            </Text>

            {sub.lastInvoiceUrl && (
              <TouchableOpacity
                style={styles.invoiceButton}
                onPress={() => Linking.openURL(sub.lastInvoiceUrl)}
              >
                <Text style={styles.invoiceButtonText}>Voir la facture</Text>
              </TouchableOpacity>
            )}

            {["active", "trialing"].includes(sub.status) && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setSubscriptionToCancel(sub);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.cancelText}>Annuler l’abonnement</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Annuler cet abonnement ?</Text>
            <View style={styles.modalButtons}>
              <View style={{ flex: 1 }}>
                <BaseButton
                  label="Annuler"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <BaseButton label="Confirmer" onPress={cancelSubscription} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1c143d",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  text: {
    color: "#ccc",
    marginBottom: 4,
  },
  invoiceButton: {
    marginTop: 10,
    backgroundColor: "#814DFF",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  invoiceButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    borderColor: "#ef4444",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1c143d",
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
