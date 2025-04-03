import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create Context
export const ProfileContext = createContext();

// Use default export for the ProfileProvider
const ProfileProvider = ({ children }) => {
	const [name, setName] = useState("Taguro");

	// Load name from AsyncStorage when app starts
	useEffect(() => {
		const loadName = async () => {
			try {
				const storedName = await AsyncStorage.getItem("userName");
				if (storedName) {
					setName(storedName);
				}
			} catch (error) {
				console.log("Error loading name:", error);
			}
		};

		loadName();
	}, []);

	// Update name and save to AsyncStorage
	const updateName = async (newName) => {
		try {
			await AsyncStorage.setItem("userName", newName);
			setName(newName);
		} catch (error) {
			console.log("Error updating name:", error);
		}
	};

	return (
		<ProfileContext.Provider value={{ name, updateName }}>
			{children}
		</ProfileContext.Provider>
	);
};

export default ProfileProvider; // Default export
