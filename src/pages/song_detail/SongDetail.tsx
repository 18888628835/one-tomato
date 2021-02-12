import { View, Image } from "@tarojs/components";
import {
  getCurrentInstance,
  getBackgroundAudioManager,
  setNavigationBarTitle,
  useReady,
  getApp,
} from "@tarojs/taro";
import { styled } from "linaria/react";
import React, { useEffect, useRef, useState } from "react";
import needle from "../../image/song_detail/needle.png";
import disc from "../../image/song_detail/disc.png";
import MyIcon from "../../components/custom_hooks/MyIcon";
import { request } from "../../utils/request";

const Wrapper = styled(View)`
  background-color: #8a8a8a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .circle {
    z-index: 2;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: white;
  }
  .needle {
    position: relative;
    z-index: 1;
    left: 58rpx;
    top: -35rpx;
    transition: all 0.5s;
    transform-origin: 40rpx 0rpx;
    transform: rotate(-20deg);
    width: 192rpx;
    height: 275rpx;
  }
  .needleRotato {
    transform: rotate(-1deg);
  }
  .music {
    position: relative;
    top: -180rpx;
    .disc {
      width: 595rpx;
      height: 595rpx;
    }
    .musicImg {
      position: absolute;
      left: 117rpx;
      top: 117rpx;
      width: 362rpx;
      height: 360rpx;
      border-radius: 50%;
    }
    .musicImgRotato {
      animation: rotato 10s 0.4s linear infinite;
    }
    @keyframes rotato {
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .musicFooter {
    border-top: 2rpx solid white;
    padding: 20rpx 60rpx 0;
    display: flex;
    text-align: center;
    line-height: 60rpx;
    position: absolute;
    bottom: 80rpx;
    width: 100%;
    justify-content: space-around;
    .icon {
      font-size: 40rpx;
      width: 60rpx;
      height: 60rpx;
      color: white;
    }
    .play {
      font-size: 60rpx;
    }
  }
`;
const SongDetail = () => {
  const [play, setPlay] = useState(true);
  const [musicInfo, setMusicInfo] = useState<any>({});
  const [musicUrl, setMusicUrl] = useState<any>({});
  const music = useRef<any | null>(null);
  music.current = getBackgroundAudioManager();
  const MusicId = getCurrentInstance().router?.params.musicId;
  let [key, setKey] = useState(0);
  const [recommend, setRecommend] = useState<any[]>([]);

  //   获取音乐信息
  const getMusicInfo = async (id: string) => {
    const res = await request("/song/detail", { ids: id });
    const url = await request("/song/url", { id: id });
    setMusicInfo(res.songs[0]);
    setMusicUrl(url.data[0]);
    setNavigationBarTitle({
      title: res.songs[0].name,
    });
  };

  useEffect(() => {
    getMusicInfo(MusicId!);
    let recommendData = getApp().$app.globalData.recommend;
    setRecommend(recommendData);
    setKey(parseInt(getCurrentInstance().router?.params.key!));
  }, []);

  useReady(() => {
    music.current.onPlay(() => {
      setPlay(true);
    });
    music.current.onPause(() => {
      setPlay(false);
    });
  });

  useEffect(() => {
    if (musicUrl.url) {
      let src = musicUrl.url;
      music.current.src = src;
      music.current.title = musicInfo.name;
    }
  }, [musicUrl, musicInfo]);

  useEffect(() => {
    if (play) {
      music.current.play();
    } else {
      music.current.pause();
    }
  }, [play]);
  const toggleMusic = (type: string) => {
    let index = key;
    if (type === "pre") {
      index = index === 0 ? recommend.length - 1 : index - 1;
    } else {
      index = index === recommend.length - 1 ? 0 : index + 1;
    }
    setKey(index);
    getMusicInfo(recommend[index].id);
  };
  return (
    <Wrapper>
      <View className="author">{musicInfo.ar ? musicInfo.ar[0].name : ""}</View>
      <View className="circle"></View>
      <Image className={`needle ${play && "needleRotato"}`} src={needle} />
      <View className="music">
        <Image className="disc" src={disc} />
        <Image
          className={`musicImg ${play && "musicImgRotato"}`}
          src={musicInfo.al ? musicInfo.al.picUrl : ""}
        />
      </View>
      <View className="musicFooter">
        <MyIcon className="icon" iconName="icon7" />
        <MyIcon
          className="icon"
          iconName="houtui"
          onClick={() => {
            toggleMusic("pre");
          }}
        />
        <MyIcon
          className="icon play"
          iconName={`${play ? "bofangmoren" : "bofang"}`}
          onClick={() => {
            setPlay(!play);
          }}
        />
        <MyIcon
          className="icon"
          iconName="qianjin"
          onClick={() => {
            toggleMusic("next");
          }}
        />
        <MyIcon className="icon" iconName="yinleliebiao" />
      </View>
    </Wrapper>
  );
};

export default SongDetail;
