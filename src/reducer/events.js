const events = {
  mapFirstReady: "map_first_ready",
};
export default events;

export function subscribe(eventName, listener) {
  document.addEventListener(eventName, listener);
}

export function unsubscribe(eventName, listener) {
  document.removeEventListener(eventName, listener);
}

export function publish(eventName) {
  const event = new CustomEvent(eventName);
  document.dispatchEvent(event);
}
