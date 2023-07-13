const { fetchRemoteTextAndCreateReadlineInterface } = require('./lib/fetch-remote-text-by-line');
const { withBannerArray } = require('./lib/with-banner');
const { resolve: pathResolve } = require('path');
const { compareAndWriteFile } = require('./lib/string-array-compare');
const { processLine } = require('./lib/process-line');

(async () => {
  console.time('Total Time - build-chnroutes-cidr');
  const { merge: mergeCidrs } = await import('cidr-tools');

  /** @type {Set<string>} */
  const cidr = new Set();
  for await (const line of await fetchRemoteTextAndCreateReadlineInterface('https://raw.githubusercontent.com/misakaio/chnroutes2/master/chnroutes.txt')) {
    const l = processLine(line);
    if (l) {
      cidr.add(l);
    }
  }

  console.log('Before Merge:', cidr.size);
  const filteredCidr = mergeCidrs(Array.from(cidr));
  console.log('After Merge:', filteredCidr.length);

  await compareAndWriteFile(
    withBannerArray(
      'Sukka\'s Surge Rules - Mainland China IPv4 CIDR',
      [
        'License: CC BY-SA 2.0',
        'Homepage: https://ruleset.skk.moe',
        'GitHub: https://github.com/SukkaW/Surge',
        '',
        'Data from https://misaka.io (misakaio @ GitHub)'
      ],
      new Date(),
      filteredCidr.map(i => `IP-CIDR,${i}`)
    ),
    pathResolve(__dirname, '../List/ip/china_ip.conf')
  );

  console.timeEnd('Total Time - build-chnroutes-cidr');
})();
