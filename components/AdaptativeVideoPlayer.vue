<script setup>
import { onMounted, onBeforeUnmount, nextTick } from 'vue';

import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// import hlsQualitySelector from "videojs-hls-quality-selector";
// import qualityLevels from "videojs-contrib-quality-levels";
// import 'videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css'


const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  videoPoster: {
    type: String,
    default: ''
  }
})

let player = ref(null)
const videoPlayer = ref(null)
// let player = null

onMounted(() => {
  console.log("onMounted AdaptativeVideoPlayer")
  initPlayer()
})

const onPlayerReady = () => {
  console.log('Reproductor listo')
  // Configurar controles de calidad manual
  addQualitySelector()
}


// Configuración del reproductor
const initPlayer = async () => {
  await nextTick()

  const options = {
    controls: false,
    responsive: props.responsive,
    fluid: true,
    aspectRatio: props.aspectRatio,
    autoplay: true,
    muted: true,
    volume: 0,
    preload: 'auto',
    loop: true,
    sources: [{
      src: props.videoUrl,
      type: 'application/x-mpegURL'
    }],
    // Configuración para adaptive bitrate
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true
      }
    },
    playbackRates: [0.75, 1, 1.5, 2],
    // Plugin para calidad automática
    // plugins: {
    //   qualitySelector: {
    //     default: 'auto'
    //   }
    // }
  }

  if (videoPlayer.value)
    console.log('videoPlayer', videoPlayer.value)
  else
    console.error('No se encontró el elemento videoPlayer')

  player.value = videojs(videoPlayer.value, options, onPlayerReady)
  // Configurar adaptive bitrate
  setupAdaptiveBitrate()
  // Eventos del reproductor
  player.value.on('loadstart', () => {
    console.log('Video loading started')
  })
  // player.value.on('ready', onPlayerReady)
  player.value.on('error', onPlayerError)
  player.value.on('loadedmetadata', onLoadedMetadata)

}


// Configuración del adaptive bitrate
const setupAdaptiveBitrate = () => {
  player.value.ready(() => {
    const tech = player.value.tech({ IWillNotUseThisInPlugins: true })

    if (tech.hls) {
      // Configurar niveles de calidad automáticos
      tech.hls.on('hlsManifestLoaded', () => {
        const levels = tech.hls.playlists.master.playlists
        console.log('Niveles de calidad disponibles:', levels.map(l => `${l.attributes.RESOLUTION.width}x${l.attributes.RESOLUTION.height}`))
      })

      // Monitorear cambios de calidad
      tech.hls.on('hlsLevelSwitched', (event, data) => {
        const currentLevel = tech.hls.playlists.master.playlists[data.level]
        console.log(`Calidad cambiada a: ${currentLevel.attributes.RESOLUTION.width}x${currentLevel.attributes.RESOLUTION.height}`)
      })

      // Configurar algoritmo de selección automática
      configureAdaptiveAlgorithm(tech.hls)
    }
  })
}


// Algoritmo para selección automática de calidad
const configureAdaptiveAlgorithm = (hls) => {
  // Detectar velocidad de conexión
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

  hls.on('hlsFragLoadEmergencyAborted', () => {
    const currentLevel = hls.currentLevel
    if (currentLevel > 0) {
      hls.currentLevel = currentLevel - 1
    }
  })
}

// Selector manual de calidad
const addQualitySelector = () => {
  player.value.ready(() => {
    const tech = player.value.tech({ IWillNotUseThisInPlugins: true })

    if (tech.hls && tech.hls.playlists.master.playlists.length > 1) {
      const levels = tech.hls.playlists.master.playlists

      // Crear botón de calidad
      const qualityButton = player.value.controlBar.addChild('MenuButton', {
        title: 'Calidad'
      })

      qualityButton.addClass('vjs-quality-selector')

      // Agregar opciones
      const items = [
        {
          label: 'Auto',
          value: -1
        },
        ...levels.map((level, index) => ({
          label: level.attributes.RESOLUTION ?
                 `${level.attributes.RESOLUTION.height}p` :
                 `Calidad ${index + 1}`,
          value: index
        }))
      ]

      items.forEach(item => {
        qualityButton.menu.addItem(new videojs.getComponent('MenuItem')(player.value, {
          label: item.label,
          clickHandler: () => {
            if (item.value === -1) {
              tech.hls.currentLevel = -1 // Auto
            } else {
              tech.hls.currentLevel = item.value
            }
          }
        }))
      })
    }
  })
}


const onPlayerError = (error) => {
  console.error('Error del reproductor:', error)
}

const onLoadedMetadata = () => {
  console.log('Metadatos cargadoss')
  // updatePlayerSize()
}

onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
  // window.removeEventListener('resize', updatePlayerSize)
})
// Actualizar tamaño del reproductor
const updatePlayerSize = () => {
  // if (props.responsive) {
  //   const container = videoPlayer.value.parentElement
  //   if (container) {
  //     const containerWidth = container.offsetWidth
  //     const aspectRatio = props.aspectRatio.split(':')
  //     const ratio = parseInt(aspectRatio[1]) / parseInt(aspectRatio[0])
  //
  //     playerWidth.value = containerWidth
  //     playerHeight.value = containerWidth * ratio
  //   }
  // }
}

const play = () => player.value?.play()
const pause = () => player.value?.pause()
const getCurrentTime = () => player.value?.currentTime()
const getDuration = () => player.value?.duration()

defineExpose({
  play,
  pause,
  getCurrentTime,
  getDuration,
  player: player.value
})

</script>

<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-default-skin vjs-big-play-centered"
      preload="auto"
      :poster="videoPoster"
      style="min-width: 100%; width: 100%; min-height: 240px; height: 100%;"
    >
      <source
        :src="videoUrl"
        type="application/x-mpegURL"
      >
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that supports HTML5 video.
      </p>
    </video>
  </div>
</template>
<style scoped>
.video-js {
  width: 100%;
  height: auto;
}
</style>