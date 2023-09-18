import { useState } from "react";

type useDialogReturnType = [boolean, () => void, () => void];
const useDialog = (): useDialogReturnType => {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return [visible, show, hide];
};

export default useDialog;
