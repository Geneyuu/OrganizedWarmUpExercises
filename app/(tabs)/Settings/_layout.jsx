import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const LayoutSettings = () => {
	return (
		<Stack>
			<Stack.Screen
				name="SettingsIndex"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
};

export default LayoutSettings;
