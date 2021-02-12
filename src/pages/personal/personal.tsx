import React, { useEffect, useState } from "react";
import { styled } from "linaria/react";
import Taro from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import missingFace from "../../image/personal/missing-face.png";
import bg2 from "../../image/personal/bg_img2.jpg";
import { request } from "../../utils/request";

const Wrapper = styled(View)`
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
  position: relative;
  .bg-img {
    width: 100%;
  }
  .info {
    position: absolute;
    width: 80%;
    display: flex;
    align-items: center;
    left: 20rpx;
    top: 100rpx;
  }
  .face-container {
    width: 136rpx;
    height: 136rpx;
    background-color: white;
    border-radius: 50%;
    left: 30rpx;
    top: 100rpx;
    margin-right: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 128rpx;
      height: 128rpx;
      border-radius: 50%;
    }
  }
  /* 最近播放 */
  .recentPlayContainer {
    background-color: #ffffff;
    width: 90%;
    margin: 50rpx auto 0;
    padding: 30rpx;
  }
  .recentScroll {
    display: flex;
    max-height: 200rpx;
  }
  .recentItem {
    margin: 30rpx;
    margin-left: 0;
  }
  .recentPlayNone {
    text-align: center;
    line-height: 100rpx;
    color: #3333;
  }
  .recentItem image {
    max-width: 200rpx;
    max-height: 200rpx;
    border-radius: 10rpx;
  }
  .listItem {
    padding: 20rpx 0;
    border-bottom: 1px solid #3333;
  }
`;

const personal = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [songList, setSongList] = useState<any[]>([]);
  useEffect(() => {
    const user = Taro.getStorageSync("userInfo");
    if (user) {
      setUserInfo(JSON.parse(user));
      request("/user/record", {
        uid: JSON.parse(user).userId,
        type: 0,
      }).then((res) => {
        const list = res.allData.slice(0, 10).map((d, key: number) => {
          d.id = key;
          return d;
        });
        setSongList(list);
      });
    }
  }, []);
  return (
    <Wrapper>
      <View>
        <Image className="bg-img" src={bg2} />
        <View
          className="info"
          onClick={() => {
            Taro.navigateTo({ url: "/pages/login/login" });
          }}
        >
          <View className="face-container">
            <Image
              className="missing-face"
              src={userInfo.avatarUrl ? userInfo.avatarUrl : missingFace}
            />
          </View>
          <Text>{userInfo.nickname ? userInfo.nickname : "游客"}</Text>
        </View>
      </View>
      <View className="recentPlayContainer">
        <Text className="title">最近播放</Text>
        <ScrollView
          scroll-x
          className="recentScroll"
          enable-flex
          style={{ height: songList.length === 0 ? "100rpx" : "200rpx" }}
        >
          {songList.length === 0 ? (
            <View className="recentPlayNone">无播放记录</View>
          ) : (
            songList.map((song, index) => {
              return (
                <View key={song.id} className="recentItem">
                  <Image src={song.song.al.picUrl} />
                </View>
              );
            })
          )}
        </ScrollView>
        {["我的音乐", "我的收藏", "我的电台", "我的信息"].map((item) => {
          return <View className="listItem">{item}</View>;
        })}
      </View>
    </Wrapper>
  );
};
export default personal;
