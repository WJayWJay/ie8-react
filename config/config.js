module.exports = {
    port: 8080,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
        // "/api": "https://jf.gf.com.cn/api",
        "/private": {
            target: "http://520.com:9001",
            secure: false,
            // pathRewrite: {"^/api" : ""}
          },
          "/login": {
            target: "http://520.com:9001",
            secure: false,
          },
          "/logout": {
            target: "http://520.com:9001",
            secure: false,
          },
        // {
        //     target: "https://jf.gf.com.cn/"
        // },
        // "/": "http://localhost:8001",
        // "/public": {
        //     target: "http://localhost:8001",
        //     // pathRewrite: {"^/public" : ""}
        // }
    }
}