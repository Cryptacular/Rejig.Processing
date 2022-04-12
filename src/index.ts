import { flushCache as flushCacheBrowser } from "./browser/cache";
import {
  processWorkflow as processWorkflowBrowser,
  resizeByLongestSide as resizeByLongestSideBrowser,
} from "./browser/processor";
import { flushCache as flushCacheNode } from "./node/cache";
import {
  processWorkflow as processWorkflowNode,
  resizeByLongestSide as resizeByLongestSideNode,
} from "./node/processor";

export const browser = {
  processWorkflow: processWorkflowBrowser,
  resizeByLongestSide: resizeByLongestSideBrowser,
  flushCache: flushCacheBrowser,
};

export const node = {
  processWorkflow: processWorkflowNode,
  resizeByLongestSide: resizeByLongestSideNode,
  flushCache: flushCacheNode,
};
