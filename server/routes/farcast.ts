import express from 'express'
import { getSSLHubRpcClient, Message } from '@farcaster/hub-nodejs'
import config from '../config.ts'
import { HttpStatusCode } from 'axios'
import { renderMintFailed, renderMintSuccess } from '../src/farcaster.ts'

const client = config.farcast.hubUrl ? getSSLHubRpcClient(config.farcast.hubUrl) : undefined

const router = express.Router()

const getOriginalHost = (s: string): string => {
  s = s.substring(config.farcast.postUrlSubdomainPrefix.length)
  if (s.startsWith('-')) {
    s = s.slice(1)
  }
  return s
}

router.post('/callback', async (req, res): Promise<any> => {
  const host = req.get('host')
  console.log('[/farcast/callback]', host, req.headers)
  console.log('[/farcast/callback] body', JSON.stringify(req.body))
  if (!host?.startsWith(config.farcast.postUrlSubdomainPrefix)) {
    return res.status(HttpStatusCode.BadRequest).send(`Invalid host: ${host}`).end()
  }
  const originalHost = getOriginalHost(host)
  let validatedMessage: Message | undefined
  try {
    const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'))
    const result = await client?.validateMessage(frameMessage)
    if (result?.isOk() && result.value.valid) {
      validatedMessage = result.value.message
    }

    // Also validate the frame url matches the expected url
    const urlBuffer = validatedMessage?.data?.frameActionBody?.url ?? new Uint8Array([])
    const urlString = Buffer.from(urlBuffer).toString('utf-8')
    if (validatedMessage && !urlString.startsWith(originalHost)) {
      return res.status(HttpStatusCode.BadRequest).send(`Invalid frame url: ${urlBuffer}`).end()
    }
  } catch (e) {
    return res.status(HttpStatusCode.BadRequest).send(`Failed to validate message: ${e}`).end()
  }
  // TODO: mint stuff
  console.log(validatedMessage)
  res.send(renderMintSuccess()).end()
  // respond a new frame
})

router.post('/callback/redirect', async (req, res) => {
  const host = req.get('host')
  res.redirect(`${req.protocol}://${host}/`)
})

router.get('/callback', async (req, res) => {
  const host = req.get('host')
  console.log(host, req.protocol)
  if (req.query.fail === '1') {
    return res.send(renderMintFailed(`${req.protocol}://${host}/${config.farcast.postUrlPath}/redirect`))
  }
  res.send(renderMintSuccess()).end()
})

export default router
