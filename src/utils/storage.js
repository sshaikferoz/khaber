// Storage utilities for Chat Threads and Variants
const CHAT_THREADS_STORAGE_KEY = "khaber_chat_threads";
const CURRENT_CHAT_STORAGE_KEY = "khaber_current_chat";
const STORAGE_KEY = "khaber_variants";

// Chat Thread Storage
export const saveChatThreadsToStorage = (chatThreads) => {
  try {
    sessionStorage.setItem(
      CHAT_THREADS_STORAGE_KEY,
      JSON.stringify(chatThreads)
    );
  } catch (error) {
    console.error("Failed to save chat threads to storage:", error);
  }
};

export const loadChatThreadsFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(CHAT_THREADS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load chat threads from storage:", error);
  }
  return {};
};

export const saveCurrentChatIdToStorage = (chatId) => {
  try {
    sessionStorage.setItem(CURRENT_CHAT_STORAGE_KEY, chatId);
  } catch (error) {
    console.error("Failed to save current chat ID:", error);
  }
};

export const loadCurrentChatIdFromStorage = () => {
  try {
    return sessionStorage.getItem(CURRENT_CHAT_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to load current chat ID:", error);
  }
  return null;
};

export const createNewChatThread = () => {
  const chatId = `chat_${Date.now()}`;
  return {
    id: chatId,
    title: "New Chat",
    createdAt: Date.now(),
    lastActivity: Date.now(),
    pipelineHistory: [],
    hasSubmittedPrompt: false,
  };
};

// Variants Storage
export const saveVariantsToStorage = (variants) => {
  try {
    const variantsData = {};
    variants.forEach((variant, index) => {
      variantsData[`version_${index + 1}`] = variant;
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(variantsData));
  } catch (error) {
    console.error("Failed to save variants to storage:", error);
  }
};

export const loadVariantsFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const variantsData = JSON.parse(stored);
      return Object.values(variantsData);
    }
  } catch (error) {
    console.error("Failed to load variants from storage:", error);
  }
  return [];
};

export const clearVariantsStorage = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear variants storage:", error);
  }
};

// Pipeline History Utilities
export const addToPipelineHistory = (chatThreads, chatId, historyItem) => {
  try {
    const updatedThreads = { ...chatThreads };
    if (updatedThreads[chatId]) {
      const existingHistory = updatedThreads[chatId].pipelineHistory || [];
      updatedThreads[chatId].pipelineHistory = [
        historyItem,
        ...existingHistory,
      ].slice(0, 10);
      updatedThreads[chatId].lastActivity = Date.now();
    }
    return updatedThreads;
  } catch (error) {
    console.error("Failed to add to pipeline history:", error);
    return chatThreads;
  }
};