import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const LayoutHome = () => {
	return (
		<Stack>
			<Stack.Screen name="HomeIndex" options={{ headerShown: false }} />
		</Stack>
	);
};

export default LayoutHome;
