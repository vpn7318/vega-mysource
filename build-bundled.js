const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const providers = fs.readdirSync("providers", {withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name);
fs.rmSync("dist",{recursive:true,force:true});
for (const provider of providers) {
  const out = path.join("dist",provider);
  fs.mkdirSync(out,{recursive:true});
  for (const file of ["catalog","posts","meta","stream","episodes","settings"]) {
    const src = path.join("providers",provider,`${file}.ts`);
    if (!fs.existsSync(src)) continue;
    esbuild.buildSync({
      entryPoints:[src], bundle:true, platform:"neutral", format:"cjs",
      target:"es2018", outfile:path.join(out,`${file}.js`),
      external:["../types"]
    });
  }
}
console.log("Built providers:", providers.join(", "));
