import React, { createContext, useReducer, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import exercises from "../constants/exercises";

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {
		open: false,
		value: null,
		intensityOpen: false,
		intensity: "beginner",
		duration: "",
		repetitions: "",
		restDuration: "",
	});

	const {
		open,
		value,
		intensityOpen,
		intensity,
		duration,
		repetitions,
		restDuration,
	} = state;

	function reducer(state, action) {
		switch (action.type) {
			case "setOpen":
				return { ...state, open: action.payload };
			case "setValue":
				return { ...state, value: action.payload };
			case "setIntensityOpen":
				return { ...state, intensityOpen: action.payload };
			case "setIntensity":
				return { ...state, intensity: action.payload };
			case "setDuration":
				return { ...state, duration: action.payload };
			case "setRepetitions":
				return { ...state, repetitions: action.payload };
			case "setRestDuration":
				return { ...state, restDuration: action.payload };
			case "resetInputs":
				return {
					...state,
					duration: "",
					repetitions: "",
					restDuration: "",
				};
			case "loadExerciseData":
				return {
					...state,
					duration: action.payload.duration,
					repetitions: action.payload.repetitions,
					restDuration: action.payload.restDuration || "",
				};
			default:
				return state;
		}
	}

	const saveExerciseSetting = async (
		exerciseId,
		intensityLevel,
		value,
		field
	) => {
		try {
			if (!value || value.trim() === "") {
				Alert.alert("Error", `❌ ${field} cannot be empty!`);
				return false;
			}

			const parsedValue = parseInt(value);
			if (isNaN(parsedValue) || parsedValue <= 0) {
				Alert.alert("Error", `❌ ${field} must be a number > 0`);
				return false;
			}

			const storedExercises = await AsyncStorage.getItem("exercises");
			if (storedExercises) {
				const exercisesList = JSON.parse(storedExercises);
				const exerciseIndex = exercisesList.findIndex(
					(ex) => ex.id === exerciseId
				);

				if (exerciseIndex !== -1) {
					exercisesList[exerciseIndex].intensity[intensityLevel][
						field
					].min = parsedValue;
					await AsyncStorage.setItem(
						"exercises",
						JSON.stringify(exercisesList)
					);
					Alert.alert("Success", `✅ ${field} saved!`);
					return true;
				}
			}
			return false;
		} catch (error) {
			Alert.alert("Error", `Failed to save ${field}`);
			return false;
		}
	};

	useEffect(() => {
		const loadExercises = async () => {
			try {
				const storedExercises = await AsyncStorage.getItem("exercises");
				if (!storedExercises) {
					const defaultExercises = exercises.map((exercise) => ({
						id: exercise.id,
						intensity: {
							beginner: {
								duration: exercise.intensity.beginner.duration,
								repetitions:
									exercise.intensity.beginner.repetitions,
								restDuration:
									exercise.intensity.beginner.restDuration,
							},
							intermediate: {
								duration:
									exercise.intensity.intermediate.duration,
								repetitions:
									exercise.intensity.intermediate.repetitions,
								restDuration:
									exercise.intensity.intermediate
										.restDuration,
							},
							advanced: {
								duration: exercise.intensity.advanced.duration,
								repetitions:
									exercise.intensity.advanced.repetitions,
								restDuration:
									exercise.intensity.advanced.restDuration,
							},
						},
					}));
					await AsyncStorage.setItem(
						"exercises",
						JSON.stringify(defaultExercises)
					);
				}
			} catch (error) {
				Alert.alert("Error", "Failed to load exercises.");
			}
		};

		loadExercises();
	}, []);

	useEffect(() => {
		const updateExerciseData = async () => {
			if (value !== null && intensity) {
				try {
					const storedExercises = await AsyncStorage.getItem(
						"exercises"
					);
					if (storedExercises) {
						const exercisesList = JSON.parse(storedExercises);
						const selectedExercise = exercisesList.find(
							(ex) => ex.id === value
						);

						if (selectedExercise) {
							const intensityData =
								selectedExercise.intensity[intensity];
							if (intensityData) {
								dispatch({
									type: "loadExerciseData",
									payload: {
										duration: `${intensityData.duration.min}`,
										repetitions: `${intensityData.repetitions.min}`,
										restDuration: `${intensityData.restDuration.min}`,
									},
								});
							} else {
								Alert.alert(
									"Error",
									"Intensity data not found."
								);
							}
						}
					}
				} catch (error) {
					Alert.alert("Error", "Failed to load exercise data.");
				}
			} else {
				dispatch({ type: "resetInputs" });
			}
		};

		updateExerciseData();
	}, [value, intensity]);

	return (
		<ExerciseContext.Provider
			value={{
				state: {
					open,
					value,
					intensityOpen,
					intensity,
					duration,
					repetitions,
					restDuration,
				},
				dispatch,
				saveExerciseSetting,
			}}
		>
			{children}
		</ExerciseContext.Provider>
	);
};
