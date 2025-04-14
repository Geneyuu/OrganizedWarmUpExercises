import React, { useState, useContext, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import exercises from "../../constants/exercises";
import { ExerciseContext } from "../../contexts/ExerciseContext";
import {
	getExerciseItems,
	intensityItems,
	validateInput,
	getRecommendedRange,
} from "../../utils/exerciseUtils";

const SettingsIndex = () => {
	const { state, dispatch, loadSavedData, saveSettings, resetToDefault } =
		useContext(ExerciseContext);
	const {
		exerciseOpen,
		exerciseValue,
		intensityOpen,
		intensityValue,
		duration,
		repetitions,
		restDuration,
	} = state;

	const [exerciseItems, setExerciseItems] = useState(
		getExerciseItems(exercises)
	);

	const [inputErrors, setInputErrors] = useState({
		duration: false,
		repetitions: false,
		restDuration: false,
	});

	// Validate inputs on change
	useEffect(() => {
		const timer = setTimeout(() => {
			if (exerciseValue && intensityValue) {
				setInputErrors({
					duration: validateInput(
						exerciseValue,
						intensityValue,
						exercises,
						"duration",
						duration
					),
					repetitions: validateInput(
						exerciseValue,
						intensityValue,
						exercises,
						"repetitions",
						repetitions
					),
					restDuration: validateInput(
						exerciseValue,
						intensityValue,
						exercises,
						"restDuration",
						restDuration
					),
				});
			} else {
				setInputErrors({
					duration: false,
					repetitions: false,
					restDuration: false,
				});
			}
		}, 50);
		return () => clearTimeout(timer);
	}, [duration, repetitions, restDuration, exerciseValue, intensityValue]);

	// Load data when exercise or intensity changes
	useEffect(() => {
		if (exerciseValue === null) {
			dispatch({ type: "SET_DURATION", payload: "" });
			dispatch({ type: "SET_REPETITIONS", payload: "" });
			dispatch({ type: "SET_REST_DURATION", payload: "" });
		} else if (exerciseValue && intensityValue) {
			loadSavedData(exerciseValue, intensityValue);
		}
	}, [exerciseValue, intensityValue]);

	// Handle input change
	const handleInputChange = (type, value) => {
		// Only allow numbers or empty string
		if (value === "" || /^\d*$/.test(value)) {
			switch (type) {
				case "duration":
					dispatch({ type: "SET_DURATION", payload: value });
					break;
				case "repetitions":
					dispatch({ type: "SET_REPETITIONS", payload: value });
					break;
				case "restDuration":
					dispatch({ type: "SET_REST_DURATION", payload: value });
					break;
				default:
					console.warn("Unknown input type:", type);
			}
		}
	};

	// Handle save button press
	// const handleSave = (type) => {
	// 	saveSettings(type, state[type.toLowerCase()]);
	// };

	const handleSave = (type) => {
		let value;

		if (type === "duration") {
			value = state.duration;
		} else if (type === "repetitions") {
			value = state.repetitions;
		} else if (type === "restDuration") {
			value = state.restDuration;
		}

		saveSettings(type, value);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.settings}>Settings</Text>

			{/* Exercise Dropdown */}
			<View style={styles.dropdownContainer}>
				<Text style={styles.label}>Select an Exercise:</Text>
				<DropDownPicker
					open={exerciseOpen}
					value={exerciseValue}
					items={exerciseItems}
					setOpen={(open) =>
						dispatch({ type: "SET_EXERCISE_OPEN", payload: open })
					}
					setValue={(callback) =>
						dispatch({
							type: "SET_EXERCISE_VALUE",
							payload: callback(),
						})
					}
					style={styles.dropdown}
					textStyle={styles.dropdownText}
					dropDownContainerStyle={styles.dropdownList}
					zIndex={3000}
					zIndexInverse={1000}
				/>
			</View>

			{/* Intensity Dropdown */}
			<View style={styles.dropdownContainer}>
				<Text style={[styles.label, { marginTop: 15 }]}>
					Warm-up Intensity:
				</Text>
				<DropDownPicker
					open={intensityOpen}
					value={intensityValue}
					items={intensityItems}
					setOpen={(open) =>
						dispatch({ type: "SET_INTENSITY_OPEN", payload: open })
					}
					setValue={(callback) =>
						dispatch({
							type: "SET_INTENSITY_VALUE",
							payload: callback(),
						})
					}
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
						{/* Duration Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabelText}>Duration:</Text>
							<TextInput
								style={[
									styles.input,
									inputErrors.duration && styles.inputError,
									!exerciseValue && styles.disabledInput,
								]}
								value={exerciseValue ? duration : ""}
								placeholder={
									exerciseValue
										? "Enter Duration"
										: "Select an exercise first"
								}
								placeholderTextColor={
									!exerciseValue ? "#a0a0a0" : "#666"
								}
								keyboardType="numeric"
								editable={!!exerciseValue}
								onChangeText={(text) =>
									handleInputChange("duration", text)
								}
							/>
							<View style={styles.rangeContainer}>
								<Text style={styles.rangeText}>
									Recommended:{" "}
									<Text style={styles.rangeValue}>
										{getRecommendedRange(
											exerciseValue,
											intensityValue,
											exercises,
											"duration"
										)}
									</Text>
								</Text>
							</View>
							<TouchableOpacity
								style={[
									styles.button,
									(!exerciseValue ||
										!duration ||
										inputErrors.duration) &&
										styles.buttonDisabled,
								]}
								onPress={() => handleSave("duration")}
								disabled={
									!exerciseValue ||
									!duration ||
									inputErrors.duration
								}
							>
								<Text style={styles.buttonText}>
									Save Duration
								</Text>
							</TouchableOpacity>
						</View>

						{/* Repetitions Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabelText}>
								Repetitions:
							</Text>
							<TextInput
								style={[
									styles.input,
									inputErrors.repetitions &&
										styles.inputError,
									!exerciseValue && styles.disabledInput,
								]}
								value={exerciseValue ? repetitions : ""}
								placeholder={
									exerciseValue
										? "Enter Repetitions"
										: "Select an exercise first"
								}
								placeholderTextColor={
									!exerciseValue ? "#a0a0a0" : "#666"
								}
								keyboardType="numeric"
								editable={!!exerciseValue}
								onChangeText={(text) =>
									handleInputChange("repetitions", text)
								}
							/>
							<View style={styles.rangeContainer}>
								<Text style={styles.rangeText}>
									Recommended:{" "}
									<Text style={styles.rangeValue}>
										{getRecommendedRange(
											exerciseValue,
											intensityValue,
											exercises,
											"repetitions"
										)}
									</Text>
								</Text>
							</View>
							<TouchableOpacity
								style={[
									styles.button,
									(!exerciseValue ||
										!repetitions ||
										inputErrors.repetitions) &&
										styles.buttonDisabled,
								]}
								onPress={() => handleSave("repetitions")}
								disabled={
									!exerciseValue ||
									!repetitions ||
									inputErrors.repetitions
								}
							>
								<Text style={styles.buttonText}>
									Save Repetitions
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Rest Duration Input */}
					<Text style={styles.inputLabelText}>Rest Timer:</Text>
					<TextInput
						style={[
							styles.input,
							inputErrors.restDuration && styles.inputError,
							!exerciseValue && styles.disabledInput,
						]}
						value={exerciseValue ? restDuration : ""}
						placeholder={
							exerciseValue
								? "Enter Rest Duration"
								: "Select an exercise first"
						}
						placeholderTextColor={
							!exerciseValue ? "#a0a0a0" : "#666"
						}
						keyboardType="numeric"
						editable={!!exerciseValue}
						onChangeText={(text) =>
							handleInputChange("restDuration", text)
						}
					/>
					<View style={styles.rangeContainer}>
						<Text style={styles.rangeText}>
							Recommended:{" "}
							<Text style={styles.rangeValue}>
								{getRecommendedRange(
									exerciseValue,
									intensityValue,
									exercises,
									"restDuration"
								)}
							</Text>
						</Text>
					</View>
					<TouchableOpacity
						style={[
							styles.button,
							(!exerciseValue ||
								!restDuration ||
								inputErrors.restDuration) &&
								styles.buttonDisabled,
						]}
						onPress={() => handleSave("restDuration")}
						disabled={
							!exerciseValue ||
							!restDuration ||
							inputErrors.restDuration
						}
					>
						<Text style={styles.buttonText}>Save Rest Timer</Text>
					</TouchableOpacity>

					{/* Reset Button */}
					<TouchableOpacity
						style={[
							styles.buttonResetDefault,
							!exerciseValue && styles.buttonDisabled,
						]}
						onPress={resetToDefault}
						disabled={!exerciseValue}
					>
						<Text style={styles.buttonText}>
							Reset All Exercises
						</Text>
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
		borderWidth: 3,
		borderColor: "#999",
		borderRadius: 5,
		backgroundColor: "white",
	},
	dropdownText: {
		fontFamily: "Karla-SemiBold",
		fontSize: 18,
		letterSpacing: -1,
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
		fontFamily: "Karla-Regular",
		fontSize: 16,
	},
	disabledInput: {
		backgroundColor: "#f5f5f5",
		borderColor: "#e0e0e0",
		color: "#a0a0a0",
	},
	inputError: {
		backgroundColor: "#ffdddd",
		borderColor: "red",
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
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: "#cccccc",
	},
	buttonResetDefault: {
		backgroundColor: "#14b316",
		paddingVertical: 15,
		width: "50%",
		alignSelf: "center",
		marginTop: 30,
		alignItems: "center",
		borderRadius: 10,
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
		color: "black", // Changed to black
	},
	rangeValue: {
		fontSize: 12,
		fontFamily: "Karla-Regular",
		color: "red", // Kept as red
	},
});

export default SettingsIndex;
