import { View, Text, Modal, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ProfileModal = ({ isVisible, message, onClose }) => {
	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="fade"
			onRequestClose={onClose}
		>
			{/* Adjusting the StatusBar style */}
			<StatusBar
				barStyle="light-content"
				style={{}}
				backgroundColor="rgba(0, 0, 0, 0.6)"
			/>

			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<Ionicons
						name="checkmark-circle-sharp"
						size={40}
						color="#000"
						style={styles.notificationIcon}
					/>

					<Text style={styles.modalTitle}>Your Name Updated!</Text>
					<Text style={styles.modalText}>{message}</Text>

					<TouchableOpacity
						style={styles.modalButton}
						onPress={onClose}
					>
						<Text style={styles.modalButtonText}>OK</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = {
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
	},
	modalContainer: {
		backgroundColor: "white",
		paddingVertical: hp(4),
		paddingHorizontal: wp(0),
		borderRadius: wp(5),
		width: wp(60),
		alignItems: "center",
		elevation: 5,
	},
	modalTitle: {
		fontSize: hp(2.5),
		color: "#000",
		fontFamily: "Karla-Bold",
		letterSpacing: -0.5,
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
		backgroundColor: "white",
		paddingVertical: hp(1),
		paddingHorizontal: wp(15),
		borderRadius: wp(3),
		width: "auto",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#000",
	},
	modalButtonText: {
		color: "black",
		fontSize: hp(2),
		fontFamily: "Karla-Regular",
	},
	notificationIcon: {
		marginBottom: hp(1),
	},
};

export default ProfileModal;
