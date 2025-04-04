import {
	View,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	Image,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import exercises from "../../constants/exercises";

const SearchIndex = () => {
	const [searchText, setSearchText] = useState("");
	const [filteredExercises, setFilteredExercises] = useState(exercises);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Track the button state
	const router = useRouter();

	const handleSearch = (text) => {
		setSearchText(text);
		if (text.trim() === "") {
			setFilteredExercises(exercises);
		} else {
			const filtered = exercises.filter((exercise) =>
				exercise.name.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredExercises(filtered);
		}
	};

	const handleExercisePress = (id) => {
		if (isButtonDisabled) return;

		setIsButtonDisabled(true);

		router.push(`/Search/${id}`);
		setSearchText("");

		setTimeout(() => {
			setFilteredExercises(exercises);
			setIsButtonDisabled(false);
		}, 500);
	};

	const renderExercise = ({ item }) => (
		<TouchableOpacity
			style={styles.card}
			onPress={() => handleExercisePress(item.id)}
		>
			<Image source={item.image} style={styles.image} />
			<View style={styles.cardText}>
				<Text style={styles.title}>{item.name}</Text>
				{/* Added Description Text */}
				<Text style={styles.description} numberOfLines={2}>
					{item.description}
				</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<View style={styles.searchBar}>
				<Ionicons
					name="search"
					size={hp("3%")}
					color="black"
					style={styles.icon}
				/>
				<TextInput
					style={styles.input}
					placeholder="Search exercises..."
					placeholderTextColor="#999"
					value={searchText}
					onChangeText={handleSearch}
				/>
			</View>

			<FlatList
				data={filteredExercises}
				keyExtractor={(item) => item.id}
				renderItem={renderExercise}
				showsVerticalScrollIndicator={false}
				// contentContainerStyle={{ paddingBottom: hp("10%") }}
				ListEmptyComponent={
					<Text style={{ textAlign: "center", marginTop: hp("2%") }}>
						No exercises found
					</Text>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: wp("4%"),
		paddingTop: hp("2%"),
		backgroundColor: "#fff",
	},

	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: wp("2%"),
		paddingHorizontal: wp("3%"),
		paddingVertical: hp("1%"),
		marginBottom: hp("2%"),
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},

	icon: {
		marginRight: wp("2%"),
	},

	input: {
		flex: 1,
		fontSize: hp("2%"),
		color: "#333",
		fontFamily: "Roboto-Regular",
	},

	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: wp("3%"),
		marginHorizontal: wp("3%"),
		marginBottom: hp("1.5%"),
		overflow: "hidden",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},

	image: {
		width: wp("25%"),
		height: wp("22%"),
		resizeMode: "cover",
	},

	cardText: {
		flex: 1,
		padding: wp("3%"),
		justifyContent: "center",
	},

	title: {
		fontSize: hp("2.2%"),
		color: "#333",
		fontFamily: "Roboto-SemiBold",
		marginBottom: hp("0.5%"),
	},

	description: {
		fontSize: hp("1.7%"),
		color: "#777",
		fontFamily: "Karla-Light",
		lineHeight: 22,
	},
});

export default SearchIndex;
