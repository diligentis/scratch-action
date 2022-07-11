import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    let myOutput = ''
    let myError = ''

    const options: exec.ExecOptions = {}
    options.listeners = {
      stdout: (data: Buffer) => {
        myOutput += data.toString()
      },
      stderr: (data: Buffer) => {
        myError += data.toString()
      }
    }

    const result = await exec.exec('git', ['diff', '--numstat'], options)
    if (result !== 0) {
      core.setFailed(myError)
      return
    }
    core.info(myOutput)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
