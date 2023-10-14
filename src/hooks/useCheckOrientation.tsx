import { Dimensions } from "react-native";
import { useEffect, useState } from "react";

export type LayoutOrientation = "landscape" | "portrait";

const useCheckOrientation = () => {
  const [orientation, setOrientation] = useState<LayoutOrientation>("portrait");

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", (e) => {
      const dim = e.screen;
      if (dim.width >= dim.height) {
        setOrientation("landscape");
      } else {
        setOrientation("portrait");
      }
    });
    return () => subscription.remove();
  }, []);

  return orientation;
};

export default useCheckOrientation;
