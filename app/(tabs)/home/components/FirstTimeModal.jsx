import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	StatusBar,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseContext } from "../../../contexts/ExerciseContext";

const FirstTimeModal = () => {
	const { dispatch } = useContext(ExerciseContext);
	const [showModal, setShowModal] = useState(false);
	const [open, setOpen] = useState(false);
	const [difficulty, setDifficulty] = useState("beginner");

	const difficultyItems = [
		{ label: "Beginner", value: "beginner" },
		{ label: "Intermediate", value: "intermediate" },
		{ label: "Advanced", value: "advanced" },
	];

	useEffect(() => {
		const checkFirstTime = async () => {
			try {
				const firstTime = await AsyncStorage.getItem("firstTime");
				if (firstTime === "false") {
					setShowModal(true);
					await AsyncStorage.setItem("firstTime", "false");
				}
			} catch (error) {
				console.error("Error checking first time:", error);
			}
		};
		checkFirstTime();
	}, []);

	const handleSaveDifficulty = () => {
		dispatch({ type: "SET_INTENSITY_VALUE", payload: difficulty });
		setShowModal(false);
	};

	return (
		<Modal visible={showModal} animationType="fade" transparent={true}>
			<StatusBar
				barStyle="light-content"
				backgroundColor="rgba(0, 0, 0, 0.5)"
			/>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Let's Get Started!</Text>
					<Text style={styles.modalText}>
						Please select your preference for performing the
						Basketball Warm-Up Exercise:
					</Text>

					<DropDownPicker
						open={open}
						value={difficulty}
						items={difficultyItems}
						setOpen={setOpen}
						setValue={setDifficulty}
						style={styles.dropdown}
						dropDownContainerStyle={styles.dropdownContainerStyle}
						textStyle={styles.dropdownText}
						zIndex={1000}
						zIndexInverse={1000}
					/>

					<TouchableOpacity
						style={styles.saveButton}
						onPress={handleSaveDifficulty}
					>
						<Text style={styles.saveButtonText}>
							Save Preference
						</Text>
					</TouchableOpacity>

					<Text style={styles.noteText}>
						Note: You can later change the WarmUp Intensity level
						anytime in the settings.
					</Text>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 22,
		marginBottom: 10,
		fontFamily: "Roboto-ExtraBold",
	},
	modalText: {
		fontSize: 14,
		marginBottom: 20,
		textAlign: "center",
		fontFamily: "Roboto-Regular",
	},
	dropdown: {
		borderWidth: 2,
		borderColor: "#888",
		borderRadius: 5,
		alignSelf: "center",
		width: "85%",
		marginBottom: 20,
	},
	dropdownContainerStyle: {
		width: "85%",
		alignSelf: "center",
		borderWidth: 2,
		borderColor: "#888",
	},
	dropdownText: {
		fontSize: 16,
		fontFamily: "Karla-SemiBold",
		letterSpacing: -1,
	},
	saveButton: {
		backgroundColor: "black",
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderRadius: 5,
		width: "60%",
		alignItems: "center",
	},
	saveButtonText: {
		color: "white",
		fontSize: 14,
		fontFamily: "Karla-Bold",
	},
	noteText: {
		fontSize: 12,
		color: "#555",
		marginTop: 15,
		width: "75%",
		textAlign: "center",
		fontFamily: "Roboto-Regular",
	},
});

export default FirstTimeModal;
