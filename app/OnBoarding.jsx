import React, { useRef, useState } from "react";
import {
	Text,
	View,
	Image,
	StyleSheet,
	Dimensions,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const slides = [
	{
		key: "one",
		title: "Welcome to Baldog",
		text: "Master your warm-ups and dominate the court!",
		image: require("../assets/images/wholebodypreview.png"),
	},
	{
		key: "two",
		title: "Step-by-Step Drills",
		text: "Follow guided exercises to boost your skills.",
		image: require("../assets/images/withballpreview.png"),
	},
	{
		key: "three",
		title: "Track Your Progress",
		text: "Monitor your routines and stay on top of your game.",
		image: require("../assets/images/stretchingpreview.png"),
	},
];

const OnBoarding = () => {
	const router = useRouter();
	const sliderRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const onDone = async () => {
		try {
			// Save onboarding state
			await AsyncStorage.setItem("hasOnboarded", "false");
			router.replace("(tabs)/home/");
		} catch (error) {
			console.log("Error saving onboarding state:", error);
		}
	};

	const renderItem = ({ item }) => (
		<View style={styles.container}>
			<View style={styles.slide}>
				<StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
				<Text style={styles.title}>{item.title}</Text>
				<Image
					source={item.image}
					style={styles.image}
					resizeMode="contain"
				/>
				<Text style={styles.text}>{item.text}</Text>
			</View>
		</View>
	);

	const renderSkipButton = () => (
		<TouchableOpacity style={styles.skipButton} onPress={onDone}>
			<Text style={styles.skipButtonText}>Skip</Text>
		</TouchableOpacity>
	);

	const renderDoneButton = () => (
		<TouchableOpacity style={styles.doneButton} onPress={onDone}>
			<Text style={styles.doneButtonText}>Done</Text>
		</TouchableOpacity>
	);

	const renderNextButton = () => (
		<TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
			<Text style={styles.nextButtonText}>Next</Text>
		</TouchableOpacity>
	);

	const goToNextSlide = () => {
		if (currentIndex < slides.length - 1 && sliderRef.current) {
			sliderRef.current.goToSlide(currentIndex + 1);
			setCurrentIndex(currentIndex + 1);
		}
	};

	return (
		<View style={styles.container}>
			<AppIntroSlider
				ref={sliderRef}
				renderItem={renderItem}
				data={slides}
				onDone={onDone}
				showSkipButton={true}
				onSkip={onDone}
				renderNextButton={renderNextButton}
				renderSkipButton={renderSkipButton}
				renderDoneButton={renderDoneButton}
				activeDotStyle={styles.activeDot}
				dotStyle={styles.dot}
				onSlideChange={(index) => setCurrentIndex(index)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#fff",
	},

	slide: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// paddingHorizontal: 10,
		// paddingTop: 100,
		backgroundColor: "#fff",
	},
	image: {
		width: width * 0.7,
		height: height * 0.4,
		marginVertical: 40,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#000000",
		textAlign: "center",
		marginBottom: 10,
		letterSpacing: 1,
	},
	text: {
		fontSize: 16,
		color: "#4B5563",
		textAlign: "center",
		paddingHorizontal: 10,
		lineHeight: 24,
	},
	activeDot: {
		backgroundColor: "#121212",
		width: 30,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 4,
	},
	dot: {
		backgroundColor: "rgba(0, 0, 0, 0.2)",
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 4,
	},
	nextButton: {
		backgroundColor: "#121212",
		paddingHorizontal: 25,
		borderRadius: 20,
	},
	nextButtonText: {
		color: "#fff",
		fontSize: 16,
		fontFamily: "Karla-Bold",
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	skipButton: {
		backgroundColor: "#E5E7EB",
		paddingVertical: 10,
		paddingHorizontal: 25,
		borderRadius: 20,
	},
	skipButtonText: {
		color: "#000",
		fontSize: 16,
		fontFamily: "Karla-Regular",
		paddingHorizontal: 5,
	},
	doneButton: {
		backgroundColor: "#000",
		paddingVertical: 10,
		paddingHorizontal: 25,
		borderRadius: 20,
	},
	doneButtonText: {
		color: "#fff",
		fontSize: 16,
		fontFamily: "Karla-Bold",
		paddingHorizontal: 20,
	},
});

export default OnBoarding;
