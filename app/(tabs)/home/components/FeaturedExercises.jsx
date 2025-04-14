import React, { useRef, useState, useEffect } from "react";
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
	// Refs and state
	const videoRef = useRef(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [videosToShow, setVideosToShow] = useState([]);
	const [isScreenFocused, setIsScreenFocused] = useState(false);
	const [appIsActive, setAppIsActive] = useState(true);

	// 1. Pick 3 random videos when component loads
	useEffect(() => {
		const videosWithClips = exercises.filter((exercise) => exercise.video);
		const shuffled = [...videosWithClips].sort(() => Math.random() - 0.5);
		setVideosToShow(shuffled.slice(0, 3));
	}, []);

	// 2. Handle when user swipes to a new slide
	const handleSlideChange = (newIndex) => {
		// Pause current video
		if (videoRef.current) {
			videoRef.current.pauseAsync();
		}

		// Update current slide
		setCurrentSlide(newIndex);

		// Play new video if screen is focused and app is active
		if (isScreenFocused && appIsActive && videoRef.current) {
			videoRef.current.playAsync();
		}
	};

	// 3. Handle app background/foreground changes
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (state) => {
			const nowActive = state === "active";
			setAppIsActive(nowActive);

			if (videosToShow[currentSlide] && videoRef.current) {
				if (nowActive && isScreenFocused) {
					videoRef.current.playAsync().catch(console.log);
				} else {
					videoRef.current.pauseAsync().catch(console.log);
				}
			}
		});

		return () => subscription.remove();
	}, [currentSlide, videosToShow, isScreenFocused]);

	// 4. Handle screen focus/blur
	useFocusEffect(
		React.useCallback(() => {
			setIsScreenFocused(true);

			// Play video when screen focuses
			if (videosToShow[currentSlide] && videoRef.current && appIsActive) {
				videoRef.current.playAsync().catch(console.log);
			}

			return () => {
				setIsScreenFocused(false);
				// Pause video when screen blurs
				if (videosToShow[currentSlide] && videoRef.current) {
					videoRef.current.pauseAsync().catch(console.log);
				}
			};
		}, [currentSlide, videosToShow, appIsActive])
	);

	if (videosToShow.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Featured Exercises</Text>

			<Carousel
				loop
				width={wp(100)}
				height={hp(26)}
				data={videosToShow}
				onSnapToItem={handleSlideChange}
				renderItem={({ item, index }) => (
					<View style={styles.slide}>
						<Video
							ref={index === currentSlide ? videoRef : null}
							source={item.video}
							style={styles.video}
							resizeMode="cover"
							shouldPlay={
								index === currentSlide &&
								isScreenFocused &&
								appIsActive
							}
							isLooping
							renderToHardwareTextureAndroid={true}
						/>
					</View>
				)}
				autoPlay={isScreenFocused && appIsActive}
				autoPlayInterval={3000}
				pagingEnabled
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.8,
					parallaxScrollingOffset: wp(25),
				}}
			/>
		</View>
	);
};

// Styles remain the same
const styles = StyleSheet.create({
	container: {
		marginVertical: hp(2),
		alignItems: "center",
	},
	heading: {
		fontSize: hp(2),
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginLeft: wp(5),
		marginBottom: hp(1),
	},
	slide: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: wp(2),
		overflow: "hidden",
	},
	video: {
		width: "100%",
		height: "100%",
	},
});

export default FeaturedExercises;
