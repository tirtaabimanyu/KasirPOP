import { StyleSheet, View } from "react-native";
import {
  MD3Theme,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toNumber } from "../utils/formatUtils";

type CommonProps = {
  value: number;
  onPressDecrease: () => void;
  onPressIncrease: () => void;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  disabled?: boolean;
  setIsEditing?: (state: boolean) => void;
};

interface EditableProps extends CommonProps {
  editable: true;
  onChangeText: (value: number) => void;
}

interface NonEditableProps extends CommonProps {
  editable?: false;
}

type InputCounterProp = EditableProps | NonEditableProps;

const InputCounter = (props: InputCounterProp) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles(theme).container,
        props.disabled && styles(theme).disabled,
      ]}
    >
      <TouchableRipple
        borderless
        rippleColor={theme.colors.primaryContainer}
        disabled={props.disabled || props.disableDecrement}
        onPress={props.onPressDecrease}
        style={styles(theme).button}
      >
        <MaterialCommunityIcons
          name="minus"
          size={22}
          color={
            props.disabled || props.disableDecrement
              ? theme.colors.onSurfaceDisabled
              : theme.colors.onSurface
          }
        />
      </TouchableRipple>
      <TextInput
        dense
        disabled={props.disabled}
        editable={props.editable ? true : false}
        keyboardType="numeric"
        style={styles(theme).textInput}
        underlineColor="transparent"
        value={props.value.toString()}
        onChangeText={(value) =>
          props.editable && props.onChangeText(toNumber(value))
        }
        onFocus={() => props.setIsEditing && props.setIsEditing(true)}
        onBlur={() => props.setIsEditing && props.setIsEditing(false)}
      />
      <TouchableRipple
        borderless
        rippleColor={theme.colors.primaryContainer}
        disabled={props.disabled || props.disableIncrement}
        onPress={props.onPressIncrease}
        style={styles(theme).button}
      >
        <MaterialCommunityIcons
          name="plus"
          size={22}
          color={
            props.disabled || props.disableIncrement
              ? theme.colors.onSurfaceDisabled
              : theme.colors.onSurface
          }
        />
      </TouchableRipple>
    </View>
  );
};

export default InputCounter;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 100,
    },
    button: {
      borderRadius: 100,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    textInput: { textAlign: "center", backgroundColor: "transparent" },
    disabled: { backgroundColor: theme.colors.surfaceDisabled },
  });
