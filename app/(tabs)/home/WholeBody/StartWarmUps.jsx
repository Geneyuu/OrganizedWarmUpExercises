import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Video } from "expo-av";
import * as Progress from "react-native-progress";
import { ExerciseContext } from "../../../contexts/ExerciseContext";
import exercises from "../../../constants/exercises";
import { Ionicons } from "@expo/vector-icons";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useRouter } from "expo-router";

const StartWarmUps = () => {
	const { state } = useContext(ExerciseContext);

	const videoRef = useRef(null);
	const [currentIndex, setCurrendIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isResting, setIsResting] = useState(true);
	const [timeLeft, setTimeLeft] = useState(0);

	const currentExercise = exercises[currentIndex];

	const exerciseDuration =
		parseInt(state.duration) ||
		currentExercise.intensity[state.intensityValue].duration.min;
	const restDuration =
		currentExercise.intensity[state.intensityValue].restDuration.min;

	const recommendedRepetition =
		currentExercise.intensity[state.intensityValue].recommendedRepetition;
	const recommendedDuration =
		currentExercise.intensity[state.intensityValue].recommendedDuration;

	const typeDuration = isResting ? restDuration : exerciseDuration;

	const progress = ((typeDuration - timeLeft) / typeDuration) * 100;

	const togglePlayPause = async () => {
		if (isPlaying) {
			await videoRef.current?.pauseAsync();
			setIsPlaying(false);
		} else {
			await videoRef.current?.playAsync();
			setIsPlaying(true);
		}
	};

	return (
		<>
			<View style={styles.container}>
				<Video
					ref={videoRef}
					style={styles.video}
					source={currentExercise.video}
					resizeMode="cover"
					isLooping
					shouldPlay
				/>
				<View style={styles.descriptionContainer}>
					<Text style={styles.exerciseCount}>
						Exercises: {currentIndex + 1} of {exercises.length}
					</Text>
					<Text style={styles.descriptionTitle}>
						{currentExercise.name}
					</Text>
					<Text style={styles.descriptionContent}>
						{currentExercise.description}
					</Text>
					<Text style={styles.recommendedTextStyle}>
						Recommended Duration: {recommendedDuration}
					</Text>
					<Text style={styles.recommendedTextStyle}>
						Recommended Repetitions: {recommendedRepetition}
					</Text>
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.button, isPlaying && styles.pauseButton]}
						onPress={togglePlayPause}
					>
						<View style={styles.iconButtonContent}>
							<Ionicons
								name={
									isPlaying
										? "pause-circle-sharp"
										: "play-circle-sharp"
								}
								size={25}
								color="white"
								style={{ marginRight: 15 }}
							/>
							<Text style={styles.buttonText}>
								{isPlaying
									? "Pause Exercise"
									: "Start Exercise"}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.buttonRestart}>
						<View style={styles.iconButtonContent}>
							<Ionicons
								name={"refresh-outline"}
								size={25}
								color="black"
								style={{ marginRight: 5 }}
							/>
							<Text style={styles.buttonTextRestart}>
								Restart All Exercises
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.progressbarContainer}>
				<Progress.Bar progress={progress} />
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	descriptionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-start",
		width: "100%",
		paddingHorizontal: wp("5%"),
		paddingBottom: hp("1%"),
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		marginTop: hp("-2%"),
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	buttonContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: wp("3%"),
		paddingHorizontal: wp("5%"),
		marginBottom: hp("2%"),
		width: "100%",
	},
	progressbarContainer: {
		paddingBottom: hp("5%"),
		backgroundColor: "#5B8C5A",
	},
	descriptionTitle: {
		fontSize: wp("6%"),
		fontFamily: "Roboto-ExtraBold",
		textAlign: "left",
		marginBottom: hp("1%"),
		color: "#2C3E50", // Dark blue-gray instead of pure black
	},
	descriptionContent: {
		fontSize: hp("1.8%"),
		lineHeight: hp("2.4%"),
		fontFamily: "Roboto-Regular",
		marginBottom: hp("1%"),
		color: "#34495E", // Slightly lighter than title
	},
	recommendedTextStyle: {
		fontFamily: "Karla-Regular",
		fontSize: hp("1.7%"),
		marginVertical: hp("0.3%"),
		color: "#7F8C8D",
	},
	exerciseCount: {
		letterSpacing: -0.8,
		fontFamily: "Karla-SemiBold",
		fontSize: wp("3.5%"),
		marginBottom: hp("1%"),
		color: "#5B8C5A",
	},
	video: {
		alignSelf: "center",
		width: wp("100%"),
		height: hp("55%"),
	},
	button: {
		flex: 1,
		minWidth: wp("40%"),
		maxWidth: wp("45%"),
		backgroundColor: "#1A2A3A", // Primary blue color
		borderRadius: 12,
		paddingVertical: hp("1.8%"),
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
		shadowColor: "#2980B9",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
	},
	buttonText: {
		fontFamily: "Karla-SemiBold",
		color: "white",
		fontSize: hp("1.5%"),
		textAlign: "center",
	},
	pauseButton: {
		backgroundColor: "#E74C3C",
	},
	buttonRestart: {
		flex: 1,
		minWidth: wp("40%"),
		maxWidth: wp("45%"),
		borderWidth: 1,
		borderColor: "#BDC3C7",
		backgroundColor: "white",
		borderRadius: 12,
		paddingVertical: hp("1.8%"),
		justifyContent: "center",
		alignItems: "center",
		elevation: 1,
		shadowColor: "#ECF0F1",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	buttonTextRestart: {
		fontFamily: "Karla-SemiBold",
		color: "#2C3E50", // Dark text instead of pure black
		fontSize: hp("1.5%"),
		textAlign: "center",
	},
	iconButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default StartWarmUps;
