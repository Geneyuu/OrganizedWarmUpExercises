import { useState, useEffect } from "react";
import * as Font from "expo-font";

const useLoadFonts = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		const loadFonts = async () => {
			try {
				console.log("Loading fonts...");
				await Font.loadAsync({
					"Karla-Regular": require("./../../../assets/fonts/Karla-Regular.ttf"),
					"Karla-Bold": require("./../../../assets/fonts/Karla-Bold.ttf"),
					"Karla-SemiBold": require("./../../../assets/fonts/Karla-SemiBold.ttf"),
					"Karla-BoldItalic": require("./../../../assets/fonts/Karla-BoldItalic.ttf"),
					"Karla-ExtraBold": require("./../../../assets/fonts/Karla-ExtraBold.ttf"),
					"Karla-ExtraBoldItalic": require("./../../../assets/fonts/Karla-ExtraBoldItalic.ttf"),
					"Karla-ExtraLight": require("./../../../assets/fonts/Karla-ExtraLight.ttf"),
					"Karla-ExtraLightItalic": require("./../../../assets/fonts/Karla-ExtraLightItalic.ttf"),
					"Karla-Italic": require("./../../../assets/fonts/Karla-Italic.ttf"),
					"Karla-Light": require("./../../../assets/fonts/Karla-Light.ttf"),
					"Karla-LightItalic": require("./../../../assets/fonts/Karla-LightItalic.ttf"),
					"Karla-Medium": require("./../../../assets/fonts/Karla-Medium.ttf"),
					"Karla-MediumItalic": require("./../../../assets/fonts/Karla-MediumItalic.ttf"),
					"Karla-SemiBoldItalic": require("./../../../assets/fonts/Karla-SemiBoldItalic.ttf"),
					"Oswald-Bold": require("./../../../assets/fonts/Oswald-Bold.ttf"),
					"Oswald-Regular": require("./../../../assets/fonts/Oswald-Regular.ttf"),
					"Roboto-Regular": require("./../../../assets/fonts/Roboto-Regular.ttf"),
					"Roboto-SemiBold": require("./../../../assets/fonts/Roboto-SemiBold.ttf"),
					"Roboto-ExtraBold": require("./../../../assets/fonts/Roboto-ExtraBold.ttf"),
				});
				setFontsLoaded(true);
				console.log("Fonts loaded successfully.");
			} catch (error) {
				console.error("Error loading fonts:", error);
			}
		};

		loadFonts();
	}, []);

	return fontsLoaded;
};

export default useLoadFonts;
