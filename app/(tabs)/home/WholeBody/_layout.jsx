import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View, Text, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Layout = () => {
	const router = useRouter();

	return (
		<Stack>
			{/* With Ball Screen */}
			<Stack.Screen
				name="WholeBodyIndex"
				options={{
					headerShown: true,
					header: () => (
						<SafeAreaView
							style={{
								backgroundColor: "#fff",
							}}
						>
							<View
								style={{
									height: hp(8),
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "#fff",
									borderBottomWidth: 2.5,
									borderBottomColor: "#161616",
									paddingHorizontal: wp(3),
								}}
							>
								<TouchableOpacity
									onPress={() => router.back()}
									style={{
										marginLeft: wp(2.5),
									}}
								>
									<Ionicons
										name="arrow-back"
										size={hp(3.5)}
										color="black"
									/>
								</TouchableOpacity>

								<View style={{ flex: 1, alignItems: "center" }}>
									<Text
										style={{
											position: "relative",
											left: wp(-1.5),
											color: "#161616",
											fontSize: hp(2.8),
											fontFamily: "Roboto-SemiBold",
											textTransform: "capitalize",
											letterSpacing: -0.7,
										}}
									>
										Lower Body Activation
									</Text>
								</View>
							</View>
						</SafeAreaView>
					),
				}}
			/>

			{/* Start Warm-Ups Screen */}
			<Stack.Screen
				name="StartWarmUps"
				options={{
					headerShown: true,
					headerTransparent: true,
					header: () => (
						<SafeAreaView
							style={{ backgroundColor: "transparent" }}
						>
							<StatusBar
								backgroundColor="transparent"
								barStyle="light-content"
								translucent={true}
							/>

							<View
								style={{
									height: hp(8),
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "transparent",
									paddingHorizontal: wp(3),
								}}
							>
								<TouchableOpacity
									onPress={() => router.back()}
									style={{
										marginLeft: wp(2.5),
									}}
								>
									<Ionicons
										name="arrow-back"
										size={hp(3.5)}
										color="white"
									/>
								</TouchableOpacity>

								<View style={{ flex: 1, alignItems: "center" }}>
									<Text
										style={{
											position: "relative",
											backgroundColor: "transparent",
											left: wp(-5),
											color: "#161616",
											fontSize: hp(3),
											fontFamily: "Roboto-SemiBold",
										}}
									>
										{/* Optional title here */}
									</Text>
								</View>
							</View>
						</SafeAreaView>
					),
				}}
			/>

			{/* Dynamic Screen with ID */}
			<Stack.Screen
				name="[id]"
				options={{
					headerShown: true,
					headerTransparent: true,
					header: () => (
						<SafeAreaView
							style={{ backgroundColor: "transparent" }}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									height: hp(8),
									backgroundColor: "transparent",
									paddingHorizontal: wp(3),
								}}
							>
								<TouchableOpacity
									onPress={() => router.back()}
									style={{
										flexDirection: "row",
										alignItems: "center",
										padding: 5,
										marginTop: hp(2.5),
										zIndex: 10,
									}}
								>
									<Ionicons
										name="arrow-back"
										size={hp(4)}
										color="white"
									/>
									<Text
										style={{
											color: "white",
											fontSize: hp(2),
											marginLeft: wp(2),
											fontFamily: "Roboto-SemiBold",
										}}
									>
										Back
									</Text>
								</TouchableOpacity>

								<View style={{ flex: 1, alignItems: "center" }}>
									<Text
										style={{
											color: "white",
											fontSize: hp(2.5),
											fontFamily: "Roboto-Bold",
										}}
									>
										{/* Optional title here */}
									</Text>
								</View>
							</View>
						</SafeAreaView>
					),
				}}
			/>
		</Stack>
	);
};

export default Layout;
