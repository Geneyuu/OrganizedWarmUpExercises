import React, { useState } from "react";
import {
	View,
	Text,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { exercises } from "../../../constants/exercises";
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// 🔸 Exercise Item Component
const ExerciseItem = ({ id, name, image }) => {
	const router = useRouter();
	const [isClickable, setIsClickable] = useState(true);

	const handlePress = () => {
		if (!isClickable) return;
		setIsClickable(false);
		router.push(`/home/WholeBody/${id}`);
		const timeout = setTimeout(() => setIsClickable(true), 1300);
		return () => clearTimeout(timeout);
	};

	return (
		<View style={styles.cardContainer}>
			<TouchableOpacity
				onPress={handlePress}
				disabled={!isClickable}
				style={styles.card}
			>
				<Image source={image} style={styles.exerciseImage} />
				<View style={styles.textContainer}>
					<Text style={styles.exerciseText}>{name}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

// 🔸 Sticky Start Button
const StickyButton = () => {
	const router = useRouter();
	const [isClickable, setIsClickable] = useState(true);

	const handlePress = () => {
		if (!isClickable) return;
		setIsClickable(false);
		router.push("/home/with-ball/StartWarmUps");
		setTimeout(() => setIsClickable(true), 1300);
	};

	return (
		<View style={styles.stickyButtonContainer}>
			<TouchableOpacity style={styles.stickyButton} onPress={handlePress}>
				<Text style={styles.stickyButtonText}>Start Warmups</Text>
			</TouchableOpacity>
		</View>
	);
};

// 🔸 Main Component
const WholeBodyIndex = () => {
	return (
		<>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
			>
				<Image
					source={require("../../../../assets/images/wholebodypreview.png")}
					style={styles.mainImage}
				/>
				<Text style={styles.description}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Maecenas et consectetur ante. Vivamus vulputate nibh eros,
					vel tempor magna posuere sed.
				</Text>
				<Text style={styles.subheading}>Included exercises:</Text>
				<View style={styles.exerciseContainer}>
					{exercises.slice(0, 5).map((exercise) => (
						<ExerciseItem key={exercise.id} {...exercise} />
					))}
				</View>
			</ScrollView>
			<StickyButton />
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: wp(4),
		backgroundColor: "#fff",
	},
	mainImage: {
		width: "100%",
		height: hp(30),
		resizeMode: "cover",
		borderRadius: wp(3),
		marginBottom: hp(2),
	},
	description: {
		fontSize: wp(4),
		lineHeight: hp(3),
		color: "#161616",
		marginBottom: hp(2),
		textAlign: "justify",
		fontFamily: "Karla-Regular",
	},
	subheading: {
		fontSize: wp(5),
		marginBottom: hp(2),
		color: "#161616",
		fontFamily: "Karla-Bold",
	},
	exerciseContainer: {
		flexDirection: "column",
		marginBottom: hp(7),
	},
	cardContainer: {
		width: "95%",
		marginHorizontal: wp(3),
		marginBottom: hp("1.5%"),
		backgroundColor: "white",
		borderRadius: wp("3%"),
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
	},
	exerciseImage: {
		width: wp(25),
		height: wp(25),
		borderTopLeftRadius: wp(2),
		borderBottomLeftRadius: wp(2),
		marginRight: wp(3),
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
	},
	exerciseText: {
		fontSize: wp(4),
		color: "#161616",
		fontFamily: "Roboto-ExtraBold",
		textAlign: "left", // Ensure text aligns left
	},
	stickyButtonContainer: {
		position: "absolute",
		bottom: hp(2),
		left: wp(4),
		right: wp(4),
	},
	stickyButton: {
		backgroundColor: "#161616",
		paddingVertical: hp(1.8),
		borderWidth: 2,
		borderRadius: wp(2),
		justifyContent: "center",
		alignItems: "center",
	},
	stickyButtonText: {
		fontSize: wp(4.5),
		color: "#fff",
		fontFamily: "Karla-Bold",
	},
});

export default WholeBodyIndex;
