import { View, Text } from "@tarojs/components";
import React, { FC } from "react";
interface propsType {
  iconName: string;
  onClick?: () => void;
  className?: string;
}
const MyIcon: FC<propsType> = (props) => {
  return (
    <View
      className={props.className}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <Text
        style={{ fontSize: "inherit" }}
        className={`iconfont icon-${props.iconName}`}
      ></Text>
      <Text>{props.children}</Text>
    </View>
  );
};
export default MyIcon;
