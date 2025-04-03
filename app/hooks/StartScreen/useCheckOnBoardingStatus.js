import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const useCheckOnboardingStatus = () => {
	const router = useRouter();

	useEffect(() => {
		const checkOnboardingStatus = async () => {
			try {
				const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

				if (hasOnboarded === "true") {
					console.log("Already onboarded, going to Home.");
					router.replace("/OnBoarding");
				} else {
					console.log("First time user, going to Onboarding.");
					router.replace("/OnBoarding");
				}
			} catch (error) {
				console.log("Error checking onboarding status:", error);
				// router.replace("/onboarding");
			}
		};

		const timeout = setTimeout(() => {
			checkOnboardingStatus();
		}, 6000);

		return () => clearTimeout(timeout);
	}, []);
};

export default useCheckOnboardingStatus;
