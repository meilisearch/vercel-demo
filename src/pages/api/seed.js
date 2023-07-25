import setup from '../../../scripts/setup'

async function handler(req, res) {
  try {
    const message = await setup()

    if (message) {
      res.status(500).json({
        error: { message },
      })
    } else {
      await res.revalidate(`/`)
      res.status(200).send('ok.')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: { message: 'Internal Server Error' },
    })
  }
}

export default handler
