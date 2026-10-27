const cp = require('child_process');
const fs = require('fs');

const commits = ['9af3d23', 'd9f36c4', '720c947', '36bb48e'];
for (const commit of commits) {
  try {
    const out = cp.execSync(`git show ${commit}:processor/index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    console.log(`Commit ${commit}:processor/index.html exists, length: ${out.length}`);
    fs.writeFileSync(`scratch/commit_${commit}.html`, out);
  } catch(e) {
    try {
      const out2 = cp.execSync(`git show ${commit}:optical_array_prototype.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      console.log(`Commit ${commit}:optical_array_prototype.html exists, length: ${out2.length}`);
      fs.writeFileSync(`scratch/commit_${commit}.html`, out2);
    } catch(e2) {
      console.log(`Commit ${commit} failed:`, e2.message);
    }
  }
}
