import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Header from "./components/Header";
import FirstTimeModal from "./components/FirstTimeModal";

const HomeIndex = () => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.HomeContainer}>
				<Header />
				<FirstTimeModal />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "white",
	},
	HomeContainer: {
		flex: 1,
		backgroundColor: "white",
	},
});

export default HomeIndex;
