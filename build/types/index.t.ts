export {};

declare global {
  interface Window {
    player: shaka.Player;
  }
}
