export default defineContentScript({
  matches: [
    "*://www.google.co.jp/*",
    "*://www.google.com/*",
  ],
  main() {
    useGoogleStableTabs()
  },
});
