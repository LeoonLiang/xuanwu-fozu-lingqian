export interface FortuneStick {
  签号: string;
  签名: string;
  签文类型: string;
  卦象: string;
  生肖: string;
  签文简介: {
    戏文: string;
    诗曰: string;
    内兆: string;
  };
  家宅运势: {
    签文: string;
    解曰: string;
  };
  岁君签: {
    总诗: string;
    年龄运势: Array<{
      年龄: string;
      男: string;
      女: string;
    }>;
  };
  生意: {
    生意: string;
    生意解曰: string;
    开铺: string;
    合伙: string;
    置货: string;
  };
  出外: {
    出外: string;
  };
  谋望求财: {
    谋望: string;
    谋望解曰: string;
    求财: string;
  };
  学艺功名: {
    学艺: string;
    功名: string;
  };
  行舟六畜: {
    行舟: string;
    六畜: string;
    猪羊: string;
    草龙: string;
    三鸟: string;
    田蚕: string;
  };
  移徙: {
    移徙: string;
  };
  行人: {
    诗: string;
    解曰: string;
  };
  婚姻: {
    婚姻: string;
    解曰: string;
  };
  官讼: {
    官讼: string;
    解曰: string;
  };
  失物: {
    诗: string;
    解曰: string;
  };
  占病: {
    占病: string;
    解曰: string;
  };
  其他?: {
    [key: string]: string;
  };
  [key: string]: any; // Allow additional properties
}

export interface FortuneStickLite {
  签号: string;
  签名: string;
  签文类型: string;
  卦象: string;
  生肖: string;
}

export interface Manifest {
  name: string;
  version: number;
  count: number;
  files: string[];
  lite: {
    count: number;
    files: string[];
  };
  map: Array<{
    id: string;
    full: string;
    lite: string;
  }>;
}

declare const manifest: Manifest;
export default manifest;
