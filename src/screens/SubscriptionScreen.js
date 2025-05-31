import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import Purchases from 'react-native-purchases';

export default function SubscriptionScreen({ navigation }) {
  useEffect(() => {
    Purchases.configure({ apiKey: 'TU_REVENUECAT_PUBLIC_KEY' });
  }, []);

  const handlePurchase = async () => {
    const offerings = await Purchases.getOfferings();
    const packageToBuy = offerings.current.availablePackages[0];

    try {
      const purchase = await Purchases.purchasePackage(packageToBuy);
      if (purchase) {
        navigation.replace('Home');
      }
    } catch (e) {
      console.log('Error comprando:', e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Activa tu suscripción por $2 USD / mes</Text>
      <Button title="Suscribirse" onPress={handlePurchase} />
    </View>
  );
}
