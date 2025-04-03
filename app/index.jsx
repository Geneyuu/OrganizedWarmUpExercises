import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, StatusBar } from "react-native";
import { MotiImage } from "moti";
// import { useRouter } from "expo-router";
import useLoadFonts from "./hooks/StartScreen/useLoadFonts";
import useCheckOnboardingStatus from "./hooks/StartScreen/useCheckOnBoardingStatus";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import "../global.css";

export default function Index() {
	const fontsLoaded = useLoadFonts();
	// const router = useRouter();

	useCheckOnboardingStatus();

	if (!fontsLoaded) {
		return (
			<View>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 justify-center items-center bg-white">
			<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

			{/* MotiImage for Animated logo */}
			<MotiImage
				source={require("../assets/images/applogo_modified.png")}
				from={{ scale: 1 }}
				animate={{ scale: 1.1, translateY: 1 }}
				transition={{
					type: "timing",
					duration: 1500,
					loop: true,
				}}
				style={styles.logo}
			/>

			<Text
				className="text-center text-black tracking-[6px] uppercase"
				style={styles.title}
			>
				Basketball Warm Ups
			</Text>

			<Image
				source={require("../assets/images/cvsulogo.png")}
				className="absolute bottom-[8%]"
				style={styles.universityLogo}
			/>

			<Text
				className="absolute text-center uppercase tracking-[1.5px] text-gray-800"
				style={styles.universityText}
			>
				Cavite State University
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	logo: {
		width: wp("35%"),
		height: wp("35%"),
		marginBottom: hp("2%"),
	},
	title: {
		fontSize: hp("2.5%"),
		marginTop: hp("2%"),
		width: wp("50%"),
		fontFamily: "Roboto-SemiBold",
	},
	universityLogo: {
		width: wp("15%"),
		height: wp("15%"),
		resizeMode: "contain",
	},
	universityText: {
		bottom: hp("4%"),
		fontSize: hp("2%"),
		width: wp("80%"),
		fontFamily: "Roboto-SemiBold",
	},
});
