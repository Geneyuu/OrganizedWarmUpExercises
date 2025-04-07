import React, { useState, useContext, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import exercises from "../../constants/exercises";
import { ExerciseContext } from "../../contexts/ExerciseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

	const selectedExercise = exercises.find(
		(exercise) => exercise.id === exerciseValue
	);

	const intensityData = selectedExercise?.intensity?.[intensityValue];

	useEffect(() => {
		if (intensityData) {
			dispatch({
				type: "SET_DURATION",
				payload: intensityData.duration.min.toString(),
			});
			dispatch({
				type: "SET_REPETITIONS",
				payload: intensityData.repetitions.min.toString(),
			});
			dispatch({
				type: "SET_REST_DURATION",
				payload: intensityData.restDuration.min.toString(),
			});
		} else {
			dispatch({
				type: "RESET_INPUTS",
			});
		}
	}, [selectedExercise, intensityValue]);

	useEffect(() => {
		if (exerciseValue && intensityValue) {
			loadSavedData(exerciseValue, intensityValue);
		}
	}, [exerciseValue, intensityValue]);

	// Validation functions
	const isValueInRange = (value, type) => {
		if (!intensityData || !value) return true;

		const numValue = parseInt(value, 10);
		if (isNaN(numValue)) return false;

		switch (type) {
			case "duration":
				return (
					numValue >= intensityData.duration.min &&
					numValue <= intensityData.duration.max
				);
			case "repetitions":
				return (
					numValue >= intensityData.repetitions.min &&
					numValue <= intensityData.repetitions.max
				);
			case "restDuration":
				return (
					numValue >= intensityData.restDuration.min &&
					numValue <= intensityData.restDuration.max
				);
			default:
				return true;
		}
	};

	const getInputStyle = (value, type) => {
		const isValid = isValueInRange(value, type);
		return [styles.input, !isValid && styles.inputError];
	};

	const getRecommendedRange = (type) => {
		if (!intensityData) return "N/A";

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

	const handleSave = (type, value) => {
		if (!isValueInRange(value, type)) {
			Alert.alert(
				"Invalid Value",
				`Please enter a value between ${getRecommendedRange(type)}`,
				[{ text: "OK" }]
			);
			return;
		}
		saveSettings(type, value);
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
								style={getInputStyle(duration, "duration")}
								value={duration}
								placeholder="Enter Duration"
								keyboardType="numeric"
								editable={true}
								onChangeText={(text) =>
									dispatch({
										type: "SET_DURATION",
										payload: text,
									})
								}
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
								style={styles.button}
								onPress={() => handleSave("duration", duration)}
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
								style={getInputStyle(
									repetitions,
									"repetitions"
								)}
								value={repetitions}
								placeholder="Enter Repetitions"
								keyboardType="numeric"
								editable={true}
								onChangeText={(text) =>
									dispatch({
										type: "SET_REPETITIONS",
										payload: text,
									})
								}
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
								style={styles.button}
								onPress={() =>
									handleSave("repetitions", repetitions)
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
						style={getInputStyle(restDuration, "restDuration")}
						value={restDuration}
						placeholder="Enter Rest Duration (seconds)"
						keyboardType="numeric"
						editable={true}
						onChangeText={(text) =>
							dispatch({
								type: "SET_REST_DURATION",
								payload: text,
							})
						}
					/>
					<View style={styles.rangeContainer}>
						<Text style={styles.rangeText}>Recommended:</Text>
						<Text style={styles.rangeValue}>
							{getRecommendedRange("restTimer")}
						</Text>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPress={() => handleSave("restDuration", restDuration)}
					>
						<Text style={styles.buttonText}>Save Rest Timer</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonResetDefault}
						onPress={resetToDefault}
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
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		backgroundColor: "white",
	},
	dropdownText: {
		fontFamily: "Karla-SemiBold",
		fontSize: 17,
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
		fontSize: 18,
	},
	inputError: {
		borderColor: "red",
		borderWidth: 2,
		backgroundColor: "#FFEBEE",
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
	buttonResetDefault: {
		backgroundColor: "red",
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
