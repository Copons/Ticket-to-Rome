export function listen(target, eventType, callback, useCapture = false) {
  if (target) {
    target.addEventListener(eventType, callback, !!useCapture);
  }
}

export function customEvent(target, eventType, detail) {
  const customEventHandler = new CustomEvent(eventType, { detail });
  target.dispatchEvent(customEventHandler);
}
