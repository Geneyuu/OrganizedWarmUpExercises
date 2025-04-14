// Helper function to get dropdown items for exercises
export const getExerciseItems = (exercises) => [
	{ label: "Select an Exercise...", value: null },
	...exercises.map((exercise) => ({
		label: exercise.name,
		value: exercise.id,
	})),
];

// Intensity options for dropdown
export const intensityItems = [
	{ label: "Beginner", value: "beginner" },
	{ label: "Intermediate", value: "intermediate" },
	{ label: "Advanced", value: "advanced" },
];

// Input validation function
export const validateInput = (
	exerciseValue,
	intensityValue,
	exercises,
	type,
	value
) => {
	if (!exerciseValue || !intensityValue) return false; // Don't show error when no exercise selected
	if (value === "") return false; // Allow empty values

	if (!/^\d+$/.test(value)) return true;

	const numValue = parseInt(value, 10);
	if (isNaN(numValue)) return true;

	const originalExercise = exercises.find((ex) => ex.id === exerciseValue);
	if (!originalExercise) return true;

	const originalIntensityData = originalExercise.intensity[intensityValue];
	if (!originalIntensityData) return true;

	const { min, max } = originalIntensityData[type];
	return numValue < min || numValue > max;
};
// Get recommended range text
export const getRecommendedRange = (
	exerciseValue,
	intensityValue,
	exercises,
	type
) => {
	if (!exerciseValue || !intensityValue) return "N/A";

	const originalExercise = exercises.find((ex) => ex.id === exerciseValue);
	if (!originalExercise) return "N/A";

	const originalIntensityData = originalExercise.intensity[intensityValue];
	if (!originalIntensityData) return "N/A";

	const range = originalIntensityData[type];
	return type === "repetitions"
		? `${range.min}-${range.max} reps`
		: `${range.min}-${range.max} seconds`;
};

// Get initial input values
export const getInitialValues = (exerciseValue, intensityValue, exercises) => {
	if (!exerciseValue || !intensityValue) {
		return {
			duration: "",
			repetitions: "",
			restDuration: "",
		};
	}

	const exercise = exercises.find((ex) => ex.id === exerciseValue);
	if (!exercise)
		return {
			duration: "",
			repetitions: "",
			restDuration: "",
		};

	const intensity = exercise.intensity[intensityValue];
	return {
		duration: intensity.duration.min.toString(),
		repetitions: intensity.repetitions.min.toString(),
		restDuration: intensity.restDuration.min.toString(),
	};
};
