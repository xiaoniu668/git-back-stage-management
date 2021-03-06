import layoutAside from './home/layout-aside'
import layoutHeader from './layout-header'
import Breadcrumb from './comment/bread-crumb.vue'
import { quillEditor } from 'vue-quill-editor' // 引入quill组件
import CoverImages from './publish/cover-image'
import selectImage from './publish/select-image'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  install (Vue) {
    Vue.component('layout-aside', layoutAside)// 全剧注册
    Vue.component('layout-header', layoutHeader)// 全剧注册
    Vue.component('bread-crumb', Breadcrumb)// 注册一个全局面包屑组件
    Vue.component('quill-editor', quillEditor)// 注册一个全局富文本编辑器
    Vue.component('cover-image', CoverImages)// 注册一个全局封面组件
    Vue.component('select-image', selectImage)// 注册一个选择素材组件
  }
}
