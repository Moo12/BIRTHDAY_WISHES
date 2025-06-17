<template>
    
  <div class="relative w-full h-[60vh] bg-white/10 rounded-lg overflow-hidden">
    <div
      v-for="wish in wishesWithPosition"
      :key="wish.id"
      :style="getWishStyle(wish)"
      @mouseenter="hoveredWishId = wish.id"
      @mouseleave="hoveredWishId = null"
    >
      <WishPoster
        :wish="wish"
        :isMine="user?.uid === wish.user"
        @open="onWishClick(wish)"
      />
    </div>
  </div>
  </template>
  
  <script setup>
  import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'
  import WishPoster from './WishPoster.vue'
  import { useWishlistStore } from '@/stores/wishListStore'
  import useAuth from '@/composables/useAuth'

  
  const emit = defineEmits(['onWishClick'])
  
  const { user } = useAuth()
  const wishlistStore = useWishlistStore()

  const wishPositions = reactive({})
  
  const hoveredWishId = ref(null)

  const isMobile = ref(window.innerWidth < 768)

  function handleResize() {
    isMobile.value = window.innerWidth < 768
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  })
  onUnmounted(() => window.removeEventListener('resize', handleResize))
  
  const onWishClick = (wish) => {
    console.log('onWishClick:', wish)
    emit('onWishClick', wish)
  }

const latestMine = computed(() => {
  return wishlistStore.visibleWishes
    .filter(wish => wish.user === user.value.uid)
    .sort((a, b) => new Date(b.metadata?.created_at || 0) - new Date(a.metadata?.created_at || 0))
    .slice(0, 2)
    .map(wish => wish.id)
})

// Generate random positions and angles for each wish
const wishesWithPosition = computed(() => {
  
  return wishlistStore.visibleWishes.map((wish) => {
    
    let zIndex = 1
    if (latestMine.value[0] === wish.id) zIndex = 100
    else if (latestMine.value[1] === wish.id) zIndex = 99
    
    if (!wishPositions[wish.id]) {
      // Generate and save a new position for this wish
      const xMax = isMobile.value ? 60 : 80
      const yMax = isMobile.value ? 40 : 50



      wishPositions[wish.id] = {
        x: Math.random() * xMax, // 5% to 85%
        y: Math.random() * yMax, // 5% to 75%
        angle: Math.random() * 16 - 8,// -8 to +8 degrees
      }
    }
    return { ...wish, ...wishPositions[wish.id], zIndex}
  })
})

function getWishStyle(wish) {
  const maxLatestMineZ = 100; // or whatever you use for latestMine[0]
  const hoveredZ = maxLatestMineZ + 1;

  let zIndex = wish.zIndex || 1;

  if (hoveredWishId.value === wish.id) {
    zIndex = hoveredZ;
  }

  const style = {
    position: 'absolute',
    left: wish.x + '%',
    top: wish.y + '%',
    transform: `rotate(${wish.angle}deg)`,
    transition: 'transform 0.3s',
    zIndex: zIndex
  }
  if (isMobile.value) {
    style.width = '35%'
    style.minWidth = '50%'
    style.maxWidth = '60%'
  } else {
    style.width = '18%'
    style.minWidth = '12%'
    style.maxWidth = '22%'
  }
  return style
}

</script>
  