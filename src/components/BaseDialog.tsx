import { StyleProp, ViewStyle } from "react-native";
import { Dialog, Portal } from "react-native-paper";

type CommonProps = {
  visible: boolean;
  children: React.JSX.Element[] | React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  transparent?: boolean;
};

interface DismissableDialog extends CommonProps {
  dismissable: true;
  onDismiss: () => void;
}

interface NonDismissableDialog extends CommonProps {
  dismissable?: false;
  onDismiss?: never;
}

type BaseDialogProps = DismissableDialog | NonDismissableDialog;

const BaseDialog = (props: BaseDialogProps) => {
  return (
    <Portal>
      <Dialog
        {...(props.transparent
          ? {
              theme: {
                colors: {
                  backdrop: "transparent",
                },
              },
            }
          : {})}
        visible={props.visible}
        style={[
          {
            backgroundColor: "white",
            width: "50%",
            alignSelf: "center",
          },
          props.style,
        ]}
        {...(props.dismissable
          ? {
              dismissable: props.dismissable,
              onDismiss: props.onDismiss,
            }
          : { dismissable: props.dismissable || false })}
      >
        {props.children}
      </Dialog>
    </Portal>
  );
};

BaseDialog.Content = Dialog.Content;
BaseDialog.Actions = Dialog.Actions;
BaseDialog.Title = Dialog.Title;
BaseDialog.ScrollArea = Dialog.ScrollArea;
BaseDialog.Icon = Dialog.Icon;

export default BaseDialog;
