declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      WECOM_CALLBACK_TOKEN: string;
      WECOM_CALLBACK_AESKEY: string;
    }
  }
}

// 触发模块化识别
export {};
