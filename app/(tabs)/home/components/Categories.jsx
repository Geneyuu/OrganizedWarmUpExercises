import React from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const categoryData = [
	{
		title: "Whole Body Exercises",
		imageUri: require("./../../../../assets/images/withballpreview.png"),
		navigationPath: "home/WholeBody/WholeBodyIndex",
	},
	{
		title: "Upper Body Activation",
		imageUri: require("./../../../../assets/images/withballpreview.png"),
		navigationPath: "home/in-place/inplace",
	},
	{
		title: "Lower Body Activation",
		imageUri: require("./../../../../assets/images/withballpreview.png"),
		navigationPath: "home/with-ball/withball",
	},
	{
		title: "Dynamic Exercises",
		imageUri: require("./../../../../assets/images/withballpreview.png"),
		navigationPath: "home/stretching/stretching",
	},
];

const CategoryCard = ({ title, imageUri, navigationPath }) => {
	const router = useRouter();

	return (
		<TouchableOpacity
			style={styles.categoryCard}
			onPress={() => router.push(navigationPath)}
		>
			<Image style={styles.cardImage} source={imageUri} />
			<Text style={styles.cardText}>{title}</Text>
		</TouchableOpacity>
	);
};

// Main component for category
const Categories = () => (
	<View style={styles.categoriesContainer}>
		<Text style={styles.sectionTitle}>Categories</Text>
		<ScrollView
			contentContainerStyle={styles.categoriesGrid}
			showsVerticalScrollIndicator={false}
		>
			{categoryData.map((category, index) => (
				<CategoryCard key={index} {...category} />
			))}
		</ScrollView>
	</View>
);

const styles = StyleSheet.create({
	categoriesContainer: {
		width: wp("100%"),
		flex: 1,
		justifyContent: "flex-start",
		paddingHorizontal: wp(5),
	},

	categoriesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		paddingBottom: hp(2),
	},

	sectionTitle: {
		fontSize: hp(2.2),
		fontFamily: "Roboto-ExtraBold",
		color: "#000",
	},

	categoryCard: {
		width: "47%",
		alignItems: "center",
	},

	cardImage: {
		width: wp(40),
		height: hp(12.5),
		borderRadius: 10,
		marginTop: 10,
	},

	cardText: {
		marginTop: 5,
		fontSize: wp(3.5),
		textAlign: "center",
		fontFamily: "Karla-Regular",
		color: "#000",
	},
});

export default Categories;
