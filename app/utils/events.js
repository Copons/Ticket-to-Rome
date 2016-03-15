export function listen(target, eventType, callback, useCapture = false) {
  if (target) {
    target.addEventListener(eventType, callback, !!useCapture);
  }
}
