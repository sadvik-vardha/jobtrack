import { useState, useRef, useCallback } from "react";
import { APPS_KEY, SEEDED_KEY } from "../utils/constants";
import { loadItem, saveItem } from "../utils/storage";
import { generateId } from "../utils/helpers";
import { withStatusChange } from "../utils/history";
import { createSampleApplications } from "../data/sampleData";

function getInitialApplications() {
  const alreadySeeded = loadItem(SEEDED_KEY, false);
  const stored = loadItem(APPS_KEY, null);

  // User has data (or intentionally cleared it) before.
  if (alreadySeeded) {
    return Array.isArray(stored) ? stored : [];
  }

  // First visit ever: show demo data.
  return createSampleApplications();
}

export default function useApplications() {
  const [applications, setApplications] = useState(getInitialApplications);
  const [storageError, setStorageError] = useState(false);

  // Always holds the latest list, so actions never use stale data.
  const latest = useRef(applications);

  // Single place that updates state AND saves to LocalStorage.
  const commit = useCallback((next) => {
    latest.current = next;
    setApplications(next);
    const savedApps = saveItem(APPS_KEY, next);
    const savedFlag = saveItem(SEEDED_KEY, true);
    setStorageError(!(savedApps && savedFlag));
  }, []);

  const addApplication = useCallback(
    (data) => {
      const newApp = {
        ...data,
        id: generateId(),
        history: [{ status: data.status, date: data.dateApplied }],
      };
      commit([newApp, ...latest.current]);
      return newApp;
    },
    [commit]
  );

  // Edit form can change status too, so record that in history.
  const updateApplication = useCallback(
    (id, changes) => {
      commit(
        latest.current.map((app) =>
          app.id === id
            ? withStatusChange(
                { ...app, ...changes, status: app.status },
                changes.status ?? app.status
              )
            : app
        )
      );
    },
    [commit]
  );

  const updateStatus = useCallback(
    (id, status) => {
      commit(
        latest.current.map((app) =>
          app.id === id ? withStatusChange(app, status) : app
        )
      );
    },
    [commit]
  );

  const deleteApplication = useCallback(
    (id) => {
      commit(latest.current.filter((app) => app.id !== id));
    },
    [commit]
  );

  const clearAll = useCallback(() => {
    commit([]);
  }, [commit]);

  const loadSamples = useCallback(() => {
    commit(createSampleApplications());
  }, [commit]);

  const replaceAll = useCallback(
    (list) => {
      commit(list);
    },
    [commit]
  );

  return {
    applications,
    storageError,
    addApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    clearAll,
    loadSamples,
    replaceAll,
  };
}