import { Stack } from "expo-router";
import ProfileProvider from "../app/contexts/ProfileContext";
import ExerciseProvider from "../app/contexts/ExerciseContext";

export default function RootLayout() {
	return (
		<ProfileProvider>
			<ExerciseProvider>
				<Stack>
					<Stack.Screen
						name="index"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="OnBoarding"
						options={{ headerShown: false }}
					/>
				</Stack>
			</ExerciseProvider>
		</ProfileProvider>
	);
}
