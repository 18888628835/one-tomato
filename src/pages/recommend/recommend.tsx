import Taro, { getApp } from "@tarojs/taro";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { styled } from "linaria/react";
import recommendSong from "../../image/recommend/recommendSong.jpg";
import MyIcon from "../../components/custom_hooks/MyIcon";
import { request } from "../../utils/request";

const Wrapper = styled(View)`
  .recommend-header {
    position: relative;
  }
  .recommendJpg {
    width: 100%;
    height: 300rpx;
  }
  .date {
    width: 240rpx;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: white;
    font-size: 34rpx;
    font-weight: bold;
  }
  .recommend-container {
    padding: 0 20rpx;
    top: -30rpx;
    background-color: white;
    position: relative;
    border-radius: 40rpx;
    border-top: 1rpx solid transparent;
    .recommend-header {
      margin-top: 30rpx;
      display: flex;
      justify-content: space-between;
    }
    .recommend-list {
      height: calc(100vh - 340rpx);
      margin-top:20rpx;
      .recommend-song {
        display: flex;
        justify-content: space-between;
        margin-bottom:30rpx;
        Image {
          height: 80rpx;
          width: 80rpx;
        }
        .more-icon {
          font-size: 34rpx;
          width: 60rpx;
          text-align: center;
          line-height:80rpx;
        }
        .recommend-item{
          flex:1;
          display:flex;
          flex-direction:column;
          margin-left:20rpx;
          Text{
            line-height:40rpx;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
        }
      }
    }
  }
`;
const recommend = () => {
  const [recommendData, setRecommendData] = useState<any[]>([]);
  const getRecommendData = async () => {
    if (!Taro.getStorageSync("userInfo")) {
      Taro.showToast({
        title: "请先登录",
        success: () => {
          Taro.reLaunch({ url: "/pages/login/login" });
        },
      });
    }
    const res = await request("/recommend/songs");
    setRecommendData(res.recommend);
  };

  useEffect(() => {
    getRecommendData();
  }, []);
  return (
    <Wrapper>
      <View className="recommend-header">
        <Image className="recommendJpg" src={recommendSong} />
        <View className="date">
          <Text>{new Date().getMonth() + 1}月</Text>
          <Text>{new Date().getDate()}日</Text>
        </View>
      </View>
      <View className="recommend-container">
        <View className="recommend-header">
          <Text>播放全部</Text>
          <Text>多选</Text>
        </View>
        <ScrollView scrollY className="recommend-list">
          {recommendData.map((item, key) => {
            return (
              <View key={item.id} className="recommend-song">
                <Image src={item.album.picUrl} />
                <View
                  className="recommend-item"
                  onClick={() => {
                    let global = getApp().$app.globalData.recommend;
                    global.push(...recommendData);
                    Taro.navigateTo({
                      url: `/pages/song_detail/SongDetail?musicId=${item.id}&key=${key}`,
                    });
                  }}
                >
                  <Text>{item.name}</Text>
                  <Text>{item.artists[0].name}</Text>
                </View>
                <MyIcon
                  className="more-icon"
                  iconName="more"
                  onClick={() => {}}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Wrapper>
  );
};

export default recommend;
