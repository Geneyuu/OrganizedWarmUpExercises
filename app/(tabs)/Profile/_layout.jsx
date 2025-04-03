import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const LayoutProfile = () => {
	return (
		<Stack>
			<Stack.Screen
				name="ProfileIndex"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
};

export default LayoutProfile;
