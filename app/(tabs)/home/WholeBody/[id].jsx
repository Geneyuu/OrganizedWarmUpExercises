import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	AppState,
	ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Video } from "expo-av";
import { exercises } from "../../../constants/exercises";
import { useFocusEffect } from "@react-navigation/native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ExerciseDetails = () => {
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

	useEffect(() => {
		return () => {
			if (videoRef.current) {
				videoRef.current.pauseAsync();
				videoRef.current.unloadAsync();
			}
			setIsVideoReady(false);
		};
	}, []);

	useFocusEffect(
		useCallback(() => {
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
							resizeMode="cover"
							onLoad={handleVideoLoad}
							onError={(error) =>
								console.log("Error loading video:", error)
							}
							renderToHardwareTextureAndroid={true}
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
		fontSize: wp("7%"),
		color: "#333",
		marginBottom: hp("2%"),
		textAlign: "center",
		fontFamily: "Karla-Bold",
		marginTop: hp("4%"),
	},
	detailsContainer: {
		backgroundColor: "#fff",
		padding: wp("5%"),
		borderRadius: wp("4%"),
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: wp("2%"),
		elevation: 2,
		marginTop: hp("3%"),
		width: wp("90%"),
		alignSelf: "center",
	},
	detailTitle: {
		fontSize: wp("5%"),
		color: "#333",
		marginBottom: hp("1%"),
		fontFamily: "Karla-Bold",
	},
	detailText: {
		fontSize: wp("4%"),
		color: "#666",
		lineHeight: hp("3%"),
		fontFamily: "Karla-Regular",
		textAlign: "left",
	},
	videoContainer: {
		width: wp("100%"),
		height: hp("50%"),
		overflow: "hidden",
		justifyContent: "center",
		alignItems: "center",
	},
	video: {
		alignSelf: "center",
		width: wp("100%"),
		height: hp("55%"),
	},

	loadingContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: hp("2%"),
	},
	errorText: {
		color: "red",
		fontSize: wp("4%"),
		marginTop: hp("2%"),
		textAlign: "center",
	},
});

export default ExerciseDetails;
