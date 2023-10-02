import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  Platform,
  Pressable,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TextInput } from "react-native-paper";
import moment from "moment";
import useDialog from "../hooks/useDialog";
import BaseDialog from "./BaseDialog";

type InputDatePickerProps = {
  setDate: (d: Date) => void;
  date: Date;
  label?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: boolean;
};

const InputDatePicker = (props: InputDatePickerProps) => {
  const [show, setShow, hideShow] = useDialog();
  const showDatePicker =
    Platform.OS == "ios" || (Platform.OS == "android" && show);

  const onChange = (
    e: DateTimePickerEvent,
    selectedDate: Date = new Date()
  ) => {
    hideShow();
    props.setDate(selectedDate);
  };

  return (
    <View style={props.style}>
      <Pressable onPress={() => setShow()}>
        <TextInput
          mode="outlined"
          label={props.label}
          value={props.date && moment(props.date).format("DD MMM YYYY")}
          editable={false}
          error={props.error}
          style={[{ backgroundColor: "transparent" }, props.inputStyle]}
          pointerEvents="none"
        />
      </Pressable>
      {Platform.OS == "ios" ? (
        <BaseDialog
          visible={show}
          dismissable
          onDismiss={hideShow}
          style={{
            width: 450,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.25,
            shadowRadius: 16.0,
            elevation: 24,
          }}
        >
          <BaseDialog.Content>
            <DateTimePicker
              testID="dateTimePicker"
              value={props.date}
              mode={"date"}
              onChange={onChange}
              display={"inline"}
            />
          </BaseDialog.Content>
        </BaseDialog>
      ) : (
        show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={props.date}
            mode={"date"}
            onChange={onChange}
            display={"default"}
          />
        )
      )}
    </View>
  );
};

export default InputDatePicker;
