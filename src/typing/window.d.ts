interface Window {
  electronAPI: {
    setTitle: (title: string) => void
    /**
     * @method pageReady
     * @param {string} name 页面名称
     */
    pageReady: (name: string) => void
  }
}
