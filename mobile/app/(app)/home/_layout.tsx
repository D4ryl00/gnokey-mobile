import { colors } from "@/assets/styles/colors";
import Icons from "@/components/icons";
import { Tabs } from "expo-router";

type Group<T extends string> = `(${T})`;
export type SharedSegment = Group<"feed"> | Group<"search"> | Group<"profile">;

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <Icons.Home color={focused ? colors.icon.focus : colors.icon.default} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <Icons.Profile color={focused ? colors.icon.focus : colors.icon.default} />,
        }}
      />
    </Tabs>
  );
}
