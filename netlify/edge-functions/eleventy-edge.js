import { EleventyEdge } from "eleventy:edge";
import precompiledAppData from "./_generated/eleventy-edge-app-data.js";

// filters - -
import { irand, frand, angleToV, min, max } from "../../11ty/filters.mjs";

export default async (request, context) => {
  try {
    let edge = new EleventyEdge("edge", {
      request,
      context,
      precompiled: precompiledAppData,

      // default is [], add more keys to opt-in e.g. ["appearance", "username"]
      cookies: [],
    });

    const url = new URL(request.url);
    const randomize = url.searchParams.get("randomize");
    let maxDepth = +url.searchParams.get("max-depth") || 4;
    let minWidth = +url.searchParams.get("min-width") || 4;
    let minHeight = +url.searchParams.get("min-height") || 4;
    let dirProb = +url.searchParams.get("dir-prob") || 0.5;
    let sizeDist = +url.searchParams.get("size-dist") || 8;
    if (randomize) {
      maxDepth = irand([1, 32]);
      minWidth = irand([1, 64]);
      minHeight = irand([1, 64]);
      dirProb = irand([0, 20]) / 20;
      sizeDist = irand([2, 16]);
    }

    edge.config(config => {
      config.addNunjucksFilter("irand", irand);
      config.addNunjucksFilter("frand", frand);
      config.addNunjucksFilter("angleToV", angleToV);
      config.addNunjucksFilter("min", ([a, b]) => Math.min(a, b));
      config.addNunjucksFilter("max", ([a, b]) => Math.max(a, b));

      config.addGlobalData("maxDepth", maxDepth);
      config.addGlobalData("minWidth", minWidth);
      config.addGlobalData("minHeight", minHeight);
      config.addGlobalData("dirProb", dirProb);
      config.addGlobalData("sizeDist", sizeDist);
    });

    const res = await edge.handleResponse();
    const b = await res.text();
    const mini = b
      .replace(/\>[\r\n ]+\</g, "><")
      .replace(/(<.*?>)|\s+/g, (m, $1) => ($1 ? $1 : " "))
      .trim();

    return new Response(mini, res);
  } catch (e) {
    console.log("ERROR", { e });
    return context.next(e);
  }
};
