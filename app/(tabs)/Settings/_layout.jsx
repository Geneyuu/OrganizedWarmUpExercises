import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const LayoutSettings = () => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<Stack>
				<Stack.Screen
					name="SettingsIndex"
					options={{ headerShown: false }}
				/>
			</Stack>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "white",
	},
});

export default LayoutSettings;
