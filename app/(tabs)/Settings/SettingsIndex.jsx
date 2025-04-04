import React, { useContext, useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	Text,
	Alert,
	TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ExerciseContext } from "../../contexts/ExerciseContext";
import exercises from "../../constants/exercises";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SettingsIndex component
export default function SettingsIndex() {
	const { state, dispatch } = useContext(ExerciseContext);
	const { open, value, duration, repetitions, restDuration } = state;

	// Convert exercises array into dropdown items
	const [items, setItems] = useState([
		{ label: "Select an Exercise...", value: null },
		...exercises.map((exercise) => ({
			label: exercise.name,
			value: exercise.id,
		})),
	]);

	// Function to handle saving the edited values to AsyncStorage
	const saveExerciseData = async (type) => {
		if (value === null) {
			Alert.alert("Error", "Please select an exercise.");
			return;
		}
		if (!duration || !repetitions || !restDuration) {
			Alert.alert(
				"Error",
				"Please fill out duration, repetitions, and rest duration."
			);
			return;
		}

		try {
			const storedExercises = await AsyncStorage.getItem("exercises");
			const exercisesList = storedExercises
				? JSON.parse(storedExercises)
				: [];

			const updatedExercises = exercisesList.map((exercise) => {
				if (exercise.id === value) {
					return {
						...exercise,
						duration:
							type === "duration"
								? parseInt(duration, 10)
								: exercise.duration,
						repetitions:
							type === "repetitions"
								? parseInt(repetitions, 10)
								: exercise.repetitions,
						restDuration:
							type === "restDuration"
								? parseInt(restDuration, 10)
								: exercise.restDuration, // Remove restTimer and keep restDuration
					};
				}
				return exercise;
			});

			await AsyncStorage.setItem(
				"exercises",
				JSON.stringify(updatedExercises)
			);
			Alert.alert(
				"Success",
				`${
					type.charAt(0).toUpperCase() + type.slice(1)
				} saved successfully!`
			);
		} catch (error) {
			Alert.alert("Error", "Failed to save exercise data.");
		}
	};

	// Function to reset all values to default
	const resetToDefault = async () => {
		try {
			const defaultExercises = exercises.map((exercise) => ({
				id: exercise.id,
				duration: exercise.duration,
				repetitions: exercise.repetitions,
				restDuration: exercise.restDuration, // Only use restDuration
			}));

			await AsyncStorage.setItem(
				"exercises",
				JSON.stringify(defaultExercises)
			);
			dispatch({ type: "resetInputs" });
			dispatch({ type: "setValue", payload: null });
			Alert.alert("Reset", "All values reset to default.");
		} catch (error) {
			Alert.alert("Error", "Failed to reset values.");
		}
	};

	return (
		<View style={styles.container}>
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={(open) => dispatch({ type: "setOpen", payload: open })}
				setValue={(callback) => {
					const newValue = callback(value);
					dispatch({ type: "setValue", payload: newValue });
				}}
				setItems={setItems}
				style={styles.dropdown}
				dropDownContainerStyle={styles.dropdownContainer}
				textStyle={styles.text}
				placeholder="Select an exercise"
			/>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Set Duration:</Text>
				<TextInput
					style={styles.input}
					value={duration}
					onChangeText={(text) =>
						dispatch({ type: "setDuration", payload: text })
					}
					keyboardType="numeric"
				/>
				<TouchableOpacity
					style={styles.button}
					onPress={() => saveExerciseData("duration")}
				>
					<Text style={styles.buttonText}>Save Duration</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Set Repetitions:</Text>
				<TextInput
					style={styles.input}
					value={repetitions}
					onChangeText={(text) =>
						dispatch({ type: "setRepetitions", payload: text })
					}
					keyboardType="numeric"
				/>
				<TouchableOpacity
					style={styles.button}
					onPress={() => saveExerciseData("repetitions")}
				>
					<Text style={styles.buttonText}>Save Repetitions</Text>
				</TouchableOpacity>
			</View>
			{/* Inside the component */}
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Set Rest Duration:</Text>
				<TextInput
					style={styles.input}
					value={restDuration} // Use restDuration
					onChangeText={
						(text) =>
							dispatch({ type: "setRestDuration", payload: text }) // Dispatch for restDuration
					}
					keyboardType="numeric"
				/>
				<TouchableOpacity
					style={styles.button}
					onPress={() => saveExerciseData("restDuration")}
				>
					<Text style={styles.buttonText}>Save Rest Duration</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={styles.resetButton}
				onPress={resetToDefault}
			>
				<Text style={styles.resetButtonText}>
					Reset All Exercises to Default
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 20,
		backgroundColor: "#f5f5f5",
	},
	dropdown: {
		backgroundColor: "white",
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 10,
	},
	dropdownContainer: {
		backgroundColor: "white",
		borderColor: "#ccc",
		borderRadius: 10,
	},
	text: {
		fontSize: 16,
		fontFamily: "Karla-Bold",
		color: "black",
	},
	inputContainer: {
		marginTop: 15,
	},
	label: {
		fontSize: 16,
		fontFamily: "Karla-Bold",
		marginBottom: 5,
		color: "#333",
	},
	input: {
		height: 45,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 15,
		backgroundColor: "white",
		marginBottom: 10,
	},
	button: {
		backgroundColor: "black",
		paddingVertical: 12,
		borderRadius: 10,
		marginTop: 10,
	},
	buttonText: {
		fontSize: 16,
		color: "white",
		textAlign: "center",
		fontFamily: "Karla-Bold",
	},
	resetButton: {
		backgroundColor: "#f44336",
		paddingVertical: 12,
		borderRadius: 10,
		marginTop: 20,
	},
	resetButtonText: {
		fontSize: 16,
		color: "white",
		textAlign: "center",
		fontFamily: "Karla-Bold",
	},
});
