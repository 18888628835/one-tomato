import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  ScrollView,
} from "@tarojs/components";
import { styled } from "linaria/react";
import { request } from "../../utils/request";
import MyIcon from "../../components/custom_hooks/MyIcon";
import TitleHeader from "../../components/custom_hooks/TitleHeader";
import Taro, { useShareAppMessage } from "@tarojs/taro";

const Wrapper = styled(View)`
  /* 轮播区域 */
  .banner {
    height: 300rpx;
    image {
      height: 100%;
      width: 100%;
    }
  }
  /* 图标导航 */
  .iconWrapper {
    display: flex;
    justify-content: space-around;
    text-align: center;
    > View {
      display: flex;
      flex-direction: column;
      align-items: center;
      .iconfont {
        width: 100rpx;
        font-size: 50rpx;
        border-radius: 50%;
        background-color: #eb442c;
        color: white;
        text-align: center;
        line-height: 100rpx;
        margin: 10rpx 0;
      }
      > Text:nth-child(2) {
        font-size: 26rpx;
      }
    }
  }
  /* 推荐歌曲 */
  .Recommend {
    padding: 30rpx;
    .scrollView {
      display: flex;
      height: 300rpx;
      .Recommend-item {
        width: 200rpx;
        margin: 20rpx 20rpx 10rpx 0;
      }
      .Recommend-item image {
        height: 200rpx;
        width: 200rpx;
      }
      text {
        font-size: 26rpx;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }
    }
  }
  /* 热歌排行榜 */
  .hotList {
    padding: 30rpx;
    .hotList-swiper {
      background-color: #fbfbfb;
      height: 400rpx;
    }
    .title {
      font-size: 30rpx;
      line-height: 80rpx;
    }

    .music-item {
      margin-bottom: 20rpx;
      .count {
        height: 100rpx;
        width: 100rpx;
        line-height: 100rpx;
        text-align: center;
      }
      display: flex;
      align-items: center;
      > image {
        height: 100rpx;
        width: 100rpx;
      }
    }
  }
`;
export default function index() {
  useShareAppMessage((res) => {
    if (res.from === "menu") {
      return { title: "一个好玩的小程序" };
    }
  });
  const [Banners, setBanners] = useState<any[]>([]);
  const [recommentdList, setRecommentdList] = useState<any[]>([]);
  const [topList, setTopList] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      await request("/banner", { type: 2 }).then((res) => {
        setBanners(res.banners);
      });
      await request("/personalized", { limit: 10 }).then((res) => {
        setRecommentdList(res.result);
      });
      let top: any[] = [];
      for (let i = 0; i < 5; i++) {
        await request("/top/list", { idx: i }).then((res) => {
          const item = {
            name: res.playlist.name,
            tracks: res.playlist.tracks.slice(0, 3),
          };
          top.push(item);
        });
      }
      setTopList(top);
    })();
  }, []);
  return (
    <Wrapper>
      {/* 轮播区域 */}
      <Swiper
        className="banner"
        indicatorDots
        indicatorColor="ivory"
        indicatorActiveColor="#d43c33"
        autoplay
      >
        {Banners.map(({ pic, id }) => {
          return (
            <SwiperItem key={id}>
              <Image mode="scaleToFill" src={pic} />;
            </SwiperItem>
          );
        })}
      </Swiper>
      {/* 图标导航区域 */}
      <View className="iconWrapper">
        {[
          ["paixingbang", "排行榜"],
          ["gedan", "歌单"],
          ["diantai", "电台"],
          ["zhibobofangshexiangjiguankanmianxing", "直播"],
          ["tuijian", "每日推荐", "/pages/recommend/recommend"],
        ].map((item) => (
          <MyIcon
            onClick={() => {
              Taro.navigateTo({
                url: item[2],
              });
            }}
            key={item[0]}
            iconName={item[0]}
          >
            {item[1]}
          </MyIcon>
        ))}
      </View>
      {/* 推荐歌曲 */}
      <View className="Recommend">
        <TitleHeader title="推荐歌曲" text="为你精心推荐" />
        <ScrollView scrollX enableFlex className="scrollView">
          {recommentdList.map(({ id, picUrl, name }) => {
            return (
              <View key={id} className="Recommend-item">
                <Image mode="scaleToFill" src={picUrl} />
                <Text>{name}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View className="hotList">
        <TitleHeader {...{ title: "排行榜", text: "热歌风向标" }} />
        <Swiper next-margin="50rpx" className="hotList-swiper">
          {topList.map(({ name, tracks }, key) => {
            return (
              <SwiperItem key={name + key}>
                <View className="title">{name}</View>
                {tracks.map(({ id, al }, k) => {
                  return (
                    <View key={id} className="music-item">
                      <Image src={al.picUrl} />
                      <Text className="count">{k + 1}</Text>
                      <Text>{al.name}</Text>
                    </View>
                  );
                })}
              </SwiperItem>
            );
          })}
        </Swiper>
      </View>
    </Wrapper>
  );
}
