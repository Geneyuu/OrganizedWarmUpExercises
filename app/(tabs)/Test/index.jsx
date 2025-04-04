import { View, Text } from "react-native";
import React, { useContext } from "react";
import { ExerciseContext } from "../../contexts/ExerciseContext"; // I-adjust ang path

const Index = () => {
	const { state } = useContext(ExerciseContext); // Access the state from context

	return (
		<View>
			<Text>Selected Exercise Value: {state.value}</Text>
			<Text>Duration: {state.duration}</Text>
			<Text>Repetitions: {state.repetitions}</Text>
			<Text>restDuration: {state.restDuration}</Text>
		</View>
	);
};

export default Index;
