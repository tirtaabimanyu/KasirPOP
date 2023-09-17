import { Portal, Snackbar } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/typedStore";
import { hideSnackbar } from "../redux/slices/layoutSlice";

const GlobalSnackbar = () => {
  const { visible, message, duration } = useAppSelector(
    (state) => state.layout.snackbar
  );
  const dispatch = useAppDispatch();
  const dismiss = () => dispatch(hideSnackbar());

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={dismiss}
        wrapperStyle={{ width: "30%", alignSelf: "flex-end" }}
        duration={duration}
        action={{ label: "Tutup", onPress: dismiss }}
      >
        {message}
      </Snackbar>
    </Portal>
  );
};

export default GlobalSnackbar;
