import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import React, { useContext, useState } from "react";
import { ProfileContext } from "../../contexts/ProfileContext";
import { useRouter } from "expo-router";
import ProfileModal from "./components/ProfileModal";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ProfileIndex = () => {
	const router = useRouter();
	const { name, updateName } = useContext(ProfileContext);
	const [newName, setNewName] = useState(name);
	const [errorMessage, setErrorMessage] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");

	const handleSave = () => {
		const nameToSave = newName.trim() === "" ? name : newName;

		if (nameToSave.length > 10) {
			setErrorMessage("Maximum of 10 characters allowed.");
		} else {
			setErrorMessage("");
			updateName(nameToSave);
			setModalMessage(`You set your name to: \n \n${nameToSave}!`);
			setIsModalVisible(true);
			// setNewName("");
		}
	};

	const closeModal = () => {
		setIsModalVisible(false);
		router.replace("/home");
	};

	return (
		<TouchableWithoutFeedback>
			{/* onPress={() => Keyboard.dismiss()} */}
			<View style={styles.container}>
				<Text style={styles.label}>Profile</Text>

				<View style={styles.currentNameContainer}>
					<Text style={styles.currentName}>Current Name:</Text>
					<Text style={styles.currentNameValue}>{name}</Text>
				</View>

				<Text style={styles.newNameLabel}>New Name:</Text>

				<TextInput
					style={[
						styles.input,
						errorMessage ? styles.inputError : null,
					]}
					value={newName}
					onChangeText={(text) => {
						setNewName(text);
						setErrorMessage(
							text.length > 10
								? "Maximum of 10 characters allowed."
								: ""
						);
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

				{/* Reusable Modal Component */}
				<ProfileModal
					isVisible={isModalVisible}
					message={modalMessage}
					onClose={closeModal}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = {
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		paddingHorizontal: wp(5),
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
};

export default ProfileIndex;
