import { create } from 'zustand'

type State = {
  /**
   * The loader is shown if `show()` has been called more times than `hide()` \
   * I.e. it will stop showing once `hide()` has been called as many times as `show()` (once all loading operations are complete)
   */
  showCount: number
  isShowing: boolean
  isShowingNextLoading: boolean
  content: string
}

type Actions = {
  show: (content?: string) => void
  hide: () => void
  setIsShowingNextLoading: (isShowingNextLoading: boolean) => void
}

export const useLoadingStore = create<State & Actions>((set) => ({
  showCount: 0,
  isShowing: false,
  isShowingNextLoading: false,
  content: '',
  showContent: false,
  show: (content = '') =>
    set((state) => ({
      showCount: state.showCount + 1,
      content,
      isShowing: true,
    })),
  hide: () =>
    set((state) => ({
      isShowing: state.isShowing && --state.showCount > 0,
    })),
  setIsShowingNextLoading: (isShowingNextLoading) =>
    set((state) => {
      if (state.isShowingNextLoading !== isShowingNextLoading) {
        return { isShowingNextLoading }
      }
      return state
    }),
}))
