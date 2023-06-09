import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'
import { LoadingManager, Vector3 } from 'three'
import TemperatureField from '../util/temperature'
import _, { reject } from 'lodash'
import { API } from '../api/api'
import Dexie from 'dexie'
import { DataInfo, InitIndexDB, ModelInfo } from '../util/indexDB'
import { AxiosResponse } from 'axios'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

interface UtilSet {
  threeScene?: ThreeScene
  homePoints?: HomePoints
  tweenJS?: TweenJS
  temp?: TemperatureField
}

export interface flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: {
    camera: number
    controls: number
  }
}

class FlyToPosition implements flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: flyToPosition['needTime'] = { camera: 0, controls: 0 }
  constructor(
    controlsTarget: number[],
    positionTarget: number[],
    needTime: number[]
  ) {
    this.controlsTarget = new Vector3(...controlsTarget)
    this.positionTarget = new Vector3(...positionTarget)
    this.needTime.camera = needTime[0]
    this.needTime.controls = needTime[1]
  }
}

export interface ScenePosition {
  enterPosition: FlyToPosition
  heatMap: FlyToPosition
  // homePosition:FlyToPosition,
}
export type OnDownloadProgress = (e: any) => void

export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  const isLoading = ref(true)
  const utilSet: Ref<UtilSet> = ref({})
  const router = useRouter()
  const loadingProgress = ref({
    progress: 0,
    name: '连接中...'
  })

  const scenePosition: Ref<ScenePosition> = ref({
    heatMap: new FlyToPosition([0, -2200, 0], [0, -2000, 20], [1, 1]),
    // homePosition: new FlyToPosition([1, 0, 0], [-2000, -2000, -2000], [2, 2]),
    enterPosition: new FlyToPosition([0, 0, 0], [0, 0, 5], [1, 1]),
    points: new FlyToPosition([0, -1000, 0], [0, -1000, 20], [1, 1])
  })

  const init = (homeContainer: HTMLElement) => {
    threeScene = new ThreeScene(homeContainer, {
      fov: 60,
      near: 0.1,
      far: 1500
    })

    utilSet.value.tweenJS = new TweenJS(threeScene)
    utilSet.value.temp = new TemperatureField(threeScene)
    utilSet.value.threeScene = threeScene
    lockMouse()
    const resize = _.debounce(threeScene.onWindowResize, 100)
    window.addEventListener('resize', resize)
    loadModel()
  }

  const loadModel = async () => {
    const GLTFOnProgress = (url: string, loaded: number, total: number) => {
      const progress = (loaded / total) * 100
      if (url.startsWith('/model')) {
        const modelName = url.substring(url.lastIndexOf('/') + 1)
        loadingProgress.value.name = modelName
      }
      loadingProgress.value.progress = Number(progress.toFixed(2))
    }
    const GLTFOnError = (url: string) => {
      console.log(`加载 Error`, url)
    }
    const GLTFOnLoaded = () => {
      console.log('全部模型加载完毕')
      router.replace({ name: 'menu' })
      isLoading.value = false
    }

    const GLTFloadingManager = new LoadingManager(
      GLTFOnLoaded,
      GLTFOnProgress,
      GLTFOnError
    )
    const modelRequestUrl = (await API.getModel()).data
    const modelData: Array<DataInfo> = []

    for (let url of modelRequestUrl) {
      modelData.push({
        url: url,
        data: null
      })
    }

    const modelDataBase = {
      dbName: 'three_model',
      dbVer: 1,
      stores: modelData
    }
    const load = async (modelSet: DataInfo[]) => {
      const GLTFLoaderIns = new GLTFLoader(GLTFloadingManager)
      modelSet.forEach((model, urlInd: number) => {
        const modelData = URL.createObjectURL(model.data!)
        const modelName = model.url.substring(model.url.lastIndexOf('/') + 1)
        loadingProgress.value.name = modelName
        threeScene.loadModel(modelData, GLTFLoaderIns)
      })
      return
    }

    const modelDB = new InitIndexDB(modelDataBase, load)
  }
  const lockMouse = () => {
    document.addEventListener('pointerlockchange', (e) => {
      if (document.pointerLockElement) {
        console.log('锁定')
        threeScene.enterFps()
      } else {
        console.log('取消锁定')
        pause()
      }
    })
  }

  const pause = () => {
    router.push({ name: 'pause' })
    router.beforeEach((to, from, next) => {
      to.meta.fixedRoute = from.name as string
      console.log(to)

      next()
    })
    threeScene.pause()
  }

  const flyTo = (positionName: keyof ScenePosition) => {
    const position = scenePosition.value[positionName]
    utilSet.value.tweenJS!.flyTo(position)
    return position as FlyToPosition
  }

  const requestPointerLock = () => {
    try {
      document.body.requestPointerLock()
    } catch (error) {
      console.log(error)
    }
  }

  let animateId
  const animate = () => {
    animateId = requestAnimationFrame(animate)
    if (isLoading.value) return
    // tweenJS.tween.update()
    // homePoints.update()
    threeScene.animate()
  }

  return {
    utilSet,
    loadingProgress,
    init,
    animate,
    requestPointerLock,
    flyTo,
    pause,
    loadModel,
    isLoading
  }
})

export const HomeStore = defineStore('homeStore', () => {})
