import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ExerciseContext } from "../../contexts/ExerciseContext";
import exercises from "../../constants/exercises";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsIndex = () => {
	const { state, dispatch, saveExerciseSetting } =
		useContext(ExerciseContext);
	const {
		open,
		value,
		intensity,
		intensityOpen,
		duration,
		repetitions,
		restDuration,
	} = state;

	const exerciseItems = [
		{ label: "Select an Exercise...", value: null },
		...exercises.map((exercise) => ({
			label: exercise.name,
			value: exercise.id,
		})),
	];

	const intensityItems = [
		{ label: "Beginner", value: "beginner" },
		{ label: "Intermediate", value: "intermediate" },
		{ label: "Advanced", value: "advanced" },
	];

	// Get the selected exercise data
	const selectedExercise = exercises.find((ex) => ex.id === value);

	// Get range values based on selected exercise and intensity
	const getRangeValues = (type) => {
		if (!selectedExercise || !intensity) return { min: 0, max: 0 };
		return selectedExercise?.intensity?.[intensity]?.[type];
	};

	// Validation function
	const isInputValid = (inputValue, type) => {
		if (!inputValue || inputValue.trim() === "") return true;
		const numValue = inputValue;
		if (isNaN(numValue)) return false;

		const range = getRangeValues(type);
		return numValue >= range.min && numValue <= range.max;
	};

	const handleSaveDuration = async () => {
		if (!value) {
			Alert.alert("Error", "Please select an exercise first!");
			return;
		}
		if (!isInputValid(duration, "duration")) {
			Alert.alert("Error", "Duration is outside recommended range!");
			return;
		}
		await saveExerciseSetting(value, intensity, duration, "duration");
	};

	const handleSaveRepetitions = async () => {
		if (!value) {
			Alert.alert("Error", "Please select an exercise first!");
			return;
		}
		if (!isInputValid(repetitions, "repetitions")) {
			Alert.alert("Error", "Repetitions are outside recommended range!");
			return;
		}
		await saveExerciseSetting(value, intensity, repetitions, "repetitions");
	};

	const handleRestTimer = async () => {
		if (!value) {
			Alert.alert("Error", "Please select an exercise first!");
			return;
		}
		if (!isInputValid(restDuration, "restDuration")) {
			Alert.alert("Error", "Rest duration is outside recommended range!");
			return;
		}
		await saveExerciseSetting(
			value,
			intensity,
			restDuration,
			"restDuration"
		);
	};

	const resetToDefault = async () => {
		try {
			dispatch({ type: "setValue", payload: null });
			// dispatch({ type: "setIntensity", payload: "beginner" });
			dispatch({ type: "setDuration", payload: "" });
			dispatch({ type: "setRepetitions", payload: "" });
			dispatch({ type: "setRestDuration", payload: "" });
			dispatch({ type: "setOpen", payload: false });
			dispatch({ type: "setIntensityOpen", payload: false });

			await AsyncStorage.setItem("exercises", JSON.stringify(exercises));

			dispatch({ type: "loadExercises", payload: exercises });

			Alert.alert("Success", "All values reset to default!");
		} catch (error) {
			console.error("Reset failed:", error);
			Alert.alert("Error", "Failed to reset values");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.settings}>Settings</Text>

			<View style={styles.dropdownContainer}>
				<Text style={styles.label}>Select an Exercise:</Text>
				<DropDownPicker
					open={open}
					value={value}
					items={exerciseItems}
					setOpen={(isOpen) =>
						dispatch({ type: "setOpen", payload: isOpen })
					}
					setValue={(val) => {
						const selectedValue =
							typeof val === "function" ? val(value) : val;
						dispatch({ type: "setValue", payload: selectedValue });

						// Reset inputs when intensity changes para walang red flasshshs
						dispatch({ type: "resetInputs" });
					}}
					style={styles.dropdown}
					textStyle={styles.dropdownText}
					dropDownContainerStyle={styles.dropdownList}
					zIndex={3000}
					zIndexInverse={1000}
				/>
			</View>

			<View style={styles.dropdownContainer}>
				<Text style={[styles.label, { marginTop: 15 }]}>
					Warm-up Difficulty:
				</Text>
				<DropDownPicker
					open={intensityOpen}
					value={intensity}
					items={intensityItems}
					setOpen={(isOpen) =>
						dispatch({ type: "setIntensityOpen", payload: isOpen })
					}
					setValue={(val) => {
						const selected =
							typeof val === "function" ? val(intensity) : val;
						dispatch({ type: "setIntensity", payload: selected });

						// Reset inputs when intensity changes para walang red flasshshs
						dispatch({ type: "setDuration", payload: "" });
						dispatch({ type: "setRepetitions", payload: "" });
						dispatch({ type: "setRestDuration", payload: "" });
					}}
					style={styles.dropdown}
					textStyle={styles.dropdownText}
					dropDownContainerStyle={styles.dropdownList}
					zIndex={2000}
					zIndexInverse={2000}
				/>
			</View>
			<ScrollView>
				<View style={styles.inputContainer}>
					<View style={styles.rowContainer}>
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabelText}>Duration:</Text>
							<TextInput
								style={[
									styles.input,
									!isInputValid(duration, "duration") &&
										styles.invalidInput,
								]}
								value={duration}
								onChangeText={(text) =>
									dispatch({
										type: "setDuration",
										payload: text,
									})
								}
								placeholder="Enter Duration"
								keyboardType="numeric"
							/>
							<View style={styles.rangeContainer}>
								<Text style={styles.rangeText}>
									Recommended:
								</Text>
								<Text style={styles.rangeValue}>
									{getRangeValues("duration").min}-
									{getRangeValues("duration").max} seconds
								</Text>
							</View>
							<TouchableOpacity
								onPress={handleSaveDuration}
								style={styles.button}
							>
								<Text style={styles.buttonText}>
									Save Duration
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabelText}>
								Repetitions:
							</Text>
							<TextInput
								style={[
									styles.input,
									!isInputValid(repetitions, "repetitions") &&
										styles.invalidInput,
								]}
								value={repetitions}
								onChangeText={(text) =>
									dispatch({
										type: "setRepetitions",
										payload: text,
									})
								}
								placeholder="Enter Repetitions"
								keyboardType="numeric"
							/>
							<View style={styles.rangeContainer}>
								<Text style={styles.rangeText}>
									Recommended:
								</Text>
								<Text style={styles.rangeValue}>
									{getRangeValues("repetitions").min}-
									{getRangeValues("repetitions").max} reps
								</Text>
							</View>
							<TouchableOpacity
								onPress={handleSaveRepetitions}
								style={styles.button}
							>
								<Text style={styles.buttonText}>
									Save Repetitions
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<Text style={styles.inputLabelText}>Rest Timer:</Text>
					<TextInput
						style={[
							styles.input,
							!isInputValid(restDuration, "restDuration") &&
								styles.invalidInput,
						]}
						value={restDuration}
						onChangeText={(text) =>
							dispatch({ type: "setRestDuration", payload: text })
						}
						placeholder="Enter Rest Duration (seconds)"
						keyboardType="numeric"
					/>
					<View style={styles.rangeContainer}>
						<Text style={styles.rangeText}>Recommended:</Text>
						<Text style={styles.rangeValue}>
							{getRangeValues("restDuration").min}-
							{getRangeValues("restDuration").max} seconds
						</Text>
					</View>
					<TouchableOpacity
						onPress={handleRestTimer}
						style={styles.button}
					>
						<Text style={styles.buttonText}>Save Rest Timer</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={resetToDefault}
						style={styles.buttonResetDefault}
					>
						<Text style={styles.buttonText}>Reset to Default</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "white",
	},
	settings: {
		fontSize: 35,
		fontFamily: "Roboto-ExtraBold",
		marginVertical: 20,
	},
	label: {
		fontSize: 19,
		fontFamily: "Roboto-ExtraBold",
		marginBottom: 5,
	},
	dropdownContainer: {
		marginBottom: 15,
	},
	dropdown: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		backgroundColor: "white",
	},
	dropdownText: {
		fontFamily: "Roboto-Regular",
		fontSize: 18,
	},
	dropdownList: {
		borderColor: "#ccc",
		borderWidth: 1,
	},
	inputContainer: {
		marginTop: 10,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		backgroundColor: "white",
		marginBottom: 10,
		paddingHorizontal: 10,
		fontFamily: "Roboto-Regular",
		fontSize: 18,
		transition: "border-color 0.3s ease",
	},
	invalidInput: {
		borderColor: "red",
		backgroundColor: "#FFEEEE",
	},
	rowContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	inputGroup: {
		width: "48%",
	},
	inputLabelText: {
		fontSize: 16,
		fontFamily: "Roboto-ExtraBold",
		marginBottom: 5,
	},
	button: {
		backgroundColor: "black",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	buttonResetDefault: {
		backgroundColor: "red",
		paddingVertical: 15,
		width: "50%",
		alignSelf: "center",
		marginTop: 30,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 15,
		fontFamily: "Karla-Bold",
	},
	rangeContainer: {
		flexDirection: "row",
		marginBottom: 10,
		marginTop: -10,
		paddingHorizontal: 2,
	},
	rangeText: {
		fontSize: 12,
		fontFamily: "Roboto-Regular",
		color: "#666",
		marginRight: 5,
	},
	rangeValue: {
		fontSize: 12,
		fontFamily: "Roboto-Bold",
		color: "#333",
	},
});

export default SettingsIndex;
