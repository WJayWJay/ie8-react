module.exports = {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
        // "/api": "https://jf.gf.com.cn/api",
        "/api": {
            target: "https://jf.gf.com.cn/",
            secure: false,
            pathRewrite: {"^/api" : ""}
          },
        // {
        //     target: "https://jf.gf.com.cn/"
        // },
        "/": "http://localhost:8001",
        // "/public": {
        //     target: "http://localhost:8001",
        //     // pathRewrite: {"^/public" : ""}
        // }
    }
}