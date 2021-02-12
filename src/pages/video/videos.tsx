import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Video, ScrollView } from "@tarojs/components";
import { styled } from "linaria/react";
import { request } from "../../utils/request";
import videoLogo from "../../image/video/video.jpg";
import logo from "../../image/video/logo.png";
import Taro, { getStorageSync } from "@tarojs/taro";

const Wrapper = styled(View)`
  .search-container {
    height: 80rpx;
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    image {
      height: 60rpx;
      width: 60rpx;
    }
    .search {
      flex: 1;
      margin: 0 20rpx;
      text-align: center;
      border: 1px solid #3333;
      color: #d43c33;
      line-height: 60rpx;
    }
  }
  .scroll {
    .scroll-view {
      display: flex;
      height: 68rpx;
      .container {
        padding: 0 30rpx;
      }
      .item {
        line-height: 67rpx;
        white-space: nowrap;
      }
      .active {
        border-bottom: 1rpx solid #d43c33;
      }
    }
  }
  .videoList {
    margin-top: 10rpx;
    height: calc(100vh-155rpx);
    .videoItem video,
    Image {
      width: 100%;
      height: 360rpx;
      border-radius: 10rpx;
    }
    .videoItem {
      height: calc(100vh - 155rpx); //减法符号两边留空格
      box-sizing: border-box;
      padding: 3%;
    }
    .title {
      font-size: 28rpx;
      border-bottom: 1rpx solid #3333;
      padding-bottom: 20rpx;
    }
    .nickname {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 60rpx;
      margin-bottom: 30rpx;
      font-size: 30rpx;
      border-bottom: 1rpx solid #3333;
      > image {
        height: 60rpx;
        width: 60rpx;
        border-bottom: 0;
        margin-right: 30rpx;
      }
    }
  }
`;
const Videos = () => {
  let [showVideoId, setShowVideoId] = useState<number>(0);
  const [selected, setSelected] = useState(0);
  const [videoListData, setVideoListData] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);
  const userInfo = getStorageSync("userInfo");
  const [currentId, setCurrentId] = useState(0);
  const video: any = useRef([]);
  const [triggered, setTriggered] = useState(true);
  const getVideoList = async (params: any[], key: number) => {
    Taro.showLoading({ title: "加载中，请稍候" });
    try {
      const response = await request("/video/group", {
        id: params[key].id,
      });
      if (response.code === 200) {
        setVideoList(response.datas);
      }
    } catch (error) {
      console.error(error);
    }
    setTriggered(true);
    Taro.hideLoading();
  };
  useEffect(() => {
    request("/video/group/list").then(
      (res) => {
        const list: any[] = res.data.slice(0, 20);
        setVideoListData(list);
        getVideoList(list, selected);
      },
      (error) => {
        throw new Error(error);
      }
    );
  }, []);
  return (
    <Wrapper>
      <View className="nav-header">
        <View className="search-container">
          <Image src={videoLogo} />
          <View className="search">搜索视频</View>
          <Image src={logo} />
        </View>
        <View className="scroll">
          <ScrollView
            scroll-x
            className="scroll-view"
            enable-flex
            scrollIntoView={`data-${currentId}`}
            scrollWithAnimation
          >
            {videoListData.map(({ name, id }, index) => {
              return (
                <View
                  id={`data-${index}`}
                  key={id}
                  className="container"
                  onClick={() => {
                    setSelected(index);
                    getVideoList(videoListData, index);
                    setCurrentId(index);
                  }}
                >
                  <View className={selected === index ? "item active" : "item"}>
                    {name}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <View className="videoList">
        <ScrollView
          scrollY
          className="videoItem"
          refresher-enabled
          refresher-triggered={triggered}
          onRefresherRefresh={() => {
            setTriggered(false);
            getVideoList(videoListData, currentId);
          }}
          onScrollToLower={() => {
            setVideoList([...videoList, ...videoList]);
          }}
        >
          {videoList.length > 0 ? (
            videoList.map((v) => {
              return (
                <View key={v.data.urlInfo.id}>
                  {showVideoId !== v.data.urlInfo.id ? (
                    <Image
                      src={v.data.coverUrl}
                      onClick={(e) => {
                        setShowVideoId(v.data.urlInfo.id);
                      }}
                    />
                  ) : (
                    <Video
                      id={`${v.data.vid}`}
                      autoplay
                      objectFit="fill"
                      show-center-play-btn
                      controls
                      show-play-btn
                      show-mute-btn
                      src={v.data.urlInfo.url}
                      onPlay={(e) => {
                        const videoObj = video.current.find((item) => {
                          return e.currentTarget.id in item;
                        });
                        if (videoObj) {
                          const videoContex = Taro.createVideoContext(
                            e.currentTarget.id
                          );
                          videoContex.seek(videoObj[e.currentTarget.id]);
                        }
                      }}
                      onTimeUpdate={(e) => {
                        if (e.detail.currentTime !== 0) {
                          const videoObj = video.current.find((item) => {
                            return e.currentTarget.id in item;
                          });
                          if (!videoObj) {
                            video.current.push({
                              [e.currentTarget.id]: e.detail.currentTime,
                            });
                          } else {
                            videoObj[e.currentTarget.id] = e.detail.currentTime;
                          }
                        }
                      }}
                    ></Video>
                  )}
                  <View className="videoInfo">
                    <View className="title">{v.data.title}</View>
                    <View className="nickname">
                      <Image
                        src={v.data.creator ? v.data.creator.avatarUrl : ""}
                      />
                      <Text>
                        {v.data.creator ? v.data.creator.nickname : ""}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : !userInfo ? (
            <View>
              <View
                onClick={() => {
                  Taro.navigateTo({ url: "/pages/login/login" });
                }}
              >
                视频功能需要先登录
              </View>
            </View>
          ) : (
            "暂无推荐视频，请稍后再试"
          )}
        </ScrollView>
      </View>
    </Wrapper>
  );
};
export default Videos;
