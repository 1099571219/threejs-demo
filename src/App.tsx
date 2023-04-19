import {
  Button,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader
} from 'ant-design-vue'
import { RouterView } from 'vue-router'
import { MainStore } from './store/mainStore'
import layout from './module/layout/layout'
import HomeButton from './module/home/homeButton'
export default defineComponent({
  setup() {
    const mainStore = MainStore()
    const container = ref()
    onMounted(() => {
      mainStore.init(container.value as HTMLElement)
      mainStore.animate()
    })

    const home = <HomeButton />

    const main = (
      <RouterView
        class={[
          ' pointer-events-none absolute top-[50%] left-[0] translate-y-[-50%] h-[80%] w-[100%] flex items-center justify-center text-white'
        ]}
      />
    )
    const context = [layout, main]

    const homeContainer = (): JSX.Element => {
      return (
        <div
          ref='container'
          class={'absolute top-[0] left-0 w-[100%] h-[100%] text-black'}>
          {!mainStore.enter ? home : context}
        </div>
      )
    }

    return {
      homeContainer,
      container
    }
  },

  render() {
    return (
      <div class='relative w-[100vw] h-[100vh] text-black'>
        <div class={' fixed z-10 top-[30%] left-0 text-black'}> </div>
        {this.homeContainer()}
      </div>
    )
  }
})
