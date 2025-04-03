import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { ProfileContext } from "./../../../contexts/ProfileContext"; // Adjust path

const Header = () => {
	const router = useRouter();
	const { name, updateName } = useContext(ProfileContext);
	return (
		<>
			<View style={styles.logoContainer}>
				<Text style={styles.headerText}>WarmUps</Text>

				<View style={styles.profileDiv}>
					<Text style={styles.greetingText}>
						Hello, <Text style={styles.greetingName}>{name}</Text>
					</Text>
					<TouchableOpacity
						style={styles.profileContainer}
						onPress={() => router.push("/Profile")}
					>
						<Image
							source={require("../../../../assets/images/cvsulogo.png")}
							style={styles.profileImage}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.subHeader}>
				<Text style={styles.subHeaderText}>
					Basketball Warm-Up Exercises
				</Text>
				<Text style={styles.subHeaderText}>
					Cavite State University
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	logoContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: hp(1),
		paddingHorizontal: wp(5),
		justifyContent: "space-between",
	},

	headerText: {
		fontSize: hp(5),
		fontFamily: "Roboto-ExtraBold",
		color: "#161616",
		letterSpacing: -1.5,
	},
	//
	//
	greetingText: {
		fontSize: wp(3.5),
		color: "#000",
		fontFamily: "Roboto-Regular",
		marginTop: hp(0.5),
		marginRight: wp(2.5),
	},

	greetingName: {
		color: "#161616",
		fontFamily: "Roboto-ExtraBold",
		fontSize: wp(3.2),
		textTransform: "uppercase",
		letterSpacing: -0.5,
	},

	profileContainer: {
		width: wp(15),
		height: wp(15),
		alignItems: "center",
		justifyContent: "center",
	},

	profileImage: {
		width: "100%",
		height: "100%",
		resizeMode: "contain",
	},

	profileDiv: {
		flexDirection: "row",
		alignItems: "center",
	},

	subHeader: {
		flexDirection: "column",
		paddingHorizontal: wp(5),
		paddingBottom: hp(3),
		borderBottomWidth: hp(0.2),
		borderBottomColor: "black",
	},
	subHeaderText: {
		fontSize: wp("3"),
		color: "black",
		fontFamily: "Karla-Regular",
	},
});

export default Header;
