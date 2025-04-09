import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, AppState } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Video } from "expo-av";
import { useFocusEffect } from "expo-router";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { exercises } from "../../../constants/exercises";

const FeaturedExercises = () => {
	const videoRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [randomVideos, setRandomVideos] = useState([]);

	// Get 3 random videos on component mount
	useEffect(() => {
		// Filter exercises that have videos
		const videos = exercises.filter((ex) => ex.video);
		// Shuffle and take 3
		const shuffled = [...videos].sort(() => 0.5 - Math.random());
		setRandomVideos(shuffled.slice(0, 3));
	}, []);

	const handleSnapToItem = (index) => {
		// Pause previous video
		if (videoRef.current && randomVideos[currentIndex]) {
			videoRef.current.pauseAsync();
		}

		setCurrentIndex(index);

		// Play new video
		if (randomVideos[index] && videoRef.current) {
			videoRef.current.playAsync();
		}
	};

	// Handle app focus and state changes
	useFocusEffect(
		useCallback(() => {
			const handleAppStateChange = (nextAppState) => {
				if (nextAppState === "active") {
					// Resume video when app comes back to foreground
					if (randomVideos[currentIndex] && videoRef.current) {
						videoRef.current.playAsync().catch(console.error);
					}
				} else {
					// Pause video when app goes to background
					if (randomVideos[currentIndex] && videoRef.current) {
						videoRef.current.pauseAsync().catch(console.error);
					}
				}
			};

			const subscription = AppState.addEventListener(
				"change",
				handleAppStateChange
			);

			// Play video when screen comes into focus
			if (randomVideos[currentIndex] && videoRef.current) {
				videoRef.current.playAsync().catch(console.error);
			}

			return () => {
				subscription.remove();
				// Pause video when screen loses focus
				if (randomVideos[currentIndex] && videoRef.current) {
					videoRef.current.pauseAsync().catch(console.error);
				}
			};
		}, [currentIndex, randomVideos])
	);

	if (randomVideos.length === 0) {
		return null; // Return null or a placeholder if no videos available
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Featured Exercises</Text>
			<Carousel
				loop
				width={wp(100)}
				height={hp(26)}
				data={randomVideos}
				onSnapToItem={handleSnapToItem}
				renderItem={({ item, index }) => (
					<View style={styles.slide}>
						<Video
							ref={index === currentIndex ? videoRef : null}
							source={item.video}
							style={styles.media}
							resizeMode="cover"
							shouldPlay={index === currentIndex}
							isLooping
						/>
					</View>
				)}
				autoPlay={true}
				autoPlayInterval={3000}
				pagingEnabled={true}
				style={styles.carousel}
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.88,
					parallaxScrollingOffset: wp(15),
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: hp(2),
		alignItems: "center",
	},
	title: {
		fontSize: hp(2),
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginLeft: wp(5),
	},
	slide: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: wp(2),
		overflow: "hidden",
	},
	media: {
		width: "100%",
		height: "100%",
	},
	carousel: {
		width: wp(100),
	},
});

export default FeaturedExercises;
