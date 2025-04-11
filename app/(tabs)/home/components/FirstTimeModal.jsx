import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	StatusBar,
	Dimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseContext } from "../../../contexts/ExerciseContext";

// Add this at the top of your file to prevent Worklet issues
if (!global.__reanimatedWorkletInit) {
	global.__reanimatedWorkletInit = () => {};
}

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
				if (firstTime === null) {
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

	if (!showModal) return null;

	return (
		<>
			<StatusBar
				barStyle="light-content"
				backgroundColor="rgba(0, 0, 0, 0.5)"
			/>
			<View style={styles.overlay}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							Let's Get Started!
						</Text>
						<Text style={styles.modalText}>
							Please select your preference for performing the
							Basketball Warm-Up Exercise:
						</Text>

						<View style={styles.dropdownWrapper}>
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
								zIndex={3000} // Increased zIndex
								zIndexInverse={3000} // Increased zIndex
								listMode="SCROLLVIEW"
								scrollViewProps={{
									nestedScrollEnabled: true,
								}}
							/>
						</View>

						<TouchableOpacity
							style={styles.saveButton}
							onPress={handleSaveDifficulty}
						>
							<Text style={styles.saveButtonText}>
								Save Preference
							</Text>
						</TouchableOpacity>

						<Text style={styles.noteText}>
							Note: You can later change the WarmUp Intensity
							level anytime in the settings.
						</Text>
					</View>
				</View>
			</View>
		</>
	);
};

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 9999,
		elevation: 9999,
	},
	modalContainer: {
		width: "70%",
		maxWidth: 400,
		borderRadius: 10,
		overflow: "hidden",
		zIndex: 10000,
		elevation: 10000,
	},
	modalContent: {
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
	dropdownWrapper: {
		width: "100%",
		marginBottom: 20,
		zIndex: 1000,
	},
	dropdown: {
		borderWidth: 2,
		borderColor: "#888",
		borderRadius: 5,
	},
	dropdownContainerStyle: {
		borderWidth: 2,
		borderColor: "#888",
		marginTop: 2,
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
