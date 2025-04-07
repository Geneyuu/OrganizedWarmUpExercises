import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "./components/Header";
import FirstTimeModal from "./components/FirstTimeModal";

const HomeIndex = () => {
	return (
		<View style={styles.HomeContainer}>
			<Header />
			<FirstTimeModal />
		</View>
	);
};

const styles = StyleSheet.create({
	HomeContainer: {
		flex: 1,
		backgroundColor: "white",
	},
});

export default HomeIndex;
