import { spawn } from 'node:child_process'
import { stdin, stdout } from 'node:process'
import { watch } from 'node:fs/promises'

function spawnNode() {
    const [node, _, file] = process.argv
    const pr = spawn(node, [file])
    pr.stdout.pipe(process.stdout)
    pr.stdin.pipe(process.stderr)

    pr.on('close', (code) => {
        if (code !== null) {
            process.exit(code)
        }
    })

    return pr
}

let childNodeProcess = spawnNode()
const  watcher = watch('./', {recursive: true})
for await (const event of watcher) {
    if (event.filename.endsWith('.js')) {
        childNodeProcess.kill('SIGKILL')
        childNodeProcess = spawnNode()
    }
}
