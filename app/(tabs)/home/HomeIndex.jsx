import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./components/Header";

const HomeIndex = () => {
	return (
		<View style={styles.HomeContainer}>
			<Header />
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
