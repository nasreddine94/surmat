/**
 * One-at-a-time idle queue so procedural texture generation never blocks
 * input: each job runs in its own idle slice (or a 16 ms timeout fallback).
 */
type Job = () => void;
const queue: Job[] = [];
let running = false;

const schedule = (fn: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 250 });
  else setTimeout(fn, 16);
};

function pump() {
  const job = queue.shift();
  if (!job) {
    running = false;
    return;
  }
  try {
    job();
  } finally {
    schedule(pump);
  }
}

export function enqueue(job: Job, priority = false) {
  if (priority) queue.unshift(job);
  else queue.push(job);
  if (!running) {
    running = true;
    schedule(pump);
  }
}
