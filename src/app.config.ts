export default {
  pages: [
    "pages/index/index",
    "pages/recommend/recommend",
    "pages/song_detail/SongDetail",
    "pages/video/videos",
    "pages/personal/personal",
    "pages/login/login",
  ],
  tabBar: {
    color: "#333333",
    selectedColor: "#E6625D",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "image/tabbar/index.png",
        selectedIconPath: "image/tabbar/index_selected.png",
      },
      {
        pagePath: "pages/video/videos",
        text: "视频",
        iconPath: "image/tabbar/video.png",
        selectedIconPath: "image/tabbar/video_selected.png",
      },
      {
        pagePath: "pages/personal/personal",
        text: "我的",
        iconPath: "image/tabbar/mine.png",
        selectedIconPath: "image/tabbar/mine_selected.png",
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#D55E42",
    navigationBarTitleText: "One番茄-云音乐",
    navigationBarTextStyle: "white",
  },
  requiredBackgroundModes: ["audio"],
};
