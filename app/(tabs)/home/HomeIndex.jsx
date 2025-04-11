import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Header from "./components/Header";
import FirstTimeModal from "./components/FirstTimeModal";
import FeaturedExercises from "./components/FeaturedExercises";
import Categories from "./components/Categories";

const HomeIndex = () => {
	return (
		<View style={styles.HomeContainer}>
			<Header />
			<FirstTimeModal />
			<FeaturedExercises />
			<Categories />
		</View>
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
