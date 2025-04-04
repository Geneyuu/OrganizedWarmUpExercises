// pages/exercise/[id].jsx

import React, { useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	AppState,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import exercises from "../../constants/exercises";
import { Video } from "expo-av";

const ExerciseDetail = () => {
	const { id } = useLocalSearchParams();

	const exercise = exercises.find((exercise) => exercise.id === id);

	if (!exercise) {
		return <Text style={styles.errorText}>Exercise not found</Text>;
	}

	const { video, name, description } = exercise;

	const videoRef = useRef(null);
	const [isVideoReady, setIsVideoReady] = useState(false);

	const handleVideoLoad = () => {
		setIsVideoReady(true);
	};

	useFocusEffect(
		React.useCallback(() => {
			if (videoRef.current && isVideoReady) {
				videoRef.current.playAsync();
			}

			const handleAppStateChange = (appStatus) => {
				if (appStatus === "active" && isVideoReady) {
					videoRef.current?.playAsync();
				} else {
					videoRef.current?.pauseAsync();
				}
			};

			const appStateListener = AppState.addEventListener(
				"change",
				handleAppStateChange
			);

			return () => {
				appStateListener.remove();
				videoRef.current?.pauseAsync();
			};
		}, [isVideoReady])
	);

	return (
		<View style={styles.container}>
			{video ? (
				<>
					{!isVideoReady && (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="large" color="green" />
						</View>
					)}

					<View style={styles.videoContainer}>
						<Video
							ref={videoRef}
							source={video}
							style={[
								styles.video,
								!isVideoReady && { opacity: 0 },
							]}
							useNativeControls={false}
							shouldPlay={isVideoReady}
							isLooping
							resizeMode="contain"
							onLoad={handleVideoLoad}
							onError={(error) =>
								console.log("Error loading video:", error)
							}
						/>
					</View>
				</>
			) : (
				<Text style={styles.errorText}>Video not available</Text>
			)}

			<Text style={styles.title}>{name}</Text>
			<View style={styles.detailsContainer}>
				<Text style={styles.detailTitle}>Description</Text>
				<Text style={styles.detailText}>{description}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 35,
		color: "#333",
		marginBottom: 20,
		textAlign: "center",
		fontFamily: "Karla-Bold",
		marginTop: 30,
	},
	detailsContainer: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 15,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 2,
		marginTop: 20,
		width: "90%",
		maxWidth: "auto",
		alignSelf: "center",
	},
	detailTitle: {
		fontSize: 22,
		color: "#333",
		marginBottom: 10,
		fontFamily: "Karla-Bold",
	},
	detailText: {
		fontSize: 16,
		color: "#666",
		lineHeight: 24,
		fontFamily: "Karla-Regular",
		textAlign: "left",
	},
	videoContainer: {
		width: "100%",
		overflow: "hidden",
		alignSelf: "center",
		height: 250,
		justifyContent: "center",
		alignItems: "center",
	},
	video: {
		width: "100%",
		height: "100%",
		resizeMode: "stretch",
	},
	loadingContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	errorText: {
		color: "red",
		fontSize: 16,
		marginTop: 20,
	},
});

export default ExerciseDetail;
