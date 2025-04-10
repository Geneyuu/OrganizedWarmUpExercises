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

	const [exerciseItems, setExerciseItems] = useState([
		{ label: "Select an Exercise...", value: null },
		...exercises.map((exercise) => ({
			label: exercise.name,
			value: exercise.id,
		})),
	]);

	const [intensityItems, setIntensityItems] = useState([
		{ label: "Beginner", value: "beginner" },
		{ label: "Intermediate", value: "intermediate" },
		{ label: "Advanced", value: "advanced" },
	]);

	const [inputErrors, setInputErrors] = useState({
		duration: false,
		repetitions: false,
		restDuration: false,
	});

	const selectedExercise = exercises.find(
		(exercise) => exercise.id === exerciseValue
	);

	const intensityData = selectedExercise?.intensity?.[intensityValue];

	// Enhanced validation function
	const validateInput = (type, value) => {
		if (!exerciseValue || !intensityData) return true;
		if (!value || value.trim() === "") return true;

		const numValue = parseInt(value, 10);
		if (isNaN(numValue)) return true;

		switch (type) {
			case "duration":
				return (
					numValue < intensityData.duration.min ||
					numValue > intensityData.duration.max
				);
			case "repetitions":
				return (
					numValue < intensityData.repetitions.min ||
					numValue > intensityData.repetitions.max
				);
			case "restDuration":
				return (
					numValue < intensityData.restDuration.min ||
					numValue > intensityData.restDuration.max
				);
			default:
				return true;
		}
	};

	// Validate inputs whenever they change
	useEffect(() => {
		const timer = setTimeout(() => {
			if (exerciseValue && intensityData) {
				setInputErrors({
					duration: validateInput("duration", duration),
					repetitions: validateInput("repetitions", repetitions),
					restDuration: validateInput("restDuration", restDuration),
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
	}, [duration, repetitions, restDuration, intensityData, exerciseValue]);

	useEffect(() => {
		if (exerciseValue === null) {
			// Reset all fields when "Select an Exercise..." is chosen
			dispatch({ type: "SET_DURATION", payload: "" });
			dispatch({ type: "SET_REPETITIONS", payload: "" });
			dispatch({ type: "SET_REST_DURATION", payload: "" });
		} else if (exerciseValue && intensityValue) {
			loadSavedData(exerciseValue, intensityValue);
		}
	}, [exerciseValue, intensityValue]);

	const getRecommendedRange = (type) => {
		if (!exerciseValue || !intensityData) return "N/A";

		switch (type) {
			case "duration":
				return `${intensityData.duration.min}-${intensityData.duration.max} seconds`;
			case "repetitions":
				return `${intensityData.repetitions.min}-${intensityData.repetitions.max} reps`;
			case "restTimer":
				return `${intensityData.restDuration.min}-${intensityData.restDuration.max} seconds`;
			default:
				return "N/A";
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.settings}>Settings</Text>

			<View style={styles.dropdownContainer}>
				<Text style={styles.label}>Select an Exercise:</Text>
				<DropDownPicker
					open={exerciseOpen}
					value={exerciseValue}
					items={exerciseItems}
					setOpen={(open) =>
						dispatch({ type: "SET_EXERCISE_OPEN", payload: open })
					}
					setValue={(callback) => {
						const newValue = callback();
						dispatch({
							type: "SET_EXERCISE_VALUE",
							payload: newValue,
						});
					}}
					setItems={setExerciseItems}
					style={styles.dropdown}
					textStyle={styles.dropdownText}
					dropDownContainerStyle={styles.dropdownList}
					zIndex={3000}
					zIndexInverse={1000}
				/>
			</View>

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
					setValue={(callback) => {
						const newValue = callback();
						dispatch({
							type: "SET_INTENSITY_VALUE",
							payload: newValue,
						});
					}}
					setItems={setIntensityItems}
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
								editable={exerciseValue !== null}
								onChangeText={(text) => {
									const cleanedText = text.trim();
									dispatch({
										type: "SET_DURATION",
										payload: cleanedText,
									});
								}}
							/>
							<View style={styles.rangeContainer}>
								<Text style={styles.rangeText}>
									Recommended:
								</Text>
								<Text style={styles.rangeValue}>
									{getRecommendedRange("duration")}
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
								onPress={() =>
									saveSettings("duration", duration)
								}
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
								editable={exerciseValue !== null}
								onChangeText={(text) => {
									const cleanedText = text.trim();
									dispatch({
										type: "SET_REPETITIONS",
										payload: cleanedText,
									});
								}}
							/>
							<View style={styles.rangeContainer}>
								<Text style={styles.rangeText}>
									Recommended:
								</Text>
								<Text style={styles.rangeValue}>
									{getRecommendedRange("repetitions")}
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
								onPress={() =>
									saveSettings("repetitions", repetitions)
								}
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
								? "Enter Rest Duration (seconds)"
								: "Select an exercise first"
						}
						placeholderTextColor={
							!exerciseValue ? "#a0a0a0" : "#666"
						}
						keyboardType="numeric"
						editable={exerciseValue !== null}
						onChangeText={(text) => {
							const cleanedText = text.trim();
							dispatch({
								type: "SET_REST_DURATION",
								payload: cleanedText,
							});
						}}
					/>
					<View style={styles.rangeContainer}>
						<Text style={styles.rangeText}>Recommended:</Text>
						<Text style={styles.rangeValue}>
							{getRecommendedRange("restTimer")}
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
						onPress={() =>
							saveSettings("restDuration", restDuration)
						}
						disabled={
							!exerciseValue ||
							!restDuration ||
							inputErrors.restDuration
						}
					>
						<Text style={styles.buttonText}>Save Rest Timer</Text>
					</TouchableOpacity>
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
		color: "#666",
		marginRight: 5,
	},
	rangeValue: {
		fontSize: 12,
		fontFamily: "Karla-Regular",
		color: "red",
	},
});

export default SettingsIndex;
