type Level = "info" | "error" | "warn" | "debug";

type Meta = Record<string, unknown> | undefined;

function emit(level: Level, msg: string, meta?: Meta) {
  const entry = {
    level,
    msg,
    ts: new Date().toISOString(),
    ...(meta || {}),
  };
  try {
    // Using stdout to avoid console filtering; JSON for structured logs
    process.stdout.write(JSON.stringify(entry) + "\n");
  } catch {
    // no-op
  }
}

export function createLogger(base?: Record<string, unknown>) {
  return {
    info(msg: string, meta?: Meta) {
      emit("info", msg, { ...(base || {}), ...(meta || {}) });
    },
    warn(msg: string, meta?: Meta) {
      emit("warn", msg, { ...(base || {}), ...(meta || {}) });
    },
    error(msg: string, meta?: Meta) {
      emit("error", msg, { ...(base || {}), ...(meta || {}) });
    },
    debug(msg: string, meta?: Meta) {
      if (process.env.NODE_ENV !== "production") {
        emit("debug", msg, { ...(base || {}), ...(meta || {}) });
      }
    },
    with(extra: Record<string, unknown>) {
      return createLogger({ ...(base || {}), ...extra });
    },
  };
}
