
import { ElMessage } from 'element-plus'

const success = (message) => {
    ElMessage({
        showClose: true,
        message: message,
        type: 'success',
    })
}
const error = (message) => {
    ElMessage({
        showClose: true,
        message: message,
        type: 'error',
    })
}
export default{
    success, error
}
