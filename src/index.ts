import { flushCache as flushCacheBrowser } from "./browser/cache";
import { processWorkflow as processWorkflowBrowser } from "./browser/processor";
import { flushCache as flushCacheNode } from "./node/cache";
import { processWorkflow as processWorkflowNode } from "./node/processor";

export const browser = {
  processWorkflow: processWorkflowBrowser,
  flushCache: flushCacheBrowser,
};

export const node = {
  processWorkflow: processWorkflowNode,
  flushCache: flushCacheNode,
};
