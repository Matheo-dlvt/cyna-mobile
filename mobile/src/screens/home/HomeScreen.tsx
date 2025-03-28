import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigation/Routes";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity onPress={() => {navigation.navigate(Routes.ProductScreen as never)}}><Text>Page produit</Text></TouchableOpacity>
        </View>
    )
}