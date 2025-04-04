import React, { createContext, useReducer, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import exercises from "../constants/exercises";

const ACTIONS = {
	SET_OPEN: "setOpen",
	SET_VALUE: "setValue",
	SET_DURATION: "setDuration",
	SET_REPETITIONS: "setRepetitions",
	SET_REST_DURATION: "setRestDuration",
	RESET_INPUTS: "resetInputs",
	LOAD_EXERCISE_DATA: "loadExerciseData",
};

// Reducer function
function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.SET_OPEN:
			return { ...state, open: action.payload };
		case ACTIONS.SET_VALUE:
			return { ...state, value: action.payload };
		case ACTIONS.SET_DURATION:
			return { ...state, duration: action.payload };
		case ACTIONS.SET_REPETITIONS:
			return { ...state, repetitions: action.payload };
		case ACTIONS.SET_REST_DURATION:
			return { ...state, restDuration: action.payload };
		case ACTIONS.RESET_INPUTS:
			return {
				...state,
				duration: "",
				repetitions: "",
				restDuration: "",
			};
		case ACTIONS.LOAD_EXERCISE_DATA:
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
// Create context
export const ExerciseContext = createContext();

// Provider component
export const ExerciseProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {
		open: false,
		value: null,
		duration: "",
		repetitions: "",
		restDuration: "",
	});

	// Load exercise data from AsyncStorage when component mounts
	useEffect(() => {
		const loadExercises = async () => {
			try {
				const storedExercises = await AsyncStorage.getItem("exercises");
				if (!storedExercises) {
					// Ensure restDuration is part of each exercise
					const defaultExercises = exercises.map((exercise) => ({
						id: exercise.id,
						duration: exercise.duration,
						repetitions: exercise.repetitions,
						restDuration: exercise.restDuration || "",
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

	// Update selected exercise data on value change
	useEffect(() => {
		const updateExerciseData = async () => {
			if (state.value !== null) {
				try {
					const storedExercises = await AsyncStorage.getItem(
						"exercises"
					);
					if (storedExercises) {
						const exercisesList = JSON.parse(storedExercises);
						const selectedExercise = exercisesList.find(
							(ex) => ex.id === state.value
						);
						if (selectedExercise) {
							dispatch({
								type: ACTIONS.LOAD_EXERCISE_DATA,
								payload: {
									duration:
										selectedExercise.duration?.toString() ||
										"",
									repetitions:
										selectedExercise.repetitions?.toString() ||
										"",
									restDuration:
										selectedExercise.restDuration?.toString() ||
										"",
								},
							});
						}
					}
				} catch (error) {
					Alert.alert("Error", "Failed to load exercise data.");
				}
			} else {
				dispatch({ type: ACTIONS.RESET_INPUTS });
			}
		};

		updateExerciseData();
	}, [state.value]);

	return (
		<ExerciseContext.Provider value={{ state, dispatch }}>
			{children}
		</ExerciseContext.Provider>
	);
};

export default ExerciseProvider;
