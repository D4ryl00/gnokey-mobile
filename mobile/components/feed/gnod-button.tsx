import { StyleProp, TextStyle, TouchableOpacity } from "react-native";
import Text from "../text";
import Icons from "../icons";
import { colors } from "@/assets/styles/colors";

interface Props {
  style?: StyleProp<TextStyle> | undefined;
  onPressRepost?: () => void;
}

function GnodButton({ style, onPressRepost }: Props) {
  return (
    <TouchableOpacity
      onPress={onPressRepost}
      style={[style, { flexDirection: "row", paddingHorizontal: 12, alignItems: "center" }]}
    >
      <Icons.Gnod color={colors.text.secondary} style={{ marginRight: 4 }} />
      <Text.Caption1 style={{ color: colors.text.secondary }}>Gnod</Text.Caption1>
    </TouchableOpacity>
  );
}

export default GnodButton;
