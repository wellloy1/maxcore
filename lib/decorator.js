export function locker(fn, timeout = 100, attempts = 1) {
  let locked = false;
  return async (...args) => {
    for (let i = 0; i < attempts; i++) {
      if (!locked) break;
      await (() => {
        return new Promise((resolve) => {
          setTimeout(resolve, timeout);
        });
      })();
    }
    if (locked) return;
    locked = true;
    let result;
    try {
      result = await fn(...args);
    } catch (err) {
      result = err;
    }
    locked = false;
    return result;
  };
}
