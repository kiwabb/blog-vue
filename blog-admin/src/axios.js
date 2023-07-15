import axios from "axios"
import ElementPlus, {ElMessage} from "element-plus";
import router from "@/router";
import {getToken} from "@/utils/auth";

const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})
request.interceptors.request.use(config => {
    config.headers['Authorization'] = 'Bearer ' + getToken()  // 请求头带上token
    console.log(getToken())
    return config
})
request.interceptors.response.use(response => {
        let res = response.data;
        if (res.code === 0) {
            return response
        } else {
            ElMessage.error(res.msg? res.msg : '系统异常！')
            return Promise.reject(response.data.msg)
        }
    },
    error => {
        console.log(error)
        if(error.response.data) {
            error.message = error.response.data.msg
        }
        if(error.response.status === 401) {
            router.push("/login")
        }
        ElMessage.error(error.message)
        return Promise.reject(error)
    }
)
export default request