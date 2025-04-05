import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	StatusBar,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import Header from "./components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import { ExerciseContext } from "../../contexts/ExerciseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeIndex = () => {
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
		dispatch({ type: "setIntensity", payload: difficulty });
		setShowModal(false);
	};

	return (
		<View style={styles.HomeContainer}>
			<Header />

			<Modal visible={showModal} animationType="fade" transparent={true}>
				<StatusBar
					barStyle="light-content"
					style={{}}
					backgroundColor="rgba(0, 0, 0, 0.5)"
				/>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							Let's Get Started!
						</Text>
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
							dropDownContainerStyle={
								styles.dropdownContainerStyle
							}
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

						{/*  */}
						<Text style={styles.noteText}>
							Note: You can later change the warm-up difficulty
							anytime in the settings.
						</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	HomeContainer: {
		flex: 1,
		backgroundColor: "white",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
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
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		width: "100%",
		marginBottom: 20,
	},
	dropdownContainerStyle: {
		borderWidth: 1,
		borderColor: "#ccc",
	},
	dropdownText: {
		fontSize: 16,
		fontFamily: "Karla-Bold",
	},
	saveButton: {
		backgroundColor: "black",
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 5,
		width: "100%",
		alignItems: "center",
	},
	saveButtonText: {
		color: "white",
		fontSize: 16,
		fontFamily: "Karla-Bold",
	},
	// Note text style added here
	noteText: {
		fontSize: 12,
		color: "#555",
		marginTop: 15,
		width: "75%",
		textAlign: "center",
		fontFamily: "Roboto-Regular",
	},
});

export default HomeIndex;
