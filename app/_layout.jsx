import { Stack } from "expo-router";
import { ProfileProvider } from "../app/contexts/ProfileContext"; // Adjust path if needed

export default function RootLayout() {
	return (
		<ProfileProvider>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="OnBoarding"
					options={{ headerShown: false }}
				/>
			</Stack>
		</ProfileProvider>
	);
}
