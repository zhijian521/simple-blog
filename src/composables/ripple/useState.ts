import { ref } from 'vue'
import type { Ripple } from '../types/ripple'

export function useRippleState() {
    const ripples = ref<Ripple[]>([])
    const lastRippleTime = ref(0)
    const mousePos = ref({ x: 0, y: 0 })
    const lastMouseRippleTime = ref(0)

    return {
        ripples,
        lastRippleTime,
        mousePos,
        lastMouseRippleTime,
    }
}
