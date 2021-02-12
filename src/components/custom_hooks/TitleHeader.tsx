import React, { FC } from "react";
import { View, Text } from "@tarojs/components";
import { styled } from "linaria/react";

const Wrapper = styled(View)`
  .custom-title {
    color: #666666;
    font-size: 23rpx;
  }
  .header {
    display: flex;
    justify-content: space-between;
    > Text:nth-child(2) {
      border: 1rpx solid black;
      padding: 10rpx;
      border-radius: 20rpx;
      font-size: 20rpx;
      color: #666666;
    }
  }
`;
interface propsType {
  title: string;
  text: string;
}
const TitleHeader: FC<propsType> = (props) => {
  return (
    <Wrapper>
      <Text className="custom-title">{props.title}</Text>
      <View className="header">
        <Text>{props.text}</Text>
        <Text>查看更多</Text>
      </View>
    </Wrapper>
  );
};
export default TitleHeader;
