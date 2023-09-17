import { Dialog, Portal } from "react-native-paper";

type CommonProps = {
  visible: boolean;
  children: React.JSX.Element[] | React.JSX.Element;
};

type ConditionalProps =
  | {
      dismissable?: false;
      onDismiss?: never;
    }
  | {
      dismissable: true;
      onDismiss: () => void;
    };

type BaseDialogProps = CommonProps & ConditionalProps;

const BaseDialog = (props: BaseDialogProps) => {
  return (
    <Portal>
      <Dialog
        visible={props.visible}
        dismissable={props.dismissable}
        onDismiss={props.onDismiss}
        style={{
          backgroundColor: "white",
          width: "50%",
          alignSelf: "center",
        }}
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
