import { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import moment from "moment";

type InputDatePickerProps = {
  setDate: (d: Date) => void;
  date: Date;
  label?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: boolean;
};

const InputDatePicker = (props: InputDatePickerProps) => {
  const [show, setShow] = useState(false);

  const onChange = (
    e: DateTimePickerEvent,
    selectedDate: Date = new Date()
  ) => {
    setShow(false);
    props.setDate(selectedDate);
  };

  return (
    <View style={props.style}>
      <Pressable onPress={() => setShow(true)}>
        <TextInput
          mode="outlined"
          label={props.label}
          value={props.date && moment(props.date).format("DD MMM YYYY")}
          editable={false}
          error={props.error}
          style={[{ backgroundColor: "transparent" }, props.inputStyle]}
        />
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={props.date}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default InputDatePicker;
