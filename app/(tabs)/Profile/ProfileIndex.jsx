import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
	StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import { ProfileContext } from "../../contexts/ProfileContext"; // Adjust path
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ProfileIndex = () => {
	const router = useRouter();
	const { name, updateName } = useContext(ProfileContext);
	const [newName, setNewName] = useState(name);
	const [errorMessage, setErrorMessage] = useState(""); // Initialize state
	const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
	const [modalMessage, setModalMessage] = useState(""); // State for modal message

	const handleSave = () => {
		// If the new name is empty, use the current name
		const nameToSave = newName.trim() === "" ? name : newName;

		if (nameToSave.trim().length > 10) {
			setErrorMessage("Maximum of 10 characters allowed.");
		} else {
			setErrorMessage("");
			updateName(nameToSave);

			// Show the modal with success message
			setModalMessage(`You set your name to: \n${nameToSave}!`);
			setIsModalVisible(true);
			setNewName("");
		}
	};

	// Function to close the modal when "OK" button is pressed
	const closeModal = () => {
		setIsModalVisible(false);
		router.replace("/home"); // Navigate to home after modal is closed
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={styles.container}>
				<Text style={styles.label}>Profile</Text>

				{/* Current Name Display */}
				<View style={styles.currentNameContainer}>
					<Text style={styles.currentName}>Current Name:</Text>
					<Text style={styles.currentNameValue}>{name}</Text>
				</View>

				{/* New Name Label */}
				<Text style={styles.newNameLabel}>New Name:</Text>

				<TextInput
					style={[
						styles.input,
						errorMessage ? styles.inputError : null,
					]}
					value={newName}
					onChangeText={(text) => {
						setNewName(text);
						if (text.length > 10) {
							setErrorMessage(
								"Maximum of 10 characters allowed."
							);
						} else {
							setErrorMessage("");
						}
					}}
					placeholder="Set your new Nickname"
					placeholderTextColor="#999"
				/>
				{errorMessage ? (
					<Text style={styles.errorText}>{errorMessage}</Text>
				) : null}

				<TouchableOpacity style={styles.button} onPress={handleSave}>
					<Text style={styles.buttonText}>Save Profile</Text>
				</TouchableOpacity>

				{/* Custom Modal (Alert Style) */}
				<Modal
					visible={isModalVisible}
					transparent={true}
					animationType="fade"
					onRequestClose={() => setIsModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							{/* Notification Icon */}
							<Ionicons
								name="checkmark-circle-sharp"
								size={30}
								color="#000"
								style={styles.notificationIcon}
							/>

							<Text style={styles.modalTitle}>Name Updated</Text>
							<Text style={styles.modalText}>{modalMessage}</Text>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={closeModal} // Close the modal
							>
								<Text style={styles.modalButtonText}>OK</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		paddingHorizontal: wp(5), // Responsive padding
		paddingBottom: wp(20),
	},

	label: {
		fontSize: hp(4),
		color: "#000",
		fontFamily: "Roboto-ExtraBold",
		marginBottom: hp(2),
	},

	currentNameContainer: {
		width: "100%",
		alignSelf: "flex-start",
		marginBottom: hp(1),
	},

	currentName: {
		fontSize: hp(2),
		color: "#666",
		fontFamily: "Roboto-ExtraBold",
	},

	currentNameValue: {
		color: "#000",
		fontSize: hp(2),
		fontFamily: "Roboto-ExtraBold",
	},

	newNameLabel: {
		fontSize: hp(2),
		color: "#666",
		fontFamily: "Roboto-SemiBold",
		marginBottom: hp(0.5),
		marginTop: 10,
		alignSelf: "flex-start",
	},

	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		color: "#000",
		padding: hp(2),
		borderRadius: wp(3),
		marginBottom: hp(1.5),
		fontSize: hp(2),
		fontFamily: "Roboto-SemiBold",
	},

	inputError: {
		borderColor: "red",
	},

	errorText: {
		color: "red",
		marginBottom: hp(1),
		fontFamily: "Karla-Regular",
		fontSize: hp(1.8),
	},

	button: {
		backgroundColor: "#000",
		paddingVertical: hp(2),
		paddingHorizontal: wp(8),
		borderRadius: wp(3),
		width: "100%",
		alignItems: "center",
	},

	buttonText: {
		color: "#fff",
		fontSize: hp(2.2),
		fontFamily: "Roboto-ExtraBold",
	},

	// Modal styles
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},

	modalContainer: {
		backgroundColor: "#fff",
		paddingVertical: hp(5),
		paddingHorizontal: wp(10),
		borderRadius: wp(4),
		width: wp(70),
		alignItems: "center",
		elevation: 5, // For shadow on Android
	},

	modalTitle: {
		fontSize: hp(2.5),
		color: "#000",
		fontFamily: "Roboto-SemiBold",
		marginBottom: hp(1),
	},

	modalText: {
		fontSize: hp(2),
		color: "#000",
		fontFamily: "Karla-Regular",
		marginBottom: hp(2),
		textAlign: "center",
	},

	modalButton: {
		backgroundColor: "#000",
		paddingVertical: hp(1),
		paddingHorizontal: wp(10),
		borderRadius: wp(3),
		width: "auto",
		alignItems: "center",
	},

	modalButtonText: {
		color: "#fff",
		fontSize: hp(2),
		fontFamily: "Karla-Regular",
	},

	notificationIcon: {
		marginBottom: hp(1), // Space between icon and title
	},
});

export default ProfileIndex;
