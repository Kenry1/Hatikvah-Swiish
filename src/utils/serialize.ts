export const serializeData = (data: any): string | null => {
  try {
    // Attempt to serialize the data using JSON.stringify
    return JSON.stringify(data);
  } catch (error) {
    // Log the error if serialization fails (e.g., circular references)
    console.error("Failed to serialize data:", error);
    return null;
  }
};

export const deserializeData = (dataString: string): any | null => {
  try {
    // Attempt to deserialize the data using JSON.parse
    return JSON.parse(dataString);
  } catch (error) {
    // Log the error if deserialization fails (e.g., invalid JSON)
    console.error("Failed to deserialize data:", error);
    return null;
  }
};