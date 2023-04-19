import Header from './header/header'
import Footer from './footer/footer'
import { MainStore } from '../../store/mainStore'
export default defineComponent({
  setup(props, { emit }) {
    const mainStore = MainStore()

    const header = () => {
      return (
        <Header
          onHomeIndex={mainStore.btIsEnter}
          isHomeIndex={mainStore.enter}
          class='w-[100%] h-[10%]  border-2 absolute top-0 left-[50%] translate-x-[-50%]'
        />
      )
    }
    const footer = (
      <Footer class='pointer-events-none none w-[100%] h-[10%]  border-2 absolute bottom-0 left-0' />
    )
    const layout = [header, footer]
    return {
      layout
    }
  },
  render() {
    return this.layout.map((item) => {
          if (item instanceof Function) {
            return item()
          } else {
            return item
          }
        })
    
  }
})