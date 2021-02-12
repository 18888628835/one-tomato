import Taro, { setStorageSync } from "@tarojs/taro";
type Method =
  | "GET"
  | "OPTIONS"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT"
  | undefined;
export const request = async (
  url: string,
  data = {},
  method: Method = "GET"
) => {
  const res: any = await Taro.request({
    url: "http://localhost:3000" + url,
    data,
    method,
    header: {
      cookie: Taro.getStorageSync("cookies")
        ? Taro.getStorageSync("cookies").find((item) => {
            return item.indexOf("MUSIC_U") !== -1;
          })
        : "",
    },
  });
  if (url === "/login/cellphone") {
    Taro.setStorage({ key: "cookies", data: res.cookies });
  }
  return res.data;
};
