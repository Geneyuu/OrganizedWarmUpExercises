import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exercises } from "../constants/exercises";
import { Alert } from "react-native";

export const ExerciseContext = createContext();

const initialState = {
	exerciseOpen: false,
	exerciseValue: null,
	intensityOpen: false,
	intensityValue: "beginner",
	duration: "",
	repetitions: "",
	restDuration: "",
};

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_EXERCISE_OPEN":
			return { ...state, exerciseOpen: action.payload };
		case "SET_EXERCISE_VALUE":
			return { ...state, exerciseValue: action.payload };
		case "SET_INTENSITY_OPEN":
			return { ...state, intensityOpen: action.payload };
		case "SET_INTENSITY_VALUE":
			return { ...state, intensityValue: action.payload };
		case "SET_DURATION":
			return { ...state, duration: action.payload };
		case "SET_REPETITIONS":
			return { ...state, repetitions: action.payload };
		case "SET_REST_DURATION":
			return { ...state, restDuration: action.payload };
		case "RESET_INPUTS":
			return {
				...state,
				exerciseValue: null,
				duration: "",
				repetitions: "",
				restDuration: "",
			};
		case "SET_ALL_VALUES":
			return {
				...state,
				duration: action.payload.duration,
				repetitions: action.payload.repetitions,
				restDuration: action.payload.restDuration,
			};
		default:
			return state;
	}
};

export const ExerciseProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Load saved intensity when component mounts
	useEffect(() => {
		const loadIntensity = async () => {
			try {
				const savedIntensity = await AsyncStorage.getItem(
					"savedIntensity"
				);
				if (savedIntensity) {
					dispatch({
						type: "SET_INTENSITY_VALUE",
						payload: savedIntensity,
					});
				}
			} catch (error) {
				console.log("Error loading intensity:", error);
			}
		};

		loadIntensity();
	}, []);

	// Save intensity whenever it changes
	useEffect(() => {
		if (state.intensityValue) {
			AsyncStorage.setItem("savedIntensity", state.intensityValue);
		}
	}, [state.intensityValue]);

	// Load exercise data when needed
	useEffect(() => {
		const initializeData = async () => {
			try {
				const existing = await AsyncStorage.getItem("exerciseData");
				if (!existing) {
					const defaultExercises = exercises.map((exercise) => ({
						id: exercise.id,
						intensity: {
							beginner: exercise.intensity.beginner,
							intermediate: exercise.intensity.intermediate,
							advanced: exercise.intensity.advanced,
						},
					}));
					await AsyncStorage.setItem(
						"exerciseData",
						JSON.stringify(defaultExercises)
					);
				}
			} catch (error) {
				console.error("Failed to initialize exercise data:", error);
			}
		};

		initializeData();
	}, []);

	const loadSavedData = async (exerciseId, intensity) => {
		try {
			const savedData = await AsyncStorage.getItem("exerciseData");
			if (savedData) {
				const exercisesData = JSON.parse(savedData);
				const exerciseData = exercisesData.find(
					(ex) => ex.id === exerciseId
				);

				if (exerciseData && exerciseData.intensity[intensity]) {
					const intensityData = exerciseData.intensity[intensity];
					dispatch({
						type: "SET_ALL_VALUES",
						payload: {
							duration: intensityData.duration.min.toString(),
							repetitions:
								intensityData.repetitions.min.toString(),
							restDuration:
								intensityData.restDuration.min.toString(),
						},
					});
				}
			}
		} catch (error) {
			console.error("Failed to load exercise data:", error);
		}
	};

	const saveSettings = async (type, value) => {
		try {
			const { exerciseValue, intensityValue } = state;

			// Basic validation
			if (!exerciseValue || !intensityValue) {
				Alert.alert("Error", "Please select a WarmUp Exercise First");
				return false;
			}

			if (!value || value.trim() === "") {
				Alert.alert("Error", `${type} cannot be empty!`);
				return false;
			}

			const numericValue = parseInt(value);
			if (isNaN(numericValue)) {
				Alert.alert("Error", `${type} must be a valid number!`);
				return false;
			}

			// Get current exercise data for range validation
			const savedData = await AsyncStorage.getItem("exerciseData");
			if (!savedData) return false;

			const exercisesData = JSON.parse(savedData);
			const exerciseData = exercisesData.find(
				(ex) => ex.id === exerciseValue
			);
			if (!exerciseData) return false;

			const intensitySettings = exerciseData.intensity[intensityValue];
			const { min, max } = intensitySettings[type];

			// Range validation
			if (numericValue < min || numericValue > max) {
				Alert.alert(
					"Invalid Value",
					`${type} must be between ${min} and ${max}`
				);
				return false;
			}

			// Proceed with saving if validation passes
			const updatedIntensity = {
				...exerciseData.intensity[intensityValue],
				[type]: {
					...exerciseData.intensity[intensityValue][type],
					min: numericValue,
				},
			};

			exerciseData.intensity = {
				...exerciseData.intensity,
				[intensityValue]: updatedIntensity,
			};

			await AsyncStorage.setItem(
				"exerciseData",
				JSON.stringify(exercisesData)
			);

			Alert.alert(
				"Success",
				`${
					type.charAt(0).toUpperCase() + type.slice(1)
				} saved successfully!`
			);
			return true;
		} catch (error) {
			console.error("Failed to save settings:", error);
			Alert.alert("Error", "Failed to save settings");
			return false;
		}
	};

	const resetToDefault = async () => {
		try {
			// Reset UI state
			dispatch({ type: "SET_EXERCISE_VALUE", payload: null });
			dispatch({ type: "SET_DURATION", payload: "" });
			dispatch({ type: "SET_REPETITIONS", payload: "" });
			dispatch({ type: "SET_REST_DURATION", payload: "" });
			dispatch({ type: "SET_EXERCISE_OPEN", payload: false });
			dispatch({ type: "SET_INTENSITY_OPEN", payload: false });

			// Reset storage to original exercises
			const defaultExercises = exercises.map((exercise) => ({
				id: exercise.id,
				intensity: {
					beginner: exercise.intensity.beginner,
					intermediate: exercise.intensity.intermediate,
					advanced: exercise.intensity.advanced,
				},
			}));

			await AsyncStorage.setItem(
				"exerciseData",
				JSON.stringify(defaultExercises)
			);

			// Update context with default data
			dispatch({
				type: "SET_ALL_VALUES",
				payload: {
					duration: "",
					repetitions: "",
					restDuration: "",
				},
			});

			Alert.alert("Success", "All values reset to default!");
			return true;
		} catch (error) {
			console.error("Reset failed:", error);
			Alert.alert("Error", "Failed to reset values");
			return false;
		}
	};

	return (
		<ExerciseContext.Provider
			value={{
				state,
				dispatch,
				loadSavedData,
				saveSettings,
				resetToDefault,
			}}
		>
			{children}
		</ExerciseContext.Provider>
	);
};
