declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string; // Since process.env.PORT will always be a string or undefined
    HOSTNAME?: string;
    NODE_ENV: "development" | "production";
  }
}
