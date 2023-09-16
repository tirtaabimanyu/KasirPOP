import { Dialog, Portal } from "react-native-paper";

type BaseDialogProps = {
  visible: boolean;
  dismissable?: boolean;
  onDismiss: () => void;
  children: React.JSX.Element[];
};

const BaseDialog = ({
  visible,
  onDismiss,
  children,
  dismissable = true,
}: BaseDialogProps) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={dismissable}
        onDismiss={onDismiss}
        style={{
          backgroundColor: "white",
          width: "50%",
          alignSelf: "center",
        }}
      >
        {children}
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
