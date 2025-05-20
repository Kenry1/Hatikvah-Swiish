import { Timestamp } from "firebase/firestore";

export const serialize = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Timestamp) {
    return {
      seconds: obj.seconds,
      nanoseconds: obj.nanoseconds,
    };
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serialize(value)])
    );
  }

  return obj;
};
