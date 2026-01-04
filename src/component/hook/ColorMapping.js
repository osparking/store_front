import { useEffect, useState } from "react";

const useColorMapping = () => {
  const [colors, setColors] = useState({});

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);

    setColors({
      백설공주: rootStyle.getPropertyValue("--color-snow-white"),
      보통비누: rootStyle.getPropertyValue("--color-normal-soap"),
      메주비누: rootStyle.getPropertyValue("--color-maejoo-soap"),
      default: rootStyle.getPropertyValue("--color-default"),
    });
  }, []);

  return colors;
};

export default useColorMapping;
