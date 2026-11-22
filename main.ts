// Entry hand-in for make.fun's "Bring the humans with a TikTok ad" bounty.
//
// The entry itself is a public TikTok video; this repository is its paper
// trail. POST.json names the post. Running this file hands the entry in the
// way the bounty asks: it copies POST.json into the output directory the
// harness points at (MAKEFUN_OUTPUT_DIR, or ./out when that is unset), so
// the grader reads the post's address from a file this program produced,
// not from one that merely sits in the repo.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname ?? ".";
const postFile = join(here, "POST.json");

function readPost(): { url: string } {
  const raw = readFileSync(postFile, "utf8");
  const parsed = JSON.parse(raw) as { url?: unknown };
  // The bounty grades exactly one thing: a public TikTok video page. Refuse
  // anything that is not the full /@handle/video/<id> address — short links
  // (vt.tiktok.com, vm.tiktok.com) and photo posts do not count as entries.
  const url = parsed.url;
  const shape = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;
  if (typeof url !== "string" || !shape.test(url)) {
    throw new Error(
      "POST.json must carry the full TikTok video URL: https://www.tiktok.com/@<handle>/video/<id>",
    );
  }
  return { url };
}

function handIn(): void {
  const post = readPost();
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "out");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  copyFileSync(postFile, join(outDir, "POST.json"));
}

handIn();
