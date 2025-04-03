import React, { useState } from "react";
import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const TabIcon = ({ name, focused, color, icon }) => {
	return (
		<View style={styles.iconWrapper}>
			{focused && <View style={styles.focusedBorder} />}
			<Ionicons
				name={icon}
				size={hp(3)}
				color={focused ? "#161616" : color}
			/>
		</View>
	);
};

const Layout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: true,
				tabBarActiveTintColor: "#161616",
				tabBarInactiveTintColor: "#161616",
				tabBarStyle: {
					backgroundColor: "#fff",
					borderTopColor: "#232522",
					elevation: 0,
					height: hp(10), // 82 -> hp(10)
					borderTopWidth: 1,
					paddingTop: hp(1.5), // 12 -> hp(1.5)
					// paddingBottom: hp(0.6), // 5 -> hp(0.6)
					paddingHorizontal: wp(5), // 20 -> wp(5)
				},
				tabBarLabelStyle: {
					fontFamily: "Karla-Regular",
					fontSize: hp(1.5), // 12 -> hp(1.5)
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					headerShown: false,
					tabBarLabel: "Home",
					tabBarIcon: ({ color, size, focused }) => (
						<TabIcon
							icon={
								focused
									? "basketball-sharp"
									: "basketball-outline"
							}
							color={color}
							focused={focused}
						/>
					),
				}}
			/>
			{/* 
			<Tabs.Screen
				name="Search"
				options={{
					headerShown: false,
					tabBarLabel: "Exercises",
					tabBarIcon: ({ color, size, focused }) => (
						<TabIcon
							icon={focused ? "barbell-sharp" : "barbell-outline"}
							color={color}
							name="Exercises"
							focused={focused}
						/>
					),
				}}
			/> */}

			<Tabs.Screen
				name="Profile"
				options={{
					headerShown: false,
					tabBarLabel: "Profile",
					tabBarIcon: ({ color, size, focused }) => (
						<TabIcon
							icon={focused ? "person" : "person-outline"}
							color={color}
							name="Profile"
							focused={focused}
						/>
					),
				}}
			/>

			{/* <Tabs.Screen
				name="Settings"
				options={{
					headerShown: false,
					tabBarLabel: "Settings",
					tabBarIcon: ({ color, size, focused }) => (
						<TabIcon
							icon={focused ? "settings" : "settings-outline"}
							color={color}
							name="Settings"
							focused={focused}
						/>
					),
				}}
			/> */}
		</Tabs>
	);
};

export default Layout;

const styles = StyleSheet.create({
	iconWrapper: {
		alignItems: "center",
		justifyContent: "center",
		width: wp(16), // 60 -> wp(16)
		paddingTop: hp(0), // 0 -> hp(0)
	},
	focusedBorder: {
		width: "100%",
		height: hp(0.6), // 5 -> hp(0.6)
		backgroundColor: "#161616",
		position: "absolute",
		top: -19, // -19 -> hp(-2.3)
	},
});
