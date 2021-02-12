import { Button, View, Text, Input } from "@tarojs/components";
import { styled } from "linaria/react";
import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { request } from "../../utils/request";

const Wrapper = styled(View)`
  position: relative;
  z-index: 90;
  padding-bottom: 40rpx;
  .left-top-sign {
    font-size: 120rpx;
    color: #f8f8f8;
    position: relative;
    left: -16rpx;
  }

  .welcome {
    position: relative;
    left: 50rpx;
    top: -90rpx;
    font-size: 46rpx;
    color: #555;
  }

  .input-content {
    padding: 0 60rpx;
  }
  .input-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 30rpx;
    background: #f8f6fc;
    height: 100rpx;
    border-radius: 4px;
    margin-bottom: 50rpx;
  }

  .input-item:last-child {
    margin-bottom: 0;
  }
  .input-item input {
    height: 30rpx;
    font-size: 30rpx;
    color: #303133;
    width: 100%;
  }
  .confirm-btn {
    width: 630rpx !important;
    height: 76rpx;
    line-height: 76rpx;
    border-radius: 50rpx;
    margin-top: 70rpx;
    background: #d43c33;
    color: #fff;
    font-size: 32rpx;
    padding: 0;
  }
  .confirm-btn2:after {
    border-radius: 100px;
  }

  .forget-section {
    font-size: 28rpx;
    color: #4399fc;
    text-align: center;
    margin-top: 40rpx;
  }

  .register-section {
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #606266;
    text-align: center;
  }
  .register-section text {
    color: #4399fc;
    margin-left: 10rpx;
  }
`;
const initialData = { phone: "", password: "" };
type Data = typeof initialData;
const login = () => {
  const [data, setData] = useState<Data>(initialData);
  const showToast = (message: string) => {
    Taro.showToast({ title: message, icon: "none" });
  };
  const handlerData = (params: Partial<Data>) => {
    setData({ ...data, ...params });
  };
  const loginSubmit = async () => {
    let reg = /^[1]([3-9])[0-9]{9}$/;
    if (!data.phone || !data.password) {
      showToast("手机号码或者密码不能为空");
      return;
    } else if (!reg.test(data.phone)) {
      showToast("手机号码格式不正确");
      return;
    }
    const res = await request("/login/cellphone", data);
    if (res.code === 200) {
      Taro.showToast({
        title: "登录成功",
        icon: "success",
        success: () => {
          Taro.setStorageSync("userInfo", JSON.stringify(res.profile));
          Taro.reLaunch({ url: "/pages/personal/personal" });
        },
      });
    } else {
      showToast(res.msg);
    }
  };
  return (
    <Wrapper>
      <View className="wrapper">
        <View className="left-top-sign">LOGIN</View>
        <View className="welcome">欢迎回来！</View>
        <View className="input-content">
          <View className="input-item">
            <Input
              type="text"
              placeholder="请输入手机号码"
              value={data.phone}
              onInput={(e: any) => {
                handlerData({ phone: e.detail.value });
              }}
            />
          </View>
          <View className="input-item">
            <Input
              type="password"
              placeholder="请输入密码"
              value={data.password}
              onInput={(e) => {
                handlerData({ password: e.detail.value });
              }}
            />
          </View>
        </View>
        <Button className="confirm-btn" onClick={loginSubmit}>
          登录
        </Button>
      </View>
      <View className="register-section">
        还没有账号?
        <Text>马上注册</Text>
      </View>
    </Wrapper>
  );
};
export default login;
